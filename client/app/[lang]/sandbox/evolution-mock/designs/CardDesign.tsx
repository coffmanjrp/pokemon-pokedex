"use client";

import React from "react";
import { EvolutionDetail } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { EvolutionCard as ExistingEvolutionCard } from "@/components/ui/pokemon/evolution/EvolutionCard";
import { EvolutionConditionBadge } from "@/components/ui/pokemon/evolution/EvolutionConditionBadge";
import { getFallbackText } from "@/lib/fallbackText";
import { HiArrowRight } from "react-icons/hi2";

interface CardDesignProps {
  evolutionChain: EvolutionDetail;
  dictionary: Dictionary;
  lang: Locale;
}

export function CardDesign({
  evolutionChain,
  dictionary,
  lang,
}: CardDesignProps) {
  const evolutions = evolutionChain.evolvesTo || [];
  const fallback = getFallbackText(lang);

  // Dummy onClick handler for evolution cards
  const handleCardClick = (e: React.MouseEvent, pokemon: EvolutionDetail) => {
    console.log("Evolution card clicked:", pokemon.name);
  };

  return (
    <div className="py-8">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex items-center justify-center">
          {/* Eevee */}
          <ExistingEvolutionCard
            pokemon={evolutionChain}
            dictionary={dictionary}
            lang={lang}
            onClick={handleCardClick}
            fallback={fallback}
          />

          {/* Arrow */}
          <div className="mx-8">
            <HiArrowRight className="w-12 h-12 text-blue-500" />
          </div>

          {/* Evolution Options - No background, no title */}
          <div className="grid grid-cols-4 gap-6">
            {evolutions.map((evolution) => {
              return (
                <div
                  key={evolution.id}
                  className="flex flex-col items-center space-y-3"
                >
                  <ExistingEvolutionCard
                    pokemon={evolution}
                    dictionary={dictionary}
                    lang={lang}
                    onClick={handleCardClick}
                    fallback={fallback}
                  />
                  {evolution.evolutionDetails && (
                    <EvolutionConditionBadge
                      evolutionDetails={evolution.evolutionDetails}
                      dictionary={dictionary}
                      lang={lang}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="space-y-6">
          {/* Eevee */}
          <div className="flex justify-center">
            <ExistingEvolutionCard
              pokemon={evolutionChain}
              dictionary={dictionary}
              lang={lang}
              onClick={handleCardClick}
              fallback={fallback}
            />
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-0 h-0 border-l-12 border-r-12 border-b-16 border-l-transparent border-r-transparent border-b-blue-500 rotate-180"></div>
          </div>

          {/* Evolution Options - No background, no title */}
          <div className="grid grid-cols-2 gap-3 px-2">
            {evolutions.map((evolution) => {
              return (
                <div
                  key={evolution.id}
                  className="flex flex-col items-center space-y-2 max-w-[160px]"
                >
                  <ExistingEvolutionCard
                    pokemon={evolution}
                    dictionary={dictionary}
                    lang={lang}
                    onClick={handleCardClick}
                    fallback={fallback}
                  />
                  {evolution.evolutionDetails && (
                    <EvolutionConditionBadge
                      evolutionDetails={evolution.evolutionDetails}
                      dictionary={dictionary}
                      lang={lang}
                      variant="compact"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
