import type { Tournament } from "@/domain";
import { SponsorShowcase, TournamentContactCard } from "@/shared/ui";

type GlobalSupportProps = {
  tournament: Tournament;
};

export function GlobalSupport({ tournament }: GlobalSupportProps) {
  return (
    <section className="page-shell home-support-grid" aria-label="Organisers and sponsors">
      <TournamentContactCard tournament={tournament} />
      <section className="home-support-card">
        <SponsorShowcase compact title="Sponsors" description="Tournament partners supporting the people behind the event." />
      </section>
    </section>
  );
}
