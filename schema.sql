-- Database Schema for Witness Kenya

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT,
  trust_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Leaders Table
CREATE TABLE leaders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT CHECK (position IN ('MCA', 'MP', 'Governor', 'Senator')),
  county_id TEXT NOT NULL,
  constituency_id TEXT,
  ward_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Posts Table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  media_url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  description TEXT,
  county_id TEXT NOT NULL,
  constituency_id TEXT NOT NULL,
  ward_id TEXT NOT NULL,
  leader_id UUID REFERENCES leaders(id),
  gps_lat DOUBLE PRECISION NOT NULL,
  gps_long DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  timestamp_capture TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'under_review', 'hidden', 'verified')),
  confirm_count INTEGER DEFAULT 0,
  dispute_count INTEGER DEFAULT 0,
  effective_confirm DOUBLE PRECISION DEFAULT 0,
  effective_dispute DOUBLE PRECISION DEFAULT 0,
  verifier_count_local INTEGER DEFAULT 0,
  verifier_count_media INTEGER DEFAULT 0,
  issue_category TEXT CHECK (issue_category IN ('roads', 'water', 'health', 'schools', 'infrastructure'))
);

-- 4. Votes Table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('confirm', 'dispute')),
  verifier_method TEXT DEFAULT 'vote' CHECK (verifier_method IN ('vote', 'proximity', 'media_corroborating', 'dispute')),
  dispute_reason TEXT,
  counter_media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, post_id)
);

-- 5. Comments Table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  media_url TEXT,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Flags Table
CREATE TABLE flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  flag_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS Policies (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE flags ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Posts: Everyone can read active/verified, only authenticated can create
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (status != 'hidden');
CREATE POLICY "Authenticated users can create posts" ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Votes: Users can read all, but only create/delete their own
CREATE POLICY "Votes are viewable by everyone" ON votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote" ON votes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can delete own vote" ON votes FOR DELETE USING (auth.uid() = user_id);

-- Functions & Triggers for Vote Counts and Weighted Trust
CREATE OR REPLACE FUNCTION update_post_vote_counts()
RETURNS TRIGGER AS $$
DECLARE
  voter_trust INTEGER;
  trust_weight DOUBLE PRECISION;
  voter_count INTEGER;
  diversity_bonus DOUBLE PRECISION := 1.0;
BEGIN
  -- Get the voter's trust score
  SELECT COALESCE(trust_score, 0) INTO voter_trust 
  FROM profiles WHERE id = COALESCE(NEW.user_id, OLD.user_id);

  trust_weight := 1.0 + GREATEST(0, voter_trust / 100.0);

  IF (TG_OP = 'INSERT') THEN
    IF (NEW.vote_type = 'confirm') THEN
      -- Calculate diversity bonus (simplified: check how many users have confirmed this post)
      SELECT COUNT(DISTINCT user_id) INTO voter_count FROM votes WHERE post_id = NEW.post_id AND vote_type = 'confirm';
      IF voter_count > 3 THEN
        diversity_bonus := 1.1; -- Small bonus if many diverse verifiers
      END IF;

      UPDATE posts SET 
        confirm_count = confirm_count + 1,
        effective_confirm = effective_confirm + (trust_weight * diversity_bonus)
      WHERE id = NEW.post_id;

      -- Reward the original poster for getting a confirmation
      UPDATE profiles SET trust_score = trust_score + 1 
      WHERE id = (SELECT user_id FROM posts WHERE id = NEW.post_id);

    ELSE
      UPDATE posts SET 
        dispute_count = dispute_count + 1,
        effective_dispute = effective_dispute + trust_weight
      WHERE id = NEW.post_id;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    IF (OLD.vote_type = 'confirm') THEN
      UPDATE posts SET 
        confirm_count = GREATEST(0, confirm_count - 1),
        effective_confirm = GREATEST(0, effective_confirm - trust_weight)
      WHERE id = OLD.post_id;
    ELSE
      UPDATE posts SET 
        dispute_count = GREATEST(0, dispute_count - 1),
        effective_dispute = GREATEST(0, effective_dispute - trust_weight)
      WHERE id = OLD.post_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_vote_change
AFTER INSERT OR DELETE ON votes
FOR EACH ROW EXECUTE FUNCTION update_post_vote_counts();

-- Function to update location geography from lat/long
CREATE OR REPLACE FUNCTION update_post_location()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location = ST_SetSRID(ST_MakePoint(NEW.gps_long, NEW.gps_lat), 4326);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_post_insert_update_location
BEFORE INSERT OR UPDATE OF gps_lat, gps_long ON posts
FOR EACH ROW EXECUTE FUNCTION update_post_location();

-- Function to handle status changes and flag penalties
CREATE OR REPLACE FUNCTION update_trust_on_moderation()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    IF (NEW.status = 'verified') THEN
      UPDATE profiles SET trust_score = trust_score + 5 WHERE id = NEW.user_id;
    ELSIF (NEW.status = 'hidden') THEN
      UPDATE profiles SET trust_score = trust_score - 10 WHERE id = NEW.user_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_post_status_change
AFTER UPDATE OF status ON posts
FOR EACH ROW EXECUTE FUNCTION update_trust_on_moderation();

-- Function to penalize trust on flags
CREATE OR REPLACE FUNCTION update_trust_on_flag()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET trust_score = trust_score - 2 
  WHERE id = (SELECT user_id FROM posts WHERE id = NEW.post_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_flag_insert
AFTER INSERT ON flags
FOR EACH ROW EXECUTE FUNCTION update_trust_on_flag();
