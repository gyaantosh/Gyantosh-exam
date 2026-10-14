import { createClient } from '@/lib/supabase/server';

// Abhi logged in user aur uski profile wapas deta hai (login nahi hai to user = null)
export async function getSessionUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user ?? null;
  if (!user) return { user: null, profile: null };
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  return { user, profile };
}

// Admin kaam se pehle chalayein. Admin nahi hai to error phek deta hai.
export async function requireAdmin() {
  const { user, profile } = await getSessionUser();
  if (!user || !profile?.is_admin) {
    throw new Error('Sirf admin ye kaam kar sakta hai.');
  }
  return { user, profile };
}
