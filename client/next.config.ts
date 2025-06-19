import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
  },
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
  },
};

export default nextConfig;
