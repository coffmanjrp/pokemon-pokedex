import { gsap } from 'gsap';
import { POKEMON_TYPE_COLORS, PokemonTypeName } from '@/types/pokemon';
import { AnimationConfig } from './types';

export function createCardEchoBorder({ pokemon, targetElement, gridContainer }: AnimationConfig) {
  if (!gridContainer) {
    console.warn('Grid container is required for card echo border effect');
    return;
  }

  const rect = targetElement.getBoundingClientRect();
  const containerRect = gridContainer.getBoundingClientRect();
  const primaryColor = POKEMON_TYPE_COLORS[pokemon.types[0]?.type.name as PokemonTypeName] || '#68A090';
  
  // Create 4 echo frames that will expand outward
  const echoCount = 4;
  const echoes: HTMLElement[] = [];

  for (let i = 0; i < echoCount; i++) {
    // Create echo frame (border only)
    const echoFrame = document.createElement('div');
    
    // Position frame exactly over the original card
    echoFrame.style.cssText = `
      position: absolute;
      left: ${rect.left - containerRect.left}px;
      top: ${rect.top - containerRect.top}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      opacity: ${0.8 - (i * 0.15)};
      pointer-events: none;
      z-index: ${10 - i};
      border-radius: 12px;
      border: 2px solid ${primaryColor};
      box-shadow: 0 4px 20px ${primaryColor}40;
      background: transparent;
      transform: scale(1);
      transition: none;
    `;

    gridContainer.appendChild(echoFrame);
    echoes.push(echoFrame);
  }

  // Animate echoes expanding outward in sequence
  const tl = gsap.timeline({
    onComplete: () => {
      echoes.forEach(echo => {
        if (gridContainer.contains(echo)) {
          gridContainer.removeChild(echo);
        }
      });
    }
  });

  // Original card pulse
  tl.to(targetElement, {
    scale: 1.05,
    duration: 0.1,
    ease: "power2.out"
  })
  .to(targetElement, {
    scale: 1,
    duration: 0.3,
    ease: "power2.out"
  });

  // Echo waves expanding outward with delay (smaller scale)
  echoes.forEach((echo, index) => {
    tl.to(echo, {
      scale: 1.1 + (index * 0.05),
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: index * 0.1
    }, 0.1);
  });
}