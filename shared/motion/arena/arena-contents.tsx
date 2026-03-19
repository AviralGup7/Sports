"use client";

import { EffectComposer, Bloom, ChromaticAberration, DepthOfField, Vignette } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Sparkles } from "@react-three/drei";
import { BlendFunction } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import type { HeroSceneVariant } from "@/shared/motion/scene-config";
import { getScenePreset } from "@/shared/motion/scene-config";
import { useUICapability } from "@/shared/motion/ui-capability";

import { useTheatreRig } from "./use-theatre-rig";

type ArenaContentsProps = {
  variant: HeroSceneVariant;
  tone?: "cyan" | "blue" | "amber" | "crimson";
};

const toneColors: Record<NonNullable<ArenaContentsProps["tone"]>, THREE.ColorRepresentation> = {
  cyan: "#4de9ff",
  blue: "#5cb8ff",
  amber: "#ffb44d",
  crimson: "#ff5e7e"
};

export function ArenaContents({ variant, tone = "cyan" }: ArenaContentsProps) {
  const capability = useUICapability();
  const preset = getScenePreset(variant);
  const { sheet, values, sequenceLength } = useTheatreRig(variant);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const energyFieldRef = useRef<THREE.Mesh | null>(null);
  const beamGroupRef = useRef<THREE.Group | null>(null);
  const focusMeshRef = useRef<THREE.Mesh | null>(null);

  const beamColor = useMemo(() => new THREE.Color(toneColors[tone]), [tone]);
  const qualityMultiplier = capability.sceneQuality === "ultra" ? 1 : capability.sceneQuality === "high" ? 0.82 : capability.sceneQuality === "medium" ? 0.64 : 0.48;
  const sparkCount = Math.max(24, Math.round(180 * preset.sparkDensity * values.sparkleBias * qualityMultiplier));

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(toneColors[tone]) },
          uDistortion: { value: values.distortion },
          uGlow: { value: preset.glowIntensity }
        },
        vertexShader: `
          varying vec2 vUv;
          uniform float uTime;
          uniform float uDistortion;

          void main() {
            vUv = uv;
            vec3 pos = position;
            float wave = sin((pos.x * 2.2) + uTime * 0.85) * 0.08;
            float ripple = cos((pos.y * 2.8) - uTime * 0.65) * 0.06;
            pos.z += (wave + ripple) * uDistortion;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uGlow;

          void main() {
            vec2 uv = vUv - 0.5;
            float radial = 1.0 - smoothstep(0.05, 0.72, length(uv));
            float pulse = 0.6 + 0.4 * sin(uTime * 1.2 + uv.x * 4.0 + uv.y * 4.0);
            float scan = 0.5 + 0.5 * sin((vUv.y + uTime * 0.22) * 110.0);
            float intensity = radial * (0.55 + pulse * 0.35) * (0.78 + scan * 0.12) * uGlow;
            gl_FragColor = vec4(uColor * intensity, intensity * 0.62);
          }
        `
      }),
    [preset.glowIntensity, tone, values.distortion]
  );

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const playhead = sequenceLength > 0 ? ((Math.sin(elapsed * 0.18) + 1) * 0.5) * sequenceLength : 0;
    sheet.sequence.position = playhead;

    if (cameraRef.current) {
      cameraRef.current.position.x = Math.sin(elapsed * 0.18) * values.cameraDrift;
      cameraRef.current.position.y = values.cameraElevation + Math.cos(elapsed * 0.22) * 0.08;
      cameraRef.current.position.z = values.cameraDistance;
      cameraRef.current.lookAt(0, 0, 0);
    }

    if (energyFieldRef.current) {
      const material = energyFieldRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = elapsed;
      material.uniforms.uDistortion.value = values.distortion;
      energyFieldRef.current.rotation.z = elapsed * preset.backgroundSpin;
    }

    if (beamGroupRef.current) {
      beamGroupRef.current.rotation.z = elapsed * 0.08;
      beamGroupRef.current.children.forEach((child, index) => {
        child.scale.y = 1 + Math.sin(elapsed * (0.8 + index * 0.15)) * 0.16 * values.beamPulse;
      });
    }

    if (focusMeshRef.current) {
      focusMeshRef.current.rotation.x = elapsed * 0.35;
      focusMeshRef.current.rotation.y = elapsed * 0.45;
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, values.cameraElevation, preset.cameraDistance]} fov={42} />
      <color attach="background" args={["#050811"]} />
      <fog attach="fog" args={["#050811", 6, 14]} />
      <ambientLight intensity={0.35} color={beamColor} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color={beamColor} />
      <pointLight position={[-3, 1.5, 3]} intensity={1.2} color={beamColor} />

      <group ref={beamGroupRef}>
        {[-2.4, -0.8, 0.8, 2.4].map((x, index) => (
          <mesh key={`${variant}-beam-${index}`} position={[x, 0, -1.2]} rotation={[0, 0, Math.PI / 7]}>
            <planeGeometry args={[0.3, 5.2]} />
            <meshBasicMaterial color={beamColor} transparent opacity={0.18 + index * 0.02} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>

      <mesh ref={energyFieldRef} rotation={[-Math.PI / 2.8, 0, 0]} position={[0, -0.4, -1.1]} material={shaderMaterial}>
        <planeGeometry args={[8.5, 6.5, 32, 32]} />
      </mesh>

      <Float speed={1.4} rotationIntensity={0.18} floatIntensity={0.45}>
        <mesh ref={focusMeshRef} position={[0, 0.25, 0.4]}>
          <torusKnotGeometry args={[0.58, 0.18, 140, 18]} />
          <meshPhysicalMaterial color={beamColor} emissive={beamColor} emissiveIntensity={0.6} roughness={0.12} metalness={0.9} />
        </mesh>
      </Float>

      <Sparkles count={sparkCount} scale={[9, 4.5, 8]} size={capability.sceneQuality === "low" ? 3 : 4} speed={0.45 + preset.sparkDensity * 0.8} color={beamColor} />

      {capability.postFxQuality !== "off" ? (
        <EffectComposer multisampling={capability.postFxQuality === "full" ? 4 : 0}>
          <Bloom luminanceThreshold={0.16} luminanceSmoothing={0.45} intensity={capability.postFxQuality === "full" ? 1.15 : capability.postFxQuality === "medium" ? 0.88 : 0.62} />
          <DepthOfField focusDistance={preset.focusDistance} focalLength={preset.focusScale} bokehScale={capability.postFxQuality === "full" ? 2.4 : 1.5} height={480} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(preset.chromaOffset, preset.chromaOffset * 0.35)} />
          <Vignette eskil={false} offset={values.vignette} darkness={0.82} />
        </EffectComposer>
      ) : null}
    </>
  );
}
