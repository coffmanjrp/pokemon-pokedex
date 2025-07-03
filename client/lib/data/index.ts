// Export all data files
export { TYPE_EFFECTS } from "./typeEffects";
export type { TypeEffectKey } from "./typeEffects";

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

export {
  TYPE_TRANSLATIONS,
  TYPE_COLORS,
  TYPE_DATA,
  getTypeName,
  getTypeColor,
} from "./typeTranslations";
export type { TypeData } from "./typeTranslations";
