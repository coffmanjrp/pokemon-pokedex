// Main lib exports - form-related functionality
export {
  FORM_BADGE_COLORS,
  FORM_PRIORITIES,
  getFormCategory,
  getFormBadgeColor,
  getFormPriority,
  isRegionalVariant,
  isMegaEvolution,
  isGigantamax,
  isSpecialForm,
} from "./forms";

export type { FormTranslation, FormCategory, FormData } from "./forms";

// Re-export form utilities
export {
  getFormDisplayName,
  getFormCategoryForUI,
  getFormBadgeName,
  parsePokemonId,
} from "./formUtils";
