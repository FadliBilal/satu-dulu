// ==============================================================================
// SATUDULU — Supabase Client Configuration
// ==============================================================================

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Default fallback to connected project if environment variables are not yet inlined
const DEFAULT_SUPABASE_URL = "https://bmrxplremkaghwvkvusa.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcnhwbHJlbWthZ2h3dmt2dXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NTQyMzIsImV4cCI6MjEwNTIzMDIzMn0.ggbjR0g5PcSYSIaWlSFprvQHkY3cdytpZPjZb0v09z4";

const supabaseUrl =
  (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.trim()) ||
  DEFAULT_SUPABASE_URL;
const supabaseAnonKey =
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim()) ||
  DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return clientInstance;
}
