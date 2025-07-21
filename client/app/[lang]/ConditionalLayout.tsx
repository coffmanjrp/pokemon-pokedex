"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Locale } from "@/lib/dictionaries";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isPokemonDetailPage = pathname.includes("/pokemon/");
  const isSandboxPage = pathname.includes("/sandbox");

  // Extract language from pathname
  const langMatch = pathname.match(/^\/([a-z]{2})\//);
  const lang = (langMatch?.[1] as Locale) || "en";

  return (
    <>
      <main
        className={
          isPokemonDetailPage || isSandboxPage
            ? "min-h-screen"
            : "lg:ml-80 min-h-screen"
        }
      >
        {children}
      </main>
      <Footer lang={lang} />
    </>
  );
}
