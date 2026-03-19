export type SceneMode = "r3f" | "canvas-fallback" | "css-fallback" | "reduced";
export type SceneQuality = "ultra" | "high" | "medium" | "low";
export type PostFxQuality = "full" | "medium" | "light" | "off";
export type ScrollMode = "lenis" | "native";
export type HeroSceneVariant = "site-backdrop" | "home-hero" | "sport-masthead" | "schedule-command" | "newsroom-story" | "bracket-showcase";
export type TheatreSequenceId =
  | "site-backdrop-ambient"
  | "home-hero-intro"
  | "sport-masthead-reveal"
  | "schedule-command-flow"
  | "newsroom-glide"
  | "bracket-showcase-trace";

export type ScenePreset = {
  variant: HeroSceneVariant;
  sequenceId: TheatreSequenceId;
  beamStrength: number;
  sparkDensity: number;
  vignetteOffset: number;
  chromaOffset: number;
  focusDistance: number;
  focusScale: number;
  glowIntensity: number;
  backgroundSpin: number;
  cameraDistance: number;
};

const presets: Record<HeroSceneVariant, ScenePreset> = {
  "site-backdrop": {
    variant: "site-backdrop",
    sequenceId: "site-backdrop-ambient",
    beamStrength: 0.7,
    sparkDensity: 0.55,
    vignetteOffset: 0.28,
    chromaOffset: 0.0012,
    focusDistance: 0.028,
    focusScale: 0.018,
    glowIntensity: 0.72,
    backgroundSpin: 0.08,
    cameraDistance: 7.8
  },
  "home-hero": {
    variant: "home-hero",
    sequenceId: "home-hero-intro",
    beamStrength: 1,
    sparkDensity: 1,
    vignetteOffset: 0.16,
    chromaOffset: 0.0022,
    focusDistance: 0.018,
    focusScale: 0.02,
    glowIntensity: 1,
    backgroundSpin: 0.14,
    cameraDistance: 6.4
  },
  "sport-masthead": {
    variant: "sport-masthead",
    sequenceId: "sport-masthead-reveal",
    beamStrength: 0.86,
    sparkDensity: 0.78,
    vignetteOffset: 0.2,
    chromaOffset: 0.0018,
    focusDistance: 0.022,
    focusScale: 0.018,
    glowIntensity: 0.88,
    backgroundSpin: 0.11,
    cameraDistance: 6.9
  },
  "schedule-command": {
    variant: "schedule-command",
    sequenceId: "schedule-command-flow",
    beamStrength: 0.68,
    sparkDensity: 0.6,
    vignetteOffset: 0.24,
    chromaOffset: 0.0014,
    focusDistance: 0.026,
    focusScale: 0.016,
    glowIntensity: 0.74,
    backgroundSpin: 0.07,
    cameraDistance: 7.2
  },
  "newsroom-story": {
    variant: "newsroom-story",
    sequenceId: "newsroom-glide",
    beamStrength: 0.72,
    sparkDensity: 0.62,
    vignetteOffset: 0.22,
    chromaOffset: 0.0018,
    focusDistance: 0.024,
    focusScale: 0.018,
    glowIntensity: 0.82,
    backgroundSpin: 0.09,
    cameraDistance: 7.1
  },
  "bracket-showcase": {
    variant: "bracket-showcase",
    sequenceId: "bracket-showcase-trace",
    beamStrength: 0.82,
    sparkDensity: 0.84,
    vignetteOffset: 0.18,
    chromaOffset: 0.0016,
    focusDistance: 0.02,
    focusScale: 0.018,
    glowIntensity: 0.9,
    backgroundSpin: 0.12,
    cameraDistance: 6.7
  }
};

export function getScenePreset(variant: HeroSceneVariant) {
  return presets[variant];
}
