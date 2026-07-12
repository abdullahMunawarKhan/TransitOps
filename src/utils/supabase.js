// utils/supabase.js
import { createClient } from '@supabase/supabase-js';

// Get environment variables
let rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
if (rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
  rawUrl = 'https://' + rawUrl;
}
if (rawUrl.includes('/rest/v1')) {
  rawUrl = rawUrl.split('/rest/v1')[0];
}
const supabaseUrl = rawUrl ? (rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl) : 'https://placeholder-co-transitops.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-key').trim();

console.log('🔗 Supabase client initialized with URL:', supabaseUrl);

// Validate environment variables
if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn('⚠️ VITE_SUPABASE_URL is not defined in environment variables, using placeholder URL');
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ VITE_SUPABASE_ANON_KEY is not defined in environment variables, using placeholder Key');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    console.log('🔗 Testing Supabase connection...');
    console.log('URL:', supabaseUrl);
    console.log('Key length:', supabaseAnonKey?.length || 0);
    
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return { success: false, error };
    } else {
      console.log('✅ Supabase connected successfully');
      return { success: true, data };
    }
  } catch (err) {
    console.error('❌ Supabase connection error:', err);
    return { success: false, error: err };
  }
};

export { supabase };