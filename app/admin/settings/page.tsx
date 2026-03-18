export default function AdminSettingsPage() {
  return (
    <div className="stack-xl">
      <section className="banner">
        <p className="eyebrow">Admin settings</p>
        <h1>Readiness Checklist</h1>
        <p>The settings area is reserved for environment, auth, and backup controls from the implementation plan.</p>
      </section>

      <section className="detail-grid">
        <article className="detail-card">
          <p className="eyebrow">Auth</p>
          <h2>Pending</h2>
          <p>Wire Supabase email login and route protection for `/admin` pages.</p>
        </article>
        <article className="detail-card">
          <p className="eyebrow">Data</p>
          <h2>Pending</h2>
          <p>Replace mock arrays with database tables for sports, teams, matches, results, and announcements.</p>
        </article>
        <article className="detail-card">
          <p className="eyebrow">Operations</p>
          <h2>Pending</h2>
          <p>Add export and backup actions once persistent storage is connected.</p>
        </article>
      </section>
    </div>
  );
}
