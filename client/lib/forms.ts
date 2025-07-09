/**
 * Pokemon form classification and utilities
 *
 * This file contains the core form classification logic, constants, and basic
 * utility functions for Pokemon forms. UI-related functions that depend on
 * the dictionary system are located in formUtils.ts.
 */

export interface FormTranslation {
  en: string;
  ja: string;
  "zh-Hant"?: string;
  "zh-Hans"?: string;
  es?: string;
  fr?: string;
  ko?: string;
  it?: string;
}

export type FormCategory = "regional" | "mega" | "gigantamax" | "special";

export interface FormData extends FormTranslation {
  category: FormCategory;
  priority: number;
  badgeColor: string;
}

// Form priorities for sorting (lower number = higher priority)
export const FORM_PRIORITIES: Record<FormCategory, number> = {
  regional: 1,
  mega: 2,
  gigantamax: 3,
  special: 4,
};

/**
 * Determine the category of a Pokemon form
 */
export const getFormCategory = (formName: string): FormCategory | null => {
  // Check for regional variants using static keys
  const regionalKeys = [
    "alolan",
    "galarian",
    "hisuian",
    "paldean",
    "alola",
    "galar",
    "hisui",
    "paldea",
  ];
  if (regionalKeys.some((key) => formName.includes(key))) {
    return "regional";
  }
  // Check for mega evolution using static keys
  const megaKeys = ["mega", "mega-x", "mega-y"];
  if (megaKeys.some((key) => formName.includes(key))) {
    return "mega";
  }
  // Check for gigantamax using static keys
  if (formName.includes("gmax")) {
    return "gigantamax";
  }
  // Check for special forms using static keys
  const specialKeys = [
    "origin",
    "altered",
    "sky",
    "land",
    "therian",
    "incarnate",
    "resolute",
    "ordinary",
    "zen",
    "standard",
    "blade",
    "shield",
    "unbound",
    "confined",
    "complete",
    "10-percent",
    "50-percent",
    "dusk-mane",
    "dawn-wings",
    "ultra",
    "red-meteor",
    "blue-meteor",
    "yellow-meteor",
    "green-meteor",
    "orange-meteor",
    "indigo-meteor",
    "violet-meteor",
  ];
  if (specialKeys.some((key) => formName.includes(key))) {
    return "special";
  }
  return null;
};

/**
 * Get the sort priority for a form
 */
export const getFormPriority = (formName: string | undefined): number => {
  if (!formName || formName === "default") return 0;
  const category = getFormCategory(formName);
  return category ? FORM_PRIORITIES[category] : 4;
};

/**
 * Determine if a form is a regional variant
 */
export function isRegionalVariant(formName: string | undefined): boolean {
  if (!formName) return false;
  const regionalKeys = [
    "alolan",
    "galarian",
    "hisuian",
    "paldean",
    "alola",
    "galar",
    "hisui",
    "paldea",
  ];
  return regionalKeys.some((key) => formName.includes(key));
}

/**
 * Determine if a form is a Mega Evolution
 */
export function isMegaEvolution(formName: string | undefined): boolean {
  if (!formName) return false;
  const megaKeys = ["mega", "mega-x", "mega-y"];
  return megaKeys.some((key) => formName.includes(key));
}

/**
 * Determine if a form is a Gigantamax form
 */
export function isGigantamax(formName: string | undefined): boolean {
  if (!formName) return false;
  return formName.includes("gmax");
}

/**
 * Determine if a form is a special form (not regional, mega, or gigantamax)
 */
export function isSpecialForm(formName: string | undefined): boolean {
  if (!formName) return false;
  return getFormCategory(formName) === "special";
}
