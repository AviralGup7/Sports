"use client";

import { useEffect } from "react";

import { useUICapability } from "./ui-capability";

export function RuntimeCapabilityFlags() {
  const capability = useUICapability();

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.uiProfile = capability.profile;
    root.dataset.effects = capability.effects;
    root.dataset.heroMode = capability.heroMode;
    root.dataset.tickerMode = capability.tickerMode;
    root.dataset.bracketMode = capability.bracketMode;
    root.dataset.mobile = capability.isMobile ? "true" : "false";
    root.dataset.android = capability.isAndroid ? "true" : "false";
  }, [capability]);

  return null;
}
