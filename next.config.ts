import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudflare R2 (media backend: avatar, foto scan, media chat)
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
      // Backend Laravel via tunnel (URL foto lokal saat MEDIA_DISK=local)
      {
        protocol: "https",
        hostname: "*.trycloudflare.com",
        port: "",
        pathname: "/**",
      },
      // Placeholder avatar
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/api/**",
      },
    ],
  },
};

export default nextConfig;
