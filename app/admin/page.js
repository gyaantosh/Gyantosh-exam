import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { SITE } from '@/lib/site';
import AdminForm from './AdminForm';
import DeleteButton from './DeleteButton';
import { togglePublished, deleteMaterial } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin | Gyaantosh Exams' };

export default async function AdminPage() {
  const { user, profile } = await getSessionUser();
  if (!user) redirect('/login');

  if (!profile?.is_admin) {
    return (
      <main className="auth-page">
        <div className="auth-card reg">
          <h1>Access nahi hai</h1>
          <p className="auth-sub">Ye page sirf admin ke liye hai. README mein bataya gaya hai ki apne account ko admin kaise banayein.</p>
          <Link className="btn btn-primary" href="/">Home par jaayein</Link>
        </div>
      </main>
    );
  }

  const admin = createAdminClient();
  const { data: rows } = await admin.from('materials').select('*').order('created_at', { ascending: false });
  const materials = rows || [];

  return (
    <main className="admin-page wrap">
      <div className="admin-top">
        <h1>Admin panel</h1>
        <Link className="btn btn-line btn-sm" href="/">&larr; Website dekhein</Link>
      </div>

      <section className="admin-card">
        <h2>Naya material jodein</h2>
        <AdminForm />
      </section>

      <section className="admin-card">
        <h2>Abhi ke materials ({materials.length})</h2>
        {materials.length === 0 ? (
          <p className="soon-note">Abhi koi material nahi hai. Upar se pehla material jodein.</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Title</th><th>Exams</th><th>Daam</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.id}>
                    <td className="t-title">{m.title}<div className="t-sub">{m.topic} · {m.pages} pages</div></td>
                    <td>{(m.exams || []).join(', ')}</td>
                    <td>{m.price === 0 ? 'Free' : `${SITE.currency}${m.price}`}</td>
                    <td><span className={`badge ${m.published ? 'free' : 'paid'}`}>{m.published ? 'Live' : 'Hidden'}</span></td>
                    <td className="t-actions">
                      <form action={togglePublished}>
                        <input type="hidden" name="id" value={m.id} />
                        <input type="hidden" name="publish" value={m.published ? 'false' : 'true'} />
                        <button className="btn btn-line btn-sm" type="submit">{m.published ? 'Hide' : 'Show'}</button>
                      </form>
                      <form action={deleteMaterial}>
                        <input type="hidden" name="id" value={m.id} />
                        <DeleteButton title={m.title} />
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
