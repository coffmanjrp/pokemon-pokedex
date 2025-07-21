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
  shortened?: boolean;
}

export function EvolutionConditionBadge({
  evolutionDetails,
  dictionary,
  lang,
  variant = "default",
  shortened = false,
}: EvolutionConditionBadgeProps) {
  if (
    !evolutionDetails ||
    evolutionDetails.length === 0 ||
    !evolutionDetails[0]
  ) {
    return null;
  }

  let condition = renderEvolutionCondition(
    evolutionDetails[0],
    lang,
    dictionary,
    getFallbackText(lang),
  );

  // Apply shortening if requested
  if (shortened && condition.includes("+")) {
    const shortenEvolutionCondition = (
      cond: string,
      language: string,
    ): string => {
      // Remove common prefixes when there are additional conditions
      const patterns =
        language === "ja"
          ? [/^レベルアップ \+ /, /^レベル\d+ \+ /, /^通信交換 \+ /]
          : [/^Level up \+ /i, /^Level \d+ \+ /i, /^Trade \+ /i];

      let shortened = cond;
      for (const pattern of patterns) {
        shortened = shortened.replace(pattern, "");
      }
      return shortened;
    };

    condition = shortenEvolutionCondition(condition, lang);
  }

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
