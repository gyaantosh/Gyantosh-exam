import { createClient } from '@supabase/supabase-js';

// SIRF server code mein use karein. Ye service role key sab rules bypass karti hai.
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
