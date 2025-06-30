"use client";

import { cn } from "@/lib/utils";
import { Locale } from "@/lib/dictionaries";

interface LanguageToggleProps {
  language: Locale;
  onToggle: () => void;
  className?: string;
}

export function LanguageToggle({
  language,
  onToggle,
  className,
}: LanguageToggleProps) {
  return (
    <div className="w-full">
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {language === "ja"
          ? "言語"
          : language === "zh-Hant"
            ? "語言"
            : language === "zh-Hans"
              ? "语言"
              : "Language"}
      </label>
      <button
        onClick={onToggle}
        className={cn(
          "w-full px-4 py-2 rounded-lg text-sm font-medium",
          "border border-gray-300 hover:bg-gray-50",
          "transition-colors duration-200 text-left",
          "flex items-center justify-between",
          className,
        )}
      >
        <span>
          {language === "en"
            ? "🇺🇸 English"
            : language === "ja"
              ? "🇯🇵 日本語"
              : language === "zh-Hant"
                ? "🇹🇼 繁體中文"
                : "🇨🇳 简体中文"}
        </span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
          />
        </svg>
      </button>
    </div>
  );
}
