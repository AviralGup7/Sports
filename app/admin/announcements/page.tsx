import { AnnouncementCard } from "@/components/announcement-card";
import { announcements } from "@/lib/data";

export default function AdminAnnouncementsPage() {
  return (
    <div className="stack-xl">
      <section className="banner">
        <p className="eyebrow">Admin announcements</p>
        <h1>Notice Management</h1>
        <p>Pinned state and visibility are already represented, so publishing controls can slot in cleanly next.</p>
      </section>

      <div className="stack-lg">
        {announcements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>
    </div>
  );
}
