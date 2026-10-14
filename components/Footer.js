import { SITE } from '@/lib/site';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <h3>Gyaantosh Exams</h3>
            <p>Previous year papers, notes and MCQ sheets for government exams, in one place. Some free, some paid.</p>
          </div>
          <div>
            <h3>Quick links</h3>
            <ul>
              <li><a href="/#papers">Paper Library</a></li>
              <li><a href="/#plans">Plans</a></li>
              <li><a href="/register">Create account</a></li>
            </ul>
          </div>
          <div id="contact">
            <h3>Contact</h3>
            <ul>
              {SITE.email && <li>{SITE.email}</li>}
              {SITE.phone && <li>{SITE.phone}</li>}
              {SITE.telegram && <li><a href={SITE.telegram} target="_blank" rel="noopener noreferrer">Telegram</a></li>}
              {SITE.whatsapp && <li><a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>}
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Gyaantosh Exams</span>
          <span>New papers will be added from time to time.</span>
        </div>
      </div>
    </footer>
  );
}
