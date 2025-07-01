import { Locale } from "./dictionaries";

/**
 * Get fallback text for when dictionary is not loaded
 */
export const getFallbackText = (language: Locale): string => {
  switch (language) {
    case "zh-Hant":
      return "載入中...";
    case "zh-Hans":
      return "加载中...";
    case "ja":
      return "読み込み中...";
    default:
      return "Loading...";
  }
};

/**
 * Get fallback metadata text for when dictionary values are missing
 */
export const getFallbackMetadata = (
  language: Locale,
  type: "homeTitle" | "homeDescription",
): string => {
  switch (type) {
    case "homeTitle":
      switch (language) {
        case "zh-Hant":
          return "寶可夢圖鑑 | 完整的多世代寶可夢資料庫";
        case "zh-Hans":
          return "宝可梦图鉴 | 完整的多世代宝可梦数据库";
        case "ja":
          return "ポケモン図鑑 | 全世代ポケモン完全データベース";
        default:
          return "Pokemon Pokedex | Complete Multi-Generation Pokemon Database";
      }
    case "homeDescription":
      switch (language) {
        case "zh-Hant":
          return "完整的寶可夢資料庫，包含1302+寶可夢的詳細能力值、官方美術圖、屬性相剋、進化鏈和招式組合。完整覆蓋第1世代到第9世代，具備進階搜尋和篩選功能。";
        case "zh-Hans":
          return "完整的宝可梦数据库，包含1302+宝可梦的详细能力值、官方美术图、属性相克、进化链和招式组合。完整覆盖第1世代到第9世代，具备高级搜索和筛选功能。";
        case "ja":
          return "全1302匹以上のポケモンの詳細情報を網羅。公式アートワーク、ステータス、タイプ相性、進化チェーン、技一覧など充実した機能を提供する最新のポケモン図鑑。第1世代から第9世代まで完全対応。";
        default:
          return "Comprehensive Pokemon database featuring 1302+ Pokemon with detailed stats, official artwork, type effectiveness, evolution chains, and move sets. Complete coverage from Generation 1 to 9 with advanced search and filtering capabilities.";
      }
    default:
      return getFallbackText(language);
  }
};
