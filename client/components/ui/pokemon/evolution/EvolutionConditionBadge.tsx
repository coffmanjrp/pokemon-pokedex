import React from "react";
import { EvolutionTrigger } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { renderEvolutionCondition } from "@/lib/evolution/evolutionConditions";
import { getFallbackText } from "@/lib/fallbackText";

interface EvolutionConditionBadgeProps {
  evolutionDetails?: EvolutionTrigger[];
  dictionary: Dictionary;
  lang: Locale;
  variant?: "default" | "compact";
}

export function EvolutionConditionBadge({
  evolutionDetails,
  dictionary,
  lang,
  variant = "default",
}: EvolutionConditionBadgeProps) {
  if (!evolutionDetails || evolutionDetails.length === 0) {
    return null;
  }

  const condition = renderEvolutionCondition(
    evolutionDetails[0],
    lang,
    dictionary,
    getFallbackText(lang),
  );

  const baseClasses =
    "bg-blue-50 rounded-lg text-blue-800 font-medium text-center border border-blue-100 shadow-sm";

  const variantClasses = {
    default: "px-3 py-2 text-sm whitespace-nowrap",
    compact: "px-2 py-1 text-xs",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      {condition}
    </div>
  );
}
