import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployments
  output: "standalone",
  
  // Disable X-Powered-By header for security
  poweredByHeader: false,
  
  // Enable strict mode for better error handling
  reactStrictMode: true,
};

export default nextConfig;
