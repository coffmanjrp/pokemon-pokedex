export interface GenerationData {
  id: number;
  name: {
    en: string;
    ja: string;
    "zh-Hant": string;
    "zh-Hans": string;
    es: string;
    ko: string;
    fr: string;
    it: string;
    de: string;
  };
  region: {
    en: string;
    ja: string;
    "zh-Hant": string;
    "zh-Hans": string;
    es: string;
    ko: string;
    fr: string;
    it: string;
    de: string;
  };
  pokemonRange: { start: number; end: number };
  games: string[];
  remakes?: string[];
}

export const GENERATIONS: GenerationData[] = [
  {
    id: 1,
    name: {
      en: "Generation I",
      ja: "第1世代",
      "zh-Hant": "第一世代",
      "zh-Hans": "第一世代",
      es: "Generación I",
      ko: "1세대",
      fr: "Génération I",
      it: "Generazione I",
      de: "Generation I",
    },
    region: {
      en: "Kanto",
      ja: "カントー地方",
      "zh-Hant": "關都地區",
      "zh-Hans": "关都地区",
      es: "Kanto",
      ko: "관동",
      fr: "Kanto",
      it: "Kanto",
      de: "Kanto",
    },
    pokemonRange: { start: 1, end: 151 },
    games: ["red", "blue", "yellow"],
    remakes: ["firered", "leafgreen"],
  },
  {
    id: 2,
    name: {
      en: "Generation II",
      ja: "第2世代",
      "zh-Hant": "第二世代",
      "zh-Hans": "第二世代",
      es: "Generación II",
      ko: "2세대",
      fr: "Génération II",
      it: "Generazione II",
      de: "Generation II",
    },
    region: {
      en: "Johto",
      ja: "ジョウト地方",
      "zh-Hant": "城都地區",
      "zh-Hans": "城都地区",
      es: "Johto",
      ko: "성도",
      fr: "Johto",
      it: "Johto",
      de: "Johto",
    },
    pokemonRange: { start: 152, end: 251 },
    games: ["gold", "silver", "crystal"],
    remakes: ["heartgold", "soulsilver"],
  },
  {
    id: 3,
    name: {
      en: "Generation III",
      ja: "第3世代",
      "zh-Hant": "第三世代",
      "zh-Hans": "第三世代",
      es: "Generación III",
      ko: "3세대",
      fr: "Génération III",
      it: "Generazione III",
      de: "Generation III",
    },
    region: {
      en: "Hoenn",
      ja: "ホウエン地方",
      "zh-Hant": "豐緣地區",
      "zh-Hans": "丰缘地区",
      es: "Hoenn",
      ko: "호연",
      fr: "Hoenn",
      it: "Hoenn",
      de: "Hoenn",
    },
    pokemonRange: { start: 252, end: 386 },
    games: ["ruby", "sapphire", "emerald"],
    remakes: ["omega-ruby", "alpha-sapphire"],
  },
  {
    id: 4,
    name: {
      en: "Generation IV",
      ja: "第4世代",
      "zh-Hant": "第四世代",
      "zh-Hans": "第四世代",
      es: "Generación IV",
      ko: "4세대",
      fr: "Génération IV",
      it: "Generazione IV",
      de: "Generation IV",
    },
    region: {
      en: "Sinnoh",
      ja: "シンオウ地方",
      "zh-Hant": "神奧地區",
      "zh-Hans": "神奥地区",
      es: "Sinnoh",
      ko: "신오",
      fr: "Sinnoh",
      it: "Sinnoh",
      de: "Sinnoh",
    },
    pokemonRange: { start: 387, end: 493 },
    games: ["diamond", "pearl", "platinum"],
    remakes: ["brilliant-diamond", "shining-pearl"],
  },
  {
    id: 5,
    name: {
      en: "Generation V",
      ja: "第5世代",
      "zh-Hant": "第五世代",
      "zh-Hans": "第五世代",
      es: "Generación V",
      ko: "5세대",
      fr: "Génération V",
      it: "Generazione V",
      de: "Generation V",
    },
    region: {
      en: "Unova",
      ja: "イッシュ地方",
      "zh-Hant": "合眾地區",
      "zh-Hans": "合众地区",
      es: "Teselia",
      ko: "하나",
      fr: "Unys",
      it: "Unima",
      de: "Einall",
    },
    pokemonRange: { start: 494, end: 649 },
    games: ["black", "white", "black-2", "white-2"],
  },
  {
    id: 6,
    name: {
      en: "Generation VI",
      ja: "第6世代",
      "zh-Hant": "第六世代",
      "zh-Hans": "第六世代",
      es: "Generación VI",
      ko: "6세대",
      fr: "Génération VI",
      it: "Generazione VI",
      de: "Generation VI",
    },
    region: {
      en: "Kalos",
      ja: "カロス地方",
      "zh-Hant": "卡洛斯地區",
      "zh-Hans": "卡洛斯地区",
      es: "Kalos",
      ko: "칼로스",
      fr: "Kalos",
      it: "Kalos",
      de: "Kalos",
    },
    pokemonRange: { start: 650, end: 721 },
    games: ["x", "y"],
  },
  {
    id: 7,
    name: {
      en: "Generation VII",
      ja: "第7世代",
      "zh-Hant": "第七世代",
      "zh-Hans": "第七世代",
      es: "Generación VII",
      ko: "7세대",
      fr: "Génération VII",
      it: "Generazione VII",
      de: "Generation VII",
    },
    region: {
      en: "Alola",
      ja: "アローラ地方",
      "zh-Hant": "阿羅拉地區",
      "zh-Hans": "阿罗拉地区",
      es: "Alola",
      ko: "알로라",
      fr: "Alola",
      it: "Alola",
      de: "Alola",
    },
    pokemonRange: { start: 722, end: 809 },
    games: ["sun", "moon", "ultra-sun", "ultra-moon"],
  },
  {
    id: 8,
    name: {
      en: "Generation VIII",
      ja: "第8世代",
      "zh-Hant": "第八世代",
      "zh-Hans": "第八世代",
      es: "Generación VIII",
      ko: "8세대",
      fr: "Génération VIII",
      it: "Generazione VIII",
      de: "Generation VIII",
    },
    region: {
      en: "Galar",
      ja: "ガラル地方",
      "zh-Hant": "伽勒爾地區",
      "zh-Hans": "伽勒尔地区",
      es: "Galar",
      ko: "가라르",
      fr: "Galar",
      it: "Galar",
      de: "Galar",
    },
    pokemonRange: { start: 810, end: 905 },
    games: ["sword", "shield"],
    remakes: ["legends-arceus"], // Special case: Hisui region
  },
  {
    id: 9,
    name: {
      en: "Generation IX",
      ja: "第9世代",
      "zh-Hant": "第九世代",
      "zh-Hans": "第九世代",
      es: "Generación IX",
      ko: "9세대",
      fr: "Génération IX",
      it: "Generazione IX",
      de: "Generation IX",
    },
    region: {
      en: "Paldea",
      ja: "パルデア地方",
      "zh-Hant": "帕德亞地區",
      "zh-Hans": "帕德亚地区",
      es: "Paldea",
      ko: "팔데아",
      fr: "Paldea",
      it: "Paldea",
      de: "Paldea",
    },
    pokemonRange: { start: 906, end: 1025 },
    games: ["scarlet", "violet"],
  },
];

// Helper functions
export const getGenerationById = (id: number): GenerationData | undefined => {
  return GENERATIONS.find((gen) => gen.id === id);
};

export const getGenerationByGame = (
  gameName: string,
): GenerationData | undefined => {
  return GENERATIONS.find(
    (gen) =>
      gen.games.includes(gameName) ||
      (gen.remakes && gen.remakes.includes(gameName)),
  );
};

export const getGenerationByPokemonId = (
  pokemonId: number,
): GenerationData | undefined => {
  return GENERATIONS.find(
    (gen) =>
      pokemonId >= gen.pokemonRange.start && pokemonId <= gen.pokemonRange.end,
  );
};

export const getGenerationName = (
  generation: GenerationData,
  language:
    | "en"
    | "ja"
    | "zh-Hant"
    | "zh-Hans"
    | "es"
    | "ko"
    | "fr"
    | "it"
    | "de",
): string => {
  return generation.name[language];
};

export const getGenerationRegion = (
  generation: GenerationData,
  language:
    | "en"
    | "ja"
    | "zh-Hant"
    | "zh-Hans"
    | "es"
    | "ko"
    | "fr"
    | "it"
    | "de",
): string => {
  return generation.region[language];
};

export const isRemakeGame = (gameName: string): boolean => {
  return GENERATIONS.some((gen) => gen.remakes?.includes(gameName));
};

// usePokemonList compatible format with min/max properties
export const GENERATION_RANGES = {
  1: {
    min: 1,
    max: 151,
    region: {
      en: "Kanto",
      ja: "カントー地方",
      "zh-Hant": "關都地區",
      "zh-Hans": "关都地区",
      es: "Kanto",
      ko: "관동",
      fr: "Kanto",
      it: "Kanto",
      de: "Kanto",
    },
  },
  2: {
    min: 152,
    max: 251,
    region: {
      en: "Johto",
      ja: "ジョウト地方",
      "zh-Hant": "城都地區",
      "zh-Hans": "城都地区",
      es: "Johto",
      ko: "성도",
      fr: "Johto",
      it: "Johto",
      de: "Johto",
    },
  },
  3: {
    min: 252,
    max: 386,
    region: {
      en: "Hoenn",
      ja: "ホウエン地方",
      "zh-Hant": "豐緣地區",
      "zh-Hans": "丰缘地区",
      es: "Hoenn",
      ko: "호연",
      fr: "Hoenn",
      it: "Hoenn",
      de: "Hoenn",
    },
  },
  4: {
    min: 387,
    max: 493,
    region: {
      en: "Sinnoh",
      ja: "シンオウ地方",
      "zh-Hant": "神奧地區",
      "zh-Hans": "神奥地区",
      es: "Sinnoh",
      ko: "신오",
      fr: "Sinnoh",
      it: "Sinnoh",
      de: "Sinnoh",
    },
  },
  5: {
    min: 494,
    max: 649,
    region: {
      en: "Unova",
      ja: "イッシュ地方",
      "zh-Hant": "合眾地區",
      "zh-Hans": "合众地区",
      es: "Teselia",
      ko: "하나",
      fr: "Unys",
      it: "Unima",
      de: "Einall",
    },
  },
  6: {
    min: 650,
    max: 721,
    region: {
      en: "Kalos",
      ja: "カロス地方",
      "zh-Hant": "卡洛斯地區",
      "zh-Hans": "卡洛斯地区",
      es: "Kalos",
      ko: "칼로스",
      fr: "Kalos",
      it: "Kalos",
      de: "Kalos",
    },
  },
  7: {
    min: 722,
    max: 809,
    region: {
      en: "Alola",
      ja: "アローラ地方",
      "zh-Hant": "阿羅拉地區",
      "zh-Hans": "阿罗拉地区",
      es: "Alola",
      ko: "알로라",
      fr: "Alola",
      it: "Alola",
      de: "Alola",
    },
  },
  8: {
    min: 810,
    max: 905,
    region: {
      en: "Galar",
      ja: "ガラル地方",
      "zh-Hant": "伽勒爾地區",
      "zh-Hans": "伽勒尔地区",
      es: "Galar",
      ko: "가라르",
      fr: "Galar",
      it: "Galar",
      de: "Galar",
    },
  },
  9: {
    min: 906,
    max: 1025,
    region: {
      en: "Paldea",
      ja: "パルデア地方",
      "zh-Hant": "帕德亞地區",
      "zh-Hans": "帕德亚地区",
      es: "Paldea",
      ko: "팔데아",
      fr: "Paldea",
      it: "Paldea",
      de: "Paldea",
    },
  },
} as const;
