import { BroadcastHero } from "@/components/broadcast-hero";
import { MotionIn } from "@/components/motion-in";
import { NewsBulletin } from "@/components/news-bulletin";
import { getAnnouncementsPageData } from "@/lib/data";

export default async function AnnouncementsPage() {
  const items = await getAnnouncementsPageData();
  const pinnedItems = items.filter((announcement) => announcement.pinned);
  const feedItems = items.filter((announcement) => !announcement.pinned);

  return (
    <div className="stack-xl">
      <MotionIn>
        <BroadcastHero
          eyebrow="Bulletin Desk"
          title="Announcements"
          description="Pinned headlines ride the top of the board, while the rest of the newsroom feed stacks below in reverse chronological order."
          compact
          aside={
            <div className="hero-aside-list">
              <div>
                <span className="aside-label">Pinned</span>
                <strong>{pinnedItems.length}</strong>
              </div>
              <div>
                <span className="aside-label">Feed items</span>
                <strong>{feedItems.length}</strong>
              </div>
            </div>
          }
        />
      </MotionIn>

      {pinnedItems.length > 0 ? (
        <MotionIn className="section-shell" delay={0.08}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Pinned Headlines</p>
              <h2>Top of feed</h2>
            </div>
          </div>
          <div className="news-grid">
            {pinnedItems.map((announcement) => (
              <NewsBulletin key={announcement.id} announcement={announcement} pinnedHero />
            ))}
          </div>
        </MotionIn>
      ) : null}

      <MotionIn className="section-shell" delay={0.12}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Newsroom Feed</p>
            <h2>Latest calls</h2>
          </div>
        </div>
        <div className="news-feed">
          {feedItems.map((announcement) => (
            <NewsBulletin key={announcement.id} announcement={announcement} />
          ))}
        </div>
      </MotionIn>
    </div>
  );
}
