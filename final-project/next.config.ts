// final-project/next.config.js
const repoName = "final";

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;