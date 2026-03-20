import type { Announcement } from "@/domain/announcements/types";
import { BroadcastHero } from "@/shared/layout";
import { EmptyState } from "@/shared/feedback";
import { MotionIn, ScrollStorySection } from "@/shared/motion";
import { FreshnessStamp, NewsBulletin } from "@/shared/ui";

type AnnouncementsScreenProps = {
  generatedAt: string;
  items: Announcement[];
};

export function AnnouncementsScreen({ generatedAt, items }: AnnouncementsScreenProps) {
  const pinnedItems = items.filter((announcement) => announcement.pinned);
  const feedItems = items.filter((announcement) => !announcement.pinned);

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
                  <span className="aside-label">Pinned notices</span>
                  <strong>{pinnedItems.length}</strong>
                </div>
                <div>
                  <span className="aside-label">All notices</span>
                  <strong>{feedItems.length}</strong>
                </div>
                <FreshnessStamp generatedAt={generatedAt} />
              </div>
            }
          />
        </ScrollStorySection>
      </MotionIn>

      {pinnedItems.length > 0 ? (
        <MotionIn className="section-shell" delay={0.08}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Latest Notice</p>
              <h2>Pinned updates</h2>
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
            <p className="eyebrow">Notices</p>
            <h2>All updates</h2>
          </div>
        </div>
        <div className="news-feed">
          {feedItems.length > 0 ? (
            feedItems.map((announcement) => <NewsBulletin key={announcement.id} announcement={announcement} />)
          ) : (
            <EmptyState
              eyebrow="Notices"
              title="No additional notices yet"
              description="Pinned updates can still appear above, but there are no extra notices to show right now."
            />
          )}
        </div>
      </MotionIn>
    </div>
  );
}
