"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EvolutionDetail, FormVariant } from "@/types/pokemon";
import { Locale, Dictionary } from "@/lib/dictionaries";
import { getFallbackText } from "@/lib/fallbackText";
import { renderEvolutionCondition } from "@/lib/evolution/evolutionConditions";
import { useEvolutionAnimation } from "@/hooks/useEvolutionAnimation";
import { EvolutionCard } from "./EvolutionCard";
import { FormVariationCard } from "./FormVariationCard";
import { EvolutionArrow } from "./EvolutionArrow";

interface PokemonEvolutionChainProps {
  evolutionChain: EvolutionDetail;
  lang: Locale;
  dictionary: Dictionary;
}

function PokemonEvolutionChainContent({
  evolutionChain,
  lang,
  dictionary,
}: PokemonEvolutionChainProps) {
  const searchParams = useSearchParams();
  const fromGeneration = searchParams.get("from");

  const { containerRef, triggerEvolutionAnimation, triggerFormAnimation } =
    useEvolutionAnimation({ lang, fromGeneration });

  const renderEvolutionChain = (
    evolution: EvolutionDetail,
  ): React.ReactElement[] => {
    const chain: React.ReactElement[] = [];

    const addEvolutionStage = (currentEvolution: EvolutionDetail) => {
      if (!currentEvolution) return;

      // Add Pokemon card
      chain.push(
        <div
          key={`pokemon-${currentEvolution.id}`}
          className="flex flex-col items-center"
        >
          <EvolutionCard
            pokemon={currentEvolution}
            lang={lang}
            onClick={triggerEvolutionAnimation}
            dictionary={dictionary}
            fallback={getFallbackText(lang)}
          />

          {/* Form Variations - Always Visible */}
          {currentEvolution.forms &&
            Array.isArray(currentEvolution.forms) &&
            currentEvolution.forms.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-xs text-gray-600 font-medium text-center">
                  {dictionary.ui.pokemonDetails.forms}
                </div>
                <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                  {currentEvolution.forms.map((form: FormVariant) => (
                    <FormVariationCard
                      key={form.id}
                      form={form}
                      pokemonName={currentEvolution.name}
                      lang={lang}
                      onClick={triggerFormAnimation}
                      dictionary={dictionary}
                      fallback={getFallbackText(lang)}
                    />
                  ))}
                </div>
              </div>
            )}
        </div>,
      );

      // Add evolution arrow and next stage if evolution exists
      if (
        currentEvolution.evolvesTo &&
        Array.isArray(currentEvolution.evolvesTo) &&
        currentEvolution.evolvesTo.length > 0
      ) {
        const nextEvolution = currentEvolution.evolvesTo[0];

        if (nextEvolution) {
          // Get evolution condition
          const condition =
            Array.isArray(nextEvolution.evolutionDetails) &&
            nextEvolution.evolutionDetails.length > 0 &&
            nextEvolution.evolutionDetails[0]
              ? renderEvolutionCondition(
                  nextEvolution.evolutionDetails[0],
                  lang,
                  dictionary,
                  getFallbackText(lang),
                )
              : dictionary.ui.error.unknown;

          // Add arrow
          chain.push(
            <EvolutionArrow
              key={`arrow-${nextEvolution.id}`}
              condition={condition}
              nextEvolutionId={nextEvolution.id}
            />,
          );

          // Recursively add next evolution
          addEvolutionStage(nextEvolution);
        }
      }
    };

    addEvolutionStage(evolution);
    return chain;
  };

  if (!evolutionChain) {
    return null;
  }

  return (
    <div ref={containerRef}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {dictionary.ui.pokemonDetails.evolutionChain}
      </h2>
      {/* Mobile: Vertical layout, Desktop: Horizontal layout */}
      <div className="flex justify-center">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0 px-2 md:px-4">
          {renderEvolutionChain(evolutionChain)}
        </div>
      </div>
    </div>
  );
}

export function PokemonEvolutionChain({
  evolutionChain,
  lang,
  dictionary,
}: PokemonEvolutionChainProps) {
  if (!evolutionChain) {
    return null;
  }

  return (
    <Suspense
      fallback={<div>{dictionary.ui.pokemonDetails.evolutionChain}</div>}
    >
      <PokemonEvolutionChainContent
        evolutionChain={evolutionChain}
        lang={lang}
        dictionary={dictionary}
      />
    </Suspense>
  );
}
