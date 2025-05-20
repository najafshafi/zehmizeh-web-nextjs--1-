/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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
    // Config for production server
    poweredByHeader: false,
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    // Improve production performance
    reactStrictMode: false, // Disable strict mode for production
};

module.exports = nextConfig; 