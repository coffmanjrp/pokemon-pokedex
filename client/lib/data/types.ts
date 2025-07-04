/**
 * Pokemon type system - unified definitions
 * Contains all type-related data: names, colors, effectiveness, and effects
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

// All 18 Pokemon types in canonical order
export const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

// Type for Pokemon type names
export type PokemonTypeName = (typeof POKEMON_TYPES)[number];

// Type for type effect animations
export type TypeEffectKey = keyof typeof TYPE_EFFECTS;

// =============================================================================
// TYPE COLORS
// =============================================================================

// Pokemon type colors (official Pokemon game colors)
export const TYPE_COLORS: Record<PokemonTypeName, string> = {
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
} as const;

// =============================================================================
// TYPE EFFECTIVENESS
// =============================================================================

// Type weaknesses - what types each type is weak to
export const TYPE_EFFECTIVENESS: Record<PokemonTypeName, PokemonTypeName[]> = {
  normal: ["fighting"],
  fire: ["water", "ground", "rock"],
  water: ["electric", "grass"],
  electric: ["ground"],
  grass: ["fire", "ice", "poison", "flying", "bug"],
  ice: ["fire", "fighting", "rock", "steel"],
  fighting: ["flying", "psychic", "fairy"],
  poison: ["ground", "psychic"],
  ground: ["water", "grass", "ice"],
  flying: ["electric", "ice", "rock"],
  psychic: ["bug", "ghost", "dark"],
  bug: ["fire", "flying", "rock"],
  rock: ["water", "grass", "fighting", "ground", "steel"],
  ghost: ["ghost", "dark"],
  dragon: ["ice", "dragon", "fairy"],
  dark: ["fighting", "bug", "fairy"],
  steel: ["fire", "fighting", "ground"],
  fairy: ["poison", "steel"],
} as const;

// =============================================================================
// TYPE EFFECTS (ANIMATION)
// =============================================================================

// Pokemon type-based particle effects for animations
// Each type has an array of emoji symbols that represent that type's essence
export const TYPE_EFFECTS = {
  fire: ["🔥", "✨", "💥"],
  water: ["💧", "🌊", "💎"],
  grass: ["🌿", "🍃", "✨"],
  electric: ["⚡", "✨", "💥"],
  psychic: ["🌟", "✨", "🔮"],
  ice: ["❄️", "💎", "✨"],
  dragon: ["🌟", "💥", "⭐"],
  dark: ["🌙", "✨", "🖤"],
  fairy: ["✨", "🌟", "💖"],
  fighting: ["💥", "👊", "✨"],
  poison: ["💜", "☠️", "✨"],
  ground: ["🌍", "💥", "✨"],
  flying: ["🌪️", "💨", "✨"],
  bug: ["🐛", "✨", "🍃"],
  rock: ["🗿", "💥", "✨"],
  ghost: ["👻", "🌙", "✨"],
  steel: ["⚙️", "💎", "✨"],
  normal: ["✨", "🌟", "💫"],
} as const;
