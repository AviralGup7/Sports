import type { SportSlug } from "../sports/types";

export type Role = "super_admin" | "sport_admin";

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: Role;
  sportIds: SportSlug[];
};
