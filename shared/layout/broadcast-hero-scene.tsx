"use client";

import dynamic from "next/dynamic";

import type { HeroSceneVariant } from "@/shared/motion";

const CyberArenaScene = dynamic(() => import("@/shared/motion/cyber-arena-scene").then((module) => module.CyberArenaScene), {
  ssr: false,
  loading: () => null
});

type BroadcastHeroSceneProps = {
  tone: "cyan" | "blue" | "amber" | "crimson";
  intensity: "cinematic" | "premium" | "functional";
  variant: HeroSceneVariant;
};

export function BroadcastHeroScene({ tone, intensity, variant }: BroadcastHeroSceneProps) {
  return <CyberArenaScene className="broadcast-hero-scene" tone={tone} intensity={intensity} variant={variant} />;
}
