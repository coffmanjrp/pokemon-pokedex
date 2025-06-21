import { gsap } from 'gsap';
import { AnimationConfig } from './types';

export function createBounceTilt({ targetElement }: AnimationConfig) {
  const tl = gsap.timeline();

  tl.to(targetElement, {
    y: -20,
    rotationX: 10,
    rotationY: 5,
    duration: 0.2,
    ease: "power2.out"
  })
  .to(targetElement, {
    y: 0,
    rotationX: 0,
    rotationY: 0,
    duration: 0.4,
    ease: "bounce.out"
  });
}