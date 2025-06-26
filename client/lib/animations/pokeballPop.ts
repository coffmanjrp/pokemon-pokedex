import { gsap } from "gsap";
import { AnimationConfig } from "./types";

export function createPokeballPop({
  clickEvent,
  targetElement,
}: AnimationConfig) {
  const rect = targetElement.getBoundingClientRect();
  const x = clickEvent.clientX - rect.left;
  const y = clickEvent.clientY - rect.top;

  const pokeball = document.createElement("div");
  pokeball.innerHTML = "⚪";
  pokeball.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    font-size: 40px;
    transform: translate(-50%, -50%) scale(0);
    pointer-events: none;
    z-index: 20;
  `;

  targetElement.appendChild(pokeball);

  const tl = gsap.timeline({
    onComplete: () => {
      if (targetElement.contains(pokeball)) {
        targetElement.removeChild(pokeball);
      }
    },
  });

  tl.to(pokeball, {
    scale: 1,
    duration: 0.3,
    ease: "back.out(2)",
  })
    .to(pokeball, {
      rotation: 720,
      duration: 0.4,
    })
    .to(pokeball, {
      scale: 2,
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
    });
}
