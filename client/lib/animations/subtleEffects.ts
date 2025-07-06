import { gsap } from "gsap";
import { AnimationConfig, AnimationCleanupFunction } from "./types";
import { POKEMON_TYPE_COLORS, PokemonTypeName } from "@/types/pokemon";

/**
 * 7. Baby Heart Burst - cute hearts that burst briefly on hover for baby Pokemon
 */
export function createBabyHeartBurst(
  config: AnimationConfig,
): AnimationCleanupFunction {
  const { targetElement } = config;
  const rect = targetElement.getBoundingClientRect();
  const hearts: HTMLElement[] = [];

  // Create heart elements
  const heartSymbols = ["💕", "💖", "💗", "💘", "💝"];
  const heartCount = 8;

  // Calculate positions around card perimeter
  const positions = [
    // Top edge
    { x: rect.left + rect.width * 0.3, y: rect.top },
    { x: rect.left + rect.width * 0.7, y: rect.top },
    // Right edge
    { x: rect.right, y: rect.top + rect.height * 0.3 },
    { x: rect.right, y: rect.top + rect.height * 0.7 },
    // Bottom edge
    { x: rect.left + rect.width * 0.7, y: rect.bottom },
    { x: rect.left + rect.width * 0.3, y: rect.bottom },
    // Left edge
    { x: rect.left, y: rect.top + rect.height * 0.7 },
    { x: rect.left, y: rect.top + rect.height * 0.3 },
  ];

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.className = "fixed pointer-events-none z-50";
    const startPos = positions[i];

    if (!startPos) continue;

    heart.style.cssText = `
      font-size: 16px;
      left: ${startPos.x}px;
      top: ${startPos.y}px;
      transform: translate(-50%, -50%);
      filter: drop-shadow(0 0 10px rgba(255, 182, 193, 0.8));
    `;
    heart.textContent =
      heartSymbols[Math.floor(Math.random() * heartSymbols.length)] || "💕";
    document.body.appendChild(heart);
    hearts.push(heart);
  }

  // Animate hearts bursting outward from card edges
  hearts.forEach((heart, index) => {
    const startPos = positions[index];
    if (!startPos) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate direction away from card center
    const directionX = startPos.x - centerX;
    const directionY = startPos.y - centerY;
    const magnitude = Math.sqrt(
      directionX * directionX + directionY * directionY,
    );
    const normalizedX = directionX / magnitude;
    const normalizedY = directionY / magnitude;

    // Distance to fly outward (beyond card boundaries)
    const flyDistance = 80 + Math.random() * 40;
    const targetX = normalizedX * flyDistance;
    const targetY = normalizedY * flyDistance;

    gsap.fromTo(
      heart,
      {
        scale: 0,
        rotation: 0,
        opacity: 1,
        x: 0,
        y: 0,
      },
      {
        scale: 1.4,
        rotation: 360 * (Math.random() > 0.5 ? 1 : -1),
        x: targetX,
        y: targetY,
        opacity: 0,
        duration: 1.0 + Math.random() * 0.5,
        ease: "power2.out",
        delay: Math.random() * 0.15,
      },
    );
  });

  // Add gentle pink glow to card during burst - using box-shadow instead
  const cardGlow = gsap.to(targetElement, {
    boxShadow:
      "0 0 20px rgba(255, 182, 193, 0.6), 0 4px 15px rgba(255, 182, 193, 0.4)",
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: "power2.out",
  });

  // Cleanup function - automatically clean up after animation completes
  setTimeout(() => {
    hearts.forEach((heart) => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    });
  }, 2000);

  return () => {
    cardGlow.kill();

    // Reset card to original state
    gsap.set(targetElement, {
      boxShadow: "",
    });

    hearts.forEach((heart) => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    });
  };
}

/**
 * 8. Legendary Dual Type Border Flow - types colors flowing around border
 */
export function createLegendaryBorderFlow(
  config: AnimationConfig,
): AnimationCleanupFunction {
  const { targetElement, pokemon } = config;
  const rect = targetElement.getBoundingClientRect();

  // Get Pokemon type colors
  const primaryType = pokemon.types?.[0]?.type?.name as PokemonTypeName;
  const secondaryType = pokemon.types?.[1]?.type?.name as PokemonTypeName;
  const primaryColor = POKEMON_TYPE_COLORS[primaryType] || "#FFD700";
  const secondaryColor = secondaryType
    ? POKEMON_TYPE_COLORS[secondaryType]
    : "#FFA500";

  // Create border overlay
  const borderOverlay = document.createElement("div");
  borderOverlay.className = "fixed pointer-events-none z-40";
  borderOverlay.style.cssText = `
    width: ${rect.width + 6}px;
    height: ${rect.height + 6}px;
    left: ${rect.left + rect.width / 2}px;
    top: ${rect.top + rect.height / 2}px;
    transform: translate(-50%, -50%);
    border-radius: 12px;
    border: 3px solid transparent;
    background: linear-gradient(45deg, ${primaryColor}, ${secondaryColor}, ${primaryColor}) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
  `;
  document.body.appendChild(borderOverlay);

  // Animate flowing border
  const flowTween = gsap.to(borderOverlay, {
    backgroundPosition: "200% 0",
    duration: 3,
    repeat: -1,
    ease: "none",
  });

  // Add subtle card glow - using box-shadow instead
  const cardGlow = gsap.to(targetElement, {
    boxShadow: `0 0 20px ${primaryColor}40, 0 4px 15px ${primaryColor}20`,
    scale: 1.005,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut",
  });

  return () => {
    flowTween.kill();
    cardGlow.kill();

    // Reset card to original state
    gsap.set(targetElement, {
      boxShadow: "",
    });

    if (borderOverlay.parentNode) {
      borderOverlay.parentNode.removeChild(borderOverlay);
    }
  };
}

/**
 * 9. Legendary Rainbow Border Pulse - prismatic rainbow border
 */
export function createLegendaryRainbowBorder(
  config: AnimationConfig,
): AnimationCleanupFunction {
  const { targetElement } = config;
  const rect = targetElement.getBoundingClientRect();

  // Create rainbow border overlay
  const rainbowBorder = document.createElement("div");
  rainbowBorder.className = "fixed pointer-events-none z-40";
  rainbowBorder.style.cssText = `
    width: ${rect.width + 8}px;
    height: ${rect.height + 8}px;
    left: ${rect.left + rect.width / 2}px;
    top: ${rect.top + rect.height / 2}px;
    transform: translate(-50%, -50%);
    border-radius: 12px;
    border: 4px solid transparent;
    background: conic-gradient(
      from 0deg,
      #FF6B6B, #FF8E53, #FF6B9D, #C44569,
      #F8B500, #FFD93D, #6BCF7F, #4ECDC4,
      #45B7D1, #96CEB4, #FECA57, #FF9FF3,
      #54A0FF, #5F27CD, #FF6B6B
    ) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
  `;
  document.body.appendChild(rainbowBorder);

  // Rotate rainbow border
  const rotateTween = gsap.to(rainbowBorder, {
    rotation: 360,
    duration: 4,
    repeat: -1,
    ease: "none",
  });

  // Pulse the border intensity
  const pulseTween = gsap.to(rainbowBorder, {
    opacity: 0.6,
    duration: 1.5,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut",
  });

  // Add prismatic card glow - using box-shadow instead
  const cardGlow = gsap.to(targetElement, {
    boxShadow:
      "0 0 20px rgba(255, 255, 255, 0.5), 0 4px 15px rgba(255, 255, 255, 0.3)",
    scale: 1.005,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut",
  });

  return () => {
    rotateTween.kill();
    pulseTween.kill();
    cardGlow.kill();

    // Reset card to original state
    gsap.set(targetElement, {
      boxShadow: "",
    });

    if (rainbowBorder.parentNode) {
      rainbowBorder.parentNode.removeChild(rainbowBorder);
    }
  };
}

/**
 * 10. Legendary Golden Lightning Border - electric golden border
 */
export function createLegendaryLightningBorder(
  config: AnimationConfig,
): AnimationCleanupFunction {
  const { targetElement } = config;
  const rect = targetElement.getBoundingClientRect();
  const elements: HTMLElement[] = [];

  // Golden border removed - keeping only glow and sparks

  // Create lightning sparks along border
  const createLightningSpark = () => {
    const spark = document.createElement("div");
    spark.className = "fixed pointer-events-none z-45";

    // Random position along border perimeter
    const side = Math.floor(Math.random() * 4);
    let x, y;
    switch (side) {
      case 0: // top
        x = rect.left + Math.random() * rect.width;
        y = rect.top;
        break;
      case 1: // right
        x = rect.right;
        y = rect.top + Math.random() * rect.height;
        break;
      case 2: // bottom
        x = rect.left + Math.random() * rect.width;
        y = rect.bottom;
        break;
      case 3: // left
        x = rect.left;
        y = rect.top + Math.random() * rect.height;
        break;
    }

    spark.style.cssText = `
      width: 6px;
      height: 6px;
      background: radial-gradient(circle, #FFFF00, #FFD700);
      border-radius: 50%;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px #FFD700;
    `;
    document.body.appendChild(spark);
    elements.push(spark);

    // Animate spark
    gsap.fromTo(
      spark,
      { scale: 0, opacity: 1 },
      {
        scale: 2,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          if (spark.parentNode) {
            spark.parentNode.removeChild(spark);
          }
          const index = elements.indexOf(spark);
          if (index > -1) {
            elements.splice(index, 1);
          }
        },
      },
    );
  };

  // Create initial sparks immediately for instant effect
  createLightningSpark(); // Immediate first spark
  setTimeout(createLightningSpark, 50); // Second spark quickly
  setTimeout(createLightningSpark, 100); // Third spark
  const sparkInterval = setInterval(createLightningSpark, 120); // Very frequent sparks

  // Border pulse removed since border is removed

  // Immediate golden glow on hover - starts instantly then pulses
  gsap.set(targetElement, {
    boxShadow:
      "0 0 25px rgba(255, 215, 0, 0.5), 0 4px 20px rgba(255, 215, 0, 0.3)",
  });

  const cardGlow = gsap.to(targetElement, {
    boxShadow:
      "0 0 35px rgba(255, 215, 0, 0.7), 0 4px 25px rgba(255, 215, 0, 0.4)",
    duration: 0.8,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut",
  });

  return () => {
    clearInterval(sparkInterval);
    cardGlow.kill();

    // Reset card to original state - use gsap.to for smooth transition
    gsap.to(targetElement, {
      boxShadow: "none",
      duration: 0.3,
      ease: "power2.out",
    });

    elements.forEach((element) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  };
}

/**
 * 11. Mythical Electric Spark Hover - mystical electric sparks around card
 */
export function createMythicalElectricSpark(
  config: AnimationConfig,
): AnimationCleanupFunction {
  const { targetElement } = config;
  const rect = targetElement.getBoundingClientRect();
  const sparks: HTMLElement[] = [];
  let isActive = true;

  // Create electric sparks around card perimeter
  const createElectricSpark = () => {
    if (!isActive) return;

    const spark = document.createElement("div");
    spark.className = "fixed pointer-events-none z-45";

    // Random position around card perimeter (slightly outside)
    const side = Math.floor(Math.random() * 4);
    const offset = 15; // Distance outside card
    let x, y;

    switch (side) {
      case 0: // top
        x = rect.left + Math.random() * rect.width;
        y = rect.top - offset;
        break;
      case 1: // right
        x = rect.right + offset;
        y = rect.top + Math.random() * rect.height;
        break;
      case 2: // bottom
        x = rect.left + Math.random() * rect.width;
        y = rect.bottom + offset;
        break;
      case 3: // left
        x = rect.left - offset;
        y = rect.top + Math.random() * rect.height;
        break;
    }

    spark.style.cssText = `
      width: 4px;
      height: 4px;
      background: radial-gradient(circle, #E6E6FA, #DDA0DD, #9370DB);
      border-radius: 50%;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%);
      box-shadow: 
        0 0 8px rgba(221, 160, 221, 0.8),
        0 0 16px rgba(147, 112, 219, 0.4);
    `;
    document.body.appendChild(spark);
    sparks.push(spark);

    // Animate spark with electric movement
    const sparkTl = gsap.timeline();
    sparkTl
      .fromTo(
        spark,
        { scale: 0, opacity: 1 },
        {
          scale: 1.5,
          opacity: 0.8,
          duration: 0.2,
          ease: "power2.out",
        },
      )
      .to(spark, {
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 30,
        scale: 2,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          if (spark.parentNode) {
            spark.parentNode.removeChild(spark);
          }
          const index = sparks.indexOf(spark);
          if (index > -1) {
            sparks.splice(index, 1);
          }
        },
      });
  };

  // Create spark lines connecting sparks occasionally
  const createSparkLine = () => {
    if (!isActive || sparks.length < 2) return;

    const line = document.createElement("div");
    line.className = "fixed pointer-events-none z-44";

    // Connect two random existing sparks
    const spark1 = sparks[Math.floor(Math.random() * sparks.length)];
    const spark2 = sparks[Math.floor(Math.random() * sparks.length)];

    if (!spark1 || !spark2 || spark1 === spark2) return;

    const rect1 = spark1.getBoundingClientRect();
    const rect2 = spark2.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2;
    const y1 = rect1.top + rect1.height / 2;
    const x2 = rect2.left + rect2.width / 2;
    const y2 = rect2.top + rect2.height / 2;

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

    line.style.cssText = `
      width: ${length}px;
      height: 1px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(221, 160, 221, 0.8) 20%, 
        rgba(147, 112, 219, 1) 50%, 
        rgba(221, 160, 221, 0.8) 80%, 
        transparent 100%);
      left: ${x1}px;
      top: ${y1}px;
      transform-origin: 0 50%;
      transform: rotate(${angle}deg);
      box-shadow: 0 0 4px rgba(147, 112, 219, 0.6);
    `;
    document.body.appendChild(line);
    sparks.push(line);

    // Animate line
    gsap.fromTo(
      line,
      { opacity: 0, scaleX: 0 },
      {
        opacity: 1,
        scaleX: 1,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(line, {
            opacity: 0,
            duration: 0.3,
            delay: 0.1,
            onComplete: () => {
              if (line.parentNode) {
                line.parentNode.removeChild(line);
              }
              const index = sparks.indexOf(line);
              if (index > -1) {
                sparks.splice(index, 1);
              }
            },
          });
        },
      },
    );
  };

  // Create sparks periodically
  const sparkInterval = setInterval(createElectricSpark, 400); // Every 0.4 seconds
  const lineInterval = setInterval(createSparkLine, 1200); // Every 1.2 seconds

  // Mystical card glow - using box-shadow instead
  const cardGlow = gsap.to(targetElement, {
    boxShadow:
      "0 0 20px rgba(221, 160, 221, 0.4), 0 4px 15px rgba(221, 160, 221, 0.2)",
    duration: 2.5,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut",
  });

  return () => {
    isActive = false;
    clearInterval(sparkInterval);
    clearInterval(lineInterval);
    cardGlow.kill();

    // Reset card to original state
    gsap.set(targetElement, {
      boxShadow: "",
    });

    // Clean up remaining sparks and lines
    sparks.forEach((spark) => {
      if (spark.parentNode) {
        spark.parentNode.removeChild(spark);
      }
    });
  };
}
