import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'arcadmin-website';

const nextConfig: NextConfig = {
  output: 'export',
  // Set basePath for GitHub Pages deployment (e.g., /repo-name)
  // Remove or comment out if deploying to root (username.github.io)
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
