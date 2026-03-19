"use client";

import { getScenePreset, type HeroSceneVariant } from "@/shared/motion/scene-config";
import theatreState from "@/shared/motion/theatre/cyber-arena-state.json";

type TheatreStateShape = {
  sequenceLengths: Record<string, number>;
  variants: Record<
    string,
    {
      camera: {
        distance: number;
        elevation: number;
        drift: number;
      };
      fx: {
        beamPulse: number;
        distortion: number;
        vignette: number;
        sparkleBias: number;
      };
    }
  >;
};

export type RigValues = {
  cameraDistance: number;
  cameraElevation: number;
  cameraDrift: number;
  beamPulse: number;
  distortion: number;
  vignette: number;
  sparkleBias: number;
};

export function useTheatreRig(variant: HeroSceneVariant) {
  const preset = getScenePreset(variant);
  const config = (theatreState as TheatreStateShape).variants[variant];
  const values: RigValues = {
    cameraDistance: config.camera.distance,
    cameraElevation: config.camera.elevation,
    cameraDrift: config.camera.drift,
    beamPulse: config.fx.beamPulse,
    distortion: config.fx.distortion,
    vignette: config.fx.vignette,
    sparkleBias: config.fx.sparkleBias
  };

  const sequenceLength = (theatreState as TheatreStateShape).sequenceLengths[preset.sequenceId] ?? 5;

  return { values, sequenceLength };
}
