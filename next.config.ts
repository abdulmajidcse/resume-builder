import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /** Emits a self-contained server bundle so the Docker runtime stage needs no node_modules. */
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
