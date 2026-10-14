import Link from 'next/link';
import LogoMark from '@/components/LogoMark';
import { SITE } from '@/lib/site';
import { getSessionUser } from '@/lib/auth';

const SOCIALS = [
  { key: 'youtube', label: 'YouTube', svg: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1.5" y="5" width="21" height="14" rx="4.5" fill="#E11D2E" /><path d="M10 9l5 3-5 3z" fill="#FFFFFF" /></svg> },
  { key: 'instagram', label: 'Instagram', svg: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="6" fill="#C13584" /><circle cx="12" cy="12" r="4.6" fill="none" stroke="#FFFFFF" strokeWidth="2" /><circle cx="17.4" cy="6.6" r="1.3" fill="#FFFFFF" /></svg> },
  { key: 'telegram', label: 'Telegram', svg: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#2AABEE" /><path d="M5.5 11.8l12.4-4.8-2 10-3.6-2.7-2 1.9-.3-3.2 6-5.4-7.5 4.6z" fill="#FFFFFF" /></svg> },
  { key: 'facebook', label: 'Facebook', svg: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#1877F2" /><path d="M13.2 19v-6h2l.4-2.5h-2.4V9.2c0-.7.3-1.2 1.3-1.2h1.2V5.8c-.2 0-1-.1-1.9-.1-1.9 0-3.1 1.1-3.1 3.2v1.6H8.7V13h2V19z" fill="#FFFFFF" /></svg> },
];

export default async function Header({ query = '' }) {
  const { user, profile } = await getSessionUser();
  const name = profile?.full_name || user?.email?.split('@')[0];

  return (
    <>
      <div className="topbar">
        <div className="wrap topbar-in">
          <div className="tb-group tb-contact">
            {SITE.email && <span className="tb-item">{SITE.email}</span>}
            {SITE.phone && <span className="tb-item">{SITE.phone}</span>}
          </div>
          <div className="tb-group">
            {SOCIALS.filter((s) => SITE[s.key]).map((s) => (
              <a key={s.key} className="soc" href={SITE[s.key]} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                {s.svg}
              </a>
            ))}
          </div>
        </div>
      </div>

      <header className="header">
        <div className="wrap header-in">
          <Link className="brand" href="/" aria-label="Gyaantosh Exams, home">
            <LogoMark />
            <span>
              <span className="brand-name">Gyaan<b>tosh</b><span className="ex">Exams</span></span>
              <span className="brand-tag">Learn · Practise · Achieve</span>
            </span>
          </Link>

          <form className="search" action="/" method="get" role="search">
            <label className="sr-only" htmlFor="siteSearch">Search papers</label>
            <input id="siteSearch" name="q" type="search" defaultValue={query} placeholder="Search papers, notes, exams..." autoComplete="off" />
            <button type="submit" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
            </button>
          </form>

          <div className="actions">
            {user ? (
              <>
                <span className="who">Hi, {name}</span>
                {profile?.is_admin && <Link className="btn btn-line btn-sm" href="/admin">Admin</Link>}
                <form action="/auth/signout" method="post">
                  <button className="btn btn-accent btn-sm" type="submit">Logout</button>
                </form>
              </>
            ) : (
              <>
                <Link className="btn btn-line btn-sm" href="/login">Login</Link>
                <Link className="btn btn-accent btn-sm" href="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <nav className="navbar" aria-label="Main menu">
        <div className="wrap">
          <ul className="navlist">
            <li><Link className="on" href="/">Home</Link></li>
            <li><a href="/#packs">Exams</a></li>
            <li><a href="/#papers">Papers</a></li>
            <li><a href="/#plans">Plans</a></li>
            <li><a href="/#contact">Contact</a></li>
          </ul>
        </div>
      </nav>
    </>
  );
}
