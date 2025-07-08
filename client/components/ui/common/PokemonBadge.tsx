"use client";

import { cn } from "@/lib/utils";
import { Pokemon } from "@/types/pokemon";
import { Dictionary } from "@/lib/dictionaries";
import {
  getBadgeInfo,
  BadgeVariant,
  BadgeSize,
} from "@/lib/utils/pokemonBadgeUtils";

export type BadgeType = "id" | "classification" | "form" | "custom";

interface PokemonBadgeProps {
  // Core properties
  text?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  colorClass?: string; // Tailwind color class like "bg-green-500"
  customColor?: string; // Custom color for dynamic colors
  className?: string;

  // Auto-detection properties
  type?: BadgeType;
  pokemon?: Pokemon;
  dictionary?: Dictionary;
}

export function PokemonBadge({
  text,
  variant = "id",
  size = "md",
  colorClass,
  customColor,
  className,
  type,
  pokemon,
  dictionary,
}: PokemonBadgeProps) {
  // Auto-detect badge content based on type
  let displayText = text || "";
  let displayColorClass = colorClass;
  let displayVariant = variant;

  // Use new badge info functions for auto-detection
  if (type && type !== "id" && type !== "custom" && pokemon && dictionary) {
    const badgeInfo = getBadgeInfo(
      type as "classification" | "form",
      pokemon,
      dictionary,
    );

    if (!badgeInfo) {
      return null;
    }

    displayText = badgeInfo.text;
    displayColorClass = badgeInfo.color;
    displayVariant = badgeInfo.variant;
  }

  // Size-based styling
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  // Variant-based default styling
  const variantStyles = {
    id: "font-bold text-white",
    classification: "font-bold text-white shadow-lg",
    form: "font-bold text-white shadow-md",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full",
        sizeStyles[size],
        variantStyles[displayVariant],
        displayColorClass && !customColor && displayColorClass,
        className,
      )}
      style={customColor ? { backgroundColor: customColor } : undefined}
    >
      {displayText}
    </span>
  );
}
