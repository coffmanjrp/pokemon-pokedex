"use client";

import React from "react";
import { Locale } from "@/lib/dictionaries";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";

interface DataEmptyStateProps {
  type:
    | "moves"
    | "descriptions"
    | "games"
    | "sprites"
    | "evolution"
    | "abilities"
    | "general";
  language: Locale;
  customMessage?: string;
  icon?: string;
  size?: "sm" | "md" | "lg";
}

const defaultIcons = {
  moves: "⚔️",
  descriptions: "📖",
  games: "🎮",
  sprites: "🖼️",
  evolution: "🔄",
  abilities: "✨",
  general: "📋",
};

const sizeClasses = {
  sm: {
    container: "p-4",
    icon: "text-2xl",
    text: "text-sm",
  },
  md: {
    container: "p-8",
    icon: "text-4xl",
    text: "text-base",
  },
  lg: {
    container: "p-12",
    icon: "text-6xl",
    text: "text-lg",
  },
};

export function DataEmptyState({
  type,
  language,
  customMessage,
  icon,
  size = "md",
}: DataEmptyStateProps) {
  const { dictionary } = useAppSelector((state) => state.ui);

  // Use consistent fallback behavior to prevent hydration mismatch
  const message =
    customMessage ||
    dictionary?.ui.emptyStates[type] ||
    getFallbackText(language);
  const displayIcon = icon || defaultIcons[type];
  const classes = sizeClasses[size];

  return (
    <div
      className={`flex flex-col items-center justify-center text-center text-gray-500 ${classes.container}`}
    >
      <div className={`mb-4 ${classes.icon}`}>{displayIcon}</div>
      <p className={`font-medium ${classes.text}`}>{message}</p>
    </div>
  );
}
