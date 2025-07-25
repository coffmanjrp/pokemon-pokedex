/**
 * Combination Animation Effects
 *
 * This file contains complex animations that combine multiple basic effects.
 * Future combination effects can be added here following the same pattern.
 *
 * Available combinations:
 * - createParticleEchoCombo: Particle burst + border echo
 * - createUltimateEchoCombo: Particle burst + card echo + border echo (ultimate echo combination)
 * - createElementalStorm: Massive type-based particle storm with lightning effects
 * - createMegaEvolutionEffect: Evolution-style transformation with energy waves
 *
 * To add new combinations:
 * 1. Create a new function following the AnimationConfig interface
 * 2. Add it to the ANIMATIONS registry in index.ts
 * 3. Update the AnimationType union type
 */

import { gsap } from "gsap";
import { POKEMON_TYPE_COLORS, PokemonTypeName } from "@/types/pokemon";
import { TYPE_EFFECTS } from "@/lib/data";
import { AnimationConfig } from "./types";

export function createParticleEchoCombo(config: AnimationConfig) {
  const { pokemon, clickEvent, targetElement, gridContainer } = config;

  if (!gridContainer) {
    console.warn("Grid container is required for particle echo combo effect");
    return;
  }

  // Ensure grid container has relative positioning for absolute children
  const currentPosition = window.getComputedStyle(gridContainer).position;
  if (currentPosition === "static") {
    gridContainer.style.position = "relative";
  }

  const rect = targetElement.getBoundingClientRect();
  const containerRect = gridContainer.getBoundingClientRect();
  const centerX = clickEvent.clientX - rect.left;
  const centerY = clickEvent.clientY - rect.top;
  const primaryType = pokemon.types[0]?.type.name;
  const primaryColor =
    POKEMON_TYPE_COLORS[primaryType as PokemonTypeName] || "#68A090";

  // Calculate card position relative to grid container (shared for all elements)
  // For virtual scroll containers, we need to account for scroll position
  const scrollLeft = gridContainer.scrollLeft || 0;
  const scrollTop = gridContainer.scrollTop || 0;

  const cardRelativeX = rect.left - containerRect.left + scrollLeft;
  const cardRelativeY = rect.top - containerRect.top + scrollTop;

  // Create particle burst directly here for consistent positioning
  const particles =
    TYPE_EFFECTS[primaryType as keyof typeof TYPE_EFFECTS] ||
    TYPE_EFFECTS.normal;
  const particleCount = 8;

  // Create particle burst with consistent positioning
  // Place particles in grid container to avoid overflow-hidden issues
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    const particleSymbol =
      particles[Math.floor(Math.random() * particles.length)] || "✨";

    const angle = (360 / particleCount) * i + Math.random() * 45;
    const distance = 60 + Math.random() * 40;

    // Calculate absolute position for grid container
    // Use the same positioning logic as border echo for consistency
    const absoluteStartX = cardRelativeX + centerX;
    const absoluteStartY = cardRelativeY + centerY;
    const endX = absoluteStartX + Math.cos((angle * Math.PI) / 180) * distance;
    const endY = absoluteStartY + Math.sin((angle * Math.PI) / 180) * distance;

    particle.innerHTML = particleSymbol;
    particle.style.cssText = `
      position: absolute;
      left: ${absoluteStartX}px;
      top: ${absoluteStartY}px;
      font-size: ${16 + Math.random() * 8}px;
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
      z-index: 20;
      user-select: none;
    `;

    gridContainer.appendChild(particle);

    const particleTl = gsap.timeline({
      onComplete: () => {
        if (gridContainer.contains(particle)) {
          gridContainer.removeChild(particle);
        }
      },
    });

    particleTl
      .to(particle, {
        scale: 1,
        duration: 0.1,
        ease: "back.out(2)",
      })
      .to(
        particle,
        {
          x: endX - absoluteStartX,
          y: endY - absoluteStartY,
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
  const flashX = cardRelativeX + centerX;
  const flashY = cardRelativeY + centerY;

  flash.style.cssText = `
    position: absolute;
    left: ${flashX}px;
    top: ${flashY}px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: ${primaryColor};
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(0);
    pointer-events: none;
    z-index: 15;
    box-shadow: 0 0 20px ${primaryColor};
  `;

  gridContainer.appendChild(flash);

  gsap.to(flash, {
    scale: 2,
    opacity: 0,
    duration: 0.4,
    ease: "power2.out",
    onComplete: () => {
      if (gridContainer.contains(flash)) {
        gridContainer.removeChild(flash);
      }
    },
  });

  // Create border echo frames with slight delay
  const echoCount = 4;
  const echoes: HTMLElement[] = [];

  for (let i = 0; i < echoCount; i++) {
    const echoFrame = document.createElement("div");

    echoFrame.style.cssText = `
      position: absolute;
      left: ${cardRelativeX}px;
      top: ${cardRelativeY}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      opacity: ${0.6 - i * 0.1};
      pointer-events: none;
      z-index: ${5 - i};
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

  // Animate border echoes
  const borderTl = gsap.timeline({
    onComplete: () => {
      echoes.forEach((echo) => {
        if (gridContainer.contains(echo)) {
          gridContainer.removeChild(echo);
        }
      });
    },
  });

  // Start border echo slightly after particle burst
  borderTl.to({}, { duration: 0.2 });

  echoes.forEach((echo, index) => {
    borderTl.to(
      echo,
      {
        scale: 1.1 + index * 0.05,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: index * 0.1,
      },
      0,
    );
  });

  // Original card pulse
  gsap.to(targetElement, {
    scale: 1.05,
    duration: 0.1,
    ease: "power2.out",
    yoyo: true,
    repeat: 1,
  });
}

/**
 * Ultimate Echo Combo Effect
 * The most comprehensive echo combination: particle burst + card echo + border echo
 * Features: All three echo effects combined with perfect timing and layering
 */
export function createUltimateEchoCombo(config: AnimationConfig) {
  const { pokemon, clickEvent, targetElement, gridContainer } = config;

  if (!gridContainer) {
    console.warn("Grid container is required for ultimate combo effect");
    return;
  }

  const rect = targetElement.getBoundingClientRect();
  const containerRect = gridContainer.getBoundingClientRect();
  const centerX = clickEvent.clientX - rect.left;
  const centerY = clickEvent.clientY - rect.top;
  const primaryType = pokemon.types[0]?.type.name;
  const primaryColor =
    POKEMON_TYPE_COLORS[primaryType as PokemonTypeName] || "#68A090";

  // Account for virtual scroll container's scroll position
  const scrollLeft = gridContainer.scrollLeft || 0;
  const scrollTop = gridContainer.scrollTop || 0;

  const particles =
    TYPE_EFFECTS[primaryType as keyof typeof TYPE_EFFECTS] ||
    TYPE_EFFECTS.normal;

  // 1. Particle Burst Effect
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div");
    const particleSymbol =
      particles[Math.floor(Math.random() * particles.length)] || "✨";

    const angle = (360 / 8) * i + Math.random() * 45;
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
      z-index: 20;
      user-select: none;
    `;

    targetElement.appendChild(particle);

    const particleTl = gsap.timeline({
      onComplete: () => {
        if (targetElement.contains(particle)) {
          targetElement.removeChild(particle);
        }
      },
    });

    particleTl
      .to(particle, {
        scale: 1,
        duration: 0.1,
        ease: "back.out(2)",
      })
      .to(
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

  // 2. Card Echo Effect (full card copies)
  const cardEchoes: HTMLElement[] = [];
  for (let i = 0; i < 3; i++) {
    const echo = targetElement.cloneNode(true) as HTMLElement;

    echo.style.cssText = `
      position: absolute;
      left: ${rect.left - containerRect.left + scrollLeft}px;
      top: ${rect.top - containerRect.top + scrollTop}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      opacity: ${0.4 - i * 0.1};
      pointer-events: none;
      z-index: ${8 - i};
      border-radius: 12px;
      transform: scale(1);
      transition: none;
    `;

    const interactiveElements = echo.querySelectorAll("button, a, [onclick]");
    interactiveElements.forEach((el) => {
      el.removeAttribute("onclick");
      (el as HTMLElement).style.pointerEvents = "none";
    });

    gridContainer.appendChild(echo);
    cardEchoes.push(echo);
  }

  // 3. Border Echo Effect
  const borderEchoes: HTMLElement[] = [];
  for (let i = 0; i < 4; i++) {
    const borderEcho = document.createElement("div");

    borderEcho.style.cssText = `
      position: absolute;
      left: ${rect.left - containerRect.left + scrollLeft}px;
      top: ${rect.top - containerRect.top + scrollTop}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      opacity: ${0.7 - i * 0.15};
      pointer-events: none;
      z-index: ${4 - i};
      border-radius: 12px;
      border: 2px solid ${primaryColor};
      box-shadow: 0 4px 20px ${primaryColor}40;
      background: transparent;
      transform: scale(1);
      transition: none;
    `;

    gridContainer.appendChild(borderEcho);
    borderEchoes.push(borderEcho);
  }

  // Animate all effects with different timings
  const masterTl = gsap.timeline({
    onComplete: () => {
      [...cardEchoes, ...borderEchoes].forEach((echo) => {
        if (gridContainer.contains(echo)) {
          gridContainer.removeChild(echo);
        }
      });
    },
  });

  // Original card pulse
  masterTl
    .to(targetElement, {
      scale: 1.08,
      duration: 0.1,
      ease: "power2.out",
    })
    .to(targetElement, {
      scale: 1,
      duration: 0.4,
      ease: "bounce.out",
    });

  // Card echoes start at 0.3s
  cardEchoes.forEach((echo, index) => {
    masterTl.to(
      echo,
      {
        scale: 1.08 + index * 0.04,
        opacity: 0,
        duration: 1.0,
        ease: "power2.out",
        delay: index * 0.15,
      },
      0.3,
    );
  });

  // Border echoes start at 0.5s
  borderEchoes.forEach((echo, index) => {
    masterTl.to(
      echo,
      {
        scale: 1.12 + index * 0.03,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        delay: index * 0.1,
      },
      0.5,
    );
  });
}

/**
 * Elemental Storm Effect
 * Creates a massive particle storm with lightning effects based on Pokemon type
 * Features: 20+ particles, lightning bolts, screen shake, type-based colors
 */
export function createElementalStorm(config: AnimationConfig) {
  const { pokemon, clickEvent, targetElement, gridContainer } = config;

  if (!gridContainer) {
    console.warn("Grid container is required for elemental storm effect");
    return;
  }

  const rect = targetElement.getBoundingClientRect();
  const centerX = clickEvent.clientX - rect.left;
  const centerY = clickEvent.clientY - rect.top;
  const primaryType = pokemon.types[0]?.type.name;
  const primaryColor =
    POKEMON_TYPE_COLORS[primaryType as PokemonTypeName] || "#68A090";

  const particles =
    TYPE_EFFECTS[primaryType as keyof typeof TYPE_EFFECTS] ||
    TYPE_EFFECTS.normal;
  const particleCount = 24; // More particles for storm effect

  // Create background storm effect
  const stormBackground = document.createElement("div");
  stormBackground.style.cssText = `
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, ${primaryColor}20, transparent 70%);
    opacity: 0;
    pointer-events: none;
    z-index: 1;
  `;
  document.body.appendChild(stormBackground);

  // Create lightning bolts
  const lightningCount = 6;
  const lightningBolts: HTMLElement[] = [];

  for (let i = 0; i < lightningCount; i++) {
    const lightning = document.createElement("div");
    const angle = (360 / lightningCount) * i;
    const length = 150 + Math.random() * 100;

    lightning.innerHTML = "⚡";
    lightning.style.cssText = `
      position: absolute;
      left: ${centerX}px;
      top: ${centerY}px;
      font-size: ${20 + Math.random() * 15}px;
      color: ${primaryColor};
      transform: translate(-50%, -50%) rotate(${angle}deg) translateY(-${length}px) scale(0);
      pointer-events: none;
      z-index: 25;
      text-shadow: 0 0 10px ${primaryColor};
    `;

    targetElement.appendChild(lightning);
    lightningBolts.push(lightning);
  }

  // Create massive particle storm
  const stormParticles: HTMLElement[] = [];
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    const particleSymbol =
      particles[Math.floor(Math.random() * particles.length)] || "✨";

    particle.innerHTML = particleSymbol;
    particle.style.cssText = `
      position: absolute;
      left: ${centerX}px;
      top: ${centerY}px;
      font-size: ${12 + Math.random() * 16}px;
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
      z-index: 20;
      user-select: none;
      filter: drop-shadow(0 0 5px ${primaryColor});
    `;

    targetElement.appendChild(particle);
    stormParticles.push(particle);
  }

  // Master timeline for storm effect
  const stormTl = gsap.timeline({
    onComplete: () => {
      // Cleanup all elements
      [...lightningBolts, ...stormParticles].forEach((element) => {
        if (targetElement.contains(element)) {
          targetElement.removeChild(element);
        }
      });
      if (document.body.contains(stormBackground)) {
        document.body.removeChild(stormBackground);
      }
    },
  });

  // Background storm fade in
  stormTl.to(stormBackground, {
    opacity: 1,
    duration: 0.3,
    ease: "power2.out",
  });

  // Card screen shake
  stormTl.to(
    targetElement,
    {
      x: "+=3",
      duration: 0.05,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 8,
    },
    0,
  );

  // Lightning bolts appear
  lightningBolts.forEach((bolt, index) => {
    stormTl.to(
      bolt,
      {
        scale: 1,
        duration: 0.1,
        ease: "back.out(3)",
        delay: index * 0.05,
      },
      0.2,
    );

    stormTl.to(
      bolt,
      {
        opacity: 0,
        duration: 0.2,
        delay: 0.3,
      },
      0.4,
    );
  });

  // Particle storm burst
  stormParticles.forEach((particle, index) => {
    const delay = (index / particleCount) * 0.5;
    const angle = Math.random() * 360;
    const distance = 80 + Math.random() * 150;
    const endX = Math.cos((angle * Math.PI) / 180) * distance;
    const endY = Math.sin((angle * Math.PI) / 180) * distance;

    stormTl.to(
      particle,
      {
        scale: 1.2,
        duration: 0.1,
        ease: "back.out(2)",
        delay: delay,
      },
      0.3,
    );

    stormTl.to(
      particle,
      {
        x: endX,
        y: endY,
        scale: 0.2,
        rotation: Math.random() * 720,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
      },
      0.4 + delay,
    );
  });

  // Background fade out
  stormTl.to(
    stormBackground,
    {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
    },
    1.5,
  );
}

/**
 * Mega Evolution Effect
 * Creates an evolution-style transformation with energy waves and power surge
 * Features: Energy rings, power surge, transformation flash, scale animation
 */
export function createMegaEvolutionEffect(config: AnimationConfig) {
  const { pokemon, clickEvent, targetElement, gridContainer } = config;

  if (!gridContainer) {
    console.warn("Grid container is required for mega evolution effect");
    return;
  }

  const rect = targetElement.getBoundingClientRect();
  const containerRect = gridContainer.getBoundingClientRect();
  const centerX = clickEvent.clientX - rect.left;
  const centerY = clickEvent.clientY - rect.top;
  const primaryType = pokemon.types[0]?.type.name;
  const primaryColor =
    POKEMON_TYPE_COLORS[primaryType as PokemonTypeName] || "#68A090";

  // Account for virtual scroll container's scroll position
  const scrollLeft = gridContainer.scrollLeft || 0;
  const scrollTop = gridContainer.scrollTop || 0;

  // Create energy rings
  const energyRings: HTMLElement[] = [];
  for (let i = 0; i < 5; i++) {
    const ring = document.createElement("div");
    ring.style.cssText = `
      position: absolute;
      left: ${centerX}px;
      top: ${centerY}px;
      width: ${40 + i * 20}px;
      height: ${40 + i * 20}px;
      border: 3px solid ${primaryColor};
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
      z-index: ${15 - i};
      opacity: ${0.8 - i * 0.1};
      box-shadow: 0 0 20px ${primaryColor}, inset 0 0 20px ${primaryColor}40;
    `;

    targetElement.appendChild(ring);
    energyRings.push(ring);
  }

  // Create power surge particles
  const surgeParticles: HTMLElement[] = [];
  for (let i = 0; i < 16; i++) {
    const particle = document.createElement("div");
    particle.innerHTML = "✨";

    const angle = (360 / 16) * i;
    const startDistance = 20;
    const startX = centerX + Math.cos((angle * Math.PI) / 180) * startDistance;
    const startY = centerY + Math.sin((angle * Math.PI) / 180) * startDistance;

    particle.style.cssText = `
      position: absolute;
      left: ${startX}px;
      top: ${startY}px;
      font-size: 14px;
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
      z-index: 18;
      color: ${primaryColor};
      text-shadow: 0 0 10px ${primaryColor};
    `;

    targetElement.appendChild(particle);
    surgeParticles.push(particle);
  }

  // Create transformation flash
  const flash = document.createElement("div");
  flash.style.cssText = `
    position: absolute;
    left: ${rect.left - containerRect.left + scrollLeft}px;
    top: ${rect.top - containerRect.top + scrollTop}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    background: radial-gradient(circle, ${primaryColor}80, transparent 70%);
    border-radius: 12px;
    opacity: 0;
    pointer-events: none;
    z-index: 20;
    transform: scale(0.5);
  `;

  gridContainer.appendChild(flash);

  // Evolution timeline
  const evolutionTl = gsap.timeline({
    onComplete: () => {
      // Cleanup all elements
      [...energyRings, ...surgeParticles].forEach((element) => {
        if (targetElement.contains(element)) {
          targetElement.removeChild(element);
        }
      });
      if (gridContainer.contains(flash)) {
        gridContainer.removeChild(flash);
      }
    },
  });

  // Phase 1: Energy gathering (rings appear)
  energyRings.forEach((ring, index) => {
    evolutionTl.to(
      ring,
      {
        scale: 1,
        duration: 0.3,
        ease: "back.out(2)",
        delay: index * 0.1,
      },
      0,
    );
  });

  // Phase 2: Power surge (particles spiral inward)
  surgeParticles.forEach((particle, index) => {
    const angle = (360 / 16) * index;
    const spiralX = centerX + Math.cos((angle * Math.PI) / 180) * 5;
    const spiralY = centerY + Math.sin((angle * Math.PI) / 180) * 5;

    evolutionTl.to(
      particle,
      {
        scale: 1,
        duration: 0.2,
        ease: "back.out(2)",
        delay: index * 0.03,
      },
      0.5,
    );

    evolutionTl.to(
      particle,
      {
        x: spiralX - (centerX + Math.cos((angle * Math.PI) / 180) * 20),
        y: spiralY - (centerY + Math.sin((angle * Math.PI) / 180) * 20),
        scale: 1.5,
        duration: 0.6,
        ease: "power2.inOut",
      },
      0.7,
    );
  });

  // Phase 3: Transformation flash
  evolutionTl.to(
    flash,
    {
      opacity: 1,
      scale: 1.2,
      duration: 0.2,
      ease: "power2.out",
    },
    1.2,
  );

  // Phase 4: Card transformation
  evolutionTl.to(
    targetElement,
    {
      scale: 1.15,
      rotationY: 360,
      duration: 0.8,
      ease: "power2.inOut",
    },
    1.2,
  );

  // Phase 5: Energy dispersal (rings expand and fade)
  energyRings.forEach((ring, index) => {
    evolutionTl.to(
      ring,
      {
        scale: 3,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: index * 0.05,
      },
      1.4,
    );
  });

  // Phase 6: Particles scatter
  surgeParticles.forEach((particle, index) => {
    const scatterAngle = Math.random() * 360;
    const scatterDistance = 100 + Math.random() * 50;
    const scatterX = Math.cos((scatterAngle * Math.PI) / 180) * scatterDistance;
    const scatterY = Math.sin((scatterAngle * Math.PI) / 180) * scatterDistance;

    evolutionTl.to(
      particle,
      {
        x: scatterX,
        y: scatterY,
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: index * 0.02,
      },
      1.6,
    );
  });

  // Phase 7: Flash fade and card return
  evolutionTl.to(
    flash,
    {
      opacity: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.inOut",
    },
    1.8,
  );

  evolutionTl.to(
    targetElement,
    {
      scale: 1,
      rotationY: 0,
      duration: 0.4,
      ease: "bounce.out",
    },
    2.0,
  );
}
