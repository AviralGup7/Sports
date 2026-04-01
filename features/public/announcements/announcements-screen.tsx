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
            title="Notices"
            description="Check published schedule changes, venue notices, and tournament updates in one place."
            compact
            tone="crimson"
            intensity="premium"
            variant="newsroom-story"
          />
        </ScrollStorySection>
      </MotionIn>

      {leadItem ? (
        <MotionIn className="section-shell" delay={0.06}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Notice</p>
              <h2>Latest update</h2>
            </div>
          </div>
          <div className="news-grid news-grid-headline">
            <NewsBulletin announcement={leadItem} pinnedHero={leadItem.pinned} />
          </div>
        </MotionIn>
      ) : (
        <MotionIn className="section-shell" delay={0.06}>
          <EmptyState
            eyebrow="Notices"
            title="No public notices yet"
            description="Published schedule updates and venue notices will appear here once organisers post them."
          />
        </MotionIn>
      )}

      {feedItems.length > 0 ? (
        <MotionIn className="section-shell" delay={0.1}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Feed</p>
              <h2>More notices</h2>
            </div>
          </div>
          <div className="news-feed">
            {feedItems.map((announcement) => <NewsBulletin key={announcement.id} announcement={announcement} />)}
          </div>
        </MotionIn>
      ) : null}
    </div>
  );
}
