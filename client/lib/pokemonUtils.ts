import {
  Pokemon,
  EvolutionDetail,
  Move,
  GenderInfo,
  SpeciesName,
} from "@/types/pokemon";
import { Locale, Dictionary } from "@/lib/dictionaries";
import { getFormDisplayName, isMegaEvolution } from "@/lib/formUtils";
// Form translations moved to dictionary system
import { TYPE_EFFECTIVENESS } from "@/lib/data/index";
import { isPokemonType } from "@/lib/utils/typeUtils";
import { MOVE_TRANSLATIONS } from "@/lib/data/moveTranslations";
import { getTypeColor } from "@/lib/utils";
import React from "react";
import { FaMars, FaVenus } from "react-icons/fa";

/**
 * Get form translation for use in Japanese Pokemon names
 * Returns the form suffix like "アローラのすがた", "メガ", etc.
 * @deprecated This function is deprecated and should use dictionary lookup instead
 */

function getFormTranslation(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _language: Locale,
): string | null {
  // Special forms now handled by dictionary system
  // This function is deprecated and should use dictionary lookup instead

  return null;
}

/**
 * Get the base species ID for display purposes
 * Returns the species ID instead of the variant ID for consistent numbering
 */
export function getPokemonDisplayId(pokemon: Pokemon): string {
  // For Pokemon forms (Generation 0, ID >= 10000), always use species ID if available
  const pokemonId = parseInt(pokemon.id);
  if (pokemonId >= 10000 && pokemon.species?.id) {
    return pokemon.species.id;
  }

  // For other variant Pokemon with species data, use the species ID
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
  // Base Pokemon (ID 1-1025) should not be considered variants even if they have hyphens in names
  const pokemonId = parseInt(pokemon.id);
  if (pokemonId >= 1 && pokemonId <= 1025) {
    return false;
  }

  // Only Pokemon with form IDs (10000+) are considered variants
  return pokemon.name.includes("-") && pokemonId >= 10000;
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
  language: Locale,
  dictionary?: Dictionary,
): string {
  if (!shouldDisplayFormSeparately(pokemon)) {
    return getPokemonName(pokemon, language, dictionary);
  }

  // For forms that should be displayed separately, return just the base name
  if (language === "ja" && pokemon.species?.names) {
    // Map language codes for PokeAPI
    const languageCodes = {
      ja: ["ja", "ja-Hrkt"],
      it: ["it"],
      de: ["de"],
      fr: ["fr"],
    };

    const targetCodes = languageCodes[
      language as keyof typeof languageCodes
    ] || ["en"];
    const speciesName = pokemon.species.names.find((nameEntry) =>
      targetCodes.includes(nameEntry.language.name),
    );

    if (speciesName?.name) {
      return speciesName.name;
    }
  }

  // For English or when target language name is not available
  const baseName = pokemon.name.split("-")[0];
  if (!baseName) return pokemon.name;
  return baseName.charAt(0).toUpperCase() + baseName.slice(1);
}

/**
 * Get Pokemon form name for separate display
 */
export function getPokemonFormName(
  pokemon: Pokemon,
  language: Locale,
  dictionary?: Dictionary,
): string | null {
  if (!shouldDisplayFormSeparately(pokemon)) {
    return null;
  }

  const formName = pokemon.name.split("-").slice(1).join("-");

  // Use dictionary for form translations
  if (dictionary?.ui?.forms?.translations) {
    // Try to find form translation in dictionary
    for (const [key, translation] of Object.entries(
      dictionary.ui.forms.translations,
    )) {
      if (formName.includes(key)) {
        return translation;
      }
    }
  }

  // Fallback: capitalize form name
  return formName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
  pokemon:
    | Pokemon
    | { id: string; name: string; species?: { names: SpeciesName[] } },
  language: Locale,
  dictionary?: Dictionary,
): string {
  // Special handling for Generation 0 Pokemon (forms with ID >= 10000)
  const pokemonId = parseInt(pokemon.id);
  if (pokemonId >= 10000) {
    // For Generation 0 forms, we always want to use the form's name with proper localization
    const nameParts = pokemon.name.split("-");
    const baseName = nameParts[0];
    const formName = nameParts.slice(1).join("-");

    // Use species data for localized names
    if (
      (language === "ja" ||
        language === "zh-Hans" ||
        language === "zh-Hant" ||
        language === "es" ||
        language === "it" ||
        language === "de" ||
        language === "fr") &&
      pokemon.species?.names
    ) {
      const languageCodes = {
        ja: ["ja", "ja-Hrkt"],
        "zh-Hans": ["zh-Hans"],
        "zh-Hant": ["zh-Hant"],
        es: ["es"],
        it: ["it"],
        de: ["de"],
        fr: ["fr"],
      };

      const targetCodes = languageCodes[
        language as keyof typeof languageCodes
      ] || ["en"];
      const speciesName = pokemon.species.names.find((nameEntry) =>
        targetCodes.includes(nameEntry.language.name),
      );

      if (speciesName?.name) {
        // Handle form name translation
        if (dictionary?.ui?.forms?.translations) {
          let formTranslation = null;

          if (formName.includes("mega-x")) {
            formTranslation = "X";
          } else if (formName.includes("mega-y")) {
            formTranslation = "Y";
          } else if (formName.includes("mega")) {
            formTranslation = dictionary.ui.forms.translations.mega || "メガ";
          } else {
            // Try to find other form translations
            for (const [key, translation] of Object.entries(
              dictionary.ui.forms.translations,
            )) {
              if (formName.includes(key)) {
                formTranslation = translation;
                break;
              }
            }
          }

          if (formTranslation) {
            // Special handling for Mega Evolution in Japanese
            if (isMegaEvolution(formName)) {
              // Special format for Mega Charizard and Mega Mewtwo X/Y forms
              if (
                (baseName === "charizard" || baseName === "mewtwo") &&
                (formName === "mega-x" || formName === "mega-y")
              ) {
                const megaText =
                  dictionary?.ui?.forms?.translations?.mega || "メガ";
                return `${megaText}${speciesName.name}${formTranslation}`;
              } else {
                // For other Mega forms: "メガポケモン名" format
                return `${formTranslation}${speciesName.name}`;
              }
            } else if (isPrimalForm(formName)) {
              // Special handling for Primal forms: "ゲンシポケモン名" format
              return `${formTranslation}${speciesName.name}`;
            } else {
              // For other forms: "ポケモン名（フォーム名）" format
              return `${speciesName.name}（${formTranslation}）`;
            }
          }
        }

        // Return the localized name if no form translation found
        return speciesName.name;
      }
    }

    // For English or when localized name is not available
    return getFormDisplayName(baseName || pokemon.name, formName, language);
  }

  // Check if this is a variant Pokemon
  const nameParts = pokemon.name.split("-");
  const isVariant = nameParts.length > 1;

  if (isVariant) {
    const baseName = nameParts[0];
    const formName = nameParts.slice(1).join("-");

    // Handle non-English languages with species names
    if (
      (language === "ja" ||
        language === "zh-Hans" ||
        language === "zh-Hant" ||
        language === "es" ||
        language === "it" ||
        language === "de" ||
        language === "fr") &&
      pokemon.species?.names
    ) {
      // Map language codes for PokeAPI
      const languageCodes = {
        ja: ["ja", "ja-Hrkt"],
        "zh-Hans": ["zh-Hans"],
        "zh-Hant": ["zh-Hant"],
        es: ["es"],
        it: ["it"],
        de: ["de"],
        fr: ["fr"],
      };

      const targetCodes = languageCodes[
        language as keyof typeof languageCodes
      ] || ["en"];
      const speciesName = pokemon.species.names.find((nameEntry) =>
        targetCodes.includes(nameEntry.language.name),
      );

      if (speciesName?.name) {
        // Use dictionary for form translations
        let formTranslation = null;
        if (dictionary?.ui?.forms?.translations) {
          if (formName.includes("mega-x")) {
            formTranslation = "X";
          } else if (formName.includes("mega-y")) {
            formTranslation = "Y";
          } else if (formName.includes("mega")) {
            formTranslation = dictionary.ui.forms.translations.mega;
          } else {
            // Try to find other form translations
            for (const [key, translation] of Object.entries(
              dictionary.ui.forms.translations,
            )) {
              if (formName.includes(key)) {
                formTranslation = translation;
                break;
              }
            }
          }
        }

        if (formTranslation) {
          if (language === "ja") {
            // Special handling for Mega Evolution in Japanese
            if (isMegaEvolution(formName)) {
              // Special format for Mega Charizard and Mega Mewtwo X/Y forms
              if (
                (baseName === "charizard" || baseName === "mewtwo") &&
                (formName === "mega-x" || formName === "mega-y")
              ) {
                const megaText =
                  dictionary?.ui?.forms?.translations?.mega || "メガ";
                const result = `${megaText}${speciesName.name}${formTranslation}`;
                return result;
              } else {
                // For other Mega forms: "メガポケモン名" format
                const result = `${formTranslation}${speciesName.name}`;
                return result;
              }
            } else if (isPrimalForm(formName)) {
              // Special handling for Primal forms: "ゲンシポケモン名" format
              const result = `${formTranslation}${speciesName.name}`;
              return result;
            } else {
              // For other forms: "ポケモン名（フォーム名）" format
              const result = `${speciesName.name}（${formTranslation}）`;
              return result;
            }
          } else {
            // For other languages with Mega Evolution
            if (isMegaEvolution(formName)) {
              // Special format for Mega Charizard and Mega Mewtwo X/Y forms
              if (
                (baseName === "charizard" || baseName === "mewtwo") &&
                (formName === "mega-x" || formName === "mega-y")
              ) {
                const megaText =
                  dictionary?.ui?.forms?.translations?.mega || "Mega";
                const result = `${megaText} ${speciesName.name} ${formTranslation}`;
                return result;
              } else {
                // For other Mega forms: "Mega Pokemon Name" format
                const result = `${formTranslation} ${speciesName.name}`;
                return result;
              }
            } else {
              // For other forms: "Pokemon Name (Form Name)" format
              const result = `${speciesName.name} (${formTranslation})`;
              return result;
            }
          }
        }

        return speciesName.name;
      }
    }

    // For English or when target language name is not available
    return getFormDisplayName(
      baseName || pokemon.name,
      formName,
      language,
      dictionary,
    );
  }

  // For non-variant Pokemon
  if (
    (language === "ja" ||
      language === "zh-Hans" ||
      language === "zh-Hant" ||
      language === "es" ||
      language === "it" ||
      language === "de" ||
      language === "fr") &&
    pokemon.species?.names
  ) {
    // Map language codes for PokeAPI
    const languageCodes = {
      ja: ["ja", "ja-Hrkt"],
      "zh-Hans": ["zh-Hans"],
      "zh-Hant": ["zh-Hant"],
      es: ["es"],
      it: ["it"],
      de: ["de"],
      fr: ["fr"],
    };

    const targetCodes = languageCodes[
      language as keyof typeof languageCodes
    ] || ["en"];
    const speciesName = pokemon.species.names.find((nameEntry) =>
      targetCodes.includes(nameEntry.language.name),
    );

    if (speciesName?.name) {
      return speciesName.name;
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
  language: Locale,
): string {
  // Check if this is a variant Pokemon
  const nameParts = evolutionDetail.name.split("-");
  const isVariant = nameParts.length > 1;

  if (isVariant) {
    const baseName = nameParts[0];
    const formName = nameParts.slice(1).join("-");

    // Handle non-English languages with species names
    if (
      (language === "ja" ||
        language === "zh-Hans" ||
        language === "zh-Hant" ||
        language === "es" ||
        language === "it" ||
        language === "de" ||
        language === "fr") &&
      evolutionDetail.species?.names
    ) {
      // Map language codes for PokeAPI
      const languageCodes = {
        ja: ["ja", "ja-Hrkt"],
        "zh-Hans": ["zh-Hans"],
        "zh-Hant": ["zh-Hant"],
        es: ["es"],
        it: ["it"],
        de: ["de"],
        fr: ["fr"],
      };

      const targetCodes = languageCodes[
        language as keyof typeof languageCodes
      ] || ["en"];
      const speciesName = evolutionDetail.species.names.find((nameEntry) =>
        targetCodes.includes(nameEntry.language.name),
      );

      if (speciesName?.name) {
        const formTranslation = getFormTranslation(formName, language);

        if (formTranslation) {
          if (language === "ja") {
            // Special handling for Mega Evolution in Japanese
            if (isMegaEvolution(formName)) {
              // Special format for Mega Charizard and Mega Mewtwo X/Y forms
              if (
                (baseName === "charizard" || baseName === "mewtwo") &&
                (formName === "mega-x" || formName === "mega-y")
              ) {
                const result = `メガ${speciesName.name}${formTranslation}`;
                return result;
              } else {
                // For other Mega forms: "メガポケモン名" format
                const result = `${formTranslation}${speciesName.name}`;
                return result;
              }
            } else if (isPrimalForm(formName)) {
              // Special handling for Primal forms: "ゲンシポケモン名" format
              const result = `${formTranslation}${speciesName.name}`;
              return result;
            } else {
              // For other forms: "ポケモン名（フォーム名）" format
              const result = `${speciesName.name}（${formTranslation}）`;
              return result;
            }
          } else {
            // For Chinese and Spanish languages: "ポケモン名（フォーム名）" format
            const result = `${speciesName.name}（${formTranslation}）`;
            return result;
          }
        }

        return speciesName.name;
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
  if (
    (language === "ja" ||
      language === "zh-Hans" ||
      language === "zh-Hant" ||
      language === "es" ||
      language === "it" ||
      language === "de" ||
      language === "fr") &&
    evolutionDetail.species?.names
  ) {
    // Map language codes for PokeAPI
    const languageCodes = {
      ja: ["ja", "ja-Hrkt"],
      "zh-Hans": ["zh-Hans"],
      "zh-Hant": ["zh-Hant"],
      es: ["es"],
      it: ["it"],
      de: ["de"],
      fr: ["fr"],
    };

    const targetCodes = languageCodes[
      language as keyof typeof languageCodes
    ] || ["en"];
    const speciesName = evolutionDetail.species.names.find((nameEntry) =>
      targetCodes.includes(nameEntry.language.name),
    );

    if (speciesName?.name) {
      return speciesName.name;
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
  language: Locale,
): string {
  if (!pokemon.species?.flavorTextEntries) {
    return "";
  }

  // Map locale to PokeAPI language codes
  const languageMap: Record<string, string[]> = {
    en: ["en"],
    ja: ["ja", "ja-Hrkt"],
    "zh-Hans": ["zh-Hans"],
    "zh-Hant": ["zh-Hant"],
    es: ["es"],
    it: ["it"],
    de: ["de"],
    fr: ["fr"],
  };

  const targetCodes = languageMap[language] || ["en"];

  // Filter entries by language and get the most recent one
  const languageEntries = pokemon.species.flavorTextEntries.filter((entry) =>
    targetCodes.includes(entry.language.name),
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
 * Get fallback genus text for the specified language
 */
function getGenusFallback(language: Locale): string {
  const fallbackTexts: Record<Locale, string> = {
    en: "Pokémon",
    ja: "ポケモン",
    "zh-Hans": "宝可梦",
    "zh-Hant": "寶可夢",
    es: "Pokémon",
    it: "Pokémon",
    de: "Pokémon",
    fr: "Pokémon",
  };

  return fallbackTexts[language] || "Pokémon";
}

/**
 * Get Pokemon genus (category) in the specified language
 */
export function getPokemonGenus(pokemon: Pokemon, language: Locale): string {
  // Check if genus data exists
  if (!pokemon.species?.genera || pokemon.species.genera.length === 0) {
    // Return fallback text instead of empty string
    return getGenusFallback(language);
  }

  // Map locale to PokeAPI language codes
  const languageMap: Record<string, string[]> = {
    en: ["en"],
    ja: ["ja", "ja-Hrkt"],
    "zh-Hans": ["zh-Hans"],
    "zh-Hant": ["zh-Hant"],
    es: ["es"],
    it: ["it"],
    de: ["de"],
    fr: ["fr"],
  };

  const targetCodes = languageMap[language] || ["en"];

  const genus = pokemon.species.genera.find((genusEntry) =>
    targetCodes.includes(genusEntry.language.name),
  );

  // Return genus or fallback text
  return genus?.genus || getGenusFallback(language);
}

/**
 * Get translated type name using dictionary system
 */
export function getTypeName(typeName: string, dictionary: Dictionary): string {
  const typeKey =
    typeName.toLowerCase() as keyof Dictionary["ui"]["pokemonTypes"];

  if (dictionary.ui.pokemonTypes[typeKey]) {
    return dictionary.ui.pokemonTypes[typeKey];
  }

  // Fallback: capitalize the English name
  return typeName.charAt(0).toUpperCase() + typeName.slice(1);
}

/**
 * Get translated move learn method using dictionary system
 */
export function getMoveLearnMethodName(
  methodName: string,
  dictionary: Dictionary,
): string {
  const methodKey =
    methodName.toLowerCase() as keyof Dictionary["ui"]["moveLearnMethods"];

  if (dictionary.ui.moveLearnMethods[methodKey]) {
    return dictionary.ui.moveLearnMethods[methodKey];
  }

  // Fallback: capitalize the English name
  return methodName.charAt(0).toUpperCase() + methodName.slice(1);
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
 * Get ability name in the specified language
 * Uses 2-tier fallback: GraphQL data, formatted English name
 */
export function getAbilityName(
  ability:
    | { name: string; names?: { name: string; language: { name: string } }[] }
    | string,
  language: Locale,
): string {
  // Handle string input for backward compatibility
  if (typeof ability === "string") {
    ability = { name: ability };
  }

  // Tier 1: GraphQL API data (if available in future)
  if (ability.names && ability.names.length > 0) {
    const languageMap: Record<string, string[]> = {
      en: ["en"],
      ja: ["ja", "ja-Hrkt"],
      "zh-Hant": ["zh-Hant"],
      "zh-Hans": ["zh-Hans"],
      es: ["es"],
      it: ["it"],
      de: ["de"],
      fr: ["fr"],
    };
    const targetLanguage = languageMap[language] || ["en"];

    for (const lang of targetLanguage) {
      const languageName = ability.names.find(
        (nameEntry) => nameEntry.language.name === lang,
      );

      if (languageName) {
        return languageName.name;
      }
    }
  }

  // Tier 2: Final fallback to formatted English name
  return ability.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Game version translations
 */

/**
 * Get translated version name using dictionary system
 */
export function getVersionName(
  versionName: string,
  dictionary: Dictionary,
): string {
  const versionKey = versionName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "") as keyof Dictionary["ui"]["gameVersions"];

  if (dictionary.ui.gameVersions[versionKey]) {
    return dictionary.ui.gameVersions[versionKey];
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
  language: Locale,
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
  const allWeaknesses = pokemon.types.flatMap((typeSlot) => {
    const typeName = typeSlot.type.name.toLowerCase();
    return isPokemonType(typeName) ? TYPE_EFFECTIVENESS[typeName] || [] : [];
  });

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
export function getMoveName(move: Move, language: Locale): string {
  // First, try to get name from GraphQL API data if available
  if (move.names && move.names.length > 0) {
    const languageMap: Record<string, string[]> = {
      en: ["en"],
      ja: ["ja", "ja-Hrkt"],
      "zh-Hant": ["zh-Hant"],
      "zh-Hans": ["zh-Hans"],
      es: ["es"],
      it: ["it"],
      de: ["de"],
      fr: ["fr"],
    };
    const targetLanguage = languageMap[language] || ["en"];

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
    // If Japanese language requested but translation doesn't exist, fall back to English
    if (language === "ja" && !translation["ja"]) {
      return translation["en"] || move.name;
    }
    return (
      translation[language as "en" | "ja"] || translation["en"] || move.name
    );
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
  language: Locale,
): string {
  const genderInfo = getPokemonGender(genderRate);

  switch (genderInfo.type) {
    case "genderless":
      if (language === "ja") {
        return "不明";
      } else {
        return "Genderless";
      }
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
  language: Locale,
): React.ReactElement {
  const genderInfo = getPokemonGender(genderRate);

  switch (genderInfo.type) {
    case "genderless":
      let genderlessText: string;
      if (language === "ja") {
        genderlessText = "不明";
      } else {
        genderlessText = "Genderless";
      }

      return React.createElement(
        "span",
        { className: "text-gray-500" },
        genderlessText,
      );
    case "male":
      if (genderInfo.maleRatio === 100) {
        return React.createElement(FaMars, {
          className: "text-blue-600 font-bold inline",
        });
      } else {
        return React.createElement("span", null, [
          React.createElement(FaMars, {
            key: "male",
            className: "text-blue-600 font-bold inline",
          }),
          React.createElement("span", { key: "space" }, " "),
          React.createElement(FaVenus, {
            key: "female",
            className: "text-pink-600 font-bold inline",
          }),
        ]);
      }
    case "female":
      if (genderInfo.femaleRatio === 100) {
        return React.createElement(FaVenus, {
          className: "text-pink-600 font-bold inline",
        });
      } else {
        return React.createElement("span", null, [
          React.createElement(FaMars, {
            key: "male",
            className: "text-blue-600 font-bold inline",
          }),
          React.createElement("span", { key: "space" }, " "),
          React.createElement(FaVenus, {
            key: "female",
            className: "text-pink-600 font-bold inline",
          }),
        ]);
      }
    default:
      return React.createElement("span", null, [
        React.createElement(FaMars, {
          key: "male",
          className: "text-blue-600 font-bold inline",
        }),
        React.createElement("span", { key: "space" }, " "),
        React.createElement(FaVenus, {
          key: "female",
          className: "text-pink-600 font-bold inline",
        }),
      ]);
  }
}

/**
 * Get move flavor text (description) in the specified language
 * @param move - Move object with flavorTextEntries
 * @param language - Target language
 * @returns Move description string
 */
export function getMoveFlavorText(move: Move, language: Locale): string {
  if (!move.flavorTextEntries || move.flavorTextEntries.length === 0) {
    return "";
  }

  // Map locale to PokeAPI language codes
  const languageMap: Record<string, string[]> = {
    en: ["en"],
    ja: ["ja", "ja-Hrkt"],
    "zh-Hans": ["zh-Hans"],
    "zh-Hant": ["zh-Hant"],
    es: ["es"],
    it: ["it"],
    de: ["de"],
    fr: ["fr"],
  };

  const targetCodes = languageMap[language] || ["en"];

  // Filter entries by language and get the most recent one
  const languageEntries = move.flavorTextEntries.filter((entry) =>
    targetCodes.includes(entry.language.name),
  );

  if (languageEntries.length === 0) {
    // Fallback to English if target language not available
    const englishEntries = move.flavorTextEntries.filter(
      (entry) => entry.language.name === "en",
    );
    return (
      englishEntries[englishEntries.length - 1]?.flavorText?.replace(
        /\f/g,
        " ",
      ) || ""
    );
  }

  // Return the most recent entry and clean up formatting
  return (
    languageEntries[languageEntries.length - 1]?.flavorText?.replace(
      /\f/g,
      " ",
    ) || ""
  );
}

/**
 * Get move damage class name in the specified language
 * @param damageClass - Damage class object with names array
 * @param language - Target language
 * @returns Damage class name string
 */
export function getMoveDamageClassName(
  damageClass: {
    name: string;
    names?: { name: string; language: { name: string } }[];
  },
  language: Locale,
): string {
  // Use multilingual data if available
  if (damageClass.names && damageClass.names.length > 0) {
    const languageMap: Record<string, string[]> = {
      en: ["en"],
      ja: ["ja", "ja-Hrkt"],
      "zh-Hant": ["zh-Hant"],
      "zh-Hans": ["zh-Hans"],
      es: ["es"],
      it: ["it"],
      de: ["de"],
      fr: ["fr"],
    };
    const targetLanguage = languageMap[language] || ["en"];

    for (const lang of targetLanguage) {
      const languageName = damageClass.names.find(
        (nameEntry) => nameEntry.language.name === lang,
      );

      if (languageName) {
        return languageName.name;
      }
    }
  }

  // Fallback to formatted English name
  return damageClass.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get move target name in the specified language
 * @param target - Target object with names array
 * @param language - Target language
 * @param dictionary - Optional dictionary for fallback
 * @returns Target name string
 */
export function getMoveTargetName(
  target: {
    name: string;
    names?: { name: string; language: { name: string } }[];
  },
  language: Locale,
  dictionary?: Dictionary,
): string {
  // Use multilingual data if available
  if (target.names && target.names.length > 0) {
    const languageMap: Record<string, string[]> = {
      en: ["en"],
      ja: ["ja", "ja-Hrkt"],
      "zh-Hant": ["zh-Hant"],
      "zh-Hans": ["zh-Hans"],
      es: ["es"],
      it: ["it"],
      de: ["de"],
      fr: ["fr"],
    };
    const targetLanguage = languageMap[language] || ["en"];

    for (const lang of targetLanguage) {
      const languageName = target.names.find(
        (nameEntry) => nameEntry.language.name === lang,
      );

      if (languageName) {
        return languageName.name;
      }
    }
  }

  // Try dictionary system if available
  if (dictionary && dictionary.ui.moveTargets) {
    const targetKey =
      target.name.toLowerCase() as keyof typeof dictionary.ui.moveTargets;
    if (dictionary.ui.moveTargets[targetKey]) {
      return dictionary.ui.moveTargets[targetKey];
    }
  }

  // Fallback to formatted English name
  return target.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
