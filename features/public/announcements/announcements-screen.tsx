import type { AnnouncementsPageData } from "@/server/data/public/types";
import { BroadcastHero } from "@/shared/layout";
import { EmptyState } from "@/shared/feedback";
import { MotionIn, ScrollStorySection } from "@/shared/motion";
import { NewsBulletin } from "@/shared/ui";

type AnnouncementsScreenProps = {
  data: AnnouncementsPageData;
};

export function AnnouncementsScreen({ data }: AnnouncementsScreenProps) {
  const { items } = data;
  const pinnedItems = items.filter((announcement) => announcement.pinned);
  const leadItem = pinnedItems[0] ?? items[0] ?? null;
  const feedItems = items.filter((announcement) => announcement.id !== leadItem?.id);

  return (
    <div className="stack-xl">
      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow="Notices"
            title="Updates & Alerts"
            description="Check the latest schedule changes, venue notices, and important tournament updates in one place."
            compact
            tone="crimson"
            intensity="premium"
            variant="newsroom-story"
            aside={
              <div className="hero-aside-list hero-aside-list-cyber">
                <div>
                  <span className="aside-label">Lead story</span>
                  <strong>{leadItem ? "Ready" : "Waiting"}</strong>
                </div>
                <div>
                  <span className="aside-label">More notices</span>
                  <strong>{feedItems.length}</strong>
                </div>
              </div>
            }
          />
        </ScrollStorySection>
      </MotionIn>

      {leadItem ? (
        <MotionIn className="section-shell" delay={0.06}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Lead Story</p>
              <h2>Read this notice first</h2>
            </div>
          </div>
          <div className="home-news-grid">
            <div className="news-grid news-grid-headline">
              <NewsBulletin announcement={leadItem} pinnedHero={leadItem.pinned} />
            </div>
            <div className="home-news-aside">
              <article className="home-summary-card">
                <p className="eyebrow">Noticeboard</p>
                <h3>What is in the feed</h3>
                <div className="home-kpi-list">
                  <span>
                    <strong>{pinnedItems.length}</strong>
                    Pinned updates
                  </span>
                  <span>
                    <strong>{items.length}</strong>
                    Total notices
                  </span>
                  <span>
                    <strong>{feedItems.length}</strong>
                    Remaining in feed
                  </span>
                </div>
              </article>
            </div>
          </div>
        </MotionIn>
      ) : null}

      <MotionIn className="section-shell" delay={0.1}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Feed</p>
            <h2>More notices</h2>
          </div>
        </div>
        <div className="news-feed">
          {feedItems.length > 0 ? (
            feedItems.map((announcement) => <NewsBulletin key={announcement.id} announcement={announcement} />)
          ) : (
            <EmptyState
              eyebrow="Notices"
              title="No extra notices in this feed"
              description="Pinned updates can still appear above, but there are no additional public notices available right now."
            />
          )}
        </div>
      </MotionIn>
    </div>
  );
}
