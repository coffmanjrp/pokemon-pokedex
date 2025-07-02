"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Locale } from "@/lib/dictionaries";

interface LanguageOption {
  value: Locale;
  label: string;
  flag: string;
}

interface LanguageToggleProps {
  language: Locale;
  onLanguageChange: (language: Locale) => void;
  className?: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "ja", label: "日本語", flag: "🇯🇵" },
  { value: "zh-Hant", label: "繁體中文", flag: "🇹🇼" },
  { value: "zh-Hans", label: "简体中文", flag: "🇨🇳" },
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "ko", label: "한국어", flag: "🇰🇷" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "it", label: "Italiano", flag: "🇮🇹" },
];

export function LanguageToggle({
  language,
  onLanguageChange,
  className,
}: LanguageToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentOption =
    LANGUAGE_OPTIONS.find((option) => option.value === language) ??
    LANGUAGE_OPTIONS[0];

  const getLabel = () => {
    switch (language) {
      case "ja":
        return "言語";
      case "zh-Hant":
        return "語言";
      case "zh-Hans":
        return "语言";
      case "es":
        return "Idioma";
      case "ko":
        return "언어";
      case "fr":
        return "Langue";
      case "it":
        return "Lingua";
      default:
        return "Language";
    }
  };

  const handleOptionClick = (selectedLanguage: Locale) => {
    onLanguageChange(selectedLanguage);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative">
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {getLabel()}
      </label>

      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-2 rounded-lg text-sm font-medium",
          "border border-gray-300 hover:bg-gray-50",
          "transition-colors duration-200 text-left",
          "flex items-center justify-between",
          isOpen && "bg-gray-50 border-blue-300",
          className,
        )}
      >
        <span className="flex items-center gap-2">
          <span>{currentOption?.flag}</span>
          <span>{currentOption?.label}</span>
        </span>
        <svg
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <div
            className="fixed inset-0 z-10 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Options */}
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={cn(
                  "w-full px-4 py-3 text-sm text-left flex items-center gap-2",
                  "hover:bg-gray-50 transition-colors duration-150",
                  option.value === language
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700",
                )}
              >
                <span>{option.flag}</span>
                <span>{option.label}</span>
                {option.value === language && (
                  <svg
                    className="w-4 h-4 ml-auto text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
