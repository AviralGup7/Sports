"use client";

import { getProject } from "@theatre/core";
import { useEffect, useMemo, useState } from "react";

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

  const [values, setValues] = useState<RigValues>({
    cameraDistance: config.camera.distance,
    cameraElevation: config.camera.elevation,
    cameraDrift: config.camera.drift,
    beamPulse: config.fx.beamPulse,
    distortion: config.fx.distortion,
    vignette: config.fx.vignette,
    sparkleBias: config.fx.sparkleBias
  });

  const sequenceLength = (theatreState as TheatreStateShape).sequenceLengths[preset.sequenceId] ?? 5;
  const sheet = useMemo(() => {
    const project = getProject(`iasl-${variant}`, { state: {} });
    return project.sheet(preset.sequenceId);
  }, [preset.sequenceId, variant]);

  useEffect(() => {
    const object = sheet.object("SceneRig", {
      cameraDistance: config.camera.distance,
      cameraElevation: config.camera.elevation,
      cameraDrift: config.camera.drift,
      beamPulse: config.fx.beamPulse,
      distortion: config.fx.distortion,
      vignette: config.fx.vignette,
      sparkleBias: config.fx.sparkleBias
    });

    setValues(object.value as RigValues);
    const unsubscribe = object.onValuesChange((nextValues) => {
      setValues(nextValues as RigValues);
    });

    return () => {
      unsubscribe();
    };
  }, [config.camera.distance, config.camera.drift, config.camera.elevation, config.fx.beamPulse, config.fx.distortion, config.fx.sparkleBias, config.fx.vignette, sheet]);

  return { sheet, values, sequenceLength };
}
