import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/PokeAPI/sprites/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.pokemon.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'], // Modern formats
    minimumCacheTTL: 86400, // 24 hours cache
  },
  // Suppress hydration warnings for browser extensions
  experimental: {
    optimizePackageImports: ['react-hot-toast', '@apollo/client'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  // Enable compression
  compress: true,
  // Optimize bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Code splitting optimization
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          apollo: {
            name: 'apollo',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]@apollo[\\/]/,
          },
          graphql: {
            name: 'graphql',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]graphql[\\/]/,
          },
        },
      },
    };
    
    return config;
  },
};

export default nextConfig;
