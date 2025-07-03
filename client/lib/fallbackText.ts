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
    case "es":
      return "Cargando...";
    case "ko":
      return "로딩 중...";
    case "fr":
      return "Chargement...";
    case "it":
      return "Caricamento...";
    case "de":
      return "Laden...";
    default:
      return "Loading...";
  }
};

/**
 * Get fallback metadata text for when dictionary values are missing
 */
export const getFallbackEvolutionText = (language: Locale): string => {
  switch (language) {
    case "en":
      return "Loading evolution chain...";
    case "ja":
      return "進化チェーンを読み込み中...";
    case "zh-Hant":
      return "載入進化鏈中...";
    case "zh-Hans":
      return "加载进化链中...";
    case "es":
      return "Cargando cadena evolutiva...";
    case "ko":
      return "진화 계보 로딩 중...";
    case "fr":
      return "Chargement de la chaîne d'évolution...";
    case "it":
      return "Caricamento catena evolutiva...";
    case "de":
      return "Evolutionskette wird geladen...";
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
        case "zh-Hant":
          return "寶可夢圖鑑 | 完整的多世代寶可夢資料庫";
        case "zh-Hans":
          return "宝可梦图鉴 | 完整的多世代宝可梦数据库";
        case "ja":
          return "ポケモン図鑑 | 全世代ポケモン完全データベース";
        case "es":
          return "Pokédex | Base de Datos Completa de Pokémon Multi-Generación";
        case "ko":
          return "포켓몬 도감 | 완전한 다세대 포켓몬 데이터베이스";
        case "fr":
          return "Pokédex | Base de Données Pokémon Multi-Génération Complète";
        case "it":
          return "Pokédex | Database Completo Pokémon Multi-Generazione";
        case "de":
          return "Pokédex | Vollständige Multi-Generationen Pokémon-Datenbank";
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
        case "es":
          return "Base de datos completa de Pokémon con 1302+ Pokémon que incluye estadísticas detalladas, arte oficial, efectividad de tipos, cadenas evolutivas y conjuntos de movimientos. Cobertura completa de la Generación 1 a la 9 con capacidades avanzadas de búsqueda y filtrado.";
        case "ko":
          return "1302마리 이상의 포켓몬을 포함한 종합적인 포켓몬 데이터베이스. 상세한 스탯, 공식 아트워크, 타입 상성, 진화 계보, 기술 세트를 제공합니다. 1세대부터 9세대까지 완전한 커버리지와 고급 검색 및 필터링 기능을 제공합니다.";
        case "fr":
          return "Base de données Pokémon complète avec plus de 1302 Pokémon incluant des statistiques détaillées, des illustrations officielles, l'efficacité des types, les chaînes d'évolution et les ensembles d'attaques. Couverture complète de la Génération 1 à 9 avec des capacités de recherche et de filtrage avancées.";
        case "it":
          return "Database completo dei Pokémon con oltre 1302 Pokémon che include statistiche dettagliate, artwork ufficiali, efficacia dei tipi, catene evolutive e set di mosse. Copertura completa dalla Generazione 1 alla 9 con capacità avanzate di ricerca e filtraggio.";
        case "de":
          return "Umfassende Pokémon-Datenbank mit über 1302 Pokémon mit detaillierten Statistiken, offiziellen Artworks, Typ-Effektivität, Entwicklungsketten und Attacken-Sets. Vollständige Abdeckung von Generation 1 bis 9 mit erweiterten Such- und Filterfunktionen.";
        default:
          return "Comprehensive Pokemon database featuring 1302+ Pokemon with detailed stats, official artwork, type effectiveness, evolution chains, and move sets. Complete coverage from Generation 1 to 9 with advanced search and filtering capabilities.";
      }
    default:
      return getFallbackText(language);
  }
};
