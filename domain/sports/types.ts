export type SportSlug = "cricket" | "football" | "volleyball" | "athletics";

export type Sport = {
  id: SportSlug;
  name: string;
  color: string;
  rulesSummary: string;
  format: string;
};
