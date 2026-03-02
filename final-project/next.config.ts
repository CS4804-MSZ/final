import type { NextConfig } from "next";

const nextConfig = {
    output: 'export',
    basePath: '/final',
    assetPrefix: '/final/',
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;

export default nextConfig;
