'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { EXAMS } from '@/lib/exams';

export default function RegisterPage() {
  const router = useRouter();
  const [f, setF] = useState({ name: '', mobile: '', email: '', password: '', exam: '', agree: false });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!f.name.trim()) return setMsg({ type: 'err', text: 'Enter your full name.' });
    if (!/^[6-9][0-9]{9}$/.test(f.mobile.trim())) return setMsg({ type: 'err', text: 'Enter a 10 digit mobile number.' });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) return setMsg({ type: 'err', text: 'Enter a valid email address.' });
    if (f.password.length < 6) return setMsg({ type: 'err', text: 'Password needs at least 6 characters.' });
    if (!f.exam) return setMsg({ type: 'err', text: 'Select your exam or category.' });
    if (!f.agree) return setMsg({ type: 'err', text: 'Tick the box to accept the Terms & Conditions.' });

    setBusy(true);
    setMsg({ type: '', text: '' });
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: f.email.trim(),
      password: f.password,
      options: { data: { full_name: f.name.trim(), mobile: f.mobile.trim(), exam: f.exam } },
    });
    setBusy(false);
    if (error) return setMsg({ type: 'err', text: error.message });
    if (data.session) {
      router.push('/');
      router.refresh();
    } else {
      setMsg({ type: 'ok', text: 'Account ban gaya. Apne email par aaye link se email confirm karein, phir login karein.' });
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card reg">
        <Link className="auth-home" href="/">&larr; Gyaantosh Exams</Link>
        <h1>Student Registration</h1>
        <p className="auth-sub">Free account, start preparing today</p>
        <form onSubmit={submit} noValidate>
          <label className="lbl" htmlFor="name">Full name</label>
          <input id="name" className="inp" type="text" autoComplete="name" value={f.name} onChange={set('name')} />
          <label className="lbl" htmlFor="mobile">Mobile number</label>
          <input id="mobile" className="inp" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national" value={f.mobile} onChange={set('mobile')} />
          <label className="lbl" htmlFor="email">Email address</label>
          <input id="email" className="inp" type="email" autoComplete="email" value={f.email} onChange={set('email')} />
          <label className="lbl" htmlFor="password">Password</label>
          <input id="password" className="inp" type="password" autoComplete="new-password" value={f.password} onChange={set('password')} />
          <label className="lbl" htmlFor="exam">Exam or category</label>
          <select id="exam" className="inp" value={f.exam} onChange={set('exam')}>
            <option value="">Select exam or category</option>
            {EXAMS.map((n) => <option key={n}>{n}</option>)}
            <option>Other exam</option>
          </select>
          <label className="agree" htmlFor="agree">
            <input id="agree" type="checkbox" checked={f.agree} onChange={set('agree')} /> I agree to the Terms &amp; Conditions
          </label>
          {msg.text && <p className={msg.type === 'ok' ? 'form-ok' : 'reg-msg'} role="alert">{msg.text}</p>}
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Please wait...' : 'Create Account'}</button>
        </form>
        <p className="reg-foot">Already have an account? <Link href="/login">Login</Link></p>
      </div>
    </main>
  );
}
