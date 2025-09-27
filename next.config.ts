// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // artinya semua host HTTPS diizinkan
        pathname: "/**", // semua path diizinkan
      },
      {
        protocol: "http",
        hostname: "**", // kalau ada gambar non-https
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
