// Main lib exports - form-related functionality
export {
  FORM_PRIORITIES,
  getFormCategory,
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
  getFormBadgeColor,
} from "./formUtils";
