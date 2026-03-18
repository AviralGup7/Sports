import { ActionNotice } from "@/components/action-notice";
import { ControlPanel } from "@/components/control-panel";
import { FormCluster } from "@/components/form-cluster";
import { MotionIn } from "@/components/motion-in";
import { NewsBulletin } from "@/components/news-bulletin";
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
      <MotionIn>
        <section className="operations-hero">
          <div>
            <p className="eyebrow">Notice Deck</p>
            <h1>Editorial control</h1>
            <p className="hero-text">Compose urgent public headlines, pin ticker-worthy updates, and keep the organizer feed clean.</p>
          </div>
          <div className="operations-hero-side">
            <span className="operations-chip">Total {data.announcements.length}</span>
            <span className="operations-chip">Pinned {data.announcements.filter((item) => item.pinned).length}</span>
          </div>
        </section>
      </MotionIn>

      <ActionNotice message={params.message} tone={tone} />

      <MotionIn className="split-stage" delay={0.08}>
        <ControlPanel eyebrow="Compose" title="New announcement" description="Use this deck to push a fresh public or admin-side notice.">
          <form action={upsertAnnouncementAction} className="stack-lg">
            <FormCluster label="Headline" title="Title and audience">
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
            </FormCluster>

            <FormCluster label="Body" title="Write the update">
              <label className="field">
                <span>Body</span>
                <textarea name="body" rows={6} required placeholder="Write the notice here." />
              </label>
            </FormCluster>

            <div className="selection-pills">
              <label className="selection-pill">
                <input type="checkbox" name="pinned" />
                <span>Pinned headline</span>
              </label>
              <label className="selection-pill">
                <input type="checkbox" name="isPublished" defaultChecked />
                <span>Published now</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="button">
                Save announcement
              </button>
            </div>
          </form>
        </ControlPanel>

        <div className="stack-lg">
          {data.announcements.map((announcement) => (
            <ControlPanel
              key={announcement.id}
              eyebrow="Editable bulletin"
              title={announcement.title}
              description={`${announcement.visibility} audience`}
              dense
            >
              <NewsBulletin announcement={announcement} compact showAdminMeta />
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
                <div className="selection-pills">
                  <label className="selection-pill">
                    <input type="checkbox" name="pinned" defaultChecked={announcement.pinned} />
                    <span>Pinned</span>
                  </label>
                  <label className="selection-pill">
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
            </ControlPanel>
          ))}
        </div>
      </MotionIn>
    </div>
  );
}
