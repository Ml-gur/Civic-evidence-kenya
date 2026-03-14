import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client only if credentials are provided.
// If missing, we export a proxy that provides a clear error message when accessed,
// preventing the application from crashing immediately on load.
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
    get(_, prop) {
      if (prop === 'then') return undefined; // Handle async/await checks
      throw new Error(
        'Supabase configuration missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables (Secrets panel).'
      );
    },
  });

export type Profile = {
  id: string;
  username: string;
  email: string;
  trust_score: number;
  created_at: string;
};

export type IssueCategory = 'roads' | 'water' | 'health' | 'schools' | 'infrastructure';

export type Post = {
  id: string;
  user_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  thumbnail_url?: string;
  duration?: number;
  description: string;
  county_id: string;
  constituency_id: string;
  ward_id: string;
  leader_id?: string;
  // Leader fields (auto-populated from GPS + user entry)
  governor?: string;
  mp?: string;
  mca_name?: string;
  gps_lat: number;
  gps_long: number;
  timestamp_capture: string;
  created_at: string;
  status: 'active' | 'under_review' | 'hidden' | 'verified';
  confirm_count?: number;
  dispute_count?: number;
  effective_confirm?: number;
  effective_dispute?: number;
  verifier_count_local?: number;
  verifier_count_media?: number;
  issue_category?: IssueCategory;
  profiles?: Profile;
  counties?: { name: string };
  constituencies?: { name: string };
  wards?: { name: string };
};

export type Vote = {
  id: string;
  user_id: string;
  post_id: string;
  vote_type: 'confirm' | 'dispute';
  created_at: string;
};

export type Comment = {
  id: string;
  user_id: string;
  post_id: string;
  media_url?: string;
  comment_text: string;
  created_at: string;
  profiles?: Profile;
};

export type Leader = {
  id: string;
  name: string;
  position: 'MCA' | 'MP' | 'Governor' | 'Senator';
  county_id: string;
  constituency_id?: string;
  ward_id?: string;
};
