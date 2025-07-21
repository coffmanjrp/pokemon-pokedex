/**
 * Shorten evolution conditions to avoid duplication in card layouts
 * Removes common prefixes like "Level up" when multiple conditions exist
 */
export function shortenEvolutionCondition(
  condition: string,
  lang: string = "en",
): string {
  // Common patterns to remove when there are additional conditions
  const patternsToRemove = {
    en: [/^Level up \+ /i, /^Level \d+ \+ /i, /^Trade \+ /i],
    ja: [/^レベルアップ \+ /, /^レベル\d+ \+ /, /^通信交換 \+ /],
  };

  const patterns =
    patternsToRemove[lang as keyof typeof patternsToRemove] ||
    patternsToRemove.en;

  let shortened = condition;
  for (const pattern of patterns) {
    shortened = shortened.replace(pattern, "");
  }

  return shortened;
}

/**
 * Check if evolution conditions are duplicates or similar
 * Used to group similar conditions together
 */
export function areConditionsSimilar(
  condition1: string,
  condition2: string,
): boolean {
  // Normalize conditions for comparison
  const normalize = (str: string) =>
    str.toLowerCase().replace(/\s+/g, " ").trim();

  const norm1 = normalize(condition1);
  const norm2 = normalize(condition2);

  // Exact match
  if (norm1 === norm2) return true;

  // Check if they differ only by time of day
  const dayNightPairs = [
    ["during the day", "at night"],
    ["昼", "夜"],
    ["day", "night"],
  ];

  for (const [day, night] of dayNightPairs) {
    const dayStr = String(day);
    const nightStr = String(night);
    if (
      (norm1.includes(dayStr) && norm2.includes(nightStr)) ||
      (norm1.includes(nightStr) && norm2.includes(dayStr))
    ) {
      // Check if the rest of the condition is the same
      const rest1 = norm1.replace(dayStr, "").replace(nightStr, "");
      const rest2 = norm2.replace(dayStr, "").replace(nightStr, "");
      if (rest1 === rest2) return true;
    }
  }

  return false;
}

/**
 * Get a list of all evolution conditions in a chain to check for duplicates
 */
export function getAllEvolutionConditions(
  evolutions: { id: string; evolutionDetails?: { length: number } }[],
): string[] {
  const conditions: string[] = [];

  for (const evolution of evolutions) {
    if (evolution.evolutionDetails && evolution.evolutionDetails.length > 0) {
      // We'll need to render the condition to get the string
      // This is handled in the component
      conditions.push(evolution.id);
    }
  }

  return conditions;
}
