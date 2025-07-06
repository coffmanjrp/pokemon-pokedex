"use client";

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { Dictionary } from "@/lib/dictionaries";
import { useState, useRef, useEffect, useCallback } from "react";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  className?: string;
  dictionary?: Dictionary;
  showSuggestions?: boolean;
  suggestions?: string[];
  loading?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  className,
  dictionary,
  loading = false,
}: SearchBarProps) {
  const { dictionary: reduxDictionary } = useAppSelector((state) => state.ui);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use props or fallback to Redux state
  const currentDictionary = dictionary || reduxDictionary;

  const placeholder =
    currentDictionary?.ui.search.placeholder ||
    "Search Pokémon by name or ID...";

  const handleClear = useCallback(() => {
    onChange("");
    onClear?.();
  }, [onChange, onClear]);

  // Handle ESC key to clear search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClear();
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClear]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch?.(value.trim());
      inputRef.current?.blur();
    } else {
      // Clear search when submitting empty query
      handleClear();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-blue-500 rounded-full"></div>
          ) : (
            <HiMagnifyingGlass className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "placeholder-gray-500 text-gray-900",
            "transition-all duration-200",
            isFocused && "shadow-md",
          )}
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
          >
            <HiXMark className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </form>
    </div>
  );
}
