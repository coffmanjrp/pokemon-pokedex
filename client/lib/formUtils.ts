import { Locale } from "@/lib/dictionaries";
import {
  REGIONAL_FORM_TRANSLATIONS,
  MEGA_FORM_TRANSLATIONS,
  GIGANTAMAX_FORM_TRANSLATIONS,
  SPECIAL_FORM_TRANSLATIONS,
  getFormBadgeColor as getFormBadgeColorFromData,
  getFormPriority as getFormPriorityFromData,
} from "@/lib/data/formTranslations";

/**
 * Get display name for a Pokemon form
 */
export function getFormDisplayName(
  pokemonName: string,
  formName: string | undefined,
  language: Locale,
): string {
  if (!formName || formName === "default") {
    return pokemonName;
  }

  // Helper function to capitalize Pokemon name for English
  const capitalizedPokemonName =
    language === "en"
      ? pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
      : pokemonName;

  // Check for regional variants
  for (const [key, translation] of Object.entries(REGIONAL_FORM_TRANSLATIONS)) {
    if (formName.includes(key)) {
      return `${translation[language]} ${capitalizedPokemonName}`;
    }
  }

  // Check for Mega Evolution
  for (const [key, translation] of Object.entries(MEGA_FORM_TRANSLATIONS)) {
    if (formName.includes(key)) {
      return `${translation[language]} ${capitalizedPokemonName}`;
    }
  }

  // Check for Gigantamax
  for (const [key, translation] of Object.entries(
    GIGANTAMAX_FORM_TRANSLATIONS,
  )) {
    if (formName.includes(key)) {
      return `${translation[language]} ${capitalizedPokemonName}`;
    }
  }

  // Check for special forms
  for (const [key, translation] of Object.entries(SPECIAL_FORM_TRANSLATIONS)) {
    if (formName.includes(key)) {
      return `${capitalizedPokemonName} (${translation[language]})`;
    }
  }

  // Default fallback - capitalize form name
  const capitalizedForm = formName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return `${capitalizedPokemonName} (${capitalizedForm})`;
}

/**
 * Determine if a form is a regional variant
 */
export function isRegionalVariant(formName: string | undefined): boolean {
  if (!formName) return false;
  return Object.keys(REGIONAL_FORM_TRANSLATIONS).some((key) =>
    formName.includes(key),
  );
}

/**
 * Determine if a form is a Mega Evolution
 */
export function isMegaEvolution(formName: string | undefined): boolean {
  if (!formName) return false;
  return Object.keys(MEGA_FORM_TRANSLATIONS).some((key) =>
    formName.includes(key),
  );
}

/**
 * Determine if a form is a Gigantamax form
 */
export function isGigantamax(formName: string | undefined): boolean {
  if (!formName) return false;
  return Object.keys(GIGANTAMAX_FORM_TRANSLATIONS).some((key) =>
    formName.includes(key),
  );
}

/**
 * Get form category for UI grouping
 */
export function getFormCategory(
  formName: string | undefined,
  language: Locale,
): string {
  if (!formName) return language === "en" ? "Normal" : "ノーマル";

  if (isRegionalVariant(formName)) {
    return language === "en" ? "Regional Variant" : "地方のすがた";
  }

  if (isMegaEvolution(formName)) {
    return language === "en" ? "Mega Evolution" : "メガシンカ";
  }

  if (isGigantamax(formName)) {
    return language === "en" ? "Gigantamax" : "キョダイマックス";
  }

  return language === "en" ? "Alternative Form" : "別のすがた";
}

/**
 * Parse Pokemon ID from PokeAPI URL or name
 */
export function parsePokemonId(nameOrUrl: string): string {
  // If it's a URL, extract the ID
  if (nameOrUrl.includes("pokemon/")) {
    const matches = nameOrUrl.match(/\/pokemon\/(\d+)\//);
    return matches?.[1] || nameOrUrl;
  }

  // If it's a name with ID (like charizard-mega-x), try to match known patterns
  const megaMatch = nameOrUrl.match(/^(.+)-mega-?([xy]?)$/);
  if (megaMatch) {
    // This would need a mapping of base Pokemon to their Mega Evolution IDs
    // For now, return the original string
    return nameOrUrl;
  }

  // Regional variant patterns
  const regionalMatch = nameOrUrl.match(
    /^(.+)-(alolan|galarian|hisuian|paldean)$/,
  );
  if (regionalMatch) {
    // This would need a mapping of base Pokemon to their regional variant IDs
    // For now, return the original string
    return nameOrUrl;
  }

  return nameOrUrl;
}

/**
 * Get form priority for sorting (lower number = higher priority)
 */
export function getFormPriority(formName: string | undefined): number {
  return getFormPriorityFromData(formName);
}

/**
 * Get short form badge name for Evolution Chain display
 */
export function getFormBadgeName(
  formName: string | undefined,
  language: "en" | "ja",
): string | null {
  if (!formName) return null;

  // Regional variants
  if (formName.includes("alola"))
    return language === "en" ? "Alolan" : "アローラ";
  if (formName.includes("galar"))
    return language === "en" ? "Galarian" : "ガラル";
  if (formName.includes("hisui"))
    return language === "en" ? "Hisuian" : "ヒスイ";
  if (formName.includes("paldea"))
    return language === "en" ? "Paldean" : "パルデア";

  // Mega Evolution
  if (formName.includes("mega-x"))
    return language === "en" ? "Mega X" : "メガX";
  if (formName.includes("mega-y"))
    return language === "en" ? "Mega Y" : "メガY";
  if (formName.includes("mega")) return language === "en" ? "Mega" : "メガ";

  // Gigantamax
  if (formName.includes("gmax"))
    return language === "en" ? "G-Max" : "キョダイ";

  // Primal
  if (formName.includes("primal"))
    return language === "en" ? "Primal" : "ゲンシ";

  return null;
}

/**
 * Get badge color class for form type
 */
export function getFormBadgeColor(formName: string | undefined): string {
  if (!formName) return "bg-gray-100 text-gray-800";
  return getFormBadgeColorFromData(formName);
}
