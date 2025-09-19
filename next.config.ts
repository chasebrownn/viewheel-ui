import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix for wallet adapter modules that use Node.js APIs
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
  // Silence the lockfile warning
  outputFileTracingRoot: process.cwd(),
  // Handle ESM modules from wallet adapters
  transpilePackages: [
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-react-ui',
    '@solana/wallet-adapter-wallets',
  ],
};

export default nextConfig;