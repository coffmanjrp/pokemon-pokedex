"use client";

import { Locale } from "@/lib/dictionaries";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";

interface FooterProps {
  lang: Locale;
}

export function Footer({ lang }: FooterProps) {
  const { dictionary } = useAppSelector((state) => state.ui);
  const fallback = getFallbackText(lang);

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12 lg:ml-80">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center text-sm text-gray-600">
          {/* Copyright Notice */}
          <p className="font-medium">
            {dictionary?.footer.copyright || fallback}
          </p>

          {/* Trademark Notice */}
          <p>{dictionary?.footer.trademark || fallback}</p>

          {/* Disclaimer */}
          <p className="text-xs">{dictionary?.footer.disclaimer || fallback}</p>

          {/* PokeAPI Credit */}
          <p className="text-xs">
            {dictionary?.footer.dataSource || fallback}{" "}
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              PokeAPI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
