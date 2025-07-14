import { Locale } from "./dictionaries";

/**
 * Get fallback text for when dictionary is not loaded
 */
export const getFallbackText = (language: Locale): string => {
  switch (language) {
    case "ja":
      return "読み込み中...";
    default:
      return "Loading...";
  }
};

/**
 * Get fallback metadata text for when dictionary values are missing
 */
export const getFallbackEvolutionText = (language: Locale): string => {
  switch (language) {
    case "ja":
      return "進化チェーンを読み込み中...";
    default:
      return "Loading evolution chain...";
  }
};

export const getFallbackMetadata = (
  language: Locale,
  type: "homeTitle" | "homeDescription",
): string => {
  switch (type) {
    case "homeTitle":
      switch (language) {
        case "ja":
          return "ポケモン図鑑 | 全世代ポケモン完全データベース";
        default:
          return "Pokemon Pokedex | Complete Multi-Generation Pokemon Database";
      }
    case "homeDescription":
      switch (language) {
        case "ja":
          return "全1302匹以上のポケモンの詳細情報を網羅。公式アートワーク、ステータス、タイプ相性、進化チェーン、技一覧など充実した機能を提供する最新のポケモン図鑑。第1世代から第9世代まで完全対応。";
        default:
          return "Comprehensive Pokemon database featuring 1302+ Pokemon with detailed stats, official artwork, type effectiveness, evolution chains, and move sets. Complete coverage from Generation 1 to 9 with advanced search and filtering capabilities.";
      }
    default:
      return getFallbackText(language);
  }
};
