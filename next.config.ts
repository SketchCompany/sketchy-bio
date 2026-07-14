import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimal self-contained server bundle for the Raspberry Pi (small footprint, low RAM).
  output: "standalone",
  images: {
    // Uploaded media lives under /public/uploads and is served by the same origin.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
