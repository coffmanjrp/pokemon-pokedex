import { Pokemon, EvolutionDetail, Move } from '@/types/pokemon';
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
 * Get Pokemon name from evolution detail in the specified language
 * Falls back to English name if target language is not available
 */
export function getEvolutionPokemonName(evolutionDetail: EvolutionDetail, language: 'en' | 'ja'): string {
  if (language === 'en' || !evolutionDetail.species?.names) {
    return evolutionDetail.name;
  }

  // Find Japanese name from species data
  const japaneseName = evolutionDetail.species.names.find(
    nameEntry => nameEntry.language.name === 'ja' || nameEntry.language.name === 'ja-Hrkt'
  );

  return japaneseName?.name || evolutionDetail.name;
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
  return getTypeColorFromName(primaryType);
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
    zIndex: -10,
    pointerEvents: 'none',
  };
}

/**
 * Convert hex color to rgba with opacity
 */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Get the background gradient as a CSS string for body styling
 */
export function getTypeBackgroundGradient(pokemon: Pokemon): string {
  const primaryColor = getPrimaryTypeColor(pokemon);
  
  // Convert to rgba with proper opacity values
  const colorWithAlpha1 = hexToRgba(primaryColor, 0.15); // 15% opacity
  const colorWithAlpha2 = hexToRgba(primaryColor, 0.08); // 8% opacity
  
  return `linear-gradient(135deg, ${colorWithAlpha1} 0%, ${colorWithAlpha2} 50%, #f9fafb 100%)`;
}

/**
 * Type effectiveness chart - each type's weaknesses (what they take super effective damage from)
 */
const TYPE_EFFECTIVENESS: Record<string, string[]> = {
  normal: ['fighting'],
  fire: ['water', 'ground', 'rock'],
  water: ['electric', 'grass'],
  electric: ['ground'],
  grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
  ice: ['fire', 'fighting', 'rock', 'steel'],
  fighting: ['flying', 'psychic', 'fairy'],
  poison: ['ground', 'psychic'],
  ground: ['water', 'grass', 'ice'],
  flying: ['electric', 'ice', 'rock'],
  psychic: ['bug', 'ghost', 'dark'],
  bug: ['fire', 'flying', 'rock'],
  rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
  ghost: ['ghost', 'dark'],
  dragon: ['ice', 'dragon', 'fairy'],
  dark: ['fighting', 'bug', 'fairy'],
  steel: ['fire', 'fighting', 'ground'],
  fairy: ['poison', 'steel']
};

/**
 * Get Pokemon's type weaknesses (types that deal super effective damage)
 */
export function getPokemonWeaknesses(pokemon: Pokemon): string[] {
  if (!pokemon.types || pokemon.types.length === 0) {
    return [];
  }

  // Get all weaknesses from Pokemon's types
  const allWeaknesses = pokemon.types.flatMap(typeSlot => 
    TYPE_EFFECTIVENESS[typeSlot.type.name.toLowerCase()] || []
  );

  // Remove duplicates and return unique weaknesses
  return [...new Set(allWeaknesses)];
}

/**
 * Get sprite URL for normal or shiny version
 */
export function getPokemonSpriteUrl(pokemon: Pokemon, isShiny: boolean = false): string {
  if (isShiny) {
    return (
      pokemon.sprites.other?.officialArtwork?.frontShiny ||
      pokemon.sprites.other?.home?.frontShiny ||
      pokemon.sprites.frontShiny ||
      pokemon.sprites.other?.officialArtwork?.frontDefault ||
      pokemon.sprites.other?.home?.frontDefault ||
      pokemon.sprites.frontDefault ||
      '/placeholder-pokemon.png'
    );
  }
  
  return (
    pokemon.sprites.other?.officialArtwork?.frontDefault ||
    pokemon.sprites.other?.home?.frontDefault ||
    pokemon.sprites.frontDefault ||
    '/placeholder-pokemon.png'
  );
}

/**
 * Move name translations for common moves
 */
export const MOVE_TRANSLATIONS: Record<string, { en: string; ja: string }> = {
  'tackle': { en: 'Tackle', ja: 'たいあたり' },
  'growl': { en: 'Growl', ja: 'なきごえ' },
  'vine-whip': { en: 'Vine Whip', ja: 'つるのムチ' },
  'leech-seed': { en: 'Leech Seed', ja: 'やどりぎのタネ' },
  'razor-leaf': { en: 'Razor Leaf', ja: 'はっぱカッター' },
  'poison-powder': { en: 'Poison Powder', ja: 'どくのこな' },
  'sleep-powder': { en: 'Sleep Powder', ja: 'ねむりごな' },
  'petal-dance': { en: 'Petal Dance', ja: 'はなびらのまい' },
  'string-shot': { en: 'String Shot', ja: 'いとをはく' },
  'ember': { en: 'Ember', ja: 'ひのこ' },
  'flamethrower': { en: 'Flamethrower', ja: 'かえんほうしゃ' },
  'fire-spin': { en: 'Fire Spin', ja: 'かえんぐるま' },
  'scratch': { en: 'Scratch', ja: 'ひっかく' },
  'dragon-rage': { en: 'Dragon Rage', ja: 'りゅうのいかり' },
  'fire-blast': { en: 'Fire Blast', ja: 'だいもんじ' },
  'water-gun': { en: 'Water Gun', ja: 'みずでっぽう' },
  'hydro-pump': { en: 'Hydro Pump', ja: 'ハイドロポンプ' },
  'surf': { en: 'Surf', ja: 'なみのり' },
  'ice-beam': { en: 'Ice Beam', ja: 'れいとうビーム' },
  'blizzard': { en: 'Blizzard', ja: 'ふぶき' },
  'bubble-beam': { en: 'Bubble Beam', ja: 'バブルこうせん' },
  'aurora-beam': { en: 'Aurora Beam', ja: 'オーロラビーム' },
  'hyper-beam': { en: 'Hyper Beam', ja: 'はかいこうせん' },
  'peck': { en: 'Peck', ja: 'つつく' },
  'drill-peck': { en: 'Drill Peck', ja: 'ドリルくちばし' },
  'thunder-shock': { en: 'Thunder Shock', ja: 'でんきショック' },
  'thunderbolt': { en: 'Thunderbolt', ja: '10まんボルト' },
  'thunder-wave': { en: 'Thunder Wave', ja: 'でんじは' },
  'thunder': { en: 'Thunder', ja: 'かみなり' },
  'rock-throw': { en: 'Rock Throw', ja: 'いわおとし' },
  'earthquake': { en: 'Earthquake', ja: 'じしん' },
  'dig': { en: 'Dig', ja: 'あなをほる' },
  'toxic': { en: 'Toxic', ja: 'どくどく' },
  'psychic': { en: 'Psychic', ja: 'サイコキネシス' },
  'hypnosis': { en: 'Hypnosis', ja: 'さいみんじゅつ' },
  'meditate': { en: 'Meditate', ja: 'ヨガのポーズ' },
  'agility': { en: 'Agility', ja: 'こうそくいどう' },
  'quick-attack': { en: 'Quick Attack', ja: 'でんこうせっか' },
  'rage': { en: 'Rage', ja: 'いかり' },
  'teleport': { en: 'Teleport', ja: 'テレポート' },
  'night-shade': { en: 'Night Shade', ja: 'ナイトヘッド' },
  'mimic': { en: 'Mimic', ja: 'ものまね' },
  'screech': { en: 'Screech', ja: 'きんぞくおん' },
  'double-team': { en: 'Double Team', ja: 'かげぶんしん' },
  'recover': { en: 'Recover', ja: 'じこさいせい' },
  'harden': { en: 'Harden', ja: 'かたくなる' },
  'minimize': { en: 'Minimize', ja: 'ちいさくなる' },
  'smokescreen': { en: 'Smokescreen', ja: 'えんまく' },
  'confuse-ray': { en: 'Confuse Ray', ja: 'あやしいひかり' },
  'withdraw': { en: 'Withdraw', ja: 'からにこもる' },
  'defense-curl': { en: 'Defense Curl', ja: 'まるくなる' },
  'barrier': { en: 'Barrier', ja: 'バリアー' },
  'light-screen': { en: 'Light Screen', ja: 'ひかりのかべ' },
  'haze': { en: 'Haze', ja: 'くろいきり' },
  'reflect': { en: 'Reflect', ja: 'リフレクター' },
  'focus-energy': { en: 'Focus Energy', ja: 'きあいだめ' },
  'bide': { en: 'Bide', ja: 'がまん' },
  'metronome': { en: 'Metronome', ja: 'ゆびをふる' },
  'mirror-move': { en: 'Mirror Move', ja: 'オウムがえし' },
  'self-destruct': { en: 'Self-Destruct', ja: 'じばく' },
  'egg-bomb': { en: 'Egg Bomb', ja: 'タマゴばくだん' },
  'lick': { en: 'Lick', ja: 'したでなめる' },
  'smog': { en: 'Smog', ja: 'スモッグ' },
  'sludge': { en: 'Sludge', ja: 'ヘドロこうげき' },
  'bone-club': { en: 'Bone Club', ja: 'ホネこんぼう' },
  'fire-punch': { en: 'Fire Punch', ja: 'ほのおのパンチ' },
  'ice-punch': { en: 'Ice Punch', ja: 'れいとうパンチ' },
  'thunder-punch': { en: 'Thunder Punch', ja: 'かみなりパンチ' },
  'slash': { en: 'Slash', ja: 'きりさく' },
  'substitute': { en: 'Substitute', ja: 'みがわり' },
  'struggle': { en: 'Struggle', ja: 'わるあがき' },
  'sketch': { en: 'Sketch', ja: 'スケッチ' },
  'triple-kick': { en: 'Triple Kick', ja: 'トリプルキック' },
  'thief': { en: 'Thief', ja: 'どろぼう' },
  'spider-web': { en: 'Spider Web', ja: 'クモのす' },
  'mind-reader': { en: 'Mind Reader', ja: 'こころのめ' },
  'nightmare': { en: 'Nightmare', ja: 'あくむ' },
  'flame-wheel': { en: 'Flame Wheel', ja: 'かえんぐるま' },
  'snore': { en: 'Snore', ja: 'いびき' },
  'curse': { en: 'Curse', ja: 'のろい' },
  'flail': { en: 'Flail', ja: 'じたばた' },
  'conversion-2': { en: 'Conversion 2', ja: 'テクスチャー2' },
  'aeroblast': { en: 'Aeroblast', ja: 'エアロブラスト' },
  'cotton-spore': { en: 'Cotton Spore', ja: 'わたほうし' },
  'reversal': { en: 'Reversal', ja: 'きしかいせい' },
  'spite': { en: 'Spite', ja: 'うらみ' },
  'powder-snow': { en: 'Powder Snow', ja: 'こなゆき' },
  'protect': { en: 'Protect', ja: 'まもる' },
  'mach-punch': { en: 'Mach Punch', ja: 'マッハパンチ' },
  'scary-face': { en: 'Scary Face', ja: 'こわいかお' },
  'feint-attack': { en: 'Feint Attack', ja: 'だましうち' },
  'sweet-kiss': { en: 'Sweet Kiss', ja: 'てんしのキッス' },
  'belly-drum': { en: 'Belly Drum', ja: 'はらだいこ' },
  'sludge-bomb': { en: 'Sludge Bomb', ja: 'ヘドロばくだん' },
  'mud-slap': { en: 'Mud-Slap', ja: 'どろかけ' },
  'octazooka': { en: 'Octazooka', ja: 'オクタンほう' },
  'spikes': { en: 'Spikes', ja: 'まきびし' },
  'zap-cannon': { en: 'Zap Cannon', ja: 'でんじほう' },
  'foresight': { en: 'Foresight', ja: 'みやぶる' },
  'destiny-bond': { en: 'Destiny Bond', ja: 'みちづれ' },
  'perish-song': { en: 'Perish Song', ja: 'ほろびのうた' },
  'icy-wind': { en: 'Icy Wind', ja: 'こごえるかぜ' },
  'detect': { en: 'Detect', ja: 'みきり' },
  'bone-rush': { en: 'Bone Rush', ja: 'ホネブーメラン' },
  'lock-on': { en: 'Lock-On', ja: 'ロックオン' },
  'outrage': { en: 'Outrage', ja: 'げきりん' },
  'sandstorm': { en: 'Sandstorm', ja: 'すなあらし' },
  'giga-drain': { en: 'Giga Drain', ja: 'ギガドレイン' },
  'endure': { en: 'Endure', ja: 'こらえる' },
  'charm': { en: 'Charm', ja: 'あまえる' },
  'rollout': { en: 'Rollout', ja: 'ころがる' },
  'false-swipe': { en: 'False Swipe', ja: 'みねうち' },
  'swagger': { en: 'Swagger', ja: 'いばる' },
  'milk-drink': { en: 'Milk Drink', ja: 'ミルクのみ' },
  'spark': { en: 'Spark', ja: 'スパーク' },
  'fury-cutter': { en: 'Fury Cutter', ja: 'れんぞくぎり' },
  'steel-wing': { en: 'Steel Wing', ja: 'はがねのつばさ' },
  'mean-look': { en: 'Mean Look', ja: 'くろいまなざし' },
  'attract': { en: 'Attract', ja: 'メロメロ' },
  'sleep-talk': { en: 'Sleep Talk', ja: 'ねごと' },
  'heal-bell': { en: 'Heal Bell', ja: 'いやしのすず' },
  'return': { en: 'Return', ja: 'おんがえし' },
  'present': { en: 'Present', ja: 'プレゼント' },
  'frustration': { en: 'Frustration', ja: 'やつあたり' },
  'safeguard': { en: 'Safeguard', ja: 'しんぴのまもり' },
  'pain-split': { en: 'Pain Split', ja: 'いたみわけ' },
  'sacred-fire': { en: 'Sacred Fire', ja: 'せいなるほのお' },
  'magnitude': { en: 'Magnitude', ja: 'マグニチュード' },
  'dynamic-punch': { en: 'Dynamic Punch', ja: 'ばくれつパンチ' },
  'megahorn': { en: 'Megahorn', ja: 'メガホーン' },
  'dragon-breath': { en: 'Dragon Breath', ja: 'りゅうのいぶき' },
  'baton-pass': { en: 'Baton Pass', ja: 'バトンタッチ' },
  'encore': { en: 'Encore', ja: 'アンコール' },
  'pursuit': { en: 'Pursuit', ja: 'おいうち' },
  'rapid-spin': { en: 'Rapid Spin', ja: 'こうそくスピン' },
  'sweet-scent': { en: 'Sweet Scent', ja: 'あまいかおり' },
  'iron-tail': { en: 'Iron Tail', ja: 'アイアンテール' },
  'metal-claw': { en: 'Metal Claw', ja: 'メタルクロー' },
  'vital-throw': { en: 'Vital Throw', ja: 'あてみなげ' },
  'morning-sun': { en: 'Morning Sun', ja: 'あさのひざし' },
  'synthesis': { en: 'Synthesis', ja: 'こうごうせい' },
  'moonlight': { en: 'Moonlight', ja: 'つきのひかり' },
  'hidden-power': { en: 'Hidden Power', ja: 'めざめるパワー' },
  'cross-chop': { en: 'Cross Chop', ja: 'クロスチョップ' },
  'twister': { en: 'Twister', ja: 'たつまき' },
  'rain-dance': { en: 'Rain Dance', ja: 'あまごい' },
  'sunny-day': { en: 'Sunny Day', ja: 'にほんばれ' },
  'crunch': { en: 'Crunch', ja: 'かみくだく' },
  'mirror-coat': { en: 'Mirror Coat', ja: 'ミラーコート' },
  'psych-up': { en: 'Psych Up', ja: 'じこあんじ' },
  'extreme-speed': { en: 'Extreme Speed', ja: 'しんそく' },
  'ancient-power': { en: 'Ancient Power', ja: 'げんしのちから' },
  'shadow-ball': { en: 'Shadow Ball', ja: 'シャドーボール' },
  'future-sight': { en: 'Future Sight', ja: 'みらいよち' },
  'rock-smash': { en: 'Rock Smash', ja: 'いわくだき' },
  'whirlpool': { en: 'Whirlpool', ja: 'うずしお' },
  'beat-up': { en: 'Beat Up', ja: 'ふくろだたき' }
};

/**
 * Get move name in the specified language
 * Prioritizes GraphQL data, falls back to manual translations, then English name
 */
export function getMoveName(move: Move, language: 'en' | 'ja'): string {
  // First, try to get name from GraphQL API data if available
  if (move.names && move.names.length > 0) {
    const targetLanguage = language === 'ja' ? ['ja', 'ja-Hrkt'] : ['en'];
    
    for (const lang of targetLanguage) {
      const languageName = move.names.find(
        nameEntry => nameEntry.language.name === lang
      );
      
      if (languageName) {
        return languageName.name;
      }
    }
  }
  
  // Fallback to manual translation table for moves not covered by API
  const moveName = move.name.toLowerCase();
  const translation = MOVE_TRANSLATIONS[moveName];
  
  if (translation) {
    return translation[language];
  }
  
  // Final fallback to formatted English name
  return move.name.charAt(0).toUpperCase() + move.name.slice(1).replace(/-/g, ' ');
}