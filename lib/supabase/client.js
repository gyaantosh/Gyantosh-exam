import { createBrowserClient } from '@supabase/ssr';

// Browser mein chalne wala client (login, upload ke liye)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
