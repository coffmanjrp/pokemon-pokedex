"use client";

import { useState } from "react";
import { HiChevronDown, HiChevronUp, HiCheck } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { Locale, Dictionary } from "@/lib/dictionaries";
import { LANGUAGE_OPTIONS, LanguageOption } from "@/lib/data";

interface LanguageSelectorProps {
  language: Locale;
  onLanguageChange: (language: Locale) => void;
  dictionary: Dictionary;
  className?: string;
}

export function LanguageSelector({
  language,
  onLanguageChange,
  dictionary,
  className,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentOption =
    LANGUAGE_OPTIONS.find((option) => option.value === language) ??
    LANGUAGE_OPTIONS[0];

  const getLanguageLabel = (option: LanguageOption) => {
    return dictionary.ui.language[option.labelKey];
  };

  const handleOptionClick = (selectedLanguage: Locale) => {
    onLanguageChange(selectedLanguage);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative">
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {dictionary.ui.language.toggle}
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
          <span>
            {currentOption ? getLanguageLabel(currentOption) : "Language"}
          </span>
        </span>
        {isOpen ? (
          <HiChevronUp className="w-4 h-4 transition-transform duration-200" />
        ) : (
          <HiChevronDown className="w-4 h-4 transition-transform duration-200" />
        )}
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
                <span>{getLanguageLabel(option)}</span>
                {option.value === language && (
                  <HiCheck className="w-4 h-4 ml-auto text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
