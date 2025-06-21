import { gsap } from 'gsap';
import { POKEMON_TYPE_COLORS, PokemonTypeName } from '@/types/pokemon';
import { AnimationConfig } from './types';

export function createScaleGlow({ pokemon, targetElement }: AnimationConfig) {
  const primaryColor = POKEMON_TYPE_COLORS[pokemon.types[0]?.type.name as PokemonTypeName] || '#68A090';

  gsap.to(targetElement, {
    scale: 1.1,
    boxShadow: `0 0 30px ${primaryColor}`,
    duration: 0.3,
    ease: "power2.out",
    yoyo: true,
    repeat: 1
  });
}