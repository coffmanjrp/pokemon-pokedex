import type { NextConfig } from "next";

// Bundle analyzer setup
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  // Dynamic output directory support for parallel builds
  distDir: process.env.NEXT_OUT_DIR || ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/PokeAPI/sprites/**",
      },
      {
        protocol: "https",
        hostname: "assets.pokemon.com",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"], // Prioritize AVIF for better compression
    minimumCacheTTL: 31536000, // 1 year cache for Pokemon images (rarely change)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Optimized device sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384, 512], // Extended sizes for Pokemon artwork
    dangerouslyAllowSVG: false, // Security: disable SVG
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Security for images
    // Loader optimization for external images
    loader: "default",
    // Image optimization settings
    unoptimized: false,
  },
  // Suppress hydration warnings for browser extensions
  experimental: {
    optimizePackageImports: [
      "react-hot-toast",
      "@apollo/client",
      "@tanstack/react-virtual",
    ],
    // Enable aggressive tree shaking
    esmExternals: true,
  },
  // Build timeout configurations for SSG
  staticPageGenerationTimeout: 180, // 3 minutes per page (increased from 2)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  // Cache headers for better performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  compiler: {
    // Remove console logs in production
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
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
            name: "apollo",
            chunks: "all",
            test: /[\\/]node_modules[\\/]@apollo[\\/]/,
          },
          graphql: {
            name: "graphql",
            chunks: "all",
            test: /[\\/]node_modules[\\/]graphql[\\/]/,
          },
        },
      },
    };

    return config;
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
