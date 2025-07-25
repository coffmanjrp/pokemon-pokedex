"use client";

import { Pokemon, POKEMON_TYPE_COLORS, PokemonTypeName } from "@/types/pokemon";
import { cn } from "@/lib/utils";
import {
  getPokemonName,
  getPokemonGenus,
  getPokemonDisplayId,
} from "@/lib/pokemonUtils";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useRef, memo, useEffect, useState } from "react";
import {
  createParticleEchoCombo,
  createBabyHeartBurst,
  createLegendaryLightningBorder,
  createMythicalElectricSpark,
  AnimationConfig,
} from "@/lib/animations";
import { PokemonImage } from "../detail/PokemonImage";
import { PokemonTypes } from "../detail/PokemonTypes";
import { PokemonBadge } from "../../common/PokemonBadge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Locale } from "@/lib/dictionaries";
import {
  saveScrollPosition,
  setLastVisitedPokemon,
} from "@/store/slices/navigationSlice";
import {
  saveScrollPositionToStorage,
  saveLastVisitedPokemon,
} from "@/lib/utils/scrollStorage";

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: (pokemon: Pokemon) => void;
  className?: string;
  priority?: boolean;
  lang?: Locale;
  currentGeneration?: number;
  pokemonIndex?: number; // Index in the current list
}

const PokemonCard = memo(function PokemonCard({
  pokemon,
  onClick,
  className,
  priority = false,
  lang,
  currentGeneration,
  pokemonIndex,
}: PokemonCardProps) {
  const { language, dictionary } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const primaryType = pokemon.types[0]?.type.name as PokemonTypeName;
  const primaryColor = POKEMON_TYPE_COLORS[primaryType] || "#68A090";

  // Use props lang if provided, otherwise fallback to Redux language
  const currentLang = lang || language;

  // Build the detail page URL
  const detailUrl = `/${currentLang}/pokemon/${pokemon.id}${currentGeneration !== undefined ? `?from=generation-${currentGeneration}` : ""}`;

  // Prefetch on hover for instant navigation
  useEffect(() => {
    const prefetchOnHover = () => {
      router.prefetch(detailUrl);
    };

    const linkElement = linkRef.current;
    if (linkElement) {
      linkElement.addEventListener("mouseenter", prefetchOnHover);
      linkElement.addEventListener("touchstart", prefetchOnHover, {
        passive: true,
      });

      return () => {
        linkElement.removeEventListener("mouseenter", prefetchOnHover);
        linkElement.removeEventListener("touchstart", prefetchOnHover);
      };
    }
  }, [router, detailUrl]);

  const triggerAnimation = (e: React.MouseEvent) => {
    const linkElement = linkRef.current;
    if (!linkElement) return;

    // Find the grid container - try both standard grid and virtual grid containers
    let gridContainer = linkElement.closest(".grid") as HTMLElement;

    // If not found, look for the virtual grid container (react-window)
    if (!gridContainer) {
      // Look for the react-window Grid container by traversing up the DOM
      let parent = linkElement.parentElement;
      while (parent && parent !== document.body) {
        // Check if this is the react-window container (has specific data attributes or styles)
        if (parent.style.position === "relative" && parent.style.overflow) {
          gridContainer = parent;
          break;
        }
        parent = parent.parentElement;
      }
    }

    // If still not found, use the closest positioned parent as fallback
    if (!gridContainer) {
      gridContainer = linkElement.closest(
        '[style*="position: relative"]',
      ) as HTMLElement;
    }

    if (!gridContainer) {
      console.warn("Grid container not found for particle echo combo effect");
      return;
    }

    const animationConfig: AnimationConfig = {
      pokemon,
      clickEvent: e,
      targetElement: linkElement,
      gridContainer,
    };

    createParticleEchoCombo(animationConfig);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Save scroll position before navigation
    if (currentGeneration !== undefined) {
      const scrollData = {
        generation: currentGeneration,
        scrollTop: window.scrollY,
        ...(pokemonIndex !== undefined && { pokemonIndex }),
        pokemonId: pokemon.id,
        timestamp: Date.now(),
      };

      if (process.env.NODE_ENV === "development") {
        console.log("[PokemonCard] Saving scroll position:", scrollData);
      }

      // Save to Redux
      dispatch(saveScrollPosition(scrollData));
      dispatch(setLastVisitedPokemon(pokemon.id));

      // Save to sessionStorage
      saveScrollPositionToStorage(scrollData);
      saveLastVisitedPokemon(pokemon.id);
    }

    // Trigger animation without waiting for completion
    triggerAnimation(e);

    // Call onClick callback if provided (for Redux state updates)
    onClick?.(pokemon);

    // Navigate immediately for faster perceived performance
    router.push(detailUrl);
  };

  const formatPokemonId = (pokemon: Pokemon) => {
    // For Generation 0 (Other), display the base Pokemon ID instead of the form ID
    if (currentGeneration === 0) {
      const displayId = getPokemonDisplayId(pokemon);
      return `#${displayId.padStart(3, "0")}`;
    }
    return `#${pokemon.id.padStart(3, "0")}`;
  };

  const formatName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const displayName = getPokemonName(
    pokemon,
    currentLang,
    dictionary || undefined,
  );
  const genus = getPokemonGenus(pokemon, currentLang);

  // Check for special Pokemon classification for hover effects
  const isBaby = pokemon.species?.isBaby === true;
  const isLegendary = pokemon.species?.isLegendary === true;
  const isMythical = pokemon.species?.isMythical === true;
  const isSpecialPokemon = isBaby || isLegendary || isMythical;

  // State for hover animation and cleanup
  const [isHoverCooldown, setIsHoverCooldown] = useState(false);
  const [hoverCleanup, setHoverCleanup] = useState<(() => void) | null>(null);

  // Special hover effect for special Pokemon
  const handleSpecialHoverStart = () => {
    const linkElement = linkRef.current;
    if (!linkElement || isHoverCooldown || !isSpecialPokemon) return;

    // Throttle hover effects to prevent spam
    setIsHoverCooldown(true);
    setTimeout(() => setIsHoverCooldown(false), 1000);

    const animationConfig: AnimationConfig = {
      pokemon,
      clickEvent: new MouseEvent(
        "mouseenter",
      ) as unknown as React.MouseEvent<HTMLElement>,
      targetElement: linkElement,
    };

    // Choose appropriate hover effect based on Pokemon classification
    let cleanupFn: (() => void) | null = null;

    if (isBaby) {
      cleanupFn = createBabyHeartBurst(animationConfig);
    } else if (isLegendary) {
      cleanupFn = createLegendaryLightningBorder(animationConfig);
    } else if (isMythical) {
      cleanupFn = createMythicalElectricSpark(animationConfig);
    }

    if (cleanupFn) {
      setHoverCleanup(() => cleanupFn);
    }
  };

  const handleSpecialHoverEnd = () => {
    // Clean up any ongoing hover animations
    if (hoverCleanup) {
      hoverCleanup();
      setHoverCleanup(null);
    }
  };

  return (
    <Link
      ref={linkRef}
      href={detailUrl}
      prefetch={true}
      onClick={handleClick}
      onMouseEnter={handleSpecialHoverStart}
      onMouseLeave={handleSpecialHoverEnd}
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50",
        "border-2 border-gray-200 shadow-lg transition-all duration-300",
        "hover:shadow-xl hover:scale-105 hover:-translate-y-1",
        "active:scale-95 active:shadow-md", // Enhanced touch feedback
        "cursor-pointer group touch-manipulation block",
        // Special visual indicator for special Pokemon
        isSpecialPokemon && "ring-2 ring-opacity-50",
        isBaby && "ring-pink-300",
        isLegendary && "ring-yellow-400",
        isMythical && "ring-purple-400",
        className,
      )}
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

      {/* Pokemon Form Badge (Generation 0 only) */}
      {currentGeneration === 0 && dictionary && (
        <div className="absolute top-3 left-3 z-10">
          <PokemonBadge
            type="form"
            pokemon={pokemon}
            dictionary={dictionary}
            size="sm"
          />
        </div>
      )}

      {/* Pokemon ID and Special Classification Badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        {/* Special Pokemon Classification Badge */}
        {dictionary && (
          <PokemonBadge
            type="classification"
            pokemon={pokemon}
            dictionary={dictionary}
            size="sm"
          />
        )}

        {/* Pokemon ID */}
        <PokemonBadge
          text={formatPokemonId(pokemon)}
          variant="id"
          size="sm"
          customColor={primaryColor}
        />
      </div>

      {/* Pokemon Image */}
      <div className="relative h-36 sm:h-48 flex items-center justify-center p-3 md:mb-0 sm:p-4 mb-5">
        <PokemonImage pokemon={pokemon} priority={priority} />
      </div>

      {/* Pokemon Info */}
      <div className="p-3 sm:p-4 pt-0 pb-4">
        {/* Name */}
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 text-center leading-tight">
          {language === "ja" ? displayName : formatName(displayName)}
        </h3>

        {/* Types */}
        <PokemonTypes
          types={pokemon.types}
          {...(dictionary && { dictionary })}
        />

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
    </Link>
  );
});

export { PokemonCard };
