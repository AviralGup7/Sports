import type { DayNote } from "@/server/data/public/types";

type DayNoteBannerProps = {
  note: DayNote;
};

export function DayNoteBanner({ note }: DayNoteBannerProps) {
  return (
    <section className={`day-note-banner day-note-${note.tone}`}>
      <p className="eyebrow">Tournament note</p>
      <strong>{note.title}</strong>
      <p>{note.detail}</p>
    </section>
  );
}
