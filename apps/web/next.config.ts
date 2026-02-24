import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@cosmos/ui', '@cosmos/agents', '@cosmos/pipeline'],
  output: 'standalone',
};

export default nextConfig;
