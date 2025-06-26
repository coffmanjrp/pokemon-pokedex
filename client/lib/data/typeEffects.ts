/**
 * Pokemon type-based particle effects for animations
 * Each type has an array of emoji symbols that represent that type's essence
 */
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

export type TypeEffectKey = keyof typeof TYPE_EFFECTS;
