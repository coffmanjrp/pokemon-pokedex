// Import all animation functions
import { createRippleWave } from './rippleWave';
import { createParticleBurst } from './particleBurst';
import { createCardFlip } from './cardFlip';
import { createPokeballPop } from './pokeballPop';
import { createElectricSpark } from './electricSpark';
import { createScaleGlow } from './scaleGlow';
import { createBounceTilt } from './bounceTilt';
import { createCardEcho } from './cardEcho';
import { createCardEchoBorder } from './cardEchoBorder';
import { createParticleEchoCombo, createUltimateEchoCombo, createElementalStorm, createMegaEvolutionEffect } from './combinationEffects';

// Export all animation functions for easy importing
export { createRippleWave } from './rippleWave';
export { createParticleBurst } from './particleBurst';
export { createCardFlip } from './cardFlip';
export { createPokeballPop } from './pokeballPop';
export { createElectricSpark } from './electricSpark';
export { createScaleGlow } from './scaleGlow';
export { createBounceTilt } from './bounceTilt';
export { createCardEcho } from './cardEcho';
export { createCardEchoBorder } from './cardEchoBorder';
export { createParticleEchoCombo, createUltimateEchoCombo, createElementalStorm, createMegaEvolutionEffect } from './combinationEffects';

// Export types
export type { AnimationConfig, AnimationFunction, AnimationCleanupFunction } from './types';

// Export hooks
export { useCardAnimation } from './useCardAnimation';

// Animation registry for easy access
export const ANIMATIONS = {
  'ripple-wave': createRippleWave,
  'particle-burst': createParticleBurst,
  'card-flip': createCardFlip,
  'pokeball-pop': createPokeballPop,
  'electric-spark': createElectricSpark,
  'scale-glow': createScaleGlow,
  'bounce-tilt': createBounceTilt,
  'card-echo': createCardEcho,
  'card-echo-border': createCardEchoBorder,
  'particle-echo-combo': createParticleEchoCombo,
  'ultimate-echo-combo': createUltimateEchoCombo,
  'elemental-storm': createElementalStorm,
  'mega-evolution': createMegaEvolutionEffect,
} as const;

export type AnimationType = keyof typeof ANIMATIONS;