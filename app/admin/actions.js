'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { EXAMS } from '@/lib/exams';

const FILE_EXT = ['pdf', 'png', 'jpg', 'jpeg'];
const COVER_EXT = ['png', 'jpg', 'jpeg', 'webp'];

function extOf(name, allowed) {
  const ext = String(name || '').split('.').pop().toLowerCase();
  if (!allowed.includes(ext)) throw new Error(`File type sahi nahi hai. Ye chalenge: ${allowed.join(', ')}`);
  return ext;
}

// Step 1: browser ko upload ke liye ek chhota-sa (kuch der chalne wala) link dena
export async function prepareUpload({ fileName, coverName }) {
  await requireAdmin();
  const admin = createAdminClient();

  const filePath = `${randomUUID()}.${extOf(fileName, FILE_EXT)}`;
  const { data: f, error: fe } = await admin.storage.from('materials').createSignedUploadUrl(filePath);
  if (fe) throw new Error(fe.message);

  let cover = null;
  if (coverName) {
    const coverPath = `${randomUUID()}.${extOf(coverName, COVER_EXT)}`;
    const { data: c, error: ce } = await admin.storage.from('covers').createSignedUploadUrl(coverPath);
    if (ce) throw new Error(ce.message);
    cover = { path: coverPath, token: c.token };
  }
  return { file: { path: filePath, token: f.token }, cover };
}

// Step 2: upload hone ke baad material ki details save karna
export async function saveMaterial(input) {
  await requireAdmin();

  const title = String(input.title || '').trim();
  if (title.length < 3 || title.length > 200) throw new Error('Title 3 se 200 akshar ka hona chahiye.');
  const price = Number.parseInt(input.price, 10);
  if (!Number.isInteger(price) || price < 0 || price > 100000) throw new Error('Daam 0 ya usse zyada poora number hona chahiye.');
  const pages = Number.parseInt(input.pages, 10);
  if (!Number.isInteger(pages) || pages < 1 || pages > 5000) throw new Error('Pages 1 ya usse zyada hone chahiye.');
  const exams = (input.exams || []).filter((e) => EXAMS.includes(e));
  if (exams.length === 0) throw new Error('Kam se kam ek exam chunein.');
  if (!input.filePath) throw new Error('File upload nahi hui.');

  const admin = createAdminClient();
  const { error } = await admin.from('materials').insert({
    title,
    topic: String(input.topic || 'General').slice(0, 60),
    tag: String(input.tag || '').slice(0, 60),
    exams,
    pages,
    price,
    language: String(input.language || 'Hindi').slice(0, 30),
    file_path: input.filePath,
    cover_path: input.coverPath || null,
    published: true,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin');
  return { ok: true };
}

export async function togglePublished(formData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const publish = formData.get('publish') === 'true';
  const admin = createAdminClient();
  await admin.from('materials').update({ published: publish }).eq('id', id);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteMaterial(formData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const admin = createAdminClient();
  const { data: m } = await admin.from('materials').select('file_path, cover_path').eq('id', id).maybeSingle();
  if (m) {
    await admin.storage.from('materials').remove([m.file_path]);
    if (m.cover_path) await admin.storage.from('covers').remove([m.cover_path]);
    await admin.from('materials').delete().eq('id', id);
  }
  revalidatePath('/');
  revalidatePath('/admin');
}
