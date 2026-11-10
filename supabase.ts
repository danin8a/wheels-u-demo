import { createClient } from '@supabase/supabase-js';

// Si no se han definido variables en .env, usamos valores de respaldo para desarrollo local
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://wheels-u-demo.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_key';

export const isSupabaseConfigured = Boolean(
  process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
