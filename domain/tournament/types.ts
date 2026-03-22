export type TournamentContact = {
  id: string;
  name: string;
  phone: string;
  role?: string;
};

export type Tournament = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  venue: string;
  logoAssetPath: string;
  contacts: TournamentContact[];
};
