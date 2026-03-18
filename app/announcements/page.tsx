import { AnnouncementCard } from "@/components/announcement-card";
import { getAnnouncementsPageData } from "@/lib/data";

export default async function AnnouncementsPage() {
  const items = await getAnnouncementsPageData();

  return (
    <div className="stack-xl">
      <section className="banner">
        <p className="eyebrow">Public notices</p>
        <h1>Announcements</h1>
        <p>Only published public notices are shown here, with pinned updates sorted first.</p>
      </section>

      <div className="stack-lg">
        {items.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>
    </div>
  );
}
