/**
 * Pokemon Badge Data and Configuration
 *
 * Centralized configuration for all Pokemon badges including
 * classifications (Baby, Legendary, Mythical) and forms
 * (Mega, Regional Variants, Gigantamax, etc.)
 */

import { Pokemon } from "@/types/pokemon";
import { Dictionary } from "@/lib/dictionaries";

export type BadgeVariant = "id" | "classification" | "form";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeInfo {
  text: string;
  color: string;
  variant: BadgeVariant;
}

export interface BadgeColors {
  classification: {
    baby: string;
    legendary: string;
    mythical: string;
  };
  forms: {
    // Mega Evolutions
    mega: string;
    megaX: string;
    megaY: string;
    // Regional Variants
    alolan: string;
    galarian: string;
    hisuian: string;
    paldean: string;
    // Special Forms
    gmax: string;
    primal: string;
    special: string;
  };
}

/**
 * Badge configuration interface
 */
interface BadgeConfig<T extends string> {
  id: string;
  condition: (pokemon: Pokemon) => boolean;
  badgeKey: T;
  colorKey: keyof BadgeColors["forms"] | keyof BadgeColors["classification"];
  variant: BadgeVariant;
}

/**
 * Unified color scheme for all Pokemon badges
 * Uses Tailwind CSS classes for consistent styling
 */
export const POKEMON_BADGE_COLORS: BadgeColors = {
  // Pokemon Classifications
  classification: {
    baby: "bg-pink-500",
    legendary: "bg-yellow-500",
    mythical: "bg-purple-500",
  },
  // Pokemon Forms
  forms: {
    // Mega Evolutions
    mega: "bg-purple-100 text-purple-800",
    megaX: "bg-purple-100 text-purple-800",
    megaY: "bg-purple-100 text-purple-800",
    // Regional Variants
    alolan: "bg-yellow-100 text-yellow-800",
    galarian: "bg-blue-100 text-blue-800",
    hisuian: "bg-green-100 text-green-800",
    paldean: "bg-orange-100 text-orange-800",
    // Special Forms
    gmax: "bg-red-100 text-red-800",
    primal: "bg-indigo-100 text-indigo-800",
    special: "bg-gray-100 text-gray-800",
  },
};

/**
 * Classification badge configurations in priority order
 */
const CLASSIFICATION_BADGE_CONFIGS: BadgeConfig<
  keyof Dictionary["ui"]["classifications"]
>[] = [
  {
    id: "baby",
    condition: (p) => p.species?.isBaby === true,
    badgeKey: "baby",
    colorKey: "baby",
    variant: "classification",
  },
  {
    id: "legendary",
    condition: (p) => p.species?.isLegendary === true,
    badgeKey: "legendary",
    colorKey: "legendary",
    variant: "classification",
  },
  {
    id: "mythical",
    condition: (p) => p.species?.isMythical === true,
    badgeKey: "mythical",
    colorKey: "mythical",
    variant: "classification",
  },
];

/**
 * Form badge configurations in priority order
 */
const FORM_BADGE_CONFIGS: BadgeConfig<
  keyof Dictionary["ui"]["forms"]["badges"]
>[] = [
  // Mega Evolutions (highest priority)
  {
    id: "mega-x",
    condition: (p) =>
      p.isMegaEvolution === true && p.formName?.includes("mega-x") === true,
    badgeKey: "megaX",
    colorKey: "megaX",
    variant: "form",
  },
  {
    id: "mega-y",
    condition: (p) =>
      p.isMegaEvolution === true && p.formName?.includes("mega-y") === true,
    badgeKey: "megaY",
    colorKey: "megaY",
    variant: "form",
  },
  {
    id: "mega",
    condition: (p) => p.isMegaEvolution === true,
    badgeKey: "mega",
    colorKey: "mega",
    variant: "form",
  },
  // Gigantamax
  {
    id: "gmax",
    condition: (p) => p.isDynamax === true,
    badgeKey: "gmax",
    colorKey: "gmax",
    variant: "form",
  },
  // Regional Variants
  {
    id: "alolan",
    condition: (p) =>
      p.isRegionalVariant === true && p.formName?.includes("alola") === true,
    badgeKey: "alolan",
    colorKey: "alolan",
    variant: "form",
  },
  {
    id: "galarian",
    condition: (p) =>
      p.isRegionalVariant === true && p.formName?.includes("galar") === true,
    badgeKey: "galarian",
    colorKey: "galarian",
    variant: "form",
  },
  {
    id: "hisuian",
    condition: (p) =>
      p.isRegionalVariant === true && p.formName?.includes("hisui") === true,
    badgeKey: "hisuian",
    colorKey: "hisuian",
    variant: "form",
  },
  {
    id: "paldean",
    condition: (p) =>
      p.isRegionalVariant === true && p.formName?.includes("paldea") === true,
    badgeKey: "paldean",
    colorKey: "paldean",
    variant: "form",
  },
  // Special Forms
  {
    id: "primal",
    condition: (p) => p.formName?.includes("primal") === true,
    badgeKey: "primal",
    colorKey: "primal",
    variant: "form",
  },
  // Default special form (lowest priority)
  {
    id: "special",
    condition: (p) =>
      p.formName !== null && p.formName !== undefined && p.formName !== "",
    badgeKey: "special",
    colorKey: "special",
    variant: "form",
  },
];

/**
 * Get classification badge information
 */
export function getClassificationBadge(
  pokemon: Pokemon,
  dictionary: Dictionary,
): BadgeInfo | null {
  if (!dictionary?.ui?.classifications) {
    return null;
  }

  // Find the first matching configuration
  for (const config of CLASSIFICATION_BADGE_CONFIGS) {
    if (config.condition(pokemon)) {
      return {
        text: dictionary.ui.classifications[config.badgeKey],
        color:
          POKEMON_BADGE_COLORS.classification[
            config.colorKey as keyof BadgeColors["classification"]
          ],
        variant: config.variant,
      };
    }
  }

  return null;
}

/**
 * Get form badge information
 */
export function getFormBadge(
  pokemon: Pokemon,
  dictionary: Dictionary,
): BadgeInfo | null {
  if (!dictionary?.ui?.forms?.badges) {
    return null;
  }

  const hasFormData =
    pokemon.formName ||
    pokemon.isRegionalVariant ||
    pokemon.isMegaEvolution ||
    pokemon.isDynamax;
  if (!hasFormData) {
    return null;
  }

  // Find the first matching configuration
  for (const config of FORM_BADGE_CONFIGS) {
    if (config.condition(pokemon)) {
      return {
        text: dictionary.ui.forms.badges[config.badgeKey],
        color:
          POKEMON_BADGE_COLORS.forms[
            config.colorKey as keyof BadgeColors["forms"]
          ],
        variant: config.variant,
      };
    }
  }

  return null;
}

/**
 * Get badge information based on type
 */
export function getBadgeInfo(
  type: "classification" | "form",
  pokemon: Pokemon,
  dictionary: Dictionary,
): BadgeInfo | null {
  if (type === "classification") {
    return getClassificationBadge(pokemon, dictionary);
  }
  if (type === "form") {
    return getFormBadge(pokemon, dictionary);
  }
  return null;
}

/**
 * Get color class for a specific Pokemon classification
 */
export function getClassificationColor(
  classification: "baby" | "legendary" | "mythical",
): string {
  return POKEMON_BADGE_COLORS.classification[classification];
}

/**
 * Get color class for a specific Pokemon form
 */
export function getFormColor(formName: string): string {
  const colors = POKEMON_BADGE_COLORS.forms;

  // Find matching form configuration
  const config = FORM_BADGE_CONFIGS.find((cfg) => {
    const mockPokemon: Partial<Pokemon> = { formName };

    // Set flags based on form name for matching
    if (formName.includes("mega")) {
      mockPokemon.isMegaEvolution = true;
    }
    if (formName.includes("gmax")) {
      mockPokemon.isDynamax = true;
    }
    if (
      formName.includes("alola") ||
      formName.includes("galar") ||
      formName.includes("hisui") ||
      formName.includes("paldea")
    ) {
      mockPokemon.isRegionalVariant = true;
    }

    return cfg.condition(mockPokemon as Pokemon);
  });

  return config
    ? colors[config.colorKey as keyof BadgeColors["forms"]]
    : colors.special;
}
