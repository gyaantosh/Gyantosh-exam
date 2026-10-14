import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BannerArt from '@/components/BannerArt';
import JoinArt from '@/components/JoinArt';
import PackGrid from '@/components/PackGrid';
import PapersLibrary from '@/components/PapersLibrary';
import { createClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth';
import { coverUrl } from '@/lib/exams';
import { SITE } from '@/lib/site';

export const dynamic = 'force-dynamic';

const TICKS = ['MP Police Constable', 'MP SI', 'SSC GD Constable', 'SSC MTS', 'MP Patwari', 'All Competitive Exams'];

function Tick() {
  return (
    <span className="tick">
      <svg viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.5 6.2l2.4 2.3 4.6-5" />
      </svg>
    </span>
  );
}

const FEATS = [
  { href: '#papers', title: 'PDF Papers', sub: 'Free & Paid', color: '#6D83D8', icon: <path d="M10 4h14l8 8v24H10z M24 4v8h8" /> },
  { href: '#papers', title: 'MCQ Sheets', sub: 'Topic wise', color: '#0F766E', icon: <><rect x="8" y="6" width="24" height="30" rx="4" /><path d="M13 20l3 3 6-6.5" /></> },
  { href: '#papers', title: 'Study Notes', sub: 'Free & Premium', color: '#4C9F38', icon: <><rect x="8" y="5" width="24" height="31" rx="3" /><path d="M18 12h10M18 18h10M18 24h7" /></> },
  { href: '#plans', title: 'Monthly Plan', sub: 'All papers unlocked', color: '#D97706', icon: <path d="M12 6h16v10a8 8 0 01-16 0z M18 24v6 M12 34h16" /> },
];

export default async function Home({ searchParams }) {
  const supabase = createClient();
  const { user } = await getSessionUser();

  const { data: rows } = await supabase
    .from('materials')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  // Logged in user ne kaunse paid materials khareede hain
  let ownedIds = new Set();
  let subscribed = false;
  if (user) {
    const { data: purchases } = await supabase.from('purchases').select('material_id').eq('user_id', user.id);
    ownedIds = new Set((purchases || []).map((p) => p.material_id));
    const { data: sub } = await supabase.from('subscriptions').select('active_until').eq('user_id', user.id).maybeSingle();
    subscribed = !!sub && new Date(sub.active_until) > new Date();
  }

  const materials = (rows || []).map((m) => ({
    id: m.id,
    title: m.title,
    topic: m.topic,
    tag: m.tag,
    exams: m.exams || [],
    pages: m.pages,
    price: m.price,
    language: m.language,
    cover: coverUrl(m.cover_path),
    owned: m.price > 0 && (subscribed || ownedIds.has(m.id)),
  }));

  const exam = typeof searchParams?.exam === 'string' ? searchParams.exam : 'All';
  const q = typeof searchParams?.q === 'string' ? searchParams.q : '';

  return (
    <>
      <Header query={q} />
      <main id="top">
        <div className="wrap">
          <div className="layout">
            <div className="banner">
              <div className="banner-text">
                <h1>Mission <span className="v">Vardi</span> <span className="yr">2027</span></h1>
                <p className="hi">सपना वर्दी का, तैयारी <b>Gyaantosh</b> के साथ</p>
                <ul className="ticks">
                  {TICKS.map((t) => (<li key={t}><Tick />{t}</li>))}
                </ul>
                <a className="btn btn-accent" href="#papers">Start Learning Now &rarr;</a>
              </div>
              <div className="banner-art" aria-hidden="true"><BannerArt /></div>
            </div>

            <aside className="reg cta-card" aria-labelledby="ctaTitle">
              <h2 id="ctaTitle">{user ? 'Welcome back' : 'Free account banayein'}</h2>
              <p>
                {user
                  ? 'Aapke khareede hue papers Paper Library mein "Download" ke saath dikhenge.'
                  : 'Account banakar apne khareede hue papers kabhi bhi dobara download karein.'}
              </p>
              {user ? (
                <a className="btn btn-primary" href="#papers">Open Paper Library</a>
              ) : (
                <>
                  <Link className="btn btn-primary" href="/register">Create Account</Link>
                  <p className="reg-foot">Pehle se account hai? <Link href="/login">Login</Link></p>
                </>
              )}
            </aside>

            <div className="feats">
              {FEATS.map((f) => (
                <a className="feat" href={f.href} key={f.title}>
                  <svg viewBox="0 0 40 40" fill="none" stroke={f.color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{f.icon}</svg>
                  <b>{f.title}</b>
                  <span>{f.sub}</span>
                </a>
              ))}
            </div>

            <div className="panel blue packs" id="packs">
              <div className="ph">
                <div className="ph-l">
                  <div><h2>Popular Exams</h2><p>Pick your exam and open its paper library</p></div>
                </div>
                <a className="btn btn-primary btn-sm" href="#papers">View All Papers &rarr;</a>
              </div>
              <PackGrid materials={materials} />
            </div>
          </div>

          <section className="block" id="papers">
            <div className="sec-head">
              <h2>Paper Library</h2>
              <p>Pick an exam, then see which papers are free and which you can buy.</p>
            </div>
            <PapersLibrary key={`${exam}|${q}`} materials={materials} initialExam={exam} initialQuery={q} />
          </section>

          <section className="block" id="plans">
            <div className="sec-head">
              <h2>What it costs</h2>
              <p>Need one paper? Buy just that one. Practising every day? Take the monthly plan.</p>
            </div>
            <div className="plans">
              <article className="plan">
                <h3>Free</h3>
                <p className="price">{SITE.currency}0</p>
                <ul>
                  <li>Selected sample sheets for every exam</li>
                  <li>View without logging in</li>
                </ul>
                <a className="btn btn-line" href="#papers">Open free papers</a>
              </article>
              <article className="plan">
                <h3>Single PDF</h3>
                <p className="price">{SITE.currency}29 <small>onwards, per paper</small></p>
                <ul>
                  <li>Buy only the papers you need</li>
                  <li>Download your purchased papers again later</li>
                </ul>
                <a className="btn btn-primary" href="#papers">Choose a paper</a>
              </article>
              <article className="plan best">
                <span className="tag">Best for many papers</span>
                <h3>Monthly plan</h3>
                <p className="price">{SITE.currency}199 <small>/ month</small></p>
                <ul>
                  <li>All paid papers unlocked</li>
                  <li>New papers added during the month included</li>
                </ul>
                <span className="btn btn-accent" aria-disabled="true">Coming soon</span>
              </article>
            </div>
            <p className="plans-note">Prices shown here are samples. Online payment will be switched on in the next step.</p>
          </section>

          <section className="block" id="join">
            <div className="join">
              <div className="join-art" aria-hidden="true"><JoinArt /></div>
              <div>
                <h2>Hear about new papers first</h2>
                <p>New PDFs, recruitment notices and result updates reach the community before anywhere else.</p>
              </div>
              <div className="cta-row">
                {SITE.telegram && <a className="btn btn-primary" href={SITE.telegram} target="_blank" rel="noopener noreferrer">Join on Telegram</a>}
                {SITE.whatsapp && <a className="btn btn-line" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp group</a>}
                {!SITE.telegram && !SITE.whatsapp && <span className="soon-note">Community links lib/site.js mein jodein.</span>}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
