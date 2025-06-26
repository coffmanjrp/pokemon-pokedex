"use client";

import { usePathname } from "next/navigation";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isPokemonDetailPage = pathname.includes("/pokemon/");
  const isSandboxPage = pathname.includes("/sandbox");

  return (
    <main
      className={
        isPokemonDetailPage || isSandboxPage
          ? "min-h-screen"
          : "lg:ml-80 min-h-screen"
      }
    >
      {children}
    </main>
  );
}
