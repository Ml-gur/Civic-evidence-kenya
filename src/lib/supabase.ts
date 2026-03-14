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
  phone?: string;
  role: 'Citizen' | 'Moderator' | 'Admin' | 'Partner';
  preferred_language: string;
  home_location?: string;
  trust_score: number;
  join_date: string;
  created_at: string;
};

export type IssueCategory = 'roads' | 'water' | 'health' | 'schools' | 'infrastructure';

// V2 Core Architecture
export type Issue = {
  issue_id: string;
  user_id: string;
  title: string;
  description: string;
  issue_type_id: IssueCategory;
  subtype?: string;
  media_url: string;
  media_type: 'image' | 'video';
  thumbnail_url?: string;
  media_duration?: number;
  gps_lat: number;
  gps_lng: number;
  ward_id?: string;
  constituency_id?: string;
  county_id?: string;
  mca_id?: string;
  mp_id?: string;
  governor_id?: string;
  senator_id?: string;
  responsible_body_id?: string;
  capture_timestamp: string;
  created_at: string;
  status: 'pending' | 'verified' | 'resolved' | 'rejected' | 'hidden';
  severity: 'low' | 'medium' | 'high';
  confidence_score: number;
  verifier_count: number;
  unique_regions_verified: number;
  is_sensitive: boolean;
  
  // Relations
  profiles?: Profile;
};

export type Vote = {
  vote_id: string;
  user_id: string;
  issue_id: string;
  vote_type: 'confirm' | 'dispute';
  verifier_method: 'proximity' | 'media_corroborating' | 'dispute';
  dispute_reason?: string;
  counter_media_url?: string;
  created_at: string;
};

export type UserTrustEvent = {
  id: string;
  user_id: string;
  issue_id?: string;
  event_type: string;
  delta: number;
  created_at: string;
};

export type Comment = {
  comment_id: string;
  issue_id: string;
  user_id: string;
  text: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  is_counter_evidence: boolean;
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
