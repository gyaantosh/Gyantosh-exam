'use client';

import { useMemo, useState } from 'react';
import ExamIcon from '@/components/ExamIcon';
import { EXAMS } from '@/lib/exams';
import { SITE } from '@/lib/site';

// Paper Library: exam aur Free/Paid filter, search, cards
export default function PapersLibrary({ materials, initialExam = 'All', initialQuery = '' }) {
  const [exam, setExam] = useState(EXAMS.includes(initialExam) ? initialExam : 'All');
  const [type, setType] = useState('all');
  const [q, setQ] = useState(initialQuery);
  const [msg, setMsg] = useState('');

  const items = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return materials.filter((m) => {
      const okExam = exam === 'All' || m.exams.includes(exam);
      const okType = type === 'all' || (type === 'free' ? m.price === 0 : m.price > 0);
      const hay = `${m.exams.join(' ')} ${m.title} ${m.topic} ${m.tag} ${m.price ? 'paid' : 'free'}`.toLowerCase();
      return okExam && okType && words.every((w) => hay.includes(w));
    });
  }, [materials, exam, type, q]);

  function buy(m) {
    setMsg(`"${m.title}" kharidne ka payment option agle step mein jodenge. Abhi ye button sirf dikhne ke liye hai.`);
    setTimeout(() => setMsg(''), 5000);
  }

  return (
    <>
      <div className="exams" role="group" aria-label="Exam">
        {['All', ...EXAMS].map((n) => {
          const count = n === 'All' ? materials.length : materials.filter((m) => m.exams.includes(n)).length;
          return (
            <button key={n} type="button" className="exam-btn" aria-pressed={exam === n} onClick={() => setExam(n)}>
              <span className="bub" aria-hidden="true" />
              <span>{n}</span>
              <span className="ct">{count}</span>
            </button>
          );
        })}
      </div>

      {q && (
        <div className="qinfo">
          <span>Results for &quot;{q}&quot;</span>
          <button type="button" onClick={() => setQ('')}>Clear search</button>
        </div>
      )}

      <div className="toolbar">
        <div className="seg" role="group" aria-label="Paper type">
          {[['all', 'All'], ['free', 'Free'], ['paid', 'Paid']].map(([v, label]) => (
            <button key={v} type="button" aria-pressed={type === v} onClick={() => setType(v)}>{label}</button>
          ))}
        </div>
        <p className="shown" aria-live="polite">{items.length} {items.length === 1 ? 'paper' : 'papers'} shown</p>
      </div>

      {msg && <p className="inline-msg" role="status">{msg}</p>}

      {items.length === 0 ? (
        <p className="empty">
          {materials.length === 0
            ? 'Abhi koi material upload nahi hua hai. Admin panel se pehla paper jodein.'
            : 'No papers match this choice yet. Try another exam, another word, or pick "All".'}
        </p>
      ) : (
        <div className="papers">
          {items.map((m) => {
            const free = m.price === 0;
            return (
              <article className="paper" key={m.id}>
                {m.cover ? (
                  <span className="thumb"><img src={m.cover} alt="" loading="lazy" /></span>
                ) : (
                  <span className="thumb ph-fallback" aria-hidden="true">
                    <span>{m.topic.toUpperCase()}</span>
                    <b>{m.title.split(',')[0]}</b>
                  </span>
                )}
                <div className="paper-top">
                  <div className="paper-id">
                    <span className="ex-icon"><ExamIcon exam={m.exams[0]} /></span>
                    <span className="exam-tag">{m.topic}</span>
                  </div>
                  <span className={`badge ${free ? 'free' : 'paid'}`}>{free ? 'Free' : `Paid · ${SITE.currency}${m.price}`}</span>
                </div>
                <h3>{m.title}</h3>
                <p className="meta">
                  {[m.tag, m.pages === 1 ? 'Single sheet' : `PDF · ${m.pages} pages`, m.language].filter(Boolean).join(' · ')}
                </p>
                {free ? (
                  <a className="btn btn-primary" href={`/api/download/${m.id}`} target="_blank" rel="noopener">Open free sheet</a>
                ) : m.owned ? (
                  <a className="btn btn-primary" href={`/api/download/${m.id}`}>Download</a>
                ) : (
                  <button type="button" className="btn btn-accent" onClick={() => buy(m)}>Buy · {SITE.currency}{m.price}</button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
