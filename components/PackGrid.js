import Link from 'next/link';
import ExamIcon from '@/components/ExamIcon';
import { EXAMS, META } from '@/lib/exams';
import { SITE } from '@/lib/site';

// "Popular Exams" ke cards. Ginti aur daam materials ki list se apne aap nikalte hain.
export default function PackGrid({ materials }) {
  return (
    <div className="pack-grid">
      {EXAMS.map((n) => {
        const list = materials.filter((m) => m.exams.includes(n));
        const free = list.filter((m) => m.price === 0).length;
        const paidList = list.filter((m) => m.price > 0);
        const low = paidList.length ? Math.min(...paidList.map((m) => m.price)) : 0;
        const meta = META[n] || { short: n, grad: ['#2B2A6B', '#14133A'] };
        return (
          <article className="pack" key={n}>
            <div className="pack-top" style={{ background: `linear-gradient(135deg, ${meta.grad[0]}, ${meta.grad[1]})` }}>
              <h3>{meta.short}</h3>
              <small>PAPER LIBRARY</small>
              <span className="pi"><ExamIcon exam={n} /></span>
            </div>
            <div className="pack-body">
              {meta.flag && list.length > 0 && <span className="pill">{meta.flag}</span>}
              {list.length === 0 ? (
                <>
                  <p className="soon-note">Papers for this exam are coming soon.</p>
                  <p className="pack-price">&nbsp;</p>
                  <span className="btn btn-line btn-sm" aria-disabled="true">Coming soon</span>
                </>
              ) : (
                <>
                  <ul>
                    <li>{free} free {free === 1 ? 'sheet' : 'sheets'}</li>
                    <li>{paidList.length} paid {paidList.length === 1 ? 'PDF' : 'PDFs'}</li>
                    <li>MCQs and notes</li>
                  </ul>
                  <p className="pack-price">
                    {paidList.length ? <>From {SITE.currency}{low} <small>per PDF</small></> : 'Free'}
                  </p>
                  <Link className="btn btn-primary btn-sm" href={`/?exam=${encodeURIComponent(n)}#papers`}>View Papers</Link>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
