import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // PENTING untuk static export
  },
  typescript: {
    ignoreBuildErrors: true
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true
  }
}

export default nextConfig;