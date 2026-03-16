-- Migration v3: Database Updates for Advanced Verification and Threaded Comments

-- 1. Update comments table for media and threading
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS media_type TEXT CHECK (media_type IN ('image', 'video'));
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS parent_comment_id UUID REFERENCES public.comments(comment_id) ON DELETE CASCADE;

-- 2. Update votes table for detailed verification metadata
ALTER TABLE public.votes ADD COLUMN IF NOT EXISTS verifier_method TEXT CHECK (verifier_method IN ('proximity', 'media_corroborating', 'dispute'));
ALTER TABLE public.votes ADD COLUMN IF NOT EXISTS user_lat DOUBLE PRECISION;
ALTER TABLE public.votes ADD COLUMN IF NOT EXISTS user_lng DOUBLE PRECISION;
ALTER TABLE public.votes ADD COLUMN IF NOT EXISTS distance_m DOUBLE PRECISION;

-- 3. Ensure profiles has a default trust score of 10 for new users instead of 0
ALTER TABLE public.profiles ALTER COLUMN trust_score SET DEFAULT 10;

-- 4. RPC for proximity confirmation check (to be used by backend or client)
CREATE OR REPLACE FUNCTION public.check_proximity(post_id UUID, user_lat DOUBLE PRECISION, user_lng DOUBLE PRECISION, max_dist_m DOUBLE PRECISION)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  post_lat DOUBLE PRECISION;
  post_lng DOUBLE PRECISION;
  dist_m DOUBLE PRECISION;
BEGIN
  SELECT gps_lat, gps_lng INTO post_lat, post_lng FROM public.issues WHERE issue_id = post_id;
  
  -- Use ST_DistanceSphere for accurate earth distance in meters
  dist_m := ST_DistanceSphere(ST_MakePoint(user_lng, user_lat), ST_MakePoint(post_lng, post_lat));
  
  RETURN dist_m <= max_dist_m;
END;
$$;
