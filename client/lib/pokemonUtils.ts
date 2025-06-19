import { Pokemon, PokemonSpecies, SpeciesName, FlavorTextEntry } from '@/types/pokemon';

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