export interface FormTranslation {
  en: string;
  ja: string;
  "zh-Hant"?: string;
  "zh-Hans"?: string;
  es?: string;
  ko?: string;
}

export type FormCategory = "regional" | "mega" | "gigantamax" | "special";

export interface FormData extends FormTranslation {
  category: FormCategory;
  priority: number;
  badgeColor: string;
}

// Regional form translations
export const REGIONAL_FORM_TRANSLATIONS: Record<string, FormTranslation> = {
  alola: { en: "Alolan", ja: "アローラのすがた", es: "de Alola" },
  alolan: { en: "Alolan", ja: "アローラのすがた", es: "de Alola" },
  galar: { en: "Galarian", ja: "ガラルのすがた", es: "de Galar" },
  galarian: { en: "Galarian", ja: "ガラルのすがた", es: "de Galar" },
  hisui: { en: "Hisuian", ja: "ヒスイのすがた", es: "de Hisui" },
  hisuian: { en: "Hisuian", ja: "ヒスイのすがた", es: "de Hisui" },
  paldea: { en: "Paldean", ja: "パルデアのすがた", es: "de Paldea" },
  paldean: { en: "Paldean", ja: "パルデアのすがた", es: "de Paldea" },
};

// Mega Evolution form translations
// Note: Order matters! More specific forms (mega-x, mega-y) must come before general forms (mega)
export const MEGA_FORM_TRANSLATIONS: Record<string, FormTranslation> = {
  "mega-x": { en: "Mega X", ja: "メガX", es: "Mega X" },
  "mega-y": { en: "Mega Y", ja: "メガY", es: "Mega Y" },
  mega: { en: "Mega", ja: "メガ", es: "Mega" },
};

// Gigantamax form translations
export const GIGANTAMAX_FORM_TRANSLATIONS: Record<string, FormTranslation> = {
  gmax: { en: "Gigantamax", ja: "キョダイマックスのすがた", es: "Gigantamax" },
};

// Special form translations
export const SPECIAL_FORM_TRANSLATIONS: Record<string, FormTranslation> = {
  primal: { en: "Primal", ja: "ゲンシ", es: "Primigenio" },
  origin: { en: "Origin Forme", ja: "オリジンフォルム", es: "Forma Origen" },
  altered: {
    en: "Altered Forme",
    ja: "アナザーフォルム",
    es: "Forma Alterada",
  },
  sky: { en: "Sky Forme", ja: "スカイフォルム", es: "Forma Cielo" },
  land: { en: "Land Forme", ja: "ランドフォルム", es: "Forma Tierra" },
  therian: { en: "Therian Forme", ja: "れいじゅうフォルム", es: "Forma Tótem" },
  incarnate: {
    en: "Incarnate Forme",
    ja: "けしんフォルム",
    es: "Forma Avatar",
  },
  resolute: {
    en: "Resolute Forme",
    ja: "かくごのすがた",
    es: "Forma Decidida",
  },
  ordinary: { en: "Ordinary Forme", ja: "いつものすがた", es: "Forma Normal" },
  zen: { en: "Zen Mode", ja: "ダルマモード", es: "Modo Daruma" },
  standard: { en: "Standard Mode", ja: "ノーマルモード", es: "Modo Estándar" },
  blade: { en: "Blade Forme", ja: "ブレードフォルム", es: "Forma Filo" },
  shield: { en: "Shield Forme", ja: "シールドフォルム", es: "Forma Escudo" },
  unbound: { en: "Unbound", ja: "ときはなたれし", es: "Desatado" },
  confined: { en: "Confined", ja: "いましめられし", es: "Contenido" },
  complete: {
    en: "Complete Forme",
    ja: "パーフェクトフォルム",
    es: "Forma Completa",
  },
  "10-percent": { en: "10% Forme", ja: "10%フォルム", es: "Forma 10%" },
  "50-percent": { en: "50% Forme", ja: "50%フォルム", es: "Forma 50%" },
  "dusk-mane": {
    en: "Dusk Mane",
    ja: "たそがれのたてがみ",
    es: "Melena Crepuscular",
  },
  "dawn-wings": {
    en: "Dawn Wings",
    ja: "あかつきのつばさ",
    es: "Alas del Alba",
  },
  ultra: { en: "Ultra", ja: "ウルトラ", es: "Ultra" },
  "red-meteor": { en: "Red Meteor", ja: "あかいいんせき", es: "Meteoro Rojo" },
  "blue-meteor": {
    en: "Blue Meteor",
    ja: "あおいいんせき",
    es: "Meteoro Azul",
  },
  "yellow-meteor": {
    en: "Yellow Meteor",
    ja: "きいろいいんせき",
    es: "Meteoro Amarillo",
  },
  "green-meteor": {
    en: "Green Meteor",
    ja: "みどりのいんせき",
    es: "Meteoro Verde",
  },
  "orange-meteor": {
    en: "Orange Meteor",
    ja: "オレンジいんせき",
    es: "Meteoro Naranja",
  },
  "indigo-meteor": {
    en: "Indigo Meteor",
    ja: "あいいろのいんせき",
    es: "Meteoro Índigo",
  },
  "violet-meteor": {
    en: "Violet Meteor",
    ja: "むらさきのいんせき",
    es: "Meteoro Violeta",
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
