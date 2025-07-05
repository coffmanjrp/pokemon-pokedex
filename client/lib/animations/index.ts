// Import all animation functions
import { createRippleWave } from "./rippleWave";
import { createParticleBurst } from "./particleBurst";
import { createCardFlip } from "./cardFlip";
import { createPokeballPop } from "./pokeballPop";
import { createElectricSpark } from "./electricSpark";
import { createScaleGlow } from "./scaleGlow";
import { createBounceTilt } from "./bounceTilt";
import { createCardEcho } from "./cardEcho";
import { createCardEchoBorder } from "./cardEchoBorder";
import {
  createParticleEchoCombo,
  createUltimateEchoCombo,
  createElementalStorm,
  createMegaEvolutionEffect,
} from "./combinationEffects";
import {
  createBabySparkle,
  createLegendaryAura,
  createMythicalShimmer,
} from "./specialEffects";
import {
  createBabyHoverSparkle,
  createLegendaryHoverAura,
  createMythicalHoverShimmer,
} from "./hoverEffects";
import {
  createBabyHeartBurst,
  createLegendaryBorderFlow,
  createLegendaryRainbowBorder,
  createLegendaryLightningBorder,
  createMythicalElectricSpark,
} from "./subtleEffects";

// Export all animation functions for easy importing
export { createRippleWave } from "./rippleWave";
export { createParticleBurst } from "./particleBurst";
export { createCardFlip } from "./cardFlip";
export { createPokeballPop } from "./pokeballPop";
export { createElectricSpark } from "./electricSpark";
export { createScaleGlow } from "./scaleGlow";
export { createBounceTilt } from "./bounceTilt";
export { createCardEcho } from "./cardEcho";
export { createCardEchoBorder } from "./cardEchoBorder";
export {
  createParticleEchoCombo,
  createUltimateEchoCombo,
  createElementalStorm,
  createMegaEvolutionEffect,
} from "./combinationEffects";
export {
  createBabySparkle,
  createLegendaryAura,
  createMythicalShimmer,
} from "./specialEffects";
export {
  createBabyHoverSparkle,
  createLegendaryHoverAura,
  createMythicalHoverShimmer,
} from "./hoverEffects";
export {
  createBabyHeartBurst,
  createLegendaryBorderFlow,
  createLegendaryRainbowBorder,
  createLegendaryLightningBorder,
  createMythicalElectricSpark,
} from "./subtleEffects";

// Export types
export type {
  AnimationConfig,
  AnimationFunction,
  AnimationCleanupFunction,
} from "./types";

// Export hooks
export { useCardAnimation } from "./useCardAnimation";

// Animation registry for easy access
export const ANIMATIONS = {
  "ripple-wave": createRippleWave,
  "particle-burst": createParticleBurst,
  "card-flip": createCardFlip,
  "pokeball-pop": createPokeballPop,
  "electric-spark": createElectricSpark,
  "scale-glow": createScaleGlow,
  "bounce-tilt": createBounceTilt,
  "card-echo": createCardEcho,
  "card-echo-border": createCardEchoBorder,
  "particle-echo-combo": createParticleEchoCombo,
  "ultimate-echo-combo": createUltimateEchoCombo,
  "elemental-storm": createElementalStorm,
  "mega-evolution": createMegaEvolutionEffect,
  "baby-sparkle": createBabySparkle,
  "legendary-aura": createLegendaryAura,
  "mythical-shimmer": createMythicalShimmer,
  "baby-hover-sparkle": createBabyHoverSparkle,
  "legendary-hover-aura": createLegendaryHoverAura,
  "mythical-hover-shimmer": createMythicalHoverShimmer,
  "baby-heart-burst": createBabyHeartBurst,
  "legendary-border-flow": createLegendaryBorderFlow,
  "legendary-rainbow-border": createLegendaryRainbowBorder,
  "legendary-lightning-border": createLegendaryLightningBorder,
  "mythical-electric-spark": createMythicalElectricSpark,
} as const;

export type AnimationType = keyof typeof ANIMATIONS;
