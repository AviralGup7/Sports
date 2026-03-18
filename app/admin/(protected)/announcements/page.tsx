import { ActionNotice } from "@/components/action-notice";
import { AnnouncementCard } from "@/components/announcement-card";
import { requireAdminProfile } from "@/lib/auth";
import { getAdminAnnouncementsData } from "@/lib/data";

import { upsertAnnouncementAction } from "../../actions";

type AdminAnnouncementsPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function AdminAnnouncementsPage({ searchParams }: AdminAnnouncementsPageProps) {
  const params = (await searchParams) ?? {};
  const { profile } = await requireAdminProfile();
  const data = await getAdminAnnouncementsData(profile);
  const tone = params.status === "error" ? "error" : params.status === "success" ? "success" : "info";

  return (
    <div className="stack-xl">
      <section className="banner">
        <p className="eyebrow">Admin announcements</p>
        <h1>Notice Management</h1>
        <p>Create, edit, publish, and pin updates for the public board and internal operations feed.</p>
      </section>

      <ActionNotice message={params.message} tone={tone} />

      <section className="editor-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Create notice</p>
            <h2>New announcement</h2>
          </div>
        </div>
        <form action={upsertAnnouncementAction} className="stack-lg">
          <div className="form-grid">
            <label className="field">
              <span>Title</span>
              <input name="title" required placeholder="Venue update" />
            </label>
            <label className="field">
              <span>Visibility</span>
              <select name="visibility" defaultValue="public">
                <option value="public">Public</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>
          <label className="field">
            <span>Body</span>
            <textarea name="body" rows={4} required placeholder="Write the notice here." />
          </label>
          <div className="checkbox-grid">
            <label className="checkbox-pill">
              <input type="checkbox" name="pinned" />
              <span>Pinned</span>
            </label>
            <label className="checkbox-pill">
              <input type="checkbox" name="isPublished" defaultChecked />
              <span>Published</span>
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="button">
              Save announcement
            </button>
          </div>
        </form>
      </section>

      <div className="stack-lg">
        {data.announcements.map((announcement) => (
          <article key={announcement.id} className="editor-card">
            <AnnouncementCard announcement={announcement} showAdminMeta />
            <form action={upsertAnnouncementAction} className="stack-lg">
              <input type="hidden" name="id" value={announcement.id} />
              <div className="form-grid">
                <label className="field">
                  <span>Title</span>
                  <input name="title" defaultValue={announcement.title} required />
                </label>
                <label className="field">
                  <span>Visibility</span>
                  <select name="visibility" defaultValue={announcement.visibility}>
                    <option value="public">Public</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
              </div>
              <label className="field">
                <span>Body</span>
                <textarea name="body" rows={4} defaultValue={announcement.body} required />
              </label>
              <div className="checkbox-grid">
                <label className="checkbox-pill">
                  <input type="checkbox" name="pinned" defaultChecked={announcement.pinned} />
                  <span>Pinned</span>
                </label>
                <label className="checkbox-pill">
                  <input type="checkbox" name="isPublished" defaultChecked={announcement.isPublished} />
                  <span>Published</span>
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="button button-ghost">
                  Update announcement
                </button>
              </div>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
