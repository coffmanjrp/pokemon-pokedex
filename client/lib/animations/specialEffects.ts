import { gsap } from "gsap";
import { AnimationConfig, AnimationCleanupFunction } from "./types";

/**
 * Baby Pokemon sparkle effect - cute sparkly animation with pastel colors
 */
export function createBabySparkle(
  config: AnimationConfig,
): AnimationCleanupFunction {
  const { targetElement } = config;
  const rect = targetElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Create sparkle particles
  const sparkles: HTMLElement[] = [];
  const sparkleCount = 12;

  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "fixed pointer-events-none z-50";
    sparkle.style.cssText = `
      width: 8px;
      height: 8px;
      background: linear-gradient(45deg, #FFB6C1, #FFC0CB, #E6E6FA, #F0E68C);
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(255, 182, 193, 0.8);
      left: ${centerX}px;
      top: ${centerY}px;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(sparkle);
    sparkles.push(sparkle);
  }

  // Create floating hearts
  const hearts: HTMLElement[] = [];
  for (let i = 0; i < 3; i++) {
    const heart = document.createElement("div");
    heart.className = "fixed pointer-events-none z-50";
    heart.style.cssText = `
      font-size: 16px;
      color: #FFB6C1;
      left: ${centerX}px;
      top: ${centerY}px;
      transform: translate(-50%, -50%);
    `;
    heart.textContent = "💕";
    document.body.appendChild(heart);
    hearts.push(heart);
  }

  // Animate sparkles
  sparkles.forEach((sparkle, index) => {
    const angle = (index / sparkleCount) * Math.PI * 2;
    const distance = 50 + Math.random() * 30;
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance;

    gsap.fromTo(
      sparkle,
      { scale: 0, rotation: 0, opacity: 1 },
      {
        scale: 1.5,
        rotation: 360,
        x: targetX,
        y: targetY,
        opacity: 0,
        duration: 0.8 + Math.random() * 0.4,
        ease: "power2.out",
        delay: Math.random() * 0.2,
      },
    );
  });

  // Animate hearts
  hearts.forEach((heart, index) => {
    gsap.fromTo(
      heart,
      { scale: 0, y: 0, opacity: 1 },
      {
        scale: 1.2,
        y: -40 - index * 10,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.2 + index * 0.15,
      },
    );
  });

  // Add gentle card glow
  gsap.fromTo(
    targetElement,
    { filter: "brightness(1)" },
    {
      filter: "brightness(1.3) drop-shadow(0 0 20px rgba(255, 182, 193, 0.6))",
      duration: 0.3,
      yoyo: true,
      repeat: 1,
    },
  );

  return () => {
    [...sparkles, ...hearts].forEach((element) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  };
}

/**
 * Legendary Pokemon aura effect - powerful golden aura with energy rings
 */
export function createLegendaryAura(
  config: AnimationConfig,
): AnimationCleanupFunction {
  const { targetElement } = config;
  const rect = targetElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Create energy rings
  const rings: HTMLElement[] = [];
  const ringCount = 3;

  for (let i = 0; i < ringCount; i++) {
    const ring = document.createElement("div");
    ring.className = "fixed pointer-events-none z-40";
    ring.style.cssText = `
      width: ${rect.width + 20}px;
      height: ${rect.height + 20}px;
      border: 3px solid rgba(255, 215, 0, 0.8);
      border-radius: 12px;
      left: ${centerX}px;
      top: ${centerY}px;
      transform: translate(-50%, -50%);
      box-shadow: 
        0 0 20px rgba(255, 215, 0, 0.6),
        inset 0 0 20px rgba(255, 215, 0, 0.3);
    `;
    document.body.appendChild(ring);
    rings.push(ring);
  }

  // Create lightning bolts
  const bolts: HTMLElement[] = [];
  for (let i = 0; i < 6; i++) {
    const bolt = document.createElement("div");
    bolt.className = "fixed pointer-events-none z-50";
    bolt.style.cssText = `
      width: 2px;
      height: 30px;
      background: linear-gradient(to bottom, #FFD700, #FFA500);
      border-radius: 1px;
      box-shadow: 0 0 10px #FFD700;
      left: ${centerX}px;
      top: ${centerY}px;
      transform: translate(-50%, -50%) rotate(${i * 60}deg);
      transform-origin: center;
    `;
    document.body.appendChild(bolt);
    bolts.push(bolt);
  }

  // Animate rings
  rings.forEach((ring, index) => {
    gsap.fromTo(
      ring,
      { scale: 0.5, opacity: 0 },
      {
        scale: 1.5 + index * 0.3,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        delay: index * 0.2,
      },
    );
  });

  // Animate lightning bolts
  gsap.fromTo(
    bolts,
    { scale: 0, opacity: 1 },
    {
      scale: 1.5,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1,
    },
  );

  // Dramatic card effect
  const tl = gsap.timeline();
  tl.to(targetElement, {
    scale: 1.1,
    filter: "brightness(1.5) drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))",
    duration: 0.3,
    ease: "power2.out",
  })
    .to(targetElement, {
      scale: 1.05,
      filter: "brightness(1.2) drop-shadow(0 0 15px rgba(255, 215, 0, 0.6))",
      duration: 0.7,
      ease: "power2.inOut",
    })
    .to(targetElement, {
      scale: 1,
      filter: "none",
      duration: 0.3,
      ease: "power2.in",
    });

  return () => {
    [...rings, ...bolts].forEach((element) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  };
}

/**
 * Mythical Pokemon shimmer effect - mystical rainbow shimmer with dimensional effects
 */
export function createMythicalShimmer(
  config: AnimationConfig,
): AnimationCleanupFunction {
  const { targetElement } = config;
  const rect = targetElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Create rainbow portal
  const portal = document.createElement("div");
  portal.className = "fixed pointer-events-none z-40";
  portal.style.cssText = `
    width: ${rect.width * 1.5}px;
    height: ${rect.height * 1.5}px;
    background: conic-gradient(
      from 0deg,
      #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FECA57, #FF9FF3, #54A0FF, #FF6B6B
    );
    border-radius: 50%;
    left: ${centerX}px;
    top: ${centerY}px;
    transform: translate(-50%, -50%);
    filter: blur(2px);
    opacity: 0.3;
  `;
  document.body.appendChild(portal);

  // Create shimmer waves
  const waves: HTMLElement[] = [];
  for (let i = 0; i < 5; i++) {
    const wave = document.createElement("div");
    wave.className = "fixed pointer-events-none z-45";
    wave.style.cssText = `
      width: ${rect.width + 40}px;
      height: ${rect.height + 40}px;
      border: 2px solid transparent;
      border-radius: 12px;
      left: ${centerX}px;
      top: ${centerY}px;
      transform: translate(-50%, -50%);
      background: linear-gradient(45deg, 
        rgba(255, 107, 107, 0.6),
        rgba(78, 205, 196, 0.6),
        rgba(69, 183, 209, 0.6),
        rgba(150, 206, 180, 0.6),
        rgba(254, 202, 87, 0.6),
        rgba(255, 159, 243, 0.6)
      );
      background-clip: padding-box;
    `;
    document.body.appendChild(wave);
    waves.push(wave);
  }

  // Create floating mystical symbols
  const symbols = ["✨", "🌟", "💫", "⭐", "🔮"];
  const floatingSymbols: HTMLElement[] = [];

  symbols.forEach((symbol) => {
    const element = document.createElement("div");
    element.className = "fixed pointer-events-none z-50";
    element.style.cssText = `
      font-size: 20px;
      left: ${centerX}px;
      top: ${centerY}px;
      transform: translate(-50%, -50%);
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
    `;
    element.textContent = symbol;
    document.body.appendChild(element);
    floatingSymbols.push(element);
  });

  // Animate portal
  gsap.fromTo(
    portal,
    { scale: 0, rotation: 0, opacity: 0 },
    {
      scale: 1,
      rotation: 360,
      opacity: 0.6,
      duration: 1.5,
      ease: "power2.out",
    },
  );

  gsap.to(portal, {
    scale: 2,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power2.in",
  });

  // Animate waves
  waves.forEach((wave, index) => {
    gsap.fromTo(
      wave,
      { scale: 0.5, opacity: 0.8 },
      {
        scale: 1.8,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        delay: index * 0.1,
      },
    );
  });

  // Animate floating symbols
  floatingSymbols.forEach((symbol, index) => {
    const angle = (index / floatingSymbols.length) * Math.PI * 2;
    const distance = 60 + Math.random() * 40;

    gsap.fromTo(
      symbol,
      { scale: 0, opacity: 1 },
      {
        scale: 1.5,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 20,
        opacity: 0,
        rotation: 360,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.3 + index * 0.1,
      },
    );
  });

  // Mystical card transformation
  const tl = gsap.timeline();
  tl.to(targetElement, {
    scale: 1.08,
    rotationY: 5,
    filter:
      "brightness(1.4) hue-rotate(30deg) saturate(1.3) drop-shadow(0 0 25px rgba(255, 255, 255, 0.8))",
    duration: 0.4,
    ease: "power2.out",
  })
    .to(targetElement, {
      rotationY: -5,
      filter:
        "brightness(1.4) hue-rotate(-30deg) saturate(1.3) drop-shadow(0 0 25px rgba(255, 255, 255, 0.8))",
      duration: 0.4,
      ease: "power2.inOut",
    })
    .to(targetElement, {
      scale: 1,
      rotationY: 0,
      filter: "none",
      duration: 0.5,
      ease: "power2.in",
    });

  return () => {
    [portal, ...waves, ...floatingSymbols].forEach((element) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  };
}
