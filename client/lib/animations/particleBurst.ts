import { gsap } from "gsap";
import { POKEMON_TYPE_COLORS, PokemonTypeName } from "@/types/pokemon";
import { TYPE_EFFECTS } from "@/lib/data";
import { AnimationConfig } from "./types";

export function createParticleBurst({
  pokemon,
  clickEvent,
  targetElement,
}: AnimationConfig) {
  const rect = targetElement.getBoundingClientRect();
  const centerX = clickEvent.clientX - rect.left;
  const centerY = clickEvent.clientY - rect.top;
  const primaryType = pokemon.types[0]?.type.name;
  const primaryColor =
    POKEMON_TYPE_COLORS[primaryType as PokemonTypeName] || "#68A090";

  const particles =
    TYPE_EFFECTS[primaryType as keyof typeof TYPE_EFFECTS] ||
    TYPE_EFFECTS.normal;
  const particleCount = 8;

  // Create particle burst
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    const particleSymbol =
      particles[Math.floor(Math.random() * particles.length)] || "✨";

    // Calculate random direction (360 degrees)
    const angle = (360 / particleCount) * i + Math.random() * 45;
    const distance = 60 + Math.random() * 40;
    const endX = centerX + Math.cos((angle * Math.PI) / 180) * distance;
    const endY = centerY + Math.sin((angle * Math.PI) / 180) * distance;

    particle.innerHTML = particleSymbol;
    particle.style.cssText = `
      position: absolute;
      left: ${centerX}px;
      top: ${centerY}px;
      font-size: ${16 + Math.random() * 8}px;
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
      z-index: 15;
      user-select: none;
    `;

    targetElement.appendChild(particle);

    // Animate particle burst
    const tl = gsap.timeline({
      onComplete: () => {
        if (targetElement.contains(particle)) {
          targetElement.removeChild(particle);
        }
      },
    });

    tl.to(particle, {
      scale: 1,
      duration: 0.1,
      ease: "back.out(2)",
    }).to(
      particle,
      {
        x: endX - centerX,
        y: endY - centerY,
        scale: 0.3,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.05",
    );
  }

  // Add central flash effect
  const flash = document.createElement("div");
  flash.style.cssText = `
    position: absolute;
    left: ${centerX}px;
    top: ${centerY}px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: ${primaryColor};
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(0);
    pointer-events: none;
    z-index: 10;
    box-shadow: 0 0 20px ${primaryColor};
  `;

  targetElement.appendChild(flash);

  gsap.to(flash, {
    scale: 2,
    opacity: 0,
    duration: 0.4,
    ease: "power2.out",
    onComplete: () => {
      if (targetElement.contains(flash)) {
        targetElement.removeChild(flash);
      }
    },
  });
}
