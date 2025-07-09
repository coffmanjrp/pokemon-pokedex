// Export all data files
export {
  GENERATIONS,
  getGenerationById,
  getGenerationByGame,
  getGenerationByPokemonId,
  getGenerationName,
  getGenerationRegion,
  isRemakeGame,
} from "./generations";
export type { GenerationData } from "./generations";

// Export unified type system
export {
  POKEMON_TYPES,
  TYPE_COLORS,
  TYPE_EFFECTIVENESS,
  TYPE_EFFECTS,
} from "./types";
export type { PokemonTypeName, TypeEffectKey } from "./types";

// Export type utility functions
export {
  getAllPokemonTypes,
  isPokemonType,
  getTypeColor,
  getTypeColorByName,
  getTypeWeaknesses,
  getTypeEffects,
  isWeakTo,
  getDamageMultiplier,
} from "../utils/typeUtils";

// Export language options
export { LANGUAGE_OPTIONS } from "./languages";
export type { LanguageOption, LanguageLabels } from "./languages";

// Export badge data and functions
export {
  POKEMON_BADGE_COLORS,
  getClassificationColor,
  getFormColor,
  getClassificationBadge,
  getFormBadge,
  getBadgeInfo,
} from "../utils/pokemonBadgeUtils";
export type {
  BadgeColors,
  BadgeInfo,
  BadgeVariant,
  BadgeSize,
} from "../utils/pokemonBadgeUtils";
