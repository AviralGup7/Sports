import { Match } from "@/lib/types";

import { FixtureStrip } from "./fixture-strip";

type MatchCardProps = {
  match: Match;
  showSport?: boolean;
};

export function MatchCard({ match, showSport = false }: MatchCardProps) {
  return <FixtureStrip match={match} showSport={showSport} />;
}
