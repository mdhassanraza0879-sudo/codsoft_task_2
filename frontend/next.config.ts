import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    const backendDest =
      process.env.BACKEND_URL ||
      (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith('http')
        ? process.env.NEXT_PUBLIC_API_URL
        : 'http://localhost:5000/api');

    const cleanDest = backendDest.trim().replace(/\/+$/, '');
    const finalDest = cleanDest.endsWith('/api') ? cleanDest : `${cleanDest}/api`;

    return [
      {
        source: "/api/:path*",
        destination: `${finalDest}/:path*`,
      },
    ];
  },
};

export default nextConfig;
