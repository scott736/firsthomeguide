import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL
  || (typeof process !== 'undefined' ? process.env.PUBLIC_SUPABASE_URL : undefined);
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  || (typeof process !== 'undefined' ? process.env.PUBLIC_SUPABASE_ANON_KEY : undefined);
const SUPABASE_SERVICE_KEY = import.meta.env.SUPABASE_SERVICE_KEY
  || (typeof process !== 'undefined' ? process.env.SUPABASE_SERVICE_KEY : undefined);

export function getServerSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Supabase server configuration missing');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

export function isSupabaseConfigured() {
  return !!SUPABASE_URL && (!!SUPABASE_ANON_KEY || !!SUPABASE_SERVICE_KEY);
}
