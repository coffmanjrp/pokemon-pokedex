import { Pokemon } from '@/types/pokemon';
import React from 'react';

/**
 * Get Pokemon name in the specified language
 * Falls back to English name if target language is not available
 */
export function getPokemonName(pokemon: Pokemon, language: 'en' | 'ja'): string {
  if (language === 'en' || !pokemon.species?.names) {
    return pokemon.name;
  }

  // Find Japanese name from species data
  const japaneseName = pokemon.species.names.find(
    nameEntry => nameEntry.language.name === 'ja' || nameEntry.language.name === 'ja-Hrkt'
  );

  return japaneseName?.name || pokemon.name;
}

/**
 * Get Pokemon description in the specified language
 * Returns the most recent flavor text entry for the target language
 */
export function getPokemonDescription(pokemon: Pokemon, language: 'en' | 'ja'): string {
  if (!pokemon.species?.flavorTextEntries) {
    return '';
  }

  const targetLanguage = language === 'ja' ? 'ja' : 'en';
  
  // Filter entries by language and get the most recent one
  const languageEntries = pokemon.species.flavorTextEntries.filter(
    entry => entry.language.name === targetLanguage || 
             (targetLanguage === 'ja' && entry.language.name === 'ja-Hrkt')
  );

  if (languageEntries.length === 0) {
    // Fallback to English if target language not available
    const englishEntries = pokemon.species.flavorTextEntries.filter(
      entry => entry.language.name === 'en'
    );
    return englishEntries[englishEntries.length - 1]?.flavorText.replace(/\f/g, ' ') || '';
  }

  // Return the most recent entry and clean up formatting
  return languageEntries[languageEntries.length - 1]?.flavorText.replace(/\f/g, ' ') || '';
}

/**
 * Get Pokemon genus (category) in the specified language
 */
export function getPokemonGenus(pokemon: Pokemon, language: 'en' | 'ja'): string {
  if (!pokemon.species?.genera) {
    return '';
  }

  const targetLanguage = language === 'ja' ? 'ja' : 'en';
  
  const genus = pokemon.species.genera.find(
    genusEntry => genusEntry.language.name === targetLanguage ||
                  (targetLanguage === 'ja' && genusEntry.language.name === 'ja-Hrkt')
  );

  return genus?.genus || '';
}

/**
 * Type name translations
 * PokeAPI types are always in English, so we need manual translation
 */
export const TYPE_TRANSLATIONS: Record<string, { en: string; ja: string }> = {
  normal: { en: 'Normal', ja: 'ノーマル' },
  fire: { en: 'Fire', ja: 'ほのお' },
  water: { en: 'Water', ja: 'みず' },
  electric: { en: 'Electric', ja: 'でんき' },
  grass: { en: 'Grass', ja: 'くさ' },
  ice: { en: 'Ice', ja: 'こおり' },
  fighting: { en: 'Fighting', ja: 'かくとう' },
  poison: { en: 'Poison', ja: 'どく' },
  ground: { en: 'Ground', ja: 'じめん' },
  flying: { en: 'Flying', ja: 'ひこう' },
  psychic: { en: 'Psychic', ja: 'エスパー' },
  bug: { en: 'Bug', ja: 'むし' },
  rock: { en: 'Rock', ja: 'いわ' },
  ghost: { en: 'Ghost', ja: 'ゴースト' },
  dragon: { en: 'Dragon', ja: 'ドラゴン' },
  dark: { en: 'Dark', ja: 'あく' },
  steel: { en: 'Steel', ja: 'はがね' },
  fairy: { en: 'Fairy', ja: 'フェアリー' },
};

/**
 * Get translated type name
 */
export function getTypeName(typeName: string, language: 'en' | 'ja'): string {
  const translation = TYPE_TRANSLATIONS[typeName.toLowerCase()];
  return translation ? translation[language] : typeName;
}

/**
 * Stat name translations
 */
export const STAT_TRANSLATIONS: Record<string, { en: string; ja: string }> = {
  hp: { en: 'HP', ja: 'HP' },
  attack: { en: 'Attack', ja: 'こうげき' },
  defense: { en: 'Defense', ja: 'ぼうぎょ' },
  'special-attack': { en: 'Sp. Attack', ja: 'とくこう' },
  'special-defense': { en: 'Sp. Defense', ja: 'とくぼう' },
  speed: { en: 'Speed', ja: 'すばやさ' },
};

/**
 * Get translated stat name
 */
export function getStatName(statName: string, language: 'en' | 'ja'): string {
  const translation = STAT_TRANSLATIONS[statName.toLowerCase()];
  return translation ? translation[language] : statName;
}

/**
 * Move learn method translations
 */
export const MOVE_LEARN_METHOD_TRANSLATIONS: Record<string, { en: string; ja: string }> = {
  'level-up': { en: 'Level Up', ja: 'レベルアップ' },
  'machine': { en: 'TM/TR', ja: 'わざマシン' },
  'egg': { en: 'Egg Moves', ja: 'タマゴわざ' },
  'tutor': { en: 'Move Tutor', ja: 'おしえわざ' },
  'light-ball-egg': { en: 'Egg (Light Ball)', ja: 'タマゴわざ (でんきだま)' },
  'colosseum-purification': { en: 'Purification', ja: 'スナッチング' },
  'xd-shadow': { en: 'Shadow', ja: 'ダーク' },
  'xd-purification': { en: 'Purification', ja: 'リライブ' },
  'form-change': { en: 'Form Change', ja: 'フォルムチェンジ' },
};

/**
 * Get translated move learn method
 */
export function getMoveLearnMethodName(methodName: string, language: 'en' | 'ja'): string {
  const translation = MOVE_LEARN_METHOD_TRANSLATIONS[methodName.toLowerCase()];
  return translation ? translation[language] : methodName;
}

/**
 * Format move name - removes hyphens and capitalizes
 */
export function formatMoveName(moveName: string): string {
  return moveName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Ability name translations
 * Common Pokemon abilities in Japanese
 */
export const ABILITY_TRANSLATIONS: Record<string, { en: string; ja: string }> = {
  'overgrow': { en: 'Overgrow', ja: 'しんりょく' },
  'chlorophyll': { en: 'Chlorophyll', ja: 'ようりょくそ' },
  'blaze': { en: 'Blaze', ja: 'もうか' },
  'solar-power': { en: 'Solar Power', ja: 'サンパワー' },
  'torrent': { en: 'Torrent', ja: 'げきりゅう' },
  'rain-dish': { en: 'Rain Dish', ja: 'あめうけざら' },
  'shield-dust': { en: 'Shield Dust', ja: 'りんぷん' },
  'compound-eyes': { en: 'Compound Eyes', ja: 'ふくがん' },
  'tinted-lens': { en: 'Tinted Lens', ja: 'いろめがね' },
  'swarm': { en: 'Swarm', ja: 'むしのしらせ' },
  'keen-eye': { en: 'Keen Eye', ja: 'するどいめ' },
  'tangled-feet': { en: 'Tangled Feet', ja: 'ちどりあし' },
  'big-pecks': { en: 'Big Pecks', ja: 'はとむね' },
  'intimidate': { en: 'Intimidate', ja: 'いかく' },
  'shed-skin': { en: 'Shed Skin', ja: 'だっぴ' },
  'wonder-skin': { en: 'Wonder Skin', ja: 'ミラクルスキン' },
  'static': { en: 'Static', ja: 'せいでんき' },
  'lightning-rod': { en: 'Lightning Rod', ja: 'ひらいしん' },
  'sand-veil': { en: 'Sand Veil', ja: 'すながくれ' },
  'sand-rush': { en: 'Sand Rush', ja: 'すなかき' },
  'poison-point': { en: 'Poison Point', ja: 'どくのトゲ' },
  'rivalry': { en: 'Rivalry', ja: 'とうそうしん' },
  'sheer-force': { en: 'Sheer Force', ja: 'ちからずく' },
  'cute-charm': { en: 'Cute Charm', ja: 'メロメロボディ' },
  'magic-guard': { en: 'Magic Guard', ja: 'マジックガード' },
  'unaware': { en: 'Unaware', ja: 'てんねん' },
  'flash-fire': { en: 'Flash Fire', ja: 'もらいび' },
  'flame-body': { en: 'Flame Body', ja: 'ほのおのからだ' },
  'water-absorb': { en: 'Water Absorb', ja: 'ちょすい' },
  'damp': { en: 'Damp', ja: 'しめりけ' },
  'thick-fat': { en: 'Thick Fat', ja: 'あついしぼう' },
  'synchronize': { en: 'Synchronize', ja: 'シンクロ' },
  'inner-focus': { en: 'Inner Focus', ja: 'せいしんりょく' },
  'steadfast': { en: 'Steadfast', ja: 'ふくつのこころ' },
  'limber': { en: 'Limber', ja: 'じゅうなん' },
  'imposter': { en: 'Imposter', ja: 'かわりもの' },
  'insomnia': { en: 'Insomnia', ja: 'ふみん' },
  'forewarn': { en: 'Forewarn', ja: 'よちむ' },
  'own-tempo': { en: 'Own Tempo', ja: 'マイペース' },
  'technician': { en: 'Technician', ja: 'テクニシャン' },
  'skill-link': { en: 'Skill Link', ja: 'スキルリンク' },
  'sturdy': { en: 'Sturdy', ja: 'がんじょう' },
  'rock-head': { en: 'Rock Head', ja: 'いしあたま' },
  'weak-armor': { en: 'Weak Armor', ja: 'くだけるよろい' },
  'magnet-pull': { en: 'Magnet Pull', ja: 'じりょく' },
  'analytic': { en: 'Analytic', ja: 'アナライズ' },
  'vital-spirit': { en: 'Vital Spirit', ja: 'やるき' },
  'anger-point': { en: 'Anger Point', ja: 'いかりのつぼ' },
  'defiant': { en: 'Defiant', ja: 'まけんき' },
  'guts': { en: 'Guts', ja: 'こんじょう' },
  'hustle': { en: 'Hustle', ja: 'はりきり' },
  'pressure': { en: 'Pressure', ja: 'プレッシャー' },
  'multiscale': { en: 'Multiscale', ja: 'マルチスケイル' },
  'unnerve': { en: 'Unnerve', ja: 'きんちょうかん' },
};

/**
 * Get translated ability name
 */
export function getAbilityName(abilityName: string, language: 'en' | 'ja'): string {
  const translation = ABILITY_TRANSLATIONS[abilityName.toLowerCase()];
  if (translation) {
    return translation[language];
  }
  
  // Fallback: format the English name
  return abilityName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Game version translations
 */
export const VERSION_TRANSLATIONS: Record<string, { en: string; ja: string }> = {
  'red': { en: 'Red', ja: 'あか' },
  'blue': { en: 'Blue', ja: 'あお' },
  'yellow': { en: 'Yellow', ja: 'きいろ' },
  'gold': { en: 'Gold', ja: 'きん' },
  'silver': { en: 'Silver', ja: 'ぎん' },
  'crystal': { en: 'Crystal', ja: 'クリスタル' },
  'ruby': { en: 'Ruby', ja: 'ルビー' },
  'sapphire': { en: 'Sapphire', ja: 'サファイア' },
  'emerald': { en: 'Emerald', ja: 'エメラルド' },
  'firered': { en: 'FireRed', ja: 'ファイアレッド' },
  'leafgreen': { en: 'LeafGreen', ja: 'リーフグリーン' },
  'diamond': { en: 'Diamond', ja: 'ダイヤモンド' },
  'pearl': { en: 'Pearl', ja: 'パール' },
  'platinum': { en: 'Platinum', ja: 'プラチナ' },
  'heartgold': { en: 'HeartGold', ja: 'ハートゴールド' },
  'soulsilver': { en: 'SoulSilver', ja: 'ソウルシルバー' },
  'black': { en: 'Black', ja: 'ブラック' },
  'white': { en: 'White', ja: 'ホワイト' },
  'black-2': { en: 'Black 2', ja: 'ブラック2' },
  'white-2': { en: 'White 2', ja: 'ホワイト2' },
  'x': { en: 'X', ja: 'X' },
  'y': { en: 'Y', ja: 'Y' },
  'omega-ruby': { en: 'Omega Ruby', ja: 'オメガルビー' },
  'alpha-sapphire': { en: 'Alpha Sapphire', ja: 'アルファサファイア' },
  'sun': { en: 'Sun', ja: 'サン' },
  'moon': { en: 'Moon', ja: 'ムーン' },
  'ultra-sun': { en: 'Ultra Sun', ja: 'ウルトラサン' },
  'ultra-moon': { en: 'Ultra Moon', ja: 'ウルトラムーン' },
  'sword': { en: 'Sword', ja: 'ソード' },
  'shield': { en: 'Shield', ja: 'シールド' },
  'brilliant-diamond': { en: 'Brilliant Diamond', ja: 'ブリリアントダイヤモンド' },
  'shining-pearl': { en: 'Shining Pearl', ja: 'シャイニングパール' },
  'legends-arceus': { en: 'Legends: Arceus', ja: 'レジェンズアルセウス' },
  'scarlet': { en: 'Scarlet', ja: 'スカーレット' },
  'violet': { en: 'Violet', ja: 'バイオレット' },
};

/**
 * Get translated version name
 */
export function getVersionName(versionName: string, language: 'en' | 'ja'): string {
  const translation = VERSION_TRANSLATIONS[versionName.toLowerCase()];
  if (translation) {
    return translation[language];
  }
  
  // Fallback: capitalize the English name
  return versionName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get translated generation name
 */
export function getGenerationName(generationName: string, language: 'en' | 'ja'): string {
  const genNumber = generationName.replace('generation-', '');
  const romanToNumber: Record<string, string> = {
    'i': '1', 'ii': '2', 'iii': '3', 'iv': '4', 'v': '5',
    'vi': '6', 'vii': '7', 'viii': '8', 'ix': '9'
  };
  
  const number = romanToNumber[genNumber] || genNumber;
  
  if (language === 'ja') {
    return `第${number}世代`;
  } else {
    return `Generation ${number.toUpperCase()}`;
  }
}

/**
 * Get Pokemon's primary type color for background styling
 */
export function getPrimaryTypeColor(pokemon: Pokemon): string {
  if (!pokemon.types || pokemon.types.length === 0) {
    return '#A8A878'; // Default to normal type color
  }
  
  const primaryType = pokemon.types[0].type.name;
  return TYPE_TRANSLATIONS[primaryType.toLowerCase()] ? 
    getTypeColorFromName(primaryType) : '#A8A878';
}

/**
 * Get type color by type name
 */
export function getTypeColorFromName(typeName: string): string {
  const typeColorMap: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  
  return typeColorMap[typeName.toLowerCase()] || '#A8A878';
}

/**
 * Generate gradient background style based on Pokemon's primary type
 */
export function generateTypeBackgroundStyle(pokemon: Pokemon): React.CSSProperties {
  const primaryColor = getPrimaryTypeColor(pokemon);
  
  // Create a subtle gradient with the type color
  return {
    background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}08 50%, #f9fafb 100%)`,
    minHeight: '100vh',
  };
}

/**
 * Generate full-page background overlay style for Pokemon detail pages
 */
export function generateFullPageBackgroundStyle(pokemon: Pokemon): React.CSSProperties {
  const primaryColor = getPrimaryTypeColor(pokemon);
  
  // Create a full-page background overlay that covers margin/padding areas
  return {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}08 50%, #f9fafb 100%)`,
    zIndex: -1,
    pointerEvents: 'none',
  };
}