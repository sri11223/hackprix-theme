import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
    
  },
  typescript :{
    ignoreBuildErrors :true,
  },
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
