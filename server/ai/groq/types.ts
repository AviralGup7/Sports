export type GroqMatchContext = {
  id: string;
  sportId: string;
  round: string;
  day: string;
  startTime: string;
  venue: string;
  status: string;
  teamAName: string;
  teamBName: string;
};

export type GroqAnnouncementContext = {
  id: string;
  title: string;
  visibility: string;
  pinned: boolean;
  isPublished: boolean;
};

export type GroqTeamContext = {
  id: string;
  name: string;
  association: string;
  seed: number;
  sportIds: string[];
  isActive: boolean;
};

export type GroqPlanningInput = {
  apiKey: string;
  prompt: string;
  matches: GroqMatchContext[];
  announcements: GroqAnnouncementContext[];
  teams: GroqTeamContext[];
};

export type GroqPlanningResult = {
  commands: string[];
  summary: string;
};

export type RawGroqPlanningResult = Partial<GroqPlanningResult> & {
  command?: string;
};

export type GroqApiError = {
  error?: {
    message?: string;
  };
};
