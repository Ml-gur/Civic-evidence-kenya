-- Civic Evidence Kenya: V2 Schema Migration
-- WARNING: This migration will DROP the existing 'posts', 'votes', 'comments', and 'flags' tables 
-- and replace them with the new 'issues' architecture.

BEGIN;

-- 1. Drop old tables (to clear mock data and reset the schema)
DROP TABLE IF EXISTS public.flags CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.votes CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;

-- 2. Extend Profiles Table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Citizen' CHECK (role IN ('Citizen', 'Moderator', 'Admin', 'Partner')),
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS home_location TEXT, -- stored as ward or county name
ADD COLUMN IF NOT EXISTS join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Create the new Core Issues Table
CREATE TABLE public.issues (
    issue_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    issue_type_id TEXT NOT NULL, -- The category (e.g., roads, water)
    subtype TEXT,                -- Sub-category
    media_url TEXT NOT NULL,
    media_type TEXT CHECK (media_type IN ('image', 'video')),
    thumbnail_url TEXT,
    media_duration INTEGER,
    gps_lat DOUBLE PRECISION NOT NULL,
    gps_lng DOUBLE PRECISION NOT NULL,
    ward_id TEXT,
    constituency_id TEXT,
    county_id TEXT,
    mca_id UUID REFERENCES public.leaders(id) ON DELETE SET NULL,
    mp_id UUID REFERENCES public.leaders(id) ON DELETE SET NULL,
    governor_id UUID REFERENCES public.leaders(id) ON DELETE SET NULL,
    senator_id UUID REFERENCES public.leaders(id) ON DELETE SET NULL,
    responsible_body_id TEXT,    -- e.g., 'KURA', 'Ministry of Health'
    capture_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'resolved', 'rejected', 'hidden')),
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
    confidence_score DOUBLE PRECISION DEFAULT 0,
    verifier_count INTEGER DEFAULT 0,
    unique_regions_verified INTEGER DEFAULT 0, -- Count of distinct wards/counties confirming
    is_sensitive BOOLEAN DEFAULT false,
    -- Raw counting fields (used to calculate confidence_score quickly)
    effective_confirms DOUBLE PRECISION DEFAULT 0,
    effective_disputes DOUBLE PRECISION DEFAULT 0
);

-- 4. Create the new Votes / Verification Table
CREATE TABLE public.votes (
    vote_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES public.issues(issue_id) ON DELETE CASCADE,
    vote_type TEXT CHECK (vote_type IN ('confirm', 'dispute')),
    verifier_method TEXT CHECK (verifier_method IN ('proximity', 'media_corroborating', 'dispute')),
    dispute_reason TEXT,
    counter_media_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, issue_id) -- One vote per user per issue
);

-- 5. Create the new Trust Events Table (Audit Log for Trust Evolution)
CREATE TABLE public.user_trust_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES public.issues(issue_id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- e.g., 'issue_verified', 'flagged', 'false_report'
    delta INTEGER NOT NULL,   -- amount trust_score went up or down (+5, -10)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create the new Comments / Counter-Evidence Table
CREATE TABLE public.comments (
    comment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID REFERENCES public.issues(issue_id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    media_url TEXT,
    media_type TEXT CHECK (media_type IN ('image', 'video')),
    is_counter_evidence BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. RLS Policies
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trust_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active issues" ON public.issues FOR SELECT USING (status != 'hidden' OR auth.uid() = user_id);
CREATE POLICY "Users can insert their own issues" ON public.issues FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pending issues" ON public.issues FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Anyone can view votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Users can vote once per issue" ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can change their vote" ON public.votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their vote" ON public.votes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own trust events" ON public.user_trust_events FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can insert comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Trust-Weighted Voting Trigger Logic
CREATE OR REPLACE FUNCTION public.calculate_issue_confidence()
RETURNS TRIGGER AS $$
DECLARE
  voter_trust INTEGER;
  trust_weight DOUBLE PRECISION;
  target_issue_id UUID;
BEGIN
  -- Determine the target issue regardless of INSERT/UPDATE/DELETE
  IF (TG_OP = 'DELETE') THEN
    target_issue_id := OLD.issue_id;
    SELECT COALESCE(trust_score, 0) INTO voter_trust FROM public.profiles WHERE id = OLD.user_id;
  ELSE
    target_issue_id := NEW.issue_id;
    SELECT COALESCE(trust_score, 0) INTO voter_trust FROM public.profiles WHERE id = NEW.user_id;
  END IF;

  -- 1. Base Weight formula: 1 + (Trust / 100) (ensures a brand new user is worth 1.0 vote)
  trust_weight := 1.0 + GREATEST(0, voter_trust / 100.0);

  -- 2. Update the effective counters
  IF (TG_OP = 'INSERT') THEN
    IF (NEW.vote_type = 'confirm') THEN
      UPDATE public.issues SET effective_confirms = COALESCE(effective_confirms, 0) + trust_weight, verifier_count = COALESCE(verifier_count, 0) + 1 WHERE issue_id = target_issue_id;
    ELSE
      UPDATE public.issues SET effective_disputes = COALESCE(effective_disputes, 0) + trust_weight WHERE issue_id = target_issue_id;
    END IF;

  ELSIF (TG_OP = 'UPDATE') THEN
    -- If they swapped from confirm to dispute
    IF (OLD.vote_type = 'confirm' AND NEW.vote_type = 'dispute') THEN
      UPDATE public.issues SET 
        effective_confirms = GREATEST(0, COALESCE(effective_confirms, 0) - trust_weight),
        effective_disputes = COALESCE(effective_disputes, 0) + trust_weight,
        verifier_count = GREATEST(0, COALESCE(verifier_count, 0) - 1)
      WHERE issue_id = target_issue_id;
    -- If they swapped from dispute to confirm
    ELSIF (OLD.vote_type = 'dispute' AND NEW.vote_type = 'confirm') THEN
      UPDATE public.issues SET 
        effective_confirms = COALESCE(effective_confirms, 0) + trust_weight,
        effective_disputes = GREATEST(0, COALESCE(effective_disputes, 0) - trust_weight),
        verifier_count = COALESCE(verifier_count, 0) + 1
      WHERE issue_id = target_issue_id;
    END IF;

  ELSIF (TG_OP = 'DELETE') THEN
    IF (OLD.vote_type = 'confirm') THEN
      UPDATE public.issues SET 
        effective_confirms = GREATEST(0, COALESCE(effective_confirms, 0) - trust_weight),
        verifier_count = GREATEST(0, COALESCE(verifier_count, 0) - 1)
      WHERE issue_id = target_issue_id;
    ELSE
      UPDATE public.issues SET effective_disputes = GREATEST(0, COALESCE(effective_disputes, 0) - trust_weight) WHERE issue_id = target_issue_id;
    END IF;
  END IF;

  -- 3. Recalculate Final Confidence Score = Confirms - Disputes
  -- Note: The diversity bonus rule can be added here if checking `unique_regions_verified`
  UPDATE public.issues 
  SET confidence_score = COALESCE(effective_confirms, 0) - COALESCE(effective_disputes, 0)
  WHERE issue_id = target_issue_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_vote_change_confidence
AFTER INSERT OR UPDATE OR DELETE ON public.votes
FOR EACH ROW EXECUTE FUNCTION public.calculate_issue_confidence();

COMMIT;
