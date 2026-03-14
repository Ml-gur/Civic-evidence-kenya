-- Civic Evidence Kenya: Database Schema

-- 1. Locations Table (Administrative Hierarchy)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    county TEXT NOT NULL,
    constituency TEXT NOT NULL,
    ward TEXT NOT NULL,
    boundary_data JSONB, -- GeoJSON for mapping
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Profiles Table (Extended User Data)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    trust_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Leaders Table (Governors and MPs — pre-seeded)
CREATE TABLE leaders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    position TEXT CHECK (position IN ('MCA', 'MP', 'Governor', 'Senator')),
    county TEXT NOT NULL,
    constituency TEXT,
    ward TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Posts Table (The Core Evidence)
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type TEXT CHECK (media_type IN ('image', 'video')),
    thumbnail_url TEXT,
    duration INTEGER,         -- duration in seconds for video
    description TEXT,
    issue_category TEXT CHECK (issue_category IN ('roads','water','health','schools','infrastructure')),
    county_id TEXT,
    constituency_id TEXT,
    ward_id TEXT,
    -- Leader linkage (auto-populated from GPS location)
    governor TEXT,
    mp TEXT,
    mca_name TEXT,            -- entered by the reporting user
    leader_id UUID REFERENCES leaders(id),
    gps_lat DOUBLE PRECISION NOT NULL,
    gps_long DOUBLE PRECISION NOT NULL,
    timestamp_capture TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'under_review', 'hidden', 'verified')),
    confirm_count INTEGER DEFAULT 0,
    dispute_count INTEGER DEFAULT 0,
    effective_confirm DOUBLE PRECISION DEFAULT 0,
    effective_dispute DOUBLE PRECISION DEFAULT 0,
    verifier_count_local INTEGER DEFAULT 0,
    verifier_count_media INTEGER DEFAULT 0
);

-- 5. Votes Table (Verification System)
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    vote_type TEXT CHECK (vote_type IN ('confirm', 'dispute')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id) -- One vote per user per post
);

-- 6. Comments Table (Counter-Evidence)
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    media_url TEXT, -- Optional media evidence in comments
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Flags Table (Moderation)
CREATE TABLE flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    flag_type TEXT CHECK (flag_type IN ('misinformation', 'harassment', 'irrelevant', 'fake_media')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE flags ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for MVP)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
-- DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
CREATE POLICY "Users can insert their own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions & Triggers for Vote Counts and Weighted Trust
CREATE OR REPLACE FUNCTION update_post_vote_counts()
RETURNS TRIGGER AS $$
DECLARE
  voter_trust INTEGER;
  trust_weight DOUBLE PRECISION;
  voter_count INTEGER;
  diversity_bonus DOUBLE PRECISION := 1.0;
BEGIN
  SELECT COALESCE(trust_score, 0) INTO voter_trust 
  FROM profiles WHERE id = COALESCE(NEW.user_id, OLD.user_id);

  trust_weight := 1.0 + GREATEST(0, voter_trust / 100.0);

  IF (TG_OP = 'INSERT') THEN
    IF (NEW.vote_type = 'confirm') THEN
      SELECT COUNT(DISTINCT user_id) INTO voter_count FROM votes WHERE post_id = NEW.post_id AND vote_type = 'confirm';
      IF voter_count > 3 THEN
        diversity_bonus := 1.1; 
      END IF;

      UPDATE posts SET 
        confirm_count = COALESCE(confirm_count, 0) + 1,
        effective_confirm = COALESCE(effective_confirm, 0) + (trust_weight * diversity_bonus)
      WHERE id = NEW.post_id;

      UPDATE profiles SET trust_score = COALESCE(trust_score, 0) + 1 
      WHERE id = (SELECT user_id FROM posts WHERE id = NEW.post_id);

    ELSE
      UPDATE posts SET 
        dispute_count = COALESCE(dispute_count, 0) + 1,
        effective_dispute = COALESCE(effective_dispute, 0) + trust_weight
      WHERE id = NEW.post_id;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    IF (OLD.vote_type = 'confirm') THEN
      UPDATE posts SET 
        confirm_count = GREATEST(0, COALESCE(confirm_count, 0) - 1),
        effective_confirm = GREATEST(0, COALESCE(effective_confirm, 0) - trust_weight)
      WHERE id = OLD.post_id;
    ELSE
      UPDATE posts SET 
        dispute_count = GREATEST(0, COALESCE(dispute_count, 0) - 1),
        effective_dispute = GREATEST(0, COALESCE(effective_dispute, 0) - trust_weight)
      WHERE id = OLD.post_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_vote_change
AFTER INSERT OR DELETE ON votes
FOR EACH ROW EXECUTE FUNCTION update_post_vote_counts();

-- Moderation Triggers
CREATE OR REPLACE FUNCTION update_trust_on_moderation()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    IF (NEW.status = 'verified') THEN
      UPDATE profiles SET trust_score = COALESCE(trust_score, 0) + 5 WHERE id = NEW.user_id;
    ELSIF (NEW.status = 'hidden') THEN
      UPDATE profiles SET trust_score = COALESCE(trust_score, 0) - 10 WHERE id = NEW.user_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_post_status_change
AFTER UPDATE OF status ON posts
FOR EACH ROW EXECUTE FUNCTION update_trust_on_moderation();

CREATE OR REPLACE FUNCTION update_trust_on_flag()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET trust_score = COALESCE(trust_score, 0) - 2 
  WHERE id = (SELECT user_id FROM posts WHERE id = NEW.post_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_flag_insert
AFTER INSERT ON flags
FOR EACH ROW EXECUTE FUNCTION update_trust_on_flag();

-- ============================================================================
-- 1B. INTERNAL REVERSE GEOCODING VIA POSTGIS 
-- ============================================================================

-- Enable PostGIS if not already enabled
create extension if not exists postgis with schema extensions;

-- Create kenya_wards table for reverse geocoding
create table public.kenya_wards (
    id text primary key,
    county text not null,
    constituency text not null,
    ward text not null,
    geom geometry(Geometry, 4326) not null
);

-- Create spatial index for fast ST_Contains queries
create index kenya_wards_geom_idx on public.kenya_wards using gist (geom);

-- RPC for reverse geocoding
create or replace function public.lookup_location(lat double precision, lng double precision)
returns json
language plpgsql
security definer
set search_path = public, postgis, extensions
as $$
declare
    result json;
begin
    select row_to_json(w) into result
    from (
        select county, constituency, ward
        from kenya_wards
        where ST_Contains(geom, ST_SetSRID(ST_Point(lng, lat), 4326))
        limit 1
    ) w;
    
    return result;
end;
$$;

-- 8. Trigger for Automatic Profile Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'Citizen_' || SUBSTR(new.id::text, 1, 8)),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: create profile after auth.users insertion
-- Note: This requires running as a superuser/service role in production
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
