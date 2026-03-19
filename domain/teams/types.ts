import type { SportSlug } from "../sports/types";

export type Team = {
  id: string;
  name: string;
  association: string;
  sportIds: SportSlug[];
  seed: number;
  isActive: boolean;
};
