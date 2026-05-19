import type { NextConfig } from "next";

const isDev = process.env.VERCEL_ENV === "preview";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    if (!isDev) return [];
    return [
      {
        source: "/(.*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "kekawinan.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.trakteer.id" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
