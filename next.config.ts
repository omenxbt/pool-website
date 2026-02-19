import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Browsers often request /favicon.ico first; serve our pool icon so it actually shows
      { source: "/favicon.ico", destination: "/icon.png" },
    ];
  },
};

export default nextConfig;
