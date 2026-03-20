import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_PROFILE === "e2e" ? ".next-e2e" : ".next"
};

export default nextConfig;
