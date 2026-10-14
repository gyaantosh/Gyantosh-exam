'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!email.trim() || !password) return setMsg('Enter your email and password.');
    setBusy(true);
    setMsg('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return setMsg('Email ya password galat hai. Dobara try karein.');
    router.push('/');
    router.refresh();
  }

  return (
    <main className="auth-page">
      <div className="auth-card reg">
        <Link className="auth-home" href="/">&larr; Gyaantosh Exams</Link>
        <h1>Login</h1>
        <p className="auth-sub">Apne khareede hue papers dekhne ke liye login karein</p>
        <form onSubmit={submit} noValidate>
          <label className="lbl" htmlFor="email">Email address</label>
          <input id="email" className="inp" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="lbl" htmlFor="password">Password</label>
          <input id="password" className="inp" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {msg && <p className="reg-msg" role="alert">{msg}</p>}
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Please wait...' : 'Login'}</button>
        </form>
        <p className="reg-foot">Naya user? <Link href="/register">Create account</Link></p>
      </div>
    </main>
  );
}
