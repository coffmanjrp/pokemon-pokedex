"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Pokemon, POKEMON_TYPE_COLORS, PokemonTypeName } from "@/types/pokemon";

interface PageTransitionProps {
  isActive: boolean;
  pokemon?: Pokemon;
  sourceElement?: HTMLElement | null;
  onComplete?: () => void;
}

export function PageTransition({
  isActive,
  pokemon,
  sourceElement,
  onComplete,
}: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);

  // Memoize the completion callback to prevent dependency issues
  const handleComplete = useCallback(() => {
    setTimeout(() => {
      onComplete?.();
    }, 100);
  }, [onComplete]);

  useEffect(() => {
    if (!isActive || !pokemon || !sourceElement) return;

    // Get source element position once
    const rect = sourceElement.getBoundingClientRect();
    setSourceRect(rect);
  }, [isActive, pokemon, sourceElement]);

  useEffect(() => {
    if (
      !isActive ||
      !containerRef.current ||
      !overlayRef.current ||
      !pokemon ||
      !sourceRect
    )
      return;

    const tl = gsap.timeline({
      onComplete: handleComplete,
    });

    // Create Pokemon type color layers: Primary Pokemon type + 3 random types
    const allTypeNames = Object.keys(POKEMON_TYPE_COLORS) as PokemonTypeName[];
    const primaryTypeColor =
      POKEMON_TYPE_COLORS[pokemon.types[0]?.type.name as PokemonTypeName] ||
      POKEMON_TYPE_COLORS.normal;

    // Generate 3 random type colors (excluding the primary type)
    const availableTypes = allTypeNames.filter(
      (type) => type !== pokemon.types[0]?.type.name,
    );
    const randomTypes = [];
    for (let i = 0; i < 3 && availableTypes.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableTypes.length);
      const selectedType = availableTypes.splice(randomIndex, 1)[0];
      if (selectedType) {
        randomTypes.push(POKEMON_TYPE_COLORS[selectedType]);
      }
    }

    const typeColors = [primaryTypeColor, ...randomTypes];
    const colorLayers: HTMLElement[] = [];

    typeColors.forEach((color, index) => {
      const layer = document.createElement("div");
      layer.style.cssText = `
        position: fixed;
        left: 0;
        top: 100%;
        width: 100vw;
        height: 100vh;
        background: ${color};
        z-index: ${9999 - index};
        pointer-events: none;
      `;
      document.body.appendChild(layer);
      colorLayers.push(layer);
    });

    // Initial states
    gsap.set(overlayRef.current, { opacity: 0 });

    // Netflix-style sequential layer animation
    tl
      // Quick overlay fade
      .to(overlayRef.current, {
        opacity: 0.3,
        duration: 0.3,
        ease: "power2.out",
      });

    // Only add layer animations if layers exist
    if (colorLayers[0]) {
      tl
        // Layer 1: First color slides up and covers screen
        .to(colorLayers[0], {
          top: 0,
          duration: 0.6,
          ease: "expo.out",
        })
        // Layer 1 slides up, Layer 2 follows
        .to(
          colorLayers[0],
          {
            top: "-100%",
            duration: 0.5,
            ease: "expo.in",
          },
          "+=0.3",
        );
    }

    if (colorLayers[1]) {
      tl.to(
        colorLayers[1],
        {
          top: 0,
          duration: 0.6,
          ease: "expo.out",
        },
        "-=0.3",
      )
        // Layer 2 slides up, Layer 3 follows
        .to(
          colorLayers[1],
          {
            top: "-100%",
            duration: 0.5,
            ease: "expo.in",
          },
          "+=0.3",
        );

      if (colorLayers[2]) {
        tl.to(
          colorLayers[2],
          {
            top: 0,
            duration: 0.6,
            ease: "expo.out",
          },
          "-=0.3",
        )
          // Layer 3 slides up, Layer 4 follows
          .to(
            colorLayers[2],
            {
              top: "-100%",
              duration: 0.5,
              ease: "expo.in",
            },
            "+=0.3",
          );

        if (colorLayers[3]) {
          tl.to(
            colorLayers[3],
            {
              top: 0,
              duration: 0.6,
              ease: "expo.out",
            },
            "-=0.3",
          );
        }
      }
    }

    // Final layer stays and transition occurs
    tl.to({}, { duration: 0.4 })
      // Smooth fade to complete transition
      .to(
        [
          ...(colorLayers[3] ? [colorLayers[3]] : []),
          overlayRef.current,
        ].filter(Boolean),
        {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            colorLayers.forEach((layer) => {
              if (document.body.contains(layer)) {
                document.body.removeChild(layer);
              }
            });
          },
        },
      );

    return () => {
      tl.kill();
      colorLayers.forEach((layer) => {
        if (document.body.contains(layer)) {
          document.body.removeChild(layer);
        }
      });
    };
  }, [isActive, pokemon, sourceRect, handleComplete]);

  if (!isActive || !pokemon) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[60] pointer-events-none"
    >
      {/* Subtle overlay for depth */}
      <div ref={overlayRef} className="absolute inset-0 bg-black/10" />
    </div>
  );
}
