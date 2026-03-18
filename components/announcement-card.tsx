import { Announcement } from "@/lib/types";

type AnnouncementCardProps = {
  announcement: Announcement;
  compact?: boolean;
  showAdminMeta?: boolean;
};

export function AnnouncementCard({ announcement, compact = false, showAdminMeta = false }: AnnouncementCardProps) {
  const publishedLabel = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(announcement.publishedAt));

  return (
    <article className="announcement-card">
      <div className="announcement-head">
        <div>
          <p className="eyebrow">{announcement.pinned ? "Pinned update" : "Notice"}</p>
          <h3>{announcement.title}</h3>
        </div>
        <span className="pill">{publishedLabel}</span>
      </div>
      {showAdminMeta ? (
        <p className="muted">
          {announcement.visibility} · {announcement.isPublished ? "published" : "draft"}
        </p>
      ) : null}
      <p className={compact ? "muted" : ""}>{announcement.body}</p>
    </article>
  );
}
