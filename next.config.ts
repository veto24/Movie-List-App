import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactStrictMode: true,
  images: {
    domains: ["movie-list-app-20250217.s3.ap-southeast-1.amazonaws.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
