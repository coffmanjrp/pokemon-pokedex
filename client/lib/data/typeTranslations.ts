export interface TypeData {
  en: string;
  ja: string;
  color: string;
}

export const TYPE_TRANSLATIONS: Record<string, { en: string; ja: string }> = {
  normal: { en: "Normal", ja: "ノーマル" },
  fire: { en: "Fire", ja: "ほのお" },
  water: { en: "Water", ja: "みず" },
  electric: { en: "Electric", ja: "でんき" },
  grass: { en: "Grass", ja: "くさ" },
  ice: { en: "Ice", ja: "こおり" },
  fighting: { en: "Fighting", ja: "かくとう" },
  poison: { en: "Poison", ja: "どく" },
  ground: { en: "Ground", ja: "じめん" },
  flying: { en: "Flying", ja: "ひこう" },
  psychic: { en: "Psychic", ja: "エスパー" },
  bug: { en: "Bug", ja: "むし" },
  rock: { en: "Rock", ja: "いわ" },
  ghost: { en: "Ghost", ja: "ゴースト" },
  dragon: { en: "Dragon", ja: "ドラゴン" },
  dark: { en: "Dark", ja: "あく" },
  steel: { en: "Steel", ja: "はがね" },
  fairy: { en: "Fairy", ja: "フェアリー" },
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
