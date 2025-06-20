import { Locale } from '@/lib/dictionaries';

// Regional form translations
export const REGIONAL_FORM_TRANSLATIONS: Record<string, { en: string; ja: string }> = {
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
export const MEGA_FORM_TRANSLATIONS: Record<string, { en: string; ja: string }> = {
  'mega-x': { en: 'Mega X', ja: 'X' },
  'mega-y': { en: 'Mega Y', ja: 'Y' },
  'mega': { en: 'Mega', ja: 'メガ' },
};

// Gigantamax form translations
export const GIGANTAMAX_FORM_TRANSLATIONS: Record<string, { en: string; ja: string }> = {
  'gmax': { en: 'Gigantamax', ja: 'キョダイマックス' },
};

// Special form translations
export const SPECIAL_FORM_TRANSLATIONS: Record<string, { en: string; ja: string }> = {
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

/**
 * Get display name for a Pokemon form
 */
export function getFormDisplayName(pokemonName: string, formName: string | undefined, language: Locale): string {
  if (!formName || formName === 'default') {
    return pokemonName;
  }

  // Helper function to capitalize Pokemon name for English
  const capitalizedPokemonName = language === 'en' ? 
    pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1) : 
    pokemonName;

  // Check for regional variants
  for (const [key, translation] of Object.entries(REGIONAL_FORM_TRANSLATIONS)) {
    if (formName.includes(key)) {
      return `${translation[language]} ${capitalizedPokemonName}`;
    }
  }

  // Check for Mega Evolution
  for (const [key, translation] of Object.entries(MEGA_FORM_TRANSLATIONS)) {
    if (formName.includes(key)) {
      return `${translation[language]} ${capitalizedPokemonName}`;
    }
  }

  // Check for Gigantamax
  for (const [key, translation] of Object.entries(GIGANTAMAX_FORM_TRANSLATIONS)) {
    if (formName.includes(key)) {
      return `${translation[language]} ${capitalizedPokemonName}`;
    }
  }

  // Check for special forms
  for (const [key, translation] of Object.entries(SPECIAL_FORM_TRANSLATIONS)) {
    if (formName.includes(key)) {
      return `${capitalizedPokemonName} (${translation[language]})`;
    }
  }

  // Default fallback - capitalize form name
  const capitalizedForm = formName.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return `${capitalizedPokemonName} (${capitalizedForm})`;
}

/**
 * Determine if a form is a regional variant
 */
export function isRegionalVariant(formName: string | undefined): boolean {
  if (!formName) return false;
  return Object.keys(REGIONAL_FORM_TRANSLATIONS).some(key => formName.includes(key));
}

/**
 * Determine if a form is a Mega Evolution
 */
export function isMegaEvolution(formName: string | undefined): boolean {
  if (!formName) return false;
  return Object.keys(MEGA_FORM_TRANSLATIONS).some(key => formName.includes(key));
}

/**
 * Determine if a form is a Gigantamax form
 */
export function isGigantamax(formName: string | undefined): boolean {
  if (!formName) return false;
  return Object.keys(GIGANTAMAX_FORM_TRANSLATIONS).some(key => formName.includes(key));
}

/**
 * Get form category for UI grouping
 */
export function getFormCategory(formName: string | undefined, language: Locale): string {
  if (!formName) return language === 'en' ? 'Normal' : 'ノーマル';
  
  if (isRegionalVariant(formName)) {
    return language === 'en' ? 'Regional Variant' : '地方のすがた';
  }
  
  if (isMegaEvolution(formName)) {
    return language === 'en' ? 'Mega Evolution' : 'メガシンカ';
  }
  
  if (isGigantamax(formName)) {
    return language === 'en' ? 'Gigantamax' : 'キョダイマックス';
  }
  
  return language === 'en' ? 'Alternative Form' : '別のすがた';
}

/**
 * Parse Pokemon ID from PokeAPI URL or name
 */
export function parsePokemonId(nameOrUrl: string): string {
  // If it's a URL, extract the ID
  if (nameOrUrl.includes('pokemon/')) {
    const matches = nameOrUrl.match(/\/pokemon\/(\d+)\//);
    return matches?.[1] || nameOrUrl;
  }
  
  // If it's a name with ID (like charizard-mega-x), try to match known patterns
  const megaMatch = nameOrUrl.match(/^(.+)-mega-?([xy]?)$/);
  if (megaMatch) {
    // This would need a mapping of base Pokemon to their Mega Evolution IDs
    // For now, return the original string
    return nameOrUrl;
  }
  
  // Regional variant patterns
  const regionalMatch = nameOrUrl.match(/^(.+)-(alolan|galarian|hisuian|paldean)$/);
  if (regionalMatch) {
    // This would need a mapping of base Pokemon to their regional variant IDs
    // For now, return the original string
    return nameOrUrl;
  }
  
  return nameOrUrl;
}

/**
 * Get form priority for sorting (lower number = higher priority)
 */
export function getFormPriority(formName: string | undefined): number {
  if (!formName || formName === 'default') return 0;
  if (isRegionalVariant(formName)) return 1;
  if (isMegaEvolution(formName)) return 2;
  if (isGigantamax(formName)) return 3;
  return 4;
}