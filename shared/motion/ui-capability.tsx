"use client";

import { useEffect, useMemo, useState } from "react";
import type { PostFxQuality, SceneMode, SceneQuality, ScrollMode } from "@/shared/motion/scene-config";

export type UIMobileProfile = "desktop" | "mobile" | "android-mobile";
export type UIEffectsLevel = "safe" | "enhanced" | "full";
export type UIHeroMode = "full" | "css-fallback" | "reduced";
export type UITickerMode = "looping" | "stepped" | "static";
export type UIBracketMode = "animated" | "highlighted" | "minimal";

export type UICapability = {
  isAndroid: boolean;
  isMobile: boolean;
  isCompactWidth: boolean;
  reducedMotion: boolean;
  profile: UIMobileProfile;
  effects: UIEffectsLevel;
  heroMode: UIHeroMode;
  tickerMode: UITickerMode;
  bracketMode: UIBracketMode;
  sceneMode: SceneMode;
  sceneQuality: SceneQuality;
  postFxQuality: PostFxQuality;
  scrollMode: ScrollMode;
};

function getServerSafeCapability(reducedMotion: boolean): UICapability {
  return {
    isAndroid: false,
    isMobile: false,
    isCompactWidth: false,
    reducedMotion,
    profile: "desktop",
    effects: reducedMotion ? "safe" : "enhanced",
    heroMode: reducedMotion ? "reduced" : "css-fallback",
    tickerMode: "static",
    bracketMode: reducedMotion ? "minimal" : "highlighted",
    sceneMode: reducedMotion ? "reduced" : "css-fallback",
    sceneQuality: "medium",
    postFxQuality: reducedMotion ? "off" : "light",
    scrollMode: "native"
  };
}

function readCapability(reducedMotion: boolean): UICapability {
  if (typeof window === "undefined") {
    return getServerSafeCapability(reducedMotion);
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isAndroid = userAgent.includes("android");
  const isCompactWidth = window.innerWidth <= 820;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isMobile = isCompactWidth || coarsePointer;

  const profile: UIMobileProfile = isAndroid && isMobile ? "android-mobile" : isMobile ? "mobile" : "desktop";
  const effects: UIEffectsLevel = reducedMotion ? "safe" : profile === "desktop" ? "full" : "enhanced";
  const heroMode: UIHeroMode = reducedMotion ? "reduced" : "css-fallback";
  const tickerMode: UITickerMode = reducedMotion ? "static" : profile === "desktop" ? "looping" : "stepped";
  const bracketMode: UIBracketMode = reducedMotion ? "minimal" : profile === "desktop" ? "animated" : "highlighted";
  const sceneMode: SceneMode = reducedMotion ? "reduced" : "css-fallback";
  const sceneQuality: SceneQuality = reducedMotion
    ? "low"
    : profile === "desktop"
      ? window.devicePixelRatio > 1.5
        ? "ultra"
        : "high"
      : isAndroid
        ? "low"
        : "medium";
  const postFxQuality: PostFxQuality = reducedMotion ? "off" : "light";
  const scrollMode: ScrollMode = "native";

  return {
    isAndroid,
    isMobile,
    isCompactWidth,
    reducedMotion,
    profile,
    effects,
    heroMode,
    tickerMode,
    bracketMode,
    sceneMode,
    sceneQuality,
    postFxQuality,
    scrollMode
  };
}

function sameCapability(left: UICapability, right: UICapability) {
  return (
    left.isAndroid === right.isAndroid &&
    left.isMobile === right.isMobile &&
    left.isCompactWidth === right.isCompactWidth &&
    left.reducedMotion === right.reducedMotion &&
    left.profile === right.profile &&
    left.effects === right.effects &&
    left.heroMode === right.heroMode &&
    left.tickerMode === right.tickerMode &&
    left.bracketMode === right.bracketMode &&
    left.sceneMode === right.sceneMode &&
    left.sceneQuality === right.sceneQuality &&
    left.postFxQuality === right.postFxQuality &&
    left.scrollMode === right.scrollMode
  );
}

export function useUICapability() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [capability, setCapability] = useState<UICapability>(() => getServerSafeCapability(prefersReducedMotion));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setPrefersReducedMotion(media.matches);
    };

    apply();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", apply);
      return () => {
        media.removeEventListener("change", apply);
      };
    }

    media.addListener(apply);
    return () => {
      media.removeListener(apply);
    };
  }, []);

  useEffect(() => {
    const apply = () => {
      const nextCapability = readCapability(prefersReducedMotion);
      setCapability((current) => (sameCapability(current, nextCapability) ? current : nextCapability));
    };

    apply();
    window.addEventListener("resize", apply);

    return () => {
      window.removeEventListener("resize", apply);
    };
  }, [prefersReducedMotion]);

  return useMemo(() => capability, [capability]);
}
