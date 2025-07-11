import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/providers/Providers";
import { ToastProvider } from "@/components/ui/common/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Pokemon Pokedex | Complete Multi-Generation Pokemon Database",
    template: "%s | Pokemon Pokedex",
  },
  description:
    "Comprehensive Pokemon database featuring 1302+ Pokemon from all generations. Explore detailed stats, official artwork, evolution chains, type effectiveness, and move sets. Built with modern web technologies for the best Pokemon experience.",
  keywords:
    "pokemon, pokedex, pokemon database, pokemon stats, pokemon search, evolution chain, type effectiveness, official artwork, generation, nintendo, game freak",
  authors: [{ name: "Pokemon Pokedex Team" }],
  creator: "Pokemon Pokedex",
  publisher: "Pokemon Pokedex",
  metadataBase: new URL("https://pokemon-pokedex-client.vercel.app"),
  openGraph: {
    title: "Pokemon Pokedex | Complete Multi-Generation Pokemon Database",
    description:
      "Comprehensive Pokemon database featuring 1302+ Pokemon with detailed stats, official artwork, evolution chains, and more. Explore all generations in one place.",
    type: "website",
    url: "https://pokemon-pokedex-client.vercel.app",
    siteName: "Pokemon Pokedex",
    images: [
      {
        url: "https://pokemon-pokedex-client.vercel.app/api/images/pokemon/25",
        width: 475,
        height: 475,
        alt: "Pikachu - Pokemon Pokedex",
      },
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pokemon Pokedex - Comprehensive Pokemon Database",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokemon Pokedex | Complete Multi-Generation Pokemon Database",
    description:
      "Comprehensive Pokemon database featuring 1302+ Pokemon with detailed stats, official artwork, evolution chains, and more.",
    images: ["https://pokemon-pokedex-client.vercel.app/api/images/pokemon/25"],
    creator: "@pokemon",
    site: "@pokemon",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "entertainment",
  classification: "Pokemon Database",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* DNS prefetch and preconnect for faster API calls */}
        <link rel="dns-prefetch" href="//raw.githubusercontent.com" />
        <link rel="dns-prefetch" href="//assets.pokemon.com" />
        <link
          rel="preconnect"
          href={
            process.env.NEXT_PUBLIC_SERVER_MODE === "production"
              ? process.env.NEXT_PUBLIC_GRAPHQL_URL_PROD ||
                "http://localhost:4000"
              : process.env.NEXT_PUBLIC_GRAPHQL_URL_DEV ||
                "http://localhost:4000"
          }
        />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="//fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Preload critical Pokemon images for faster initial render */}
        <link rel="prefetch" href="/api/images/pokemon/1" as="image" />
        <link rel="prefetch" href="/api/images/pokemon/4" as="image" />
        <link rel="prefetch" href="/api/images/pokemon/7" as="image" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>
          {children}
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
