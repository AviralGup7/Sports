import { Announcement } from "@/lib/types";

import { StageBadge } from "./stage-badge";

type NewsBulletinProps = {
  announcement: Announcement;
  compact?: boolean;
  showAdminMeta?: boolean;
  pinnedHero?: boolean;
};

export function NewsBulletin({
  announcement,
  compact = false,
  showAdminMeta = false,
  pinnedHero = false
}: NewsBulletinProps) {
  const publishedLabel = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(announcement.publishedAt));

  return (
    <article className={pinnedHero ? "news-bulletin news-bulletin-hero" : "news-bulletin"}>
      <div className="news-topline">
        <p className="eyebrow">{announcement.pinned ? "Pinned Headline" : "Bulletin"}</p>
        <StageBadge
          label={announcement.isPublished ? "Published" : "Draft"}
          tone={announcement.isPublished ? "success" : "alert"}
        />
      </div>
      <h3>{announcement.title}</h3>
      {showAdminMeta ? (
        <p className="bulletin-meta">
          {announcement.visibility} audience | {publishedLabel}
        </p>
      ) : (
        <p className="bulletin-meta">{publishedLabel}</p>
      )}
      <p className={compact ? "bulletin-copy bulletin-copy-compact" : "bulletin-copy"}>{announcement.body}</p>
    </article>
  );
}
