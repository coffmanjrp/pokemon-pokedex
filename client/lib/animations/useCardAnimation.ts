import { useCallback } from 'react';
import { Pokemon } from '@/types/pokemon';
import { ANIMATIONS, AnimationType } from './index';

interface UseCardAnimationOptions {
  animationType?: AnimationType;
  gridContainer?: HTMLElement | null;
}

export function useCardAnimation(options: UseCardAnimationOptions = {}) {
  const { animationType = 'particle-burst', gridContainer } = options;

  const triggerAnimation = useCallback((
    clickEvent: React.MouseEvent,
    pokemon: Pokemon,
    targetElement?: HTMLElement
  ) => {
    const element = targetElement || (clickEvent.currentTarget as HTMLElement);
    const container = gridContainer || document.querySelector('.grid') as HTMLElement;
    
    const animationFunction = ANIMATIONS[animationType];
    if (animationFunction) {
      animationFunction({
        pokemon,
        clickEvent,
        targetElement: element,
        gridContainer: container
      });
    }
  }, [animationType, gridContainer]);

  return { triggerAnimation };
}