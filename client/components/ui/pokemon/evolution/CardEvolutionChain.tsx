"use client";

import React from "react";
import { EvolutionDetail } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { EvolutionCard } from "./EvolutionCard";
import { EvolutionConditionBadge } from "./EvolutionConditionBadge";
import { EvolutionArrow } from "./EvolutionArrow";
import { getFallbackText } from "@/lib/fallbackText";
import { renderEvolutionCondition } from "@/lib/evolution/evolutionConditions";
import { areConditionsSimilar } from "@/lib/evolution/evolutionConditionShortener";

interface CardEvolutionChainProps {
  evolutionChain: EvolutionDetail;
  lang: Locale;
  dictionary: Dictionary;
  onPokemonClick: (e: React.MouseEvent, pokemon: EvolutionDetail) => void;
}

export function CardEvolutionChain({
  evolutionChain,
  lang,
  dictionary,
  onPokemonClick,
}: CardEvolutionChainProps) {
  const evolutions = evolutionChain.evolvesTo || [];
  const fallback = getFallbackText(lang);

  // Check for duplicate conditions
  const conditions = evolutions.map((evolution) => {
    if (
      evolution.evolutionDetails &&
      evolution.evolutionDetails.length > 0 &&
      evolution.evolutionDetails[0]
    ) {
      return renderEvolutionCondition(
        evolution.evolutionDetails[0],
        lang,
        dictionary,
        fallback,
      );
    }
    return "";
  });

  // Find if there are similar conditions (e.g., same except day/night)
  const hasSimilarConditions = conditions.some((cond1, idx1) =>
    conditions.some(
      (cond2, idx2) =>
        idx1 !== idx2 && cond1 && cond2 && areConditionsSimilar(cond1, cond2),
    ),
  );

  // For Pokemon with no evolutions, show single card
  if (evolutions.length === 0) {
    return (
      <div className="flex justify-center">
        <EvolutionCard
          pokemon={evolutionChain}
          dictionary={dictionary}
          lang={lang}
          onClick={onPokemonClick}
          fallback={fallback}
        />
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex items-center justify-center">
          {/* Base Pokemon */}
          <EvolutionCard
            pokemon={evolutionChain}
            dictionary={dictionary}
            lang={lang}
            onClick={onPokemonClick}
            fallback={fallback}
          />

          {/* Arrow */}
          <EvolutionArrow
            nextEvolutionId="branch"
            showCondition={false}
            variant="horizontal"
          />

          {/* Evolution Options */}
          <div
            className={`grid gap-6 ${
              evolutions.length <= 2
                ? "grid-cols-2"
                : evolutions.length <= 4
                  ? "grid-cols-2"
                  : "grid-cols-4"
            }`}
          >
            {evolutions.map((evolution) => (
              <div
                key={evolution.id}
                className="flex flex-col items-center space-y-3"
              >
                <EvolutionCard
                  pokemon={evolution}
                  dictionary={dictionary}
                  lang={lang}
                  onClick={onPokemonClick}
                  fallback={fallback}
                />
                {evolution.evolutionDetails && (
                  <EvolutionConditionBadge
                    evolutionDetails={evolution.evolutionDetails}
                    dictionary={dictionary}
                    lang={lang}
                    shortened={hasSimilarConditions}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="space-y-6">
          {/* Base Pokemon */}
          <div className="flex justify-center">
            <EvolutionCard
              pokemon={evolutionChain}
              dictionary={dictionary}
              lang={lang}
              onClick={onPokemonClick}
              fallback={fallback}
            />
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <EvolutionArrow
              nextEvolutionId="branch"
              showCondition={false}
              variant="vertical"
            />
          </div>

          {/* Evolution Options */}
          <div className="grid grid-cols-2 gap-3 px-2">
            {evolutions.map((evolution) => (
              <div
                key={evolution.id}
                className="flex flex-col items-center space-y-2 max-w-[160px]"
              >
                <EvolutionCard
                  pokemon={evolution}
                  dictionary={dictionary}
                  lang={lang}
                  onClick={onPokemonClick}
                  fallback={fallback}
                />
                {evolution.evolutionDetails && (
                  <EvolutionConditionBadge
                    evolutionDetails={evolution.evolutionDetails}
                    dictionary={dictionary}
                    lang={lang}
                    variant="compact"
                    shortened={hasSimilarConditions}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
