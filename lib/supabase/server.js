import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Server par chalne wala client, logged in user ki cookie se pehchanta hai
export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Component se cookie set nahi hoti, middleware sambhal leta hai
          }
        },
      },
    }
  );
}
