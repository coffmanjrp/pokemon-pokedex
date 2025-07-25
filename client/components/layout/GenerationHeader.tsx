"use client";

import { Dictionary, Locale, interpolate } from "@/lib/dictionaries";
import { GENERATIONS } from "@/lib/data/generations";
import { SearchBar } from "./SearchBar";
import { TypeFilter } from "./TypeFilter";
import { useState, useEffect, useRef } from "react";
import { SearchIcon } from "@/components/ui/icons";
import { gsap } from "gsap";
import { SearchScope } from "@/types/search";

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
  searchScope?: SearchScope;
  onSearchScopeChange?: (scope: SearchScope) => void;
  showSearchScopeToggle?: boolean;
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
  searchScope = SearchScope.CURRENT_GENERATION,
  onSearchScopeChange,
  showSearchScopeToggle = false,
}: GenerationHeaderProps) {
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [isMounted, setIsMounted] = useState(false);
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
            {currentGeneration === 0
              ? generationRange.region[
                  lang as keyof typeof generationRange.region
                ] || generationRange.region.en
              : interpolate(dictionary.ui.generation.displayTemplate, {
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
              searchScope={searchScope}
              {...(onSearchScopeChange && {
                onScopeChange: onSearchScopeChange,
              })}
              showScopeToggle={showSearchScopeToggle}
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
            {currentGeneration === 0
              ? generationRange.region[
                  lang as keyof typeof generationRange.region
                ] || generationRange.region.en
              : interpolate(dictionary.ui.generation.displayTemplate, {
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
                searchScope={searchScope}
                {...(onSearchScopeChange && {
                  onScopeChange: onSearchScopeChange,
                })}
                showScopeToggle={showSearchScopeToggle}
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
        {showTypeFilter && onTypeFilter && (
          <TypeFilter
            selectedTypes={selectedTypes}
            onTypeFilter={onTypeFilter}
            dictionary={dictionary}
            isShrinked={isShrinked}
          />
        )}
      </div>
    </header>
  );
}
