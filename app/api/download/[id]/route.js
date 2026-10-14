import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Surakshit download: file ka asli link kabhi page mein nahi hota.
// Har baar yahan check hota hai ki user ko ye file milni chahiye, phir 60 second ka link banta hai.
export async function GET(request, { params }) {
  const admin = createAdminClient();
  const { data: material } = await admin
    .from('materials')
    .select('id, price, file_path, published')
    .eq('id', params.id)
    .maybeSingle();

  if (!material || !material.published) {
    return NextResponse.json({ error: 'Material nahi mila.' }, { status: 404 });
  }

  if (material.price > 0) {
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const [{ data: profile }, { data: purchase }, { data: sub }] = await Promise.all([
      admin.from('profiles').select('is_admin').eq('id', user.id).maybeSingle(),
      admin.from('purchases').select('id').eq('user_id', user.id).eq('material_id', material.id).maybeSingle(),
      admin.from('subscriptions').select('active_until').eq('user_id', user.id).maybeSingle(),
    ]);

    const subscribed = !!sub && new Date(sub.active_until) > new Date();
    if (!profile?.is_admin && !purchase && !subscribed) {
      return NextResponse.json({ error: 'Ye paid material hai. Pehle kharidein.' }, { status: 403 });
    }
  }

  const { data, error } = await admin.storage
    .from('materials')
    .createSignedUrl(material.file_path, 60, material.price > 0 ? { download: true } : undefined);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: 'File abhi nahi mil rahi. Thodi der baad try karein.' }, { status: 500 });
  }
  return NextResponse.redirect(data.signedUrl);
}
