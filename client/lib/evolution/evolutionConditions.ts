import { EvolutionTrigger } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { ITEM_TRANSLATIONS } from "@/lib/data/itemTranslations";

export function renderEvolutionCondition(
  trigger: EvolutionTrigger,
  lang: Locale,
  dictionary: Dictionary | null,
  fallback: string,
): string {
  if (!trigger || typeof trigger !== "object") {
    return dictionary?.ui.error.unknown || fallback;
  }

  const conditions = [];

  // Check for minLevel (more explicit check)
  if (
    trigger.minLevel !== null &&
    trigger.minLevel !== undefined &&
    typeof trigger.minLevel === "number"
  ) {
    const levelText = dictionary?.ui.pokemonDetails.level || fallback;
    conditions.push(`${levelText} ${trigger.minLevel}`);
  }

  if (trigger.item) {
    const itemKey = trigger.item.name.toLowerCase();
    const itemTranslation = ITEM_TRANSLATIONS[itemKey];

    if (itemTranslation) {
      // Helper function to get item translation for current language
      const getItemTranslation = (lang: Locale) => {
        switch (lang) {
          case "en":
            return itemTranslation.en;
          case "ja":
            return itemTranslation.ja;
          case "zh-Hant":
          case "zh-Hans":
            return itemTranslation.en; // fallback to English for Chinese languages
          default:
            return itemTranslation.en;
        }
      };

      const itemName = getItemTranslation(lang);
      const useText = dictionary?.ui.pokemonDetails.use || fallback;
      conditions.push(
        lang === "en" ? `${useText} ${itemName}` : `${itemName}を${useText}`,
      );
    } else {
      // Fallback to formatted item name
      const formattedName = trigger.item.name.replace(/-/g, " ");
      const capitalizedName = formattedName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const useText = dictionary?.ui.pokemonDetails.use || fallback;
      conditions.push(
        lang === "en"
          ? `${useText} ${capitalizedName}`
          : `${capitalizedName}を${useText}`,
      );
    }
  }

  if (trigger.trigger?.name === "trade") {
    conditions.push(dictionary?.ui.pokemonDetails.trade || fallback);
  }

  if (trigger.trigger?.name === "level-up" && !trigger.minLevel) {
    conditions.push(dictionary?.ui.pokemonDetails.levelUp || fallback);
  }

  if (trigger.minHappiness) {
    const happinessText = dictionary?.ui.pokemonDetails.happiness || fallback;
    conditions.push(
      lang === "en"
        ? `${happinessText} ${trigger.minHappiness}+`
        : `${happinessText}${trigger.minHappiness}以上`,
    );
  }

  if (trigger.timeOfDay) {
    const timeMap = {
      day: dictionary?.ui.pokemonDetails.day || fallback,
      night: dictionary?.ui.pokemonDetails.night || fallback,
    };
    conditions.push(
      timeMap[trigger.timeOfDay as keyof typeof timeMap] || trigger.timeOfDay,
    );
  }

  if (trigger.location) {
    const locationName = trigger.location.name.replace(/-/g, " ");
    const atText = dictionary?.ui.pokemonDetails.at || fallback;
    conditions.push(
      lang === "en" ? `${atText} ${locationName}` : `${locationName}${atText}`,
    );
  }

  if (trigger.knownMove) {
    const moveName = trigger.knownMove.name.replace(/-/g, " ");
    const learnText = dictionary?.ui.pokemonDetails.learn || fallback;
    conditions.push(
      lang === "en" ? `${learnText} ${moveName}` : `${moveName}を${learnText}`,
    );
  }

  return conditions.length > 0
    ? conditions.join(lang === "en" ? " + " : " + ")
    : dictionary?.ui.pokemonDetails.specialCondition || fallback;
}
