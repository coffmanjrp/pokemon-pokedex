export interface FormTranslation {
  en: string;
  ja: string;
  "zh-Hant"?: string;
  "zh-Hans"?: string;
  es?: string;
  fr?: string;
  ko?: string;
  it?: string;
}

export type FormCategory = "regional" | "mega" | "gigantamax" | "special";

export interface FormData extends FormTranslation {
  category: FormCategory;
  priority: number;
  badgeColor: string;
}

// Regional form translations
export const REGIONAL_FORM_TRANSLATIONS: Record<string, FormTranslation> = {
  alola: {
    en: "Alolan",
    ja: "アローラのすがた",
    es: "de Alola",
    fr: "d'Alola",
  },
  alolan: {
    en: "Alolan",
    ja: "アローラのすがた",
    es: "de Alola",
    fr: "d'Alola",
  },
  galar: {
    en: "Galarian",
    ja: "ガラルのすがた",
    es: "de Galar",
    fr: "de Galar",
  },
  galarian: {
    en: "Galarian",
    ja: "ガラルのすがた",
    es: "de Galar",
    fr: "de Galar",
  },
  hisui: {
    en: "Hisuian",
    ja: "ヒスイのすがた",
    es: "de Hisui",
    fr: "de Hisui",
  },
  hisuian: {
    en: "Hisuian",
    ja: "ヒスイのすがた",
    es: "de Hisui",
    fr: "de Hisui",
  },
  paldea: {
    en: "Paldean",
    ja: "パルデアのすがた",
    es: "de Paldea",
    fr: "de Paldea",
  },
  paldean: {
    en: "Paldean",
    ja: "パルデアのすがた",
    es: "de Paldea",
    fr: "de Paldea",
  },
};

// Mega Evolution form translations
// Note: Order matters! More specific forms (mega-x, mega-y) must come before general forms (mega)
export const MEGA_FORM_TRANSLATIONS: Record<string, FormTranslation> = {
  "mega-x": { en: "Mega X", ja: "メガX", es: "Mega X", fr: "Méga-X" },
  "mega-y": { en: "Mega Y", ja: "メガY", es: "Mega Y", fr: "Méga-Y" },
  mega: { en: "Mega", ja: "メガ", es: "Mega", fr: "Méga" },
};

// Gigantamax form translations
export const GIGANTAMAX_FORM_TRANSLATIONS: Record<string, FormTranslation> = {
  gmax: {
    en: "Gigantamax",
    ja: "キョダイマックスのすがた",
    es: "Gigantamax",
    fr: "Gigamax",
  },
};

// Special form translations
export const SPECIAL_FORM_TRANSLATIONS: Record<string, FormTranslation> = {
  primal: { en: "Primal", ja: "ゲンシ", es: "Primigenio", fr: "Primo" },
  origin: {
    en: "Origin Forme",
    ja: "オリジンフォルム",
    es: "Forma Origen",
    fr: "Forme Originelle",
  },
  altered: {
    en: "Altered Forme",
    ja: "アナザーフォルム",
    es: "Forma Alterada",
    fr: "Forme Alternative",
  },
  sky: {
    en: "Sky Forme",
    ja: "スカイフォルム",
    es: "Forma Cielo",
    fr: "Forme Céleste",
  },
  land: {
    en: "Land Forme",
    ja: "ランドフォルム",
    es: "Forma Tierra",
    fr: "Forme Terrestre",
  },
  therian: {
    en: "Therian Forme",
    ja: "れいじゅうフォルム",
    es: "Forma Tótem",
    fr: "Forme Totem",
  },
  incarnate: {
    en: "Incarnate Forme",
    ja: "けしんフォルム",
    es: "Forma Avatar",
    fr: "Forme Avatar",
  },
  resolute: {
    en: "Resolute Forme",
    ja: "かくごのすがた",
    es: "Forma Decidida",
    fr: "Forme Décidée",
  },
  ordinary: {
    en: "Ordinary Forme",
    ja: "いつものすがた",
    es: "Forma Normal",
    fr: "Forme Ordinaire",
  },
  zen: {
    en: "Zen Mode",
    ja: "ダルマモード",
    es: "Modo Daruma",
    fr: "Mode Zen",
  },
  standard: {
    en: "Standard Mode",
    ja: "ノーマルモード",
    es: "Modo Estándar",
    fr: "Mode Standard",
  },
  blade: {
    en: "Blade Forme",
    ja: "ブレードフォルム",
    es: "Forma Filo",
    fr: "Forme Assaut",
  },
  shield: {
    en: "Shield Forme",
    ja: "シールドフォルム",
    es: "Forma Escudo",
    fr: "Forme Parade",
  },
  unbound: {
    en: "Unbound",
    ja: "ときはなたれし",
    es: "Desatado",
    fr: "Déchaîné",
  },
  confined: {
    en: "Confined",
    ja: "いましめられし",
    es: "Contenido",
    fr: "Entravé",
  },
  complete: {
    en: "Complete Forme",
    ja: "パーフェクトフォルム",
    es: "Forma Completa",
    fr: "Forme Parfaite",
  },
  "10-percent": {
    en: "10% Forme",
    ja: "10%フォルム",
    es: "Forma 10%",
    fr: "Forme 10%",
  },
  "50-percent": {
    en: "50% Forme",
    ja: "50%フォルム",
    es: "Forma 50%",
    fr: "Forme 50%",
  },
  "dusk-mane": {
    en: "Dusk Mane",
    ja: "たそがれのたてがみ",
    es: "Melena Crepuscular",
    fr: "Crinière du Couchant",
  },
  "dawn-wings": {
    en: "Dawn Wings",
    ja: "あかつきのつばさ",
    es: "Alas del Alba",
    fr: "Ailes de l'Aurore",
  },
  ultra: { en: "Ultra", ja: "ウルトラ", es: "Ultra", fr: "Ultra" },
  "red-meteor": {
    en: "Red Meteor",
    ja: "あかいいんせき",
    es: "Meteoro Rojo",
    fr: "Météore Rouge",
  },
  "blue-meteor": {
    en: "Blue Meteor",
    ja: "あおいいんせき",
    es: "Meteoro Azul",
    fr: "Météore Bleu",
  },
  "yellow-meteor": {
    en: "Yellow Meteor",
    ja: "きいろいいんせき",
    es: "Meteoro Amarillo",
    fr: "Météore Jaune",
  },
  "green-meteor": {
    en: "Green Meteor",
    ja: "みどりのいんせき",
    es: "Meteoro Verde",
    fr: "Météore Vert",
  },
  "orange-meteor": {
    en: "Orange Meteor",
    ja: "オレンジいんせき",
    es: "Meteoro Naranja",
    fr: "Météore Orange",
  },
  "indigo-meteor": {
    en: "Indigo Meteor",
    ja: "あいいろのいんせき",
    es: "Meteoro Índigo",
    fr: "Météore Indigo",
  },
  "violet-meteor": {
    en: "Violet Meteor",
    ja: "むらさきのいんせき",
    es: "Meteoro Violeta",
    fr: "Météore Violet",
  },
};

// Badge colors for different form categories
export const FORM_BADGE_COLORS: Record<FormCategory, string> = {
  regional: "bg-green-100 text-green-800",
  mega: "bg-purple-100 text-purple-800",
  gigantamax: "bg-red-100 text-red-800",
  special: "bg-blue-100 text-blue-800",
};

// Form priorities for sorting (lower number = higher priority)
export const FORM_PRIORITIES: Record<FormCategory, number> = {
  regional: 1,
  mega: 2,
  gigantamax: 3,
  special: 4,
};

// Helper functions for form data access
export const getFormTranslationByKey = (
  key: string,
): FormTranslation | null => {
  return (
    REGIONAL_FORM_TRANSLATIONS[key] ||
    MEGA_FORM_TRANSLATIONS[key] ||
    GIGANTAMAX_FORM_TRANSLATIONS[key] ||
    SPECIAL_FORM_TRANSLATIONS[key] ||
    null
  );
};

export const getFormCategory = (formName: string): FormCategory | null => {
  if (
    Object.keys(REGIONAL_FORM_TRANSLATIONS).some((key) =>
      formName.includes(key),
    )
  ) {
    return "regional";
  }
  if (
    Object.keys(MEGA_FORM_TRANSLATIONS).some((key) => formName.includes(key))
  ) {
    return "mega";
  }
  if (
    Object.keys(GIGANTAMAX_FORM_TRANSLATIONS).some((key) =>
      formName.includes(key),
    )
  ) {
    return "gigantamax";
  }
  if (
    Object.keys(SPECIAL_FORM_TRANSLATIONS).some((key) => formName.includes(key))
  ) {
    return "special";
  }
  return null;
};

export const getFormBadgeColor = (formName: string): string => {
  const category = getFormCategory(formName);
  return category ? FORM_BADGE_COLORS[category] : "bg-gray-100 text-gray-800";
};

export const getFormPriority = (formName: string | undefined): number => {
  if (!formName || formName === "default") return 0;
  const category = getFormCategory(formName);
  return category ? FORM_PRIORITIES[category] : 4;
};
