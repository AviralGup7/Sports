"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

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
};

function readCapability(reducedMotion: boolean): UICapability {
  if (typeof window === "undefined") {
    return {
      isAndroid: false,
      isMobile: false,
      isCompactWidth: false,
      reducedMotion,
      profile: "desktop",
      effects: reducedMotion ? "safe" : "full",
      heroMode: reducedMotion ? "reduced" : "full",
      tickerMode: reducedMotion ? "static" : "looping",
      bracketMode: reducedMotion ? "minimal" : "animated"
    };
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isAndroid = userAgent.includes("android");
  const isCompactWidth = window.innerWidth <= 820;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isMobile = isCompactWidth || coarsePointer;

  const profile: UIMobileProfile = isAndroid && isMobile ? "android-mobile" : isMobile ? "mobile" : "desktop";
  const effects: UIEffectsLevel = reducedMotion ? "safe" : profile === "desktop" ? "full" : "enhanced";
  const heroMode: UIHeroMode = reducedMotion ? "reduced" : profile === "desktop" ? "full" : "css-fallback";
  const tickerMode: UITickerMode = reducedMotion ? "static" : profile === "desktop" ? "looping" : "stepped";
  const bracketMode: UIBracketMode = reducedMotion ? "minimal" : profile === "desktop" ? "animated" : "highlighted";

  return {
    isAndroid,
    isMobile,
    isCompactWidth,
    reducedMotion,
    profile,
    effects,
    heroMode,
    tickerMode,
    bracketMode
  };
}

export function useUICapability() {
  const reducedMotion = useReducedMotion();
  const prefersReducedMotion = Boolean(reducedMotion);
  const [capability, setCapability] = useState<UICapability>(() => readCapability(prefersReducedMotion));

  useEffect(() => {
    const apply = () => {
      setCapability(readCapability(prefersReducedMotion));
    };

    apply();
    window.addEventListener("resize", apply);

    return () => {
      window.removeEventListener("resize", apply);
    };
  }, [prefersReducedMotion]);

  return useMemo(() => capability, [capability]);
}
