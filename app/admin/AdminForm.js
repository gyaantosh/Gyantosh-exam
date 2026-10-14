'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { EXAMS, TOPICS } from '@/lib/exams';
import { prepareUpload, saveMaterial } from './actions';

const MAX_MB = 45;

export default function AdminForm() {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  function toggleExam(n) {
    setExams((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));
  }

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get('file');
    const cover = fd.get('cover');
    const hasCover = cover && cover.size > 0;

    if (!file || !file.size) return setMsg({ type: 'err', text: 'PDF ya image file chunein.' });
    if (file.size > MAX_MB * 1024 * 1024) return setMsg({ type: 'err', text: `File ${MAX_MB} MB se chhoti honi chahiye.` });
    if (exams.length === 0) return setMsg({ type: 'err', text: 'Kam se kam ek exam chunein.' });

    setBusy(true);
    setMsg({ type: '', text: '' });
    try {
      const up = await prepareUpload({ fileName: file.name, coverName: hasCover ? cover.name : '' });
      const supabase = createClient();

      const r1 = await supabase.storage.from('materials').uploadToSignedUrl(up.file.path, up.file.token, file);
      if (r1.error) throw new Error(r1.error.message);

      if (hasCover && up.cover) {
        const r2 = await supabase.storage.from('covers').uploadToSignedUrl(up.cover.path, up.cover.token, cover);
        if (r2.error) throw new Error(r2.error.message);
      }

      await saveMaterial({
        title: fd.get('title'),
        topic: fd.get('topic'),
        tag: fd.get('tag'),
        pages: fd.get('pages'),
        price: fd.get('price'),
        language: fd.get('language'),
        exams,
        filePath: up.file.path,
        coverPath: hasCover && up.cover ? up.cover.path : null,
      });

      form.reset();
      setExams([]);
      setMsg({ type: 'ok', text: 'Material add ho gaya. Ab ye website par dikh raha hai.' });
      router.refresh();
    } catch (err) {
      setMsg({ type: 'err', text: err.message || 'Kuch galat hua. Dobara try karein.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="af-grid">
        <div className="af-wide">
          <label className="lbl" htmlFor="title">Title</label>
          <input id="title" name="title" className="inp" type="text" required placeholder="जैसे: पद्म पुरस्कार, 35 Most Important MCQ" />
        </div>

        <div>
          <label className="lbl" htmlFor="topic">Topic</label>
          <select id="topic" name="topic" className="inp" defaultValue="General">
            {TOPICS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="lbl" htmlFor="tag">Chhota label (optional)</label>
          <input id="tag" name="tag" className="inp" type="text" placeholder="Mission Vardi, Notes, Free sample" />
        </div>
        <div>
          <label className="lbl" htmlFor="price">Daam (₹), 0 matlab free</label>
          <input id="price" name="price" className="inp" type="number" min="0" step="1" defaultValue="0" required />
        </div>
        <div>
          <label className="lbl" htmlFor="pages">Pages</label>
          <input id="pages" name="pages" className="inp" type="number" min="1" step="1" defaultValue="1" required />
        </div>
        <div>
          <label className="lbl" htmlFor="language">Bhasha</label>
          <select id="language" name="language" className="inp" defaultValue="Hindi">
            <option>Hindi</option><option>English</option><option>Hindi + English</option>
          </select>
        </div>
      </div>

      <fieldset className="af-exams">
        <legend className="lbl">Kaunse exams ke liye</legend>
        <div className="exams">
          {EXAMS.map((n) => (
            <button key={n} type="button" className="exam-btn" aria-pressed={exams.includes(n)} onClick={() => toggleExam(n)}>
              <span className="bub" aria-hidden="true" /> <span>{n}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="af-grid">
        <div>
          <label className="lbl" htmlFor="file">Asli file (PDF ya image, max {MAX_MB} MB)</label>
          <input id="file" name="file" className="inp" type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" required />
        </div>
        <div>
          <label className="lbl" htmlFor="cover">Cover photo (optional)</label>
          <input id="cover" name="cover" className="inp" type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" />
        </div>
      </div>

      {msg.text && <p className={msg.type === 'ok' ? 'form-ok' : 'reg-msg'} role="alert">{msg.text}</p>}
      <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Upload ho raha hai...' : 'Add material'}</button>
    </form>
  );
}
