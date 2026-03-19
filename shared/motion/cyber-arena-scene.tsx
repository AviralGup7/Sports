"use client";

import { gsap } from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type CyberArenaSceneProps = {
  className?: string;
  tone?: "cyan" | "blue" | "amber" | "crimson";
  intensity?: "cinematic" | "premium" | "functional";
  interactive?: boolean;
};

type SceneMode = "webgl" | "css" | "reduced";

type Particle = {
  x: number;
  y: number;
  radius: number;
  velocityX: number;
  velocityY: number;
  alpha: number;
};

const toneMap: Record<NonNullable<CyberArenaSceneProps["tone"]>, [number, number, number]> = {
  cyan: [34, 211, 238],
  blue: [56, 189, 248],
  amber: [245, 158, 11],
  crimson: [251, 113, 133]
};

export function CyberArenaScene({
  className,
  tone = "cyan",
  intensity = "cinematic",
  interactive = true
}: CyberArenaSceneProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<SceneMode>(reduceMotion ? "reduced" : "css");

  const density = useMemo(() => {
    if (intensity === "functional") {
      return 18;
    }
    if (intensity === "premium") {
      return 28;
    }
    return 42;
  }, [intensity]);

  useEffect(() => {
    if (reduceMotion) {
      setMode("reduced");
      return;
    }

    const canvas = document.createElement("canvas");
    const webgl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    setMode(webgl ? "webgl" : "css");
  }, [reduceMotion]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !interactive || reduceMotion) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;

      gsap.to(root, {
        duration: 0.65,
        ease: "power3.out",
        "--scene-pointer-x": `${x}%`,
        "--scene-pointer-y": `${y}%`
      });
    };

    const handlePointerLeave = () => {
      gsap.to(root, {
        duration: 0.9,
        ease: "power3.out",
        "--scene-pointer-x": "50%",
        "--scene-pointer-y": "50%"
      });
    };

    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [interactive, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const rgb = toneMap[tone];
    let animationFrame = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const bounds = root.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(bounds.height * pixelRatio));
      canvas.style.width = `${bounds.width}px`;
      canvas.style.height = `${bounds.height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      particles = Array.from({ length: density }, () => ({
        x: Math.random() * bounds.width,
        y: Math.random() * bounds.height,
        radius: Math.random() * 2.6 + 0.8,
        velocityX: (Math.random() - 0.5) * 0.32,
        velocityY: (Math.random() - 0.5) * 0.24,
        alpha: Math.random() * 0.7 + 0.2
      }));
    };

    const draw = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);

      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(7, 12, 19, 0.08)");
      gradient.addColorStop(0.5, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.07)`);
      gradient.addColorStop(1, "rgba(4, 7, 11, 0.02)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      const pulse = (Math.sin(time / 1000) + 1) / 2;

      particles.forEach((particle, index) => {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        context.beginPath();
        context.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${particle.alpha * (0.45 + pulse * 0.25)})`;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();

        if (index % 3 === 0) {
          context.beginPath();
          context.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.08 + pulse * 0.08})`;
          context.lineWidth = 1;
          context.moveTo(particle.x, particle.y);
          context.lineTo(particle.x + 42, particle.y - 18);
          context.stroke();
        }
      });

      for (let ring = 0; ring < 3; ring += 1) {
        context.beginPath();
        context.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.08 + ring * 0.05})`;
        context.lineWidth = 1.2;
        context.arc(width * 0.78, height * 0.44, 90 + ring * 42 + pulse * 8, 0, Math.PI * 2);
        context.stroke();
      }

      const beamWidth = width * 0.55;
      const beamX = ((time / 22) % (width + beamWidth)) - beamWidth;
      const beamGradient = context.createLinearGradient(beamX, 0, beamX + beamWidth, 0);
      beamGradient.addColorStop(0, "rgba(255,255,255,0)");
      beamGradient.addColorStop(0.45, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.04)`);
      beamGradient.addColorStop(0.5, `rgba(255,255,255,0.14)`);
      beamGradient.addColorStop(0.56, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.08)`);
      beamGradient.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = beamGradient;
      context.fillRect(beamX, 0, beamWidth, height);

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    animationFrame = window.requestAnimationFrame(draw);
    const observer = new ResizeObserver(resize);
    observer.observe(root);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [density, reduceMotion, tone]);

  return (
    <div
      ref={rootRef}
      className={className ? `cyber-arena-scene ${className}` : "cyber-arena-scene"}
      data-mode={mode}
      data-tone={tone}
      data-intensity={intensity}
    >
      {!reduceMotion ? <canvas ref={canvasRef} className="cyber-arena-canvas" aria-hidden="true" /> : null}
      <div className="cyber-arena-grid" aria-hidden="true" />
      <div className="cyber-arena-beam cyber-arena-beam-left" aria-hidden="true" />
      <div className="cyber-arena-beam cyber-arena-beam-right" aria-hidden="true" />
      <div className="cyber-arena-scanlines" aria-hidden="true" />
    </div>
  );
}
