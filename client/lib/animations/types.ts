import { Pokemon } from '@/types/pokemon';

export interface AnimationConfig {
  pokemon: Pokemon;
  clickEvent: React.MouseEvent;
  targetElement: HTMLElement;
  gridContainer?: HTMLElement;
}

export interface AnimationCleanupFunction {
  (): void;
}

export type AnimationFunction = (config: AnimationConfig) => AnimationCleanupFunction | void;