export interface FormTranslation {
  en: string;
  ja: string;
}

export type FormCategory = 'regional' | 'mega' | 'gigantamax' | 'special';

export interface FormData extends FormTranslation {
  category: FormCategory;
  priority: number;
  badgeColor: string;
}

// Regional form translations
export const REGIONAL_FORM_TRANSLATIONS: Record<string, FormTranslation> = {
  'alola': { en: 'Alolan', ja: 'アローラのすがた' },
  'alolan': { en: 'Alolan', ja: 'アローラのすがた' },
  'galar': { en: 'Galarian', ja: 'ガラルのすがた' },
  'galarian': { en: 'Galarian', ja: 'ガラルのすがた' },
  'hisui': { en: 'Hisuian', ja: 'ヒスイのすがた' },
  'hisuian': { en: 'Hisuian', ja: 'ヒスイのすがた' },
  'paldea': { en: 'Paldean', ja: 'パルデアのすがた' },
  'paldean': { en: 'Paldean', ja: 'パルデアのすがた' },
};

// Mega Evolution form translations
// Note: Order matters! More specific forms (mega-x, mega-y) must come before general forms (mega)
export const MEGA_FORM_TRANSLATIONS: Record<string, FormTranslation> = {
  'mega-x': { en: 'Mega X', ja: 'メガX' },
  'mega-y': { en: 'Mega Y', ja: 'メガY' },
  'mega': { en: 'Mega', ja: 'メガ' },
};

// Gigantamax form translations
export const GIGANTAMAX_FORM_TRANSLATIONS: Record<string, FormTranslation> = {
  'gmax': { en: 'Gigantamax', ja: 'キョダイマックスのすがた' },
};

// Special form translations
export const SPECIAL_FORM_TRANSLATIONS: Record<string, FormTranslation> = {
  'primal': { en: 'Primal', ja: 'ゲンシ' },
  'origin': { en: 'Origin Forme', ja: 'オリジンフォルム' },
  'altered': { en: 'Altered Forme', ja: 'アナザーフォルム' },
  'sky': { en: 'Sky Forme', ja: 'スカイフォルム' },
  'land': { en: 'Land Forme', ja: 'ランドフォルム' },
  'therian': { en: 'Therian Forme', ja: 'れいじゅうフォルム' },
  'incarnate': { en: 'Incarnate Forme', ja: 'けしんフォルム' },
  'resolute': { en: 'Resolute Forme', ja: 'かくごのすがた' },
  'ordinary': { en: 'Ordinary Forme', ja: 'いつものすがた' },
  'zen': { en: 'Zen Mode', ja: 'ダルマモード' },
  'standard': { en: 'Standard Mode', ja: 'ノーマルモード' },
  'blade': { en: 'Blade Forme', ja: 'ブレードフォルム' },
  'shield': { en: 'Shield Forme', ja: 'シールドフォルム' },
  'unbound': { en: 'Unbound', ja: 'ときはなたれし' },
  'confined': { en: 'Confined', ja: 'いましめられし' },
  'complete': { en: 'Complete Forme', ja: 'パーフェクトフォルム' },
  '10-percent': { en: '10% Forme', ja: '10%フォルム' },
  '50-percent': { en: '50% Forme', ja: '50%フォルム' },
  'dusk-mane': { en: 'Dusk Mane', ja: 'たそがれのたてがみ' },
  'dawn-wings': { en: 'Dawn Wings', ja: 'あかつきのつばさ' },
  'ultra': { en: 'Ultra', ja: 'ウルトラ' },
  'red-meteor': { en: 'Red Meteor', ja: 'あかいいんせき' },
  'blue-meteor': { en: 'Blue Meteor', ja: 'あおいいんせき' },
  'yellow-meteor': { en: 'Yellow Meteor', ja: 'きいろいいんせき' },
  'green-meteor': { en: 'Green Meteor', ja: 'みどりのいんせき' },
  'orange-meteor': { en: 'Orange Meteor', ja: 'オレンジいんせき' },
  'indigo-meteor': { en: 'Indigo Meteor', ja: 'あいいろのいんせき' },
  'violet-meteor': { en: 'Violet Meteor', ja: 'むらさきのいんせき' },
};

// Badge colors for different form categories
export const FORM_BADGE_COLORS: Record<FormCategory, string> = {
  regional: 'bg-green-100 text-green-800',
  mega: 'bg-purple-100 text-purple-800',
  gigantamax: 'bg-red-100 text-red-800',
  special: 'bg-blue-100 text-blue-800',
};

// Form priorities for sorting (lower number = higher priority)
export const FORM_PRIORITIES: Record<FormCategory, number> = {
  regional: 1,
  mega: 2,
  gigantamax: 3,
  special: 4,
};

// Helper functions for form data access
export const getFormTranslationByKey = (key: string): FormTranslation | null => {
  return REGIONAL_FORM_TRANSLATIONS[key] || 
         MEGA_FORM_TRANSLATIONS[key] || 
         GIGANTAMAX_FORM_TRANSLATIONS[key] || 
         SPECIAL_FORM_TRANSLATIONS[key] || 
         null;
};

export const getFormCategory = (formName: string): FormCategory | null => {
  if (Object.keys(REGIONAL_FORM_TRANSLATIONS).some(key => formName.includes(key))) {
    return 'regional';
  }
  if (Object.keys(MEGA_FORM_TRANSLATIONS).some(key => formName.includes(key))) {
    return 'mega';
  }
  if (Object.keys(GIGANTAMAX_FORM_TRANSLATIONS).some(key => formName.includes(key))) {
    return 'gigantamax';
  }
  if (Object.keys(SPECIAL_FORM_TRANSLATIONS).some(key => formName.includes(key))) {
    return 'special';
  }
  return null;
};

export const getFormBadgeColor = (formName: string): string => {
  const category = getFormCategory(formName);
  return category ? FORM_BADGE_COLORS[category] : 'bg-gray-100 text-gray-800';
};

export const getFormPriority = (formName: string | undefined): number => {
  if (!formName || formName === 'default') return 0;
  const category = getFormCategory(formName);
  return category ? FORM_PRIORITIES[category] : 4;
};