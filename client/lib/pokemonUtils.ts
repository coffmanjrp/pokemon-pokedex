import { Pokemon, EvolutionDetail, Move, GenderInfo } from "@/types/pokemon";
import { getFormDisplayName, isMegaEvolution } from "@/lib/formUtils";
import {
  REGIONAL_FORM_TRANSLATIONS,
  MEGA_FORM_TRANSLATIONS,
  GIGANTAMAX_FORM_TRANSLATIONS,
  SPECIAL_FORM_TRANSLATIONS,
} from "@/lib/data/formTranslations";
import { ABILITY_TRANSLATIONS } from "@/lib/data/abilityTranslations";
import { VERSION_TRANSLATIONS } from "@/lib/data/versionTranslations";
import { TYPE_EFFECTIVENESS } from "@/lib/data/typeEffectiveness";
import { MOVE_TRANSLATIONS } from "@/lib/data/moveTranslations";
import { MOVE_LEARN_METHOD_TRANSLATIONS } from "@/lib/data/moveLearnMethodTranslations";
import { STAT_TRANSLATIONS } from "@/lib/data/statTranslations";
import { TYPE_TRANSLATIONS, getTypeColor } from "@/lib/data/typeTranslations";
import React from "react";

/**
 * Get form translation for use in Japanese Pokemon names
 * Returns the form suffix like "アローラのすがた", "メガ", etc.
 */
function getFormTranslation(
  formName: string,
  language: "en" | "ja",
): string | null {
  console.log(
    `[getFormTranslation] Looking for translation of "${formName}" in language "${language}"`,
  );

  // Safe access to translation objects with fallback
  const safeRegionalForms = REGIONAL_FORM_TRANSLATIONS || {};
  const safeMegaForms = MEGA_FORM_TRANSLATIONS || {};
  const safeGigantamaxForms = GIGANTAMAX_FORM_TRANSLATIONS || {};
  const safeSpecialForms = SPECIAL_FORM_TRANSLATIONS || {};

  // Check regional forms - try exact match first, then partial match
  for (const [key, translation] of Object.entries(safeRegionalForms)) {
    if (formName === key || formName.includes(key)) {
      console.log(
        `[getFormTranslation] Found regional form: ${key} -> ${translation[language]}`,
      );
      return translation[language];
    }
  }

  // Check mega forms - exact match first
  for (const [key, translation] of Object.entries(safeMegaForms)) {
    if (formName === key) {
      console.log(
        `[getFormTranslation] Found exact mega form: ${key} -> ${translation[language]}`,
      );
      return translation[language];
    }
  }
  // Check mega forms - partial match as fallback
  for (const [key, translation] of Object.entries(safeMegaForms)) {
    if (formName.includes(key)) {
      console.log(
        `[getFormTranslation] Found partial mega form: ${key} -> ${translation[language]}`,
      );
      return translation[language];
    }
  }

  // Check gigantamax forms
  for (const [key, translation] of Object.entries(safeGigantamaxForms)) {
    if (formName === key || formName.includes(key)) {
      console.log(
        `[getFormTranslation] Found gigantamax form: ${key} -> ${translation[language]}`,
      );
      return translation[language];
    }
  }

  // Check special forms
  for (const [key, translation] of Object.entries(safeSpecialForms)) {
    if (formName === key || formName.includes(key)) {
      console.log(
        `[getFormTranslation] Found special form: ${key} -> ${translation[language]}`,
      );
      return translation[language];
    }
  }

  console.log(`[getFormTranslation] No translation found for "${formName}"`);
  return null;
}

/**
 * Get the base species ID for display purposes
 * Returns the species ID instead of the variant ID for consistent numbering
 */
export function getPokemonDisplayId(pokemon: Pokemon): string {
  // If this is a variant Pokemon and we have species data, use the species ID
  if (pokemon.species?.id && pokemon.name.includes("-")) {
    return pokemon.species.id;
  }

  // For regular Pokemon, use the Pokemon ID
  return pokemon.id;
}

/**
 * Check if Pokemon is a variant form (has alternative form)
 * Used to determine if navigation arrows should be hidden
 */
export function isPokemonVariant(pokemon: Pokemon): boolean {
  return pokemon.name.includes("-");
}

/**
 * Check if Pokemon is a Primal form (Kyogre/Groudon)
 */
export function isPrimalForm(formName: string): boolean {
  return formName.includes("primal");
}

/**
 * Check if Pokemon form should display form name between name and types
 * Applies to regional variants and Gigantamax forms
 */
export function shouldDisplayFormSeparately(pokemon: Pokemon): boolean {
  if (!pokemon.name.includes("-")) return false;

  const formName = pokemon.name.split("-").slice(1).join("-");

  // Check if it's a regional variant
  const regionalForms = [
    "alola",
    "alolan",
    "galar",
    "galarian",
    "hisui",
    "hisuian",
    "paldea",
    "paldean",
  ];
  if (regionalForms.some((region) => formName.includes(region))) {
    return true;
  }

  // Check if it's Gigantamax
  if (formName.includes("gmax")) {
    return true;
  }

  return false;
}

/**
 * Get Pokemon base name without form for separate display
 */
export function getPokemonBaseName(
  pokemon: Pokemon,
  language: "en" | "ja",
): string {
  if (!shouldDisplayFormSeparately(pokemon)) {
    return getPokemonName(pokemon, language);
  }

  // For forms that should be displayed separately, return just the base name
  if (language === "ja" && pokemon.species?.names) {
    const japaneseName = pokemon.species.names.find(
      (nameEntry) =>
        nameEntry.language.name === "ja" ||
        nameEntry.language.name === "ja-Hrkt",
    );
    if (japaneseName?.name) {
      return japaneseName.name;
    }
  }

  // For English or when Japanese name is not available
  const baseName = pokemon.name.split("-")[0];
  if (!baseName) return pokemon.name;
  return baseName.charAt(0).toUpperCase() + baseName.slice(1);
}

/**
 * Get Pokemon form name for separate display
 */
export function getPokemonFormName(
  pokemon: Pokemon,
  language: "en" | "ja",
): string | null {
  if (!shouldDisplayFormSeparately(pokemon)) {
    return null;
  }

  const formName = pokemon.name.split("-").slice(1).join("-");
  return getFormTranslation(formName, language);
}

/**
 * Get previous/next Pokemon ID for navigation
 * Returns null for boundaries (no previous for first, no next for last)
 */
export function getPrevNextPokemonId(currentId: number): {
  prevId: number | null;
  nextId: number | null;
} {
  const prevId = currentId > 1 ? currentId - 1 : null; // No previous for first Pokemon
  const nextId = currentId < 1025 ? currentId + 1 : null; // No next for last Pokemon
  return { prevId, nextId };
}

/**
 * Get Pokemon name in the specified language
 * Falls back to English name if target language is not available
 */
export function getPokemonName(
  pokemon: Pokemon,
  language: "en" | "ja",
): string {
  // Check if this is a variant Pokemon
  const nameParts = pokemon.name.split("-");
  const isVariant = nameParts.length > 1;

  if (isVariant) {
    const baseName = nameParts[0];
    const formName = nameParts.slice(1).join("-");

    if (language === "ja" && pokemon.species?.names) {
      // For Japanese variants, combine Japanese species name with form translation
      const japaneseName = pokemon.species.names.find(
        (nameEntry) =>
          nameEntry.language.name === "ja" ||
          nameEntry.language.name === "ja-Hrkt",
      );

      if (japaneseName?.name) {
        const formTranslation = getFormTranslation(formName, language);

        if (formTranslation) {
          // Special handling for Mega Evolution in Japanese
          if (isMegaEvolution(formName)) {
            // Special format for Mega Charizard and Mega Mewtwo X/Y forms
            if (
              (baseName === "charizard" || baseName === "mewtwo") &&
              (formName === "mega-x" || formName === "mega-y")
            ) {
              const result = `メガ${japaneseName.name}${formTranslation}`;
              console.log(
                `[getPokemonName] Japanese Mega X/Y variant: ${pokemon.name} -> ${result}`,
              );
              return result;
            } else {
              // For other Mega forms: "メガポケモン名" format
              const result = `${formTranslation}${japaneseName.name}`;
              console.log(
                `[getPokemonName] Japanese Mega variant: ${pokemon.name} -> ${result}`,
              );
              return result;
            }
          } else if (isPrimalForm(formName)) {
            // Special handling for Primal forms: "ゲンシポケモン名" format
            const result = `${formTranslation}${japaneseName.name}`;
            console.log(
              `[getPokemonName] Japanese Primal variant: ${pokemon.name} -> ${result}`,
            );
            return result;
          } else {
            // For other forms: "ポケモン名（フォーム名）" format
            const result = `${japaneseName.name}（${formTranslation}）`;
            console.log(
              `[getPokemonName] Japanese variant: ${pokemon.name} -> ${result}`,
            );
            return result;
          }
        }

        return japaneseName.name;
      }
    }

    // For English or when Japanese name is not available
    return getFormDisplayName(baseName || pokemon.name, formName, language);
  }

  // For non-variant Pokemon
  if (language === "ja" && pokemon.species?.names) {
    const japaneseName = pokemon.species.names.find(
      (nameEntry) =>
        nameEntry.language.name === "ja" ||
        nameEntry.language.name === "ja-Hrkt",
    );
    if (japaneseName?.name) {
      return japaneseName.name;
    }
  }

  // Fallback: capitalize English name
  return pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
}

/**
 * Get Pokemon name from evolution detail in the specified language
 * Falls back to English name if target language is not available
 */
export function getEvolutionPokemonName(
  evolutionDetail: EvolutionDetail,
  language: "en" | "ja",
): string {
  // Check if this is a variant Pokemon
  const nameParts = evolutionDetail.name.split("-");
  const isVariant = nameParts.length > 1;

  if (isVariant) {
    const baseName = nameParts[0];
    const formName = nameParts.slice(1).join("-");

    if (language === "ja" && evolutionDetail.species?.names) {
      // For Japanese variants, combine Japanese species name with form translation
      const japaneseName = evolutionDetail.species.names.find(
        (nameEntry) =>
          nameEntry.language.name === "ja" ||
          nameEntry.language.name === "ja-Hrkt",
      );

      if (japaneseName?.name) {
        const formTranslation = getFormTranslation(formName, language);

        if (formTranslation) {
          // Special handling for Mega Evolution in Japanese
          if (isMegaEvolution(formName)) {
            // Special format for Mega Charizard and Mega Mewtwo X/Y forms
            if (
              (baseName === "charizard" || baseName === "mewtwo") &&
              (formName === "mega-x" || formName === "mega-y")
            ) {
              const result = `メガ${japaneseName.name}${formTranslation}`;
              console.log(
                `[getEvolutionPokemonName] Japanese Mega X/Y variant: ${evolutionDetail.name} -> ${result}`,
              );
              return result;
            } else {
              // For other Mega forms: "メガポケモン名" format
              const result = `${formTranslation}${japaneseName.name}`;
              console.log(
                `[getEvolutionPokemonName] Japanese Mega variant: ${evolutionDetail.name} -> ${result}`,
              );
              return result;
            }
          } else if (isPrimalForm(formName)) {
            // Special handling for Primal forms: "ゲンシポケモン名" format
            const result = `${formTranslation}${japaneseName.name}`;
            console.log(
              `[getEvolutionPokemonName] Japanese Primal variant: ${evolutionDetail.name} -> ${result}`,
            );
            return result;
          } else {
            // For other forms: "ポケモン名（フォーム名）" format
            const result = `${japaneseName.name}（${formTranslation}）`;
            console.log(
              `[getEvolutionPokemonName] Japanese variant: ${evolutionDetail.name} -> ${result}`,
            );
            return result;
          }
        }

        return japaneseName.name;
      }
    }

    // For English or when Japanese name is not available
    return getFormDisplayName(
      baseName || evolutionDetail.name,
      formName,
      language,
    );
  }

  // For non-variant Pokemon
  if (language === "ja" && evolutionDetail.species?.names) {
    const japaneseName = evolutionDetail.species.names.find(
      (nameEntry) =>
        nameEntry.language.name === "ja" ||
        nameEntry.language.name === "ja-Hrkt",
    );
    if (japaneseName?.name) {
      return japaneseName.name;
    }
  }

  // Fallback: capitalize English name
  return (
    evolutionDetail.name.charAt(0).toUpperCase() + evolutionDetail.name.slice(1)
  );
}

/**
 * Get Pokemon description in the specified language
 * Returns the most recent flavor text entry for the target language
 */
export function getPokemonDescription(
  pokemon: Pokemon,
  language: "en" | "ja",
): string {
  if (!pokemon.species?.flavorTextEntries) {
    return "";
  }

  const targetLanguage = language === "ja" ? "ja" : "en";

  // Filter entries by language and get the most recent one
  const languageEntries = pokemon.species.flavorTextEntries.filter(
    (entry) =>
      entry.language.name === targetLanguage ||
      (targetLanguage === "ja" && entry.language.name === "ja-Hrkt"),
  );

  if (languageEntries.length === 0) {
    // Fallback to English if target language not available
    const englishEntries = pokemon.species.flavorTextEntries.filter(
      (entry) => entry.language.name === "en",
    );
    return (
      englishEntries[englishEntries.length - 1]?.flavorText.replace(
        /\f/g,
        " ",
      ) || ""
    );
  }

  // Return the most recent entry and clean up formatting
  return (
    languageEntries[languageEntries.length - 1]?.flavorText.replace(
      /\f/g,
      " ",
    ) || ""
  );
}

/**
 * Get Pokemon genus (category) in the specified language
 */
export function getPokemonGenus(
  pokemon: Pokemon,
  language: "en" | "ja",
): string {
  if (!pokemon.species?.genera) {
    return "";
  }

  const targetLanguage = language === "ja" ? "ja" : "en";

  const genus = pokemon.species.genera.find(
    (genusEntry) =>
      genusEntry.language.name === targetLanguage ||
      (targetLanguage === "ja" && genusEntry.language.name === "ja-Hrkt"),
  );

  return genus?.genus || "";
}

/**
 * Get translated type name
 */
export function getTypeName(typeName: string, language: "en" | "ja"): string {
  const translation = TYPE_TRANSLATIONS[typeName.toLowerCase()];
  return translation ? translation[language] : typeName;
}

/**
 * Get translated stat name
 */
export function getStatName(statName: string, language: "en" | "ja"): string {
  const translation = STAT_TRANSLATIONS[statName.toLowerCase()];
  return translation ? translation[language] : statName;
}

/**
 * Get translated move learn method
 */
export function getMoveLearnMethodName(
  methodName: string,
  language: "en" | "ja",
): string {
  const translation = MOVE_LEARN_METHOD_TRANSLATIONS[methodName.toLowerCase()];
  return translation ? translation[language] : methodName;
}

/**
 * Format move name - removes hyphens and capitalizes
 */
export function formatMoveName(moveName: string): string {
  return moveName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Ability name translations
 * Common Pokemon abilities in Japanese
 */

/**
 * Get ability name in the specified language
 * Uses 3-tier fallback: GraphQL data (future), manual translations, formatted English name
 */
export function getAbilityName(
  ability:
    | { name: string; names?: { name: string; language: { name: string } }[] }
    | string,
  language: "en" | "ja",
): string {
  // Handle string input for backward compatibility
  if (typeof ability === "string") {
    ability = { name: ability };
  }

  // Tier 1: GraphQL API data (if available in future)
  if (ability.names && ability.names.length > 0) {
    const targetLanguage = language === "ja" ? ["ja", "ja-Hrkt"] : ["en"];

    for (const lang of targetLanguage) {
      const languageName = ability.names.find(
        (nameEntry) => nameEntry.language.name === lang,
      );

      if (languageName) {
        return languageName.name;
      }
    }
  }

  // Tier 2: Manual translation table for abilities not covered by API
  const abilityName = ability.name.toLowerCase();
  const translation = ABILITY_TRANSLATIONS[abilityName];

  if (translation) {
    return translation[language];
  }

  // Tier 3: Final fallback to formatted English name
  return ability.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Game version translations
 */

/**
 * Get translated version name
 */
export function getVersionName(
  versionName: string,
  language: "en" | "ja",
): string {
  const translation = VERSION_TRANSLATIONS[versionName.toLowerCase()];
  if (translation) {
    return translation[language];
  }

  // Fallback: capitalize the English name
  return versionName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get translated generation name
 */
export function getGenerationName(
  generationName: string,
  language: "en" | "ja",
): string {
  const genNumber = generationName.replace("generation-", "");
  const romanToNumber: Record<string, string> = {
    i: "1",
    ii: "2",
    iii: "3",
    iv: "4",
    v: "5",
    vi: "6",
    vii: "7",
    viii: "8",
    ix: "9",
  };

  const number = romanToNumber[genNumber] || genNumber;

  if (language === "ja") {
    return `第${number}世代`;
  } else {
    return `Generation ${number.toUpperCase()}`;
  }
}

/**
 * Get Pokemon's primary type color for background styling
 */
export function getPrimaryTypeColor(pokemon: Pokemon): string {
  if (!pokemon.types || pokemon.types.length === 0) {
    return "#A8A878"; // Default to normal type color
  }

  const primaryType = pokemon.types[0]?.type.name;
  return getTypeColorFromName(primaryType || "normal");
}

/**
 * Get type color by type name
 */
export function getTypeColorFromName(typeName: string): string {
  return getTypeColor(typeName);
}

/**
 * Generate gradient background style based on Pokemon's primary type
 */
export function generateTypeBackgroundStyle(
  pokemon: Pokemon,
): React.CSSProperties {
  const primaryColor = getPrimaryTypeColor(pokemon);

  // Create a subtle gradient with the type color
  return {
    background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}08 50%, #f9fafb 100%)`,
    minHeight: "100vh",
  };
}

/**
 * Generate full-page background overlay style for Pokemon detail pages
 */
export function generateFullPageBackgroundStyle(
  pokemon: Pokemon,
): React.CSSProperties {
  const primaryColor = getPrimaryTypeColor(pokemon);

  // Create a full-page background overlay that covers margin/padding areas
  return {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}08 50%, #f9fafb 100%)`,
    zIndex: -10,
    pointerEvents: "none",
  };
}

/**
 * Convert hex color to rgba with opacity
 */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Get the background gradient as a CSS string for body styling
 */
export function getTypeBackgroundGradient(pokemon: Pokemon): string {
  const primaryColor = getPrimaryTypeColor(pokemon);

  // Convert to rgba with proper opacity values
  const colorWithAlpha1 = hexToRgba(primaryColor, 0.15); // 15% opacity
  const colorWithAlpha2 = hexToRgba(primaryColor, 0.08); // 8% opacity

  return `linear-gradient(135deg, ${colorWithAlpha1} 0%, ${colorWithAlpha2} 50%, #f9fafb 100%)`;
}

/**
 * Type effectiveness chart - each type's weaknesses (what they take super effective damage from)
 */

/**
 * Get Pokemon's type weaknesses (types that deal super effective damage)
 */
export function getPokemonWeaknesses(pokemon: Pokemon): string[] {
  if (!pokemon.types || pokemon.types.length === 0) {
    return [];
  }

  // Get all weaknesses from Pokemon's types
  const allWeaknesses = pokemon.types.flatMap(
    (typeSlot) => TYPE_EFFECTIVENESS[typeSlot.type.name.toLowerCase()] || [],
  );

  // Remove duplicates and return unique weaknesses
  return [...new Set(allWeaknesses)];
}

/**
 * Get sprite URL for normal or shiny version
 */
export function getPokemonSpriteUrl(
  pokemon: Pokemon,
  isShiny: boolean = false,
): string {
  if (isShiny) {
    return (
      pokemon.sprites.other?.officialArtwork?.frontShiny ||
      pokemon.sprites.other?.home?.frontShiny ||
      pokemon.sprites.frontShiny ||
      pokemon.sprites.other?.officialArtwork?.frontDefault ||
      pokemon.sprites.other?.home?.frontDefault ||
      pokemon.sprites.frontDefault ||
      "/placeholder-pokemon.png"
    );
  }

  return (
    pokemon.sprites.other?.officialArtwork?.frontDefault ||
    pokemon.sprites.other?.home?.frontDefault ||
    pokemon.sprites.frontDefault ||
    "/placeholder-pokemon.png"
  );
}

/**
 * Move name translations for common moves
 */

/**
 * Get move name in the specified language
 * Prioritizes GraphQL data, falls back to manual translations, then English name
 */
export function getMoveName(move: Move, language: "en" | "ja"): string {
  // First, try to get name from GraphQL API data if available
  if (move.names && move.names.length > 0) {
    const targetLanguage = language === "ja" ? ["ja", "ja-Hrkt"] : ["en"];

    for (const lang of targetLanguage) {
      const languageName = move.names.find(
        (nameEntry) => nameEntry.language.name === lang,
      );

      if (languageName) {
        return languageName.name;
      }
    }
  }

  // Fallback to manual translation table for moves not covered by API
  const moveName = move.name.toLowerCase();
  const translation = MOVE_TRANSLATIONS[moveName];

  if (translation) {
    return translation[language];
  }

  // Final fallback to formatted English name
  return (
    move.name.charAt(0).toUpperCase() + move.name.slice(1).replace(/-/g, " ")
  );
}

/**
 * Get Pokemon gender information based on gender_rate from PokeAPI
 * @param genderRate - PokeAPI gender_rate value (-1 to 8)
 * @returns GenderInfo object with gender type and ratios
 */
export function getPokemonGender(genderRate: number): GenderInfo {
  switch (genderRate) {
    case -1:
      return { type: "genderless" };
    case 0:
      return { type: "male", maleRatio: 100, femaleRatio: 0 };
    case 1:
      return { type: "male", maleRatio: 87.5, femaleRatio: 12.5 };
    case 2:
      return { type: "male", maleRatio: 75, femaleRatio: 25 };
    case 4:
      return { type: "male", maleRatio: 50, femaleRatio: 50 };
    case 6:
      return { type: "female", maleRatio: 25, femaleRatio: 75 };
    case 7:
      return { type: "female", maleRatio: 12.5, femaleRatio: 87.5 };
    case 8:
      return { type: "female", maleRatio: 0, femaleRatio: 100 };
    default:
      // Default to equal gender ratio if unknown
      return { type: "male", maleRatio: 50, femaleRatio: 50 };
  }
}

/**
 * Get gender display string for UI
 * @param genderRate - PokeAPI gender_rate value
 * @param language - Target language
 * @returns Formatted gender string for display
 */
export function getGenderDisplayString(
  genderRate: number,
  language: "en" | "ja",
): string {
  const genderInfo = getPokemonGender(genderRate);

  switch (genderInfo.type) {
    case "genderless":
      return language === "ja" ? "不明" : "Genderless";
    case "male":
      if (genderInfo.maleRatio === 100) {
        return "♂";
      } else if (genderInfo.maleRatio === 50) {
        return "♂ ♀";
      } else {
        return `♂ ♀`;
      }
    case "female":
      if (genderInfo.femaleRatio === 100) {
        return "♀";
      } else {
        return `♂ ♀`;
      }
    default:
      return "♂ ♀";
  }
}

/**
 * Get gender display JSX element with colored symbols
 * @param genderRate - PokeAPI gender_rate value
 * @param language - Target language
 * @returns JSX element with colored gender symbols
 */
export function getGenderDisplayElement(
  genderRate: number,
  language: "en" | "ja",
): React.ReactElement {
  const genderInfo = getPokemonGender(genderRate);

  switch (genderInfo.type) {
    case "genderless":
      return React.createElement(
        "span",
        { className: "text-gray-500" },
        language === "ja" ? "不明" : "Genderless",
      );
    case "male":
      if (genderInfo.maleRatio === 100) {
        return React.createElement(
          "span",
          { className: "text-blue-600 font-bold" },
          "♂",
        );
      } else {
        return React.createElement("span", null, [
          React.createElement(
            "span",
            { key: "male", className: "text-blue-600 font-bold" },
            "♂",
          ),
          React.createElement("span", { key: "space" }, " "),
          React.createElement(
            "span",
            { key: "female", className: "text-pink-600 font-bold" },
            "♀",
          ),
        ]);
      }
    case "female":
      if (genderInfo.femaleRatio === 100) {
        return React.createElement(
          "span",
          { className: "text-pink-600 font-bold" },
          "♀",
        );
      } else {
        return React.createElement("span", null, [
          React.createElement(
            "span",
            { key: "male", className: "text-blue-600 font-bold" },
            "♂",
          ),
          React.createElement("span", { key: "space" }, " "),
          React.createElement(
            "span",
            { key: "female", className: "text-pink-600 font-bold" },
            "♀",
          ),
        ]);
      }
    default:
      return React.createElement("span", null, [
        React.createElement(
          "span",
          { key: "male", className: "text-blue-600 font-bold" },
          "♂",
        ),
        React.createElement("span", { key: "space" }, " "),
        React.createElement(
          "span",
          { key: "female", className: "text-pink-600 font-bold" },
          "♀",
        ),
      ]);
  }
}
