"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/lib/dictionaries";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";

export default function NotFound() {
  const pathname = usePathname();
  const lang = getLocaleFromPathname(pathname);
  const { dictionary } = useAppSelector((state) => state.ui);

  const fallback = getFallbackText(lang);
  const fallbackText = {
    title: fallback,
    description: fallback,
    returnHome: fallback,
  };

  const text = dictionary?.ui.notFound || fallbackText;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">❓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{text.title}</h2>
        <p className="text-gray-600 mb-6">{text.description}</p>
        <Link
          href={`/${lang}/`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {text.returnHome}
        </Link>
      </div>
    </div>
  );
}
