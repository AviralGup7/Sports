import type { Metadata } from "next";

const siteName = "Inter Cultural Assoc Sports League";
const siteDescription = "Public-facing sports portal for live scores, schedules, standings, notices, and match details.";

export function buildTournamentPageMetadata(title: string, description: string): Metadata {
  const fullTitle = `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      siteName,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description
    }
  };
}

export function getDefaultSiteMetadata(): Metadata {
  return buildTournamentPageMetadata(siteName, siteDescription);
}
