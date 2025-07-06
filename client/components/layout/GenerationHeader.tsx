"use client";

import { Dictionary, Locale, interpolate } from "@/lib/dictionaries";
import { GENERATIONS } from "@/lib/data/generations";
import { SearchBar } from "./SearchBar";
import { useState, useEffect, useRef } from "react";
import { TYPE_COLORS, POKEMON_TYPES } from "@/lib/data/index";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
} from "@/components/ui/icons";
import { gsap } from "gsap";

interface GenerationHeaderProps {
  currentGeneration: number;
  lang: Locale;
  dictionary: Dictionary;
  className?: string;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  onSearchClear?: () => void;
  showSearch?: boolean;
  searchLoading?: boolean;
  searchSuggestions?: string[];
  showTypeFilter?: boolean;
  selectedTypes?: string[];
  onTypeFilter?: (types: string[]) => void;
  isShrinked?: boolean;
  onMouseEnter?: () => void;
}

export function GenerationHeader({
  currentGeneration,
  lang,
  dictionary,
  className = "",
  searchQuery: externalSearchQuery = "",
  onSearch,
  onSearchClear,
  showSearch = true,
  searchLoading = false,
  searchSuggestions = [],
  showTypeFilter = false,
  selectedTypes = [],
  onTypeFilter,
  isShrinked = false,
  onMouseEnter,
}: GenerationHeaderProps) {
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const titleRefs = useRef<HTMLHeadingElement[]>([]);
  const searchIconRef = useRef<HTMLDivElement>(null);
  const mobileSearchIconRef = useRef<HTMLDivElement>(null);

  // Sync with external search query
  useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  // Component mount effect and initial setup
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

    // Set initial state for search icons
    if (searchIconRef.current) {
      gsap.set(searchIconRef.current, {
        opacity: 0,
        scale: 0.8,
      });
    }
    if (mobileSearchIconRef.current) {
      gsap.set(mobileSearchIconRef.current, {
        opacity: 0,
        scale: 0.8,
      });
    }

    // Set initial state for search sections
    const searchSections =
      headerRef.current?.querySelectorAll(".search-section");
    if (searchSections) {
      searchSections.forEach((section) => {
        gsap.set(section, {
          opacity: 1,
          y: 0,
        });
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

  // GSAP animation for header shrink
  useEffect(() => {
    if (!isMounted || !headerRef.current) return;

    const timeline = gsap.timeline({
      defaults: { duration: 0.4, ease: "power3.inOut" },
    });

    // Get all search sections
    const searchSections =
      headerRef.current.querySelectorAll(".search-section");
    const typeFilterSection = headerRef.current.querySelector(
      ".type-filter-section",
    );

    if (isShrinked) {
      // Shrinking animation
      timeline
        .to(headerRef.current, {
          height: "3.5rem", // h-14
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          backgroundColor: "rgba(249, 250, 251, 0.98)", // slightly transparent
          backdropFilter: "blur(8px)",
        })
        .to(
          titleRefs.current,
          {
            scale: 0.75,
            opacity: 0.9,
            y: -2,
            duration: 0.35,
            ease: "back.inOut(1.2)",
          },
          "<",
        ); // Start at the same time

      // Animate all search sections - fade out in place
      if (searchSections.length > 0) {
        timeline.to(
          searchSections,
          {
            opacity: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          "<",
        );
      }

      // Show search icon - fade in at right position
      if (searchIconRef.current) {
        timeline.to(
          searchIconRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.1",
        );
      }

      if (mobileSearchIconRef.current) {
        timeline.to(
          mobileSearchIconRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.3",
        );
      }

      // Hide type filter
      if (typeFilterSection) {
        timeline.to(
          typeFilterSection,
          {
            opacity: 0,
            scaleY: 0,
            transformOrigin: "top",
            height: 0,
            marginTop: 0,
            paddingTop: 0,
            paddingBottom: 0,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<0.1",
        );
      }
    } else {
      // Expanding animation
      timeline
        .to(headerRef.current, {
          height: "auto",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          backgroundColor: "rgb(249, 250, 251)",
          backdropFilter: "none",
        })
        .to(
          titleRefs.current,
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "back.out(1.4)",
          },
          "<",
        );

      // Hide search icon - simple fade out
      if (searchIconRef.current) {
        timeline.to(
          searchIconRef.current,
          {
            opacity: 0,
            scale: 0.8,
            duration: 0.2,
            ease: "power2.in",
          },
          "<",
        );
      }

      if (mobileSearchIconRef.current) {
        timeline.to(
          mobileSearchIconRef.current,
          {
            opacity: 0,
            scale: 0.8,
            duration: 0.2,
            ease: "power2.in",
          },
          "<",
        );
      }

      // Show all search sections - fade in place
      if (searchSections.length > 0) {
        timeline.to(
          searchSections,
          {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.2",
        ); // Overlap slightly
      }

      // Show type filter
      if (typeFilterSection) {
        timeline.to(
          typeFilterSection,
          {
            opacity: 1,
            scaleY: 1,
            height: "auto",
            marginTop: "0.75rem", // mt-3
            paddingTop: "0.75rem", // pt-3
            paddingBottom: "0",
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3",
        );
      }
    }
  }, [isShrinked, isMounted]);

  // Get generation range info
  const generationRange = GENERATIONS.find(
    (gen) => gen.id === currentGeneration,
  );

  if (!generationRange) {
    return null;
  }

  const handleSearch = (query: string) => {
    onSearch?.(query);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    onSearchClear?.();
  };

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
    <header
      ref={headerRef}
      className={`flex-shrink-0 bg-gray-50 border-b border-gray-200 shadow-sm z-30 overflow-hidden transition-all duration-300 ${className}`}
      style={{
        willChange: "height, transform",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
      }}
      onMouseEnter={onMouseEnter}
    >
      <div
        className={`relative px-4 md:px-6 transition-all duration-300 ease-in-out ${
          isShrinked ? "py-2" : "py-3"
        }`}
      >
        {/* Mobile Layout: Generation Title parallel to hamburger menu */}
        <div className="lg:hidden relative flex items-center justify-center h-10">
          {/* Generation Title - centered and aligned with hamburger menu */}
          <h1
            ref={(el) => {
              if (el) titleRefs.current[0] = el;
            }}
            className="font-bold text-gray-700 whitespace-nowrap"
            style={{ transformOrigin: "center" }}
          >
            {interpolate(dictionary.ui.generation.displayTemplate, {
              region:
                generationRange.region[
                  lang as keyof typeof generationRange.region
                ] || generationRange.region.en,
              number: currentGeneration,
            })}
          </h1>

          {/* Mobile Search Icon (visible when shrinked) - positioned at the right */}
          <div
            ref={mobileSearchIconRef}
            className={`absolute right-2 flex items-center justify-center ${isShrinked ? "" : "hidden"}`}
            style={{ opacity: 0 }}
          >
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onMouseEnter={onMouseEnter}
              aria-label={dictionary.ui.search?.placeholder || "Search"}
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar - positioned below the title */}
        {showSearch && (
          <div
            className={`lg:hidden mt-3 search-section ${isShrinked ? "pointer-events-none" : ""}`}
          >
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              onClear={handleSearchClear}
              dictionary={dictionary}
              loading={searchLoading}
              showSuggestions={true}
              suggestions={searchSuggestions}
              className="w-full"
              activeTypeFilters={selectedTypes || []}
            />
          </div>
        )}

        {/* Desktop Layout: Traditional flex layout */}
        <div
          className={`hidden lg:flex lg:items-center lg:justify-between gap-3 ${
            isShrinked ? "h-10" : ""
          }`}
        >
          {/* Generation Title */}
          <h1
            ref={(el) => {
              if (el) titleRefs.current[1] = el;
            }}
            className="font-bold text-gray-700 flex-shrink-0"
            style={{ transformOrigin: "left center" }}
          >
            {interpolate(dictionary.ui.generation.displayTemplate, {
              region:
                generationRange.region[
                  lang as keyof typeof generationRange.region
                ] || generationRange.region.en,
              number: currentGeneration,
            })}
          </h1>

          {/* Search Bar */}
          {showSearch && (
            <div
              className={`flex-1 max-w-sm xl:max-w-md search-section ${isShrinked ? "pointer-events-none" : ""}`}
            >
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                onClear={handleSearchClear}
                dictionary={dictionary}
                loading={searchLoading}
                showSuggestions={true}
                suggestions={searchSuggestions}
                className="w-full"
                activeTypeFilters={selectedTypes || []}
              />
            </div>
          )}

          {/* Search Icon (visible when shrinked) - positioned at the right */}
          <div
            ref={searchIconRef}
            className={`flex items-center justify-center mr-2 ${isShrinked ? "" : "hidden"}`}
            style={{ opacity: 0 }}
          >
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onMouseEnter={onMouseEnter}
              aria-label={dictionary.ui.search?.placeholder || "Search"}
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Type Filter Section */}
        {showTypeFilter && (
          <div
            className={`mt-3 pt-3 border-t border-gray-200 type-filter-section ${isShrinked ? "pointer-events-none" : ""}`}
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
              <div className="flex flex-wrap items-center gap-2">
                <span className="hidden lg:inline text-sm font-medium text-gray-700 mr-2">
                  {dictionary.ui.filters?.filterByType || "Filter by type:"}
                </span>

                {POKEMON_TYPES.map((type) => {
                  const isSelected = selectedTypes?.includes(type);
                  const typeColor =
                    TYPE_COLORS[type as keyof typeof TYPE_COLORS] || "#6B7280";
                  const typeLabel =
                    dictionary.ui.types?.[
                      type as keyof typeof dictionary.ui.types
                    ] || type;

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
                        backgroundColor: isSelected
                          ? typeColor
                          : `${typeColor}20`,
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
        )}
      </div>
    </header>
  );
}
