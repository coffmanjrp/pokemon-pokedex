export interface TypeData {
  en: string;
  ja: string;
  color: string;
}

export const TYPE_TRANSLATIONS: Record<
  string,
  {
    en: string;
    ja: string;
    "zh-Hant": string;
    "zh-Hans": string;
    es: string;
    ko: string;
    fr: string;
  }
> = {
  normal: {
    en: "Normal",
    ja: "ノーマル",
    "zh-Hant": "一般",
    "zh-Hans": "一般",
    es: "Normal",
    ko: "노말",
    fr: "Normal",
  },
  fire: {
    en: "Fire",
    ja: "ほのお",
    "zh-Hant": "火",
    "zh-Hans": "火",
    es: "Fuego",
    ko: "불꽃",
    fr: "Feu",
  },
  water: {
    en: "Water",
    ja: "みず",
    "zh-Hant": "水",
    "zh-Hans": "水",
    es: "Agua",
    ko: "물",
    fr: "Eau",
  },
  electric: {
    en: "Electric",
    ja: "でんき",
    "zh-Hant": "電",
    "zh-Hans": "电",
    es: "Eléctrico",
    ko: "전기",
    fr: "Électrik",
  },
  grass: {
    en: "Grass",
    ja: "くさ",
    "zh-Hant": "草",
    "zh-Hans": "草",
    es: "Planta",
    ko: "풀",
    fr: "Plante",
  },
  ice: {
    en: "Ice",
    ja: "こおり",
    "zh-Hant": "冰",
    "zh-Hans": "冰",
    es: "Hielo",
    ko: "얼음",
    fr: "Glace",
  },
  fighting: {
    en: "Fighting",
    ja: "かくとう",
    "zh-Hant": "格鬥",
    "zh-Hans": "格斗",
    es: "Lucha",
    ko: "격투",
    fr: "Combat",
  },
  poison: {
    en: "Poison",
    ja: "どく",
    "zh-Hant": "毒",
    "zh-Hans": "毒",
    es: "Veneno",
    ko: "독",
    fr: "Poison",
  },
  ground: {
    en: "Ground",
    ja: "じめん",
    "zh-Hant": "地面",
    "zh-Hans": "地面",
    es: "Tierra",
    ko: "땅",
    fr: "Sol",
  },
  flying: {
    en: "Flying",
    ja: "ひこう",
    "zh-Hant": "飛行",
    "zh-Hans": "飞行",
    es: "Volador",
    ko: "비행",
    fr: "Vol",
  },
  psychic: {
    en: "Psychic",
    ja: "エスパー",
    "zh-Hant": "超能力",
    "zh-Hans": "超能力",
    es: "Psíquico",
    ko: "에스퍼",
    fr: "Psy",
  },
  bug: {
    en: "Bug",
    ja: "むし",
    "zh-Hant": "蟲",
    "zh-Hans": "虫",
    es: "Bicho",
    ko: "벌레",
    fr: "Insecte",
  },
  rock: {
    en: "Rock",
    ja: "いわ",
    "zh-Hant": "岩石",
    "zh-Hans": "岩石",
    es: "Roca",
    ko: "바위",
    fr: "Roche",
  },
  ghost: {
    en: "Ghost",
    ja: "ゴースト",
    "zh-Hant": "幽靈",
    "zh-Hans": "幽灵",
    es: "Fantasma",
    ko: "고스트",
    fr: "Spectre",
  },
  dragon: {
    en: "Dragon",
    ja: "ドラゴン",
    "zh-Hant": "龍",
    "zh-Hans": "龙",
    es: "Dragón",
    ko: "드래곤",
    fr: "Dragon",
  },
  dark: {
    en: "Dark",
    ja: "あく",
    "zh-Hant": "惡",
    "zh-Hans": "恶",
    es: "Siniestro",
    ko: "악",
    fr: "Ténèbres",
  },
  steel: {
    en: "Steel",
    ja: "はがね",
    "zh-Hant": "鋼",
    "zh-Hans": "钢",
    es: "Acero",
    ko: "강철",
    fr: "Acier",
  },
  fairy: {
    en: "Fairy",
    ja: "フェアリー",
    "zh-Hant": "妖精",
    "zh-Hans": "妖精",
    es: "Hada",
    ko: "페어리",
    fr: "Fée",
  },
};

// Pokemon type colors (official Pokemon game colors)
export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

// Combined type data (for future use)
export const TYPE_DATA: Record<string, TypeData> = {
  normal: { en: "Normal", ja: "ノーマル", color: "#A8A878" },
  fire: { en: "Fire", ja: "ほのお", color: "#F08030" },
  water: { en: "Water", ja: "みず", color: "#6890F0" },
  electric: { en: "Electric", ja: "でんき", color: "#F8D030" },
  grass: { en: "Grass", ja: "くさ", color: "#78C850" },
  ice: { en: "Ice", ja: "こおり", color: "#98D8D8" },
  fighting: { en: "Fighting", ja: "かくとう", color: "#C03028" },
  poison: { en: "Poison", ja: "どく", color: "#A040A0" },
  ground: { en: "Ground", ja: "じめん", color: "#E0C068" },
  flying: { en: "Flying", ja: "ひこう", color: "#A890F0" },
  psychic: { en: "Psychic", ja: "エスパー", color: "#F85888" },
  bug: { en: "Bug", ja: "むし", color: "#A8B820" },
  rock: { en: "Rock", ja: "いわ", color: "#B8A038" },
  ghost: { en: "Ghost", ja: "ゴースト", color: "#705898" },
  dragon: { en: "Dragon", ja: "ドラゴン", color: "#7038F8" },
  dark: { en: "Dark", ja: "あく", color: "#705848" },
  steel: { en: "Steel", ja: "はがね", color: "#B8B8D0" },
  fairy: { en: "Fairy", ja: "フェアリー", color: "#EE99AC" },
};

// Helper functions
export const getTypeName = (
  typeName: string,
  language: "en" | "ja",
): string => {
  const type = TYPE_TRANSLATIONS[typeName.toLowerCase()];
  return type ? type[language] : typeName;
};

export const getTypeColor = (typeName: string): string => {
  return TYPE_COLORS[typeName.toLowerCase()] || "#A8A878"; // Default to normal type
};
