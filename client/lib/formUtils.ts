import { Locale, Dictionary } from "@/lib/dictionaries";
import {
  getFormBadgeColor as getFormBadgeColorFromData,
  getFormPriority as getFormPriorityFromData,
  isRegionalVariant,
  isMegaEvolution,
  isGigantamax,
} from "@/lib/forms";

/**
 * Get display name for a Pokemon form using dictionary system for basic forms
 */
export function getFormDisplayName(
  pokemonName: string,
  formName: string | undefined,
  language: Locale,
  dictionary?: Dictionary,
): string {
  if (!formName || formName === "default") {
    return pokemonName;
  }

  // Helper function to capitalize Pokemon name for English
  const capitalizedPokemonName =
    language === "en"
      ? pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
      : pokemonName;

  // Try dictionary system for basic forms first
  if (dictionary?.ui.forms.translations) {
    const basicFormTranslations = dictionary.ui.forms.translations;

    // Check for basic forms in dictionary
    for (const [key, translation] of Object.entries(basicFormTranslations)) {
      if (formName.includes(key)) {
        // For regional variants, prefix the Pokemon name
        if (
          [
            "alolan",
            "galarian",
            "hisuian",
            "paldean",
            "alola",
            "galar",
            "hisui",
            "paldea",
          ].includes(key)
        ) {
          return `${translation} ${capitalizedPokemonName}`;
        }
        // For mega, gmax, primal
        else if (["mega", "mega-x", "mega-y", "gmax", "primal"].includes(key)) {
          return `${translation} ${capitalizedPokemonName}`;
        }
      }
    }
  }

  // Check for special forms using dictionary system
  if (dictionary?.ui.forms.translations) {
    const formTranslations = dictionary.ui.forms.translations;

    // Check for special forms in dictionary
    for (const [key, translation] of Object.entries(formTranslations)) {
      if (
        formName.includes(key) &&
        ![
          "alolan",
          "galarian",
          "hisuian",
          "paldean",
          "alola",
          "galar",
          "hisui",
          "paldea",
          "mega",
          "mega-x",
          "mega-y",
          "gmax",
          "primal",
        ].includes(key)
      ) {
        return `${capitalizedPokemonName} (${translation})`;
      }
    }
  }

  // All special forms are now handled by dictionary system above

  // Default fallback - capitalize form name
  const capitalizedForm = formName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return `${capitalizedPokemonName} (${capitalizedForm})`;
}

// Form classification functions moved to @/lib/forms
// Re-export them here for backward compatibility
export { isRegionalVariant, isMegaEvolution, isGigantamax } from "@/lib/forms";

/**
 * Get form category for UI grouping (dictionary-dependent)
 * This is different from the basic getFormCategory in forms.ts as it returns
 * localized category names from the dictionary.
 */
export function getFormCategoryForUI(
  formName: string | undefined,
  dictionary: Dictionary,
): string {
  if (!formName) {
    return dictionary.ui.forms.categories.normal;
  }

  if (isRegionalVariant(formName)) {
    return dictionary.ui.forms.categories.regionalVariant;
  }

  if (isMegaEvolution(formName)) {
    return dictionary.ui.forms.categories.megaEvolution;
  }

  if (isGigantamax(formName)) {
    return dictionary.ui.forms.categories.gigantamax;
  }

  return dictionary.ui.forms.categories.alternativeForm;
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
  dictionary: Dictionary,
): string | null {
  if (!formName) return null;

  // Regional variants
  if (formName.includes("alola")) {
    return dictionary.ui.forms.badges.alolan;
  }

  if (formName.includes("galar")) {
    return dictionary.ui.forms.badges.galarian;
  }

  if (formName.includes("hisui")) {
    return dictionary.ui.forms.badges.hisuian;
  }

  if (formName.includes("paldea")) {
    return dictionary.ui.forms.badges.paldean;
  }

  // Mega Evolution (check specific variants first)
  if (formName.includes("mega-x")) {
    return dictionary.ui.forms.badges.megaX;
  }

  if (formName.includes("mega-y")) {
    return dictionary.ui.forms.badges.megaY;
  }

  if (formName.includes("mega")) {
    return dictionary.ui.forms.badges.mega;
  }

  // Gigantamax
  if (formName.includes("gmax")) {
    return dictionary.ui.forms.badges.gmax;
  }

  // Primal
  if (formName.includes("primal")) {
    return dictionary.ui.forms.badges.primal;
  }

  return null;
}

/**
 * Get badge color class for form type
 */
export function getFormBadgeColor(formName: string | undefined): string {
  if (!formName) return "bg-gray-100 text-gray-800";
  return getFormBadgeColorFromData(formName);
}
