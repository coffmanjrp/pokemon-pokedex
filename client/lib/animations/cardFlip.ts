import { gsap } from 'gsap';
import { AnimationConfig } from './types';

export function createCardFlip({ targetElement }: AnimationConfig) {
  gsap.to(targetElement, {
    rotationY: 180,
    duration: 0.6,
    ease: "power2.inOut",
    onComplete: () => {
      gsap.to(targetElement, {
        rotationY: 0,
        duration: 0.6,
        ease: "power2.inOut",
        delay: 0.5
      });
    }
  });
}