import type { NextConfig } from 'next';

const isGithubPagesBuild = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = isGithubPagesBuild
  ? {
      output: 'export',
      basePath: '/personaforge',
      assetPrefix: '/personaforge/',
      trailingSlash: true,
    }
  : {};

export default nextConfig;
