import { Locale } from "./dictionaries";

/**
 * Get fallback text for when dictionary is not loaded
 */
export const getFallbackText = (language: Locale): string => {
  return language === "en" ? "Loading..." : "読み込み中...";
};
