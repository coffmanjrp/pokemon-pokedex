import React from "react";
import { EvolutionTrigger } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { renderEvolutionCondition } from "@/lib/evolution/evolutionConditions";
import { getFallbackText } from "@/lib/fallbackText";

interface EvolutionConditionProps {
  evolutionDetails?: EvolutionTrigger[];
  dictionary: Dictionary;
  lang: Locale;
  variant?: "default" | "compact" | "icon" | "detailed";
}

export function EvolutionCondition({
  evolutionDetails,
  dictionary,
  lang,
  variant = "default",
}: EvolutionConditionProps) {
  if (!evolutionDetails || evolutionDetails.length === 0) {
    return null;
  }

  const condition = renderEvolutionCondition(
    evolutionDetails[0]!,
    lang,
    dictionary,
    getFallbackText(lang),
  );

  if (variant === "compact") {
    return (
      <div className="text-xs text-gray-600 text-center mt-1">{condition}</div>
    );
  }

  if (variant === "icon") {
    // Future: Return icon representation
    return (
      <div className="text-xs text-gray-600 text-center mt-1">{condition}</div>
    );
  }

  return (
    <div className="bg-blue-50 px-3 py-2 rounded-lg text-sm text-blue-800 font-medium text-center whitespace-nowrap border border-blue-100 shadow-sm">
      {condition}
    </div>
  );
}
