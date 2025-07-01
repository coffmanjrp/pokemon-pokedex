import { useRef } from "react";
import { EvolutionDetail, FormVariant, Pokemon } from "@/types/pokemon";
import { Locale } from "@/lib/dictionaries";
import { createParticleEchoCombo, AnimationConfig } from "@/lib/animations";

interface UseEvolutionAnimationProps {
  lang: Locale;
  fromGeneration?: string | null;
}

export function useEvolutionAnimation({
  lang,
  fromGeneration,
}: UseEvolutionAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper function to create Pokemon URL with generation parameter
  const createPokemonUrl = (pokemonId: string) => {
    const baseUrl = `/${lang}/pokemon/${pokemonId}`;
    return fromGeneration ? `${baseUrl}?from=${fromGeneration}` : baseUrl;
  };

  const triggerEvolutionAnimation = (
    e: React.MouseEvent,
    pokemon: EvolutionDetail,
  ) => {
    e.preventDefault();

    const card = e.currentTarget as HTMLElement;
    const gridContainer = containerRef.current;

    if (!card || !gridContainer) {
      console.warn("Evolution animation elements not found");
      return;
    }

    // Create a mock Pokemon object for the animation
    const mockPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types || [],
    };

    const animationConfig: AnimationConfig = {
      pokemon: mockPokemon as Pokemon,
      clickEvent: e,
      targetElement: card,
      gridContainer,
    };

    createParticleEchoCombo(animationConfig);

    // Small delay for visual feedback before navigation
    setTimeout(() => {
      window.location.href = createPokemonUrl(pokemon.id);
    }, 200);
  };

  const triggerFormAnimation = (
    e: React.MouseEvent,
    form: FormVariant,
    pokemonName: string,
  ) => {
    e.preventDefault();

    const card = e.currentTarget as HTMLElement;
    const gridContainer = containerRef.current;

    if (!card || !gridContainer) {
      console.warn("Form animation elements not found");
      return;
    }

    // Create a mock Pokemon object for the animation
    const mockPokemon = {
      id: form.id,
      name: pokemonName,
      types: form.types || [],
    };

    const animationConfig: AnimationConfig = {
      pokemon: mockPokemon as Pokemon,
      clickEvent: e,
      targetElement: card,
      gridContainer,
    };

    createParticleEchoCombo(animationConfig);

    // Small delay for visual feedback before navigation
    setTimeout(() => {
      window.location.href = createPokemonUrl(form.id);
    }, 200);
  };

  return {
    containerRef,
    triggerEvolutionAnimation,
    triggerFormAnimation,
  };
}
