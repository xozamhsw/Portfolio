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
    unoptimized: false, // tetap gunakan optimisasi bawaan Next.js
    dangerouslyAllowSVG: true, // kalau ada svg dari luar
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
