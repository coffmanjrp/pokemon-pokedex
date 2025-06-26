import { gsap } from "gsap";
import { POKEMON_TYPE_COLORS, PokemonTypeName } from "@/types/pokemon";
import { AnimationConfig } from "./types";

export function createRippleWave({
  pokemon,
  clickEvent,
  targetElement,
}: AnimationConfig) {
  const rect = targetElement.getBoundingClientRect();
  const x = clickEvent.clientX - rect.left;
  const y = clickEvent.clientY - rect.top;
  const primaryColor =
    POKEMON_TYPE_COLORS[pokemon.types[0]?.type.name as PokemonTypeName] ||
    "#68A090";

  // Create ripple element
  const ripple = document.createElement("div");
  ripple.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${primaryColor};
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(0);
    pointer-events: none;
    z-index: 10;
  `;

  targetElement.appendChild(ripple);

  // Animate ripple expansion
  gsap.to(ripple, {
    scale: 15,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    onComplete: () => {
      if (targetElement.contains(ripple)) {
        targetElement.removeChild(ripple);
      }
    },
  });
}
