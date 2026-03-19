"use client";

import { Canvas } from "@react-three/fiber";

import type { HeroSceneVariant } from "@/shared/motion/scene-config";
import { useUICapability } from "@/shared/motion/ui-capability";
import { ArenaContents } from "@/shared/motion/arena/arena-contents";

type ArenaR3FSceneProps = {
  variant: HeroSceneVariant;
  tone?: "cyan" | "blue" | "amber" | "crimson";
  className?: string;
};

export function ArenaR3FScene({ variant, tone = "cyan", className }: ArenaR3FSceneProps) {
  const capability = useUICapability();
  const dpr: [number, number] =
    capability.sceneQuality === "ultra" ? [1, 2] : capability.sceneQuality === "high" ? [1, 1.75] : [1, 1.35];

  return (
    <div className={className ? `arena-r3f-host ${className}` : "arena-r3f-host"}>
      <Canvas dpr={dpr} gl={{ antialias: capability.sceneQuality !== "low", alpha: true }} camera={{ position: [0, 0, 7], fov: 42 }}>
        <ArenaContents variant={variant} tone={tone} />
      </Canvas>
    </div>
  );
}
