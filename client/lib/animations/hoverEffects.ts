import { gsap } from "gsap";
import { AnimationConfig, AnimationCleanupFunction } from "./types";

/**
 * Baby Pokemon gentle sparkle hover effect
 */
export function createBabyHoverSparkle(
  config: AnimationConfig,
): AnimationCleanupFunction {
  const { targetElement } = config;
  const sparkles: HTMLElement[] = [];
  let isActive = true;

  // Create continuous gentle glow on the card - using box-shadow instead
  const glowTween = gsap.to(targetElement, {
    boxShadow:
      "0 0 25px rgba(255, 182, 193, 0.6), 0 4px 20px rgba(255, 182, 193, 0.3)",
    scale: 1.02,
    duration: 1.5,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut",
  });

  // Create periodic sparkles
  const createSparkle = () => {
    if (!isActive) return;

    const rect = targetElement.getBoundingClientRect();
    const sparkle = document.createElement("div");
    sparkle.className = "fixed pointer-events-none z-50";

    // Random position within card bounds
    const x = rect.left + Math.random() * rect.width;
    const y = rect.top + Math.random() * rect.height;

    sparkle.style.cssText = `
      width: 6px;
      height: 6px;
      background: linear-gradient(45deg, #FFB6C1, #FFC0CB, #E6E6FA);
      border-radius: 50%;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 8px rgba(255, 182, 193, 0.8);
    `;

    document.body.appendChild(sparkle);
    sparkles.push(sparkle);

    // Animate sparkle
    gsap.fromTo(
      sparkle,
      { scale: 0, opacity: 1 },
      {
        scale: 1.5,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => {
          if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
          }
          const index = sparkles.indexOf(sparkle);
          if (index > -1) {
            sparkles.splice(index, 1);
          }
        },
      },
    );
  };

  // Create sparkles periodically
  const sparkleInterval = setInterval(createSparkle, 400);

  return () => {
    isActive = false;
    clearInterval(sparkleInterval);
    glowTween.kill();

    // Reset card to original state
    gsap.set(targetElement, {
      boxShadow: "",
      scale: 1,
    });

    // Clean up remaining sparkles
    sparkles.forEach((sparkle) => {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    });
  };
}

/**
 * Legendary Pokemon powerful aura hover effect
 */
export function createLegendaryHoverAura(
  config: AnimationConfig,
): AnimationCleanupFunction {
  const { targetElement } = config;
  const rect = targetElement.getBoundingClientRect();
  let isActive = true;

  // Create aura ring
  const aura = document.createElement("div");
  aura.className = "fixed pointer-events-none z-40";
  aura.style.cssText = `
    width: ${rect.width + 20}px;
    height: ${rect.height + 20}px;
    border: 3px solid rgba(255, 215, 0, 0.7);
    border-radius: 12px;
    left: ${rect.left + rect.width / 2}px;
    top: ${rect.top + rect.height / 2}px;
    transform: translate(-50%, -50%);
    box-shadow: 
      0 0 20px rgba(255, 215, 0, 0.6),
      inset 0 0 20px rgba(255, 215, 0, 0.3);
  `;
  document.body.appendChild(aura);

  // Continuous card glow - using box-shadow instead
  const cardGlow = gsap.to(targetElement, {
    boxShadow:
      "0 0 30px rgba(255, 215, 0, 0.5), 0 4px 25px rgba(255, 215, 0, 0.3)",
    scale: 1.02,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut",
  });

  // Pulsing aura
  const auraPulse = gsap.to(aura, {
    scale: 1.1,
    opacity: 0.8,
    duration: 1.5,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut",
  });

  // Occasional lightning flash
  const createLightning = () => {
    if (!isActive) return;

    const lightning = document.createElement("div");
    lightning.className = "fixed pointer-events-none z-50";
    lightning.style.cssText = `
      width: 2px;
      height: 40px;
      background: linear-gradient(to bottom, #FFD700, #FFA500);
      border-radius: 1px;
      box-shadow: 0 0 15px #FFD700;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg);
    `;
    document.body.appendChild(lightning);

    gsap.fromTo(
      lightning,
      { scale: 0, opacity: 1 },
      {
        scale: 1.5,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          if (lightning.parentNode) {
            lightning.parentNode.removeChild(lightning);
          }
        },
      },
    );
  };

  const lightningInterval = setInterval(createLightning, 1500);

  return () => {
    isActive = false;
    clearInterval(lightningInterval);
    cardGlow.kill();
    auraPulse.kill();

    // Reset card to original state
    gsap.set(targetElement, {
      boxShadow: "",
      scale: 1,
    });

    if (aura.parentNode) {
      aura.parentNode.removeChild(aura);
    }
  };
}

/**
 * Mythical Pokemon mystical shimmer hover effect
 */
export function createMythicalHoverShimmer(
  config: AnimationConfig,
): AnimationCleanupFunction {
  const { targetElement } = config;
  const rect = targetElement.getBoundingClientRect();
  const elements: HTMLElement[] = [];
  let isActive = true;

  // Create mystical shimmer overlay
  const shimmer = document.createElement("div");
  shimmer.className = "fixed pointer-events-none z-45";
  shimmer.style.cssText = `
    width: ${rect.width}px;
    height: ${rect.height}px;
    border-radius: 12px;
    left: ${rect.left + rect.width / 2}px;
    top: ${rect.top + rect.height / 2}px;
    transform: translate(-50%, -50%);
    background: linear-gradient(45deg, 
      rgba(255, 107, 107, 0.1),
      rgba(78, 205, 196, 0.1),
      rgba(69, 183, 209, 0.1),
      rgba(150, 206, 180, 0.1),
      rgba(254, 202, 87, 0.1),
      rgba(255, 159, 243, 0.1)
    );
    opacity: 0.5;
  `;
  document.body.appendChild(shimmer);
  elements.push(shimmer);

  // Continuous card transformation - using box-shadow instead
  const cardEffect = gsap.to(targetElement, {
    boxShadow:
      "0 0 20px rgba(255, 255, 255, 0.4), 0 4px 20px rgba(255, 255, 255, 0.2)",
    scale: 1.01,
    duration: 3,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut",
  });

  // Rotating shimmer effect
  const shimmerRotation = gsap.to(shimmer, {
    rotation: 360,
    duration: 8,
    repeat: -1,
    ease: "none",
  });

  // Periodic floating symbols
  const createSymbol = () => {
    if (!isActive) return;

    const symbols = ["✨", "🌟", "💫", "⭐"];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];

    const element = document.createElement("div");
    element.className = "fixed pointer-events-none z-50";
    element.style.cssText = `
      font-size: 16px;
      left: ${rect.left + Math.random() * rect.width}px;
      top: ${rect.top + rect.height + 10}px;
      transform: translateX(-50%);
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
    `;
    element.textContent = symbol || "✨";
    document.body.appendChild(element);
    elements.push(element);

    gsap.fromTo(
      element,
      { opacity: 0, y: 0 },
      {
        opacity: 1,
        y: -50,
        duration: 2,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(element, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              if (element.parentNode) {
                element.parentNode.removeChild(element);
              }
              const index = elements.indexOf(element);
              if (index > -1) {
                elements.splice(index, 1);
              }
            },
          });
        },
      },
    );
  };

  const symbolInterval = setInterval(createSymbol, 800);

  return () => {
    isActive = false;
    clearInterval(symbolInterval);
    cardEffect.kill();
    shimmerRotation.kill();

    // Reset card to original state
    gsap.set(targetElement, {
      boxShadow: "",
      scale: 1,
    });

    elements.forEach((element) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  };
}
