"use client";

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
  const { language } = useAppSelector((state) => state.ui);

  const placeholder =
    language === "en"
      ? "Search Pokémon by name or ID..."
      : "ポケモンの名前やIDで検索...";
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg",
          "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "placeholder-gray-500 text-gray-900",
          "transition-colors duration-200",
        )}
      />
    </div>
  );
}
