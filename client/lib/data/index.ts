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
  REGIONAL_FORM_TRANSLATIONS,
  MEGA_FORM_TRANSLATIONS,
  GIGANTAMAX_FORM_TRANSLATIONS,
  SPECIAL_FORM_TRANSLATIONS,
  FORM_BADGE_COLORS,
  FORM_PRIORITIES,
  getFormTranslationByKey,
  getFormCategory,
  getFormBadgeColor,
  getFormPriority,
} from "./formTranslations";
export type {
  FormTranslation,
  FormCategory,
  FormData,
} from "./formTranslations";

export {
  TYPE_TRANSLATIONS,
  TYPE_COLORS,
  TYPE_DATA,
  getTypeName,
  getTypeColor,
} from "./typeTranslations";
export type { TypeData } from "./typeTranslations";
