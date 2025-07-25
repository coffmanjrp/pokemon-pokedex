"use client";

import { useState, useEffect, useRef } from "react";
import { Dictionary } from "@/lib/dictionaries";
import { TYPE_COLORS, POKEMON_TYPES } from "@/lib/data/index";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/ui/icons";
import { gsap } from "gsap";

interface TypeFilterProps {
  selectedTypes?: string[];
  onTypeFilter?: (types: string[]) => void;
  dictionary: Dictionary;
  isShrinked?: boolean;
  className?: string;
}

export function TypeFilter({
  selectedTypes = [],
  onTypeFilter,
  dictionary,
  isShrinked = false,
  className = "",
}: TypeFilterProps) {
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Component mount effect
  useEffect(() => {
    setIsMounted(true);

    // Set initial state after mount
    const content = contentRef.current;
    if (!content || typeof window === "undefined") return;

    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      // Mobile: Start with closed state
      gsap.set(content, {
        height: 0,
        opacity: 0,
        y: -10,
      });
    } else {
      // Desktop: Always visible
      gsap.set(content, {
        height: "auto",
        opacity: 1,
        y: 0,
      });
    }
  }, []);

  // GSAP animation for accordion
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    const content = contentRef.current;
    if (!content) return;

    // Only animate on mobile (lg breakpoint and below)
    const isMobile = window.innerWidth < 1024;
    if (!isMobile) return;

    if (isTypeFilterOpen) {
      // Opening animation
      gsap.fromTo(
        content,
        {
          height: 0,
          opacity: 0,
          y: -10,
        },
        {
          height: "auto",
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        },
      );
    } else {
      // Closing animation - get current height first
      const currentHeight = content.scrollHeight;
      gsap.fromTo(
        content,
        {
          height: currentHeight,
          opacity: 1,
          y: 0,
        },
        {
          height: 0,
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: "power2.in",
        },
      );
    }
  }, [isTypeFilterOpen, isMounted]);

  const handleTypeToggle = (type: string) => {
    if (!onTypeFilter) return;

    const newTypes = selectedTypes?.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...(selectedTypes || []), type];

    onTypeFilter(newTypes);
  };

  const clearTypeFilter = () => {
    onTypeFilter?.([]);
  };

  return (
    <div
      className={`mt-3 pt-3 border-t border-gray-200 type-filter-section ${
        isShrinked ? "pointer-events-none" : ""
      } ${className}`}
    >
      {/* Mobile: Accordion Toggle Button */}
      <button
        onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
        className="lg:hidden w-full flex items-center justify-between px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
        aria-expanded={isTypeFilterOpen}
        aria-controls="type-filter-content"
      >
        <span>
          {dictionary.ui.filters?.showTypeFilter || "Filter by type"}
          {selectedTypes.length > 0 && (
            <span className="ml-2 text-xs text-gray-500">
              ({selectedTypes.length})
            </span>
          )}
        </span>
        {isTypeFilterOpen ? (
          <ChevronUpIcon className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Type Filter Content - Always visible on desktop, accordion on mobile */}
      <div
        ref={contentRef}
        id="type-filter-content"
        className={`
          lg:block overflow-hidden
          ${isTypeFilterOpen ? "mt-3" : ""} lg:mt-0
        `}
      >
        <div className="flex flex-wrap items-center gap-2 py-1">
          <span className="hidden lg:inline text-sm font-medium text-gray-700 mr-2">
            {dictionary.ui.filters?.filterByType || "Filter by type:"}
          </span>

          {POKEMON_TYPES.map((type) => {
            const isSelected = selectedTypes?.includes(type);
            const typeColor =
              TYPE_COLORS[type as keyof typeof TYPE_COLORS] || "#6B7280";
            const typeLabel =
              dictionary.ui.types?.[type as keyof typeof dictionary.ui.types] ||
              type;

            // Helper function to determine if color is light or dark for text contrast
            const isLightColor = (hex: string) => {
              const r = parseInt(hex.slice(1, 3), 16);
              const g = parseInt(hex.slice(3, 5), 16);
              const b = parseInt(hex.slice(5, 7), 16);
              const brightness = (r * 299 + g * 587 + b * 114) / 1000;
              return brightness > 155;
            };

            const lightColor = isLightColor(typeColor);

            return (
              <button
                key={type}
                onClick={() => handleTypeToggle(type)}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 border shadow-sm ${
                  isSelected
                    ? "shadow-md transform scale-105 border-opacity-30"
                    : "hover:shadow-md hover:transform hover:scale-105 border-opacity-20"
                }`}
                style={{
                  backgroundColor: isSelected ? typeColor : `${typeColor}20`,
                  borderColor: typeColor,
                  color: isSelected
                    ? lightColor
                      ? "#374151"
                      : "#ffffff"
                    : "#374151",
                }}
              >
                {typeLabel}
              </button>
            );
          })}

          {selectedTypes && selectedTypes.length > 0 && (
            <button
              onClick={clearTypeFilter}
              className="px-2 py-1 text-xs text-red-600 hover:text-red-800 underline"
            >
              {dictionary.ui.filters?.clear || "Clear"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
