"use client";

import { Pokemon, POKEMON_TYPE_COLORS, PokemonTypeName } from "@/types/pokemon";
import { cn } from "@/lib/utils";
import { getPokemonName, getPokemonGenus } from "@/lib/pokemonUtils";
import { useAppSelector } from "@/store/hooks";
import { useRef, memo } from "react";
import { createParticleEchoCombo, AnimationConfig } from "@/lib/animations";
import { PokemonImage } from "./PokemonImage";
import { PokemonTypes } from "./PokemonTypes";

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: (pokemon: Pokemon) => void;
  className?: string;
  priority?: boolean;
}

const PokemonCard = memo(
  function PokemonCard({
    pokemon,
    onClick,
    className,
    priority = false,
  }: PokemonCardProps) {
    const { language } = useAppSelector((state) => state.ui);
    const cardRef = useRef<HTMLDivElement>(null);
    const primaryType = pokemon.types[0]?.type.name as PokemonTypeName;
    const primaryColor = POKEMON_TYPE_COLORS[primaryType] || "#68A090";

    const triggerAnimation = (e: React.MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;

      // Find the grid container for border echo effects
      const gridContainer = card.closest(".grid") as HTMLElement;

      if (!gridContainer) {
        console.warn("Grid container not found for particle echo combo effect");
        return;
      }

      // Use actual click position for particle burst
      // No need to modify the click event - use it as is

      const animationConfig: AnimationConfig = {
        pokemon,
        clickEvent: e,
        targetElement: card,
        gridContainer,
      };

      createParticleEchoCombo(animationConfig);
    };

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      triggerAnimation(e);
      onClick?.(pokemon);
    };

    const formatPokemonId = (id: string) => {
      return `#${id.padStart(3, "0")}`;
    };

    const formatName = (name: string) => {
      return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const displayName = getPokemonName(pokemon, language);
    const genus = getPokemonGenus(pokemon, language);

    return (
      <div
        ref={cardRef}
        className={cn(
          "relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50",
          "border-2 border-gray-200 shadow-lg transition-all duration-300",
          "hover:shadow-xl hover:scale-105 hover:-translate-y-1",
          "active:scale-95 active:shadow-md", // Enhanced touch feedback
          "cursor-pointer group touch-manipulation",
          className,
        )}
        onClick={handleClick}
        style={{
          borderColor: primaryColor,
          boxShadow: `0 4px 20px ${primaryColor}20`,
          touchAction: "manipulation", // Prevent double-tap zoom
        }}
      >
        {/* Type-based Background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundColor: primaryColor,
          }}
        />

        {/* Pokemon ID */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: primaryColor }}
          >
            {formatPokemonId(pokemon.id)}
          </span>
        </div>

        {/* Pokemon Image */}
        <div className="relative h-36 sm:h-48 flex items-center justify-center p-3 sm:p-4">
          <PokemonImage pokemon={pokemon} priority={priority} />
        </div>

        {/* Pokemon Info */}
        <div className="p-3 sm:p-4 pt-0">
          {/* Name */}
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 text-center leading-tight">
            {language === "ja" ? displayName : formatName(displayName)}
          </h3>

          {/* Types */}
          <PokemonTypes types={pokemon.types} language={language} />

          {/* Species Classification */}
          {genus && (
            <div className="text-center mt-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-bold">
                {genus}
              </span>
            </div>
          )}
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if pokemon ID changes to prevent unnecessary re-renders
    return (
      prevProps.pokemon.id === nextProps.pokemon.id &&
      prevProps.priority === nextProps.priority
    );
  },
);

export { PokemonCard };
