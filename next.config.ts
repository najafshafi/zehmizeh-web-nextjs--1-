import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true, // Use `false` for a temporary redirect
      },
    ];
  },
};

export default nextConfig;