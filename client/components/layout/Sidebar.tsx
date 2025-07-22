"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setLanguage } from "@/store/slices/uiSlice";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Locale,
  Dictionary,
  generateAlternateLanguageUrl,
} from "@/lib/dictionaries";
import { setStoredLanguage } from "@/lib/languageStorage";
import { GENERATIONS } from "@/lib/data/generations";
import { Logo } from "./Logo";
import { LanguageSelector } from "./LanguageSelector";
import { CopyrightNotice } from "./CopyrightNotice";
import { HiBars3, HiXMark } from "react-icons/hi2";

interface SidebarProps {
  lang: Locale;
  dictionary: Dictionary;
  currentGeneration: number;
  onGenerationChange: (generation: number) => void;
}

export function Sidebar({
  lang,
  dictionary,
  currentGeneration,
  onGenerationChange,
}: SidebarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLanguageChange = (newLang: Locale) => {
    const newUrl = generateAlternateLanguageUrl(pathname, newLang);

    // Preserve URL parameters (query string)
    const currentParams = searchParams.toString();
    const urlWithParams = currentParams ? `${newUrl}?${currentParams}` : newUrl;

    // Save to localStorage first
    setStoredLanguage(newLang);

    // Update Redux state
    dispatch(setLanguage(newLang));

    // Navigate to new URL with preserved parameters
    router.push(urlWithParams);
  };

  const handleGenerationClick = (generationId: number) => {
    onGenerationChange(generationId);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-2 left-2 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
        style={{ minHeight: "44px", minWidth: "44px" }} // Ensure proper touch target size
      >
        {isMobileMenuOpen ? (
          <HiXMark className="w-6 h-6" />
        ) : (
          <HiBars3 className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg z-40 transform transition-transform duration-300 ease-in-out
        w-80 sm:w-72 md:w-80
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header with Logo - positioned to avoid hamburger menu on mobile only */}
          <div className="pt-16 lg:pt-6 pb-6 px-6 border-b border-gray-200">
            <Logo />
            <p className="text-xs text-gray-500 mt-4 text-left">
              {dictionary.ui.common.tagline}
            </p>
          </div>

          {/* Generation Buttons */}
          <div
            className="flex-1 overflow-y-auto py-4"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="px-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                {dictionary.ui.navigation.generationsTitle}
              </h3>
              <div className="space-y-2">
                {GENERATIONS.map((generation) => (
                  <button
                    key={generation.id}
                    onClick={() => handleGenerationClick(generation.id)}
                    className={`
                      w-full text-left px-4 py-4 rounded-lg transition-colors duration-200 touch-manipulation
                      ${
                        currentGeneration === generation.id
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-100 active:bg-gray-200 border border-transparent"
                      }
                    `}
                    style={{ minHeight: "56px" }} // Larger touch target for mobile
                  >
                    <div className="font-medium text-sm">
                      {generation.name[lang as keyof typeof generation.name] ||
                        generation.name.en}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {generation.region[
                        lang as keyof typeof generation.region
                      ] || generation.region.en}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Language Toggle at Bottom */}
          <div className="p-6 border-t border-gray-200">
            <LanguageSelector
              language={lang}
              onLanguageChange={handleLanguageChange}
              dictionary={dictionary}
            />

            <CopyrightNotice dictionary={dictionary} />
          </div>
        </div>
      </nav>
    </>
  );
}
