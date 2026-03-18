import { AnnouncementCard } from "@/components/announcement-card";
import { getVisibleAnnouncements } from "@/lib/data";

export default function AnnouncementsPage() {
  const items = getVisibleAnnouncements("public");

  return (
    <div className="stack-xl">
      <section className="banner">
        <p className="eyebrow">Public notices</p>
        <h1>Announcements</h1>
        <p>Bulletin content is already separated from admin-only notes so visibility rules will be easy to add later.</p>
      </section>

      <div className="stack-lg">
        {items.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>
    </div>
  );
}
