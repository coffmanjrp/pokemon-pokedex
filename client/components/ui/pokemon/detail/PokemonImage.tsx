"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Pokemon, PokemonTypeName, POKEMON_TYPE_COLORS } from "@/types/pokemon";
import {
  generatePokemonBlurDataURL,
  DEFAULT_BLUR_DATA_URL,
} from "@/lib/blurDataUtils";
// Use a simple SVG data URL as placeholder to avoid Next.js image optimization issues
const placeholderPokemon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Crect width='256' height='256' fill='%23f3f4f6'/%3E%3Ctext x='128' y='128' font-family='system-ui' font-size='120' text-anchor='middle' dominant-baseline='middle' fill='%23d1d5db'%3E%3F%3C/text%3E%3C/svg%3E";

interface PokemonImageProps {
  pokemon: Pokemon;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
}

export function PokemonImage({
  pokemon,
  size = "md",
  className,
  priority = false,
}: PokemonImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");

  const getImageUrl = () => {
    // Check if any sprite URL exists and is valid
    const officialArtwork =
      pokemon.sprites.other?.officialArtwork?.frontDefault;
    const homeSprite = pokemon.sprites.other?.home?.frontDefault;
    const defaultSprite = pokemon.sprites.frontDefault;

    // Return the first valid URL, or placeholder if all are null/undefined
    if (officialArtwork && officialArtwork !== "null") return officialArtwork;
    if (homeSprite && homeSprite !== "null") return homeSprite;
    if (defaultSprite && defaultSprite !== "null") return defaultSprite;

    return placeholderPokemon;
  };

  // Pokemon のプライマリタイプを取得
  const primaryType = pokemon.types[0]?.type?.name as PokemonTypeName;

  // Pokemon タイプに基づく動的blur placeholder
  const blurDataURL = primaryType
    ? generatePokemonBlurDataURL(primaryType)
    : DEFAULT_BLUR_DATA_URL;

  // Initialize image source
  useEffect(() => {
    const url = getImageUrl();
    setImageSrc(url);
    // If already using placeholder, set as loaded
    if (url === placeholderPokemon) {
      setImageLoaded(true);
    }
  }, [pokemon]); // eslint-disable-line react-hooks/exhaustive-deps

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-16 h-16";
      case "md":
        return "w-32 h-32";
      case "lg":
        return "w-48 h-48";
      case "xl":
        return "w-64 h-64";
      default:
        return "w-32 h-32";
    }
  };

  const getSizes = () => {
    switch (size) {
      case "sm":
        return "64px";
      case "md":
        return "128px";
      case "lg":
        return "192px";
      case "xl":
        return "256px";
      default:
        return "128px";
    }
  };

  const defaultClassName = `relative ${getSizeClasses()} group-hover:scale-110 transition-transform duration-300`;

  return (
    <div className={className || defaultClassName}>
      {/* Loading skeleton overlay while image loads - Pokemon type colored */}
      {!imageLoaded && (
        <div
          className="absolute inset-0 rounded-lg flex items-center justify-center z-10 transition-opacity duration-300"
          style={{
            background: primaryType
              ? `linear-gradient(135deg, ${POKEMON_TYPE_COLORS[primaryType]}20, ${POKEMON_TYPE_COLORS[primaryType]}10)`
              : "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
          }}
        >
          <div className="text-gray-400 text-xs animate-pulse">⚡</div>
        </div>
      )}

      <Image
        src={imageSrc || placeholderPokemon}
        alt={pokemon.name}
        fill
        className={`object-contain drop-shadow-lg transition-opacity duration-500 rounded-lg ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        sizes={getSizes()}
        priority={priority}
        quality={priority ? 90 : 75} // Higher quality for priority images, optimized for others
        placeholder="blur"
        blurDataURL={blurDataURL}
        loading={priority ? "eager" : "lazy"}
        unoptimized={typeof imageSrc === "string" && imageSrc.includes(".gif")} // Preserve GIF animations only
        fetchPriority={priority ? "high" : "low"}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          if (imageSrc !== placeholderPokemon) {
            setImageSrc(placeholderPokemon);
            setImageLoaded(true);
          }
        }}
      />
    </div>
  );
}
