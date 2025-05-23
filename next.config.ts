
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains: [
    //   "zehmizeh-app-data.s3.amazonaws.com",
    //   "zehmizeh-stage-data.s3.amazonaws.com",
    // ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zehmizeh-app-data.s3.amazonaws.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "zehmizeh-stage-data.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
