"use client";

import React from "react";
import { EvolutionDetail, FormVariant } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { EvolutionCard } from "./EvolutionCard";
import { FormVariationCard } from "./FormVariationCard";
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
  onFormClick?: (
    e: React.MouseEvent,
    form: FormVariant,
    pokemonName: string,
  ) => void;
}

// Helper function to determine evolution chain structure
function analyzeEvolutionChain(chain: EvolutionDetail): {
  hasMiddleEvolution: boolean;
  middleEvolution?: EvolutionDetail;
  finalEvolutions: EvolutionDetail[];
} {
  // Check if this is a simple branching evolution (like Eevee)
  if (chain.evolvesTo && chain.evolvesTo.length > 1) {
    // Direct branching from base form
    return {
      hasMiddleEvolution: false,
      finalEvolutions: chain.evolvesTo,
    };
  }

  // Check if this has a middle evolution that branches (like Poliwag → Poliwhirl → branches)
  if (chain.evolvesTo && chain.evolvesTo.length === 1) {
    const middleEvo = chain.evolvesTo[0];
    if (middleEvo && middleEvo.evolvesTo && middleEvo.evolvesTo.length > 0) {
      // This is a chain with middle evolution
      return {
        hasMiddleEvolution: true,
        middleEvolution: middleEvo,
        finalEvolutions: middleEvo.evolvesTo,
      };
    } else {
      // Single evolution chain, no branching
      return {
        hasMiddleEvolution: false,
        finalEvolutions: chain.evolvesTo,
      };
    }
  }

  // No evolutions
  return {
    hasMiddleEvolution: false,
    finalEvolutions: [],
  };
}

export function CardEvolutionChain({
  evolutionChain,
  lang,
  dictionary,
  onPokemonClick,
  onFormClick,
}: CardEvolutionChainProps) {
  // Analyze the evolution chain structure
  const chainAnalysis = analyzeEvolutionChain(evolutionChain);
  const { hasMiddleEvolution, middleEvolution, finalEvolutions } =
    chainAnalysis;
  const fallback = getFallbackText(lang);

  // Check for duplicate conditions
  const conditions = finalEvolutions.map((evolution) => {
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
  if (finalEvolutions.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <EvolutionCard
          pokemon={evolutionChain}
          dictionary={dictionary}
          lang={lang}
          onClick={onPokemonClick}
          fallback={fallback}
        />

        {/* Form Variations */}
        {evolutionChain.forms &&
          Array.isArray(evolutionChain.forms) &&
          evolutionChain.forms.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-xs text-gray-600 font-medium text-center">
                {dictionary.ui.pokemonDetails.forms}
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                {evolutionChain.forms.map((form: FormVariant) => (
                  <FormVariationCard
                    key={form.id}
                    form={form}
                    pokemonName={evolutionChain.name}
                    lang={lang}
                    onClick={onFormClick || (() => {})}
                    dictionary={dictionary}
                    fallback={fallback}
                  />
                ))}
              </div>
            </div>
          )}
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex items-center justify-center">
          {/* Base Pokemon */}
          <div className="flex flex-col items-center">
            <EvolutionCard
              pokemon={evolutionChain}
              dictionary={dictionary}
              lang={lang}
              onClick={onPokemonClick}
              fallback={fallback}
            />

            {/* Form Variations */}
            {evolutionChain.forms &&
              Array.isArray(evolutionChain.forms) &&
              evolutionChain.forms.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-xs text-gray-600 font-medium text-center">
                    {dictionary.ui.pokemonDetails.forms}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                    {evolutionChain.forms.map((form: FormVariant) => (
                      <FormVariationCard
                        key={form.id}
                        form={form}
                        pokemonName={evolutionChain.name}
                        lang={lang}
                        onClick={onFormClick || (() => {})}
                        dictionary={dictionary}
                        fallback={fallback}
                      />
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Arrow */}
          <EvolutionArrow
            nextEvolutionId={
              hasMiddleEvolution ? middleEvolution?.id || "middle" : "branch"
            }
            showCondition={false}
            variant="horizontal"
          />

          {/* Middle Evolution (if exists) */}
          {hasMiddleEvolution && middleEvolution && (
            <>
              <div className="flex flex-col items-center">
                <EvolutionCard
                  pokemon={middleEvolution}
                  dictionary={dictionary}
                  lang={lang}
                  onClick={onPokemonClick}
                  fallback={fallback}
                />

                {/* Form Variations for middle evolution */}
                {middleEvolution.forms &&
                  Array.isArray(middleEvolution.forms) &&
                  middleEvolution.forms.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-xs text-gray-600 font-medium text-center">
                        {dictionary.ui.pokemonDetails.forms}
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                        {middleEvolution.forms.map((form: FormVariant) => (
                          <FormVariationCard
                            key={form.id}
                            form={form}
                            pokemonName={middleEvolution.name}
                            lang={lang}
                            onClick={onFormClick || (() => {})}
                            dictionary={dictionary}
                            fallback={fallback}
                          />
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Arrow to final evolutions */}
              <EvolutionArrow
                nextEvolutionId="branch"
                showCondition={false}
                variant="horizontal"
              />
            </>
          )}

          {/* Final Evolution Options */}
          <div
            className={`grid gap-6 ${
              finalEvolutions.length <= 2
                ? "grid-cols-2"
                : finalEvolutions.length <= 4
                  ? "grid-cols-2"
                  : "grid-cols-4"
            }`}
          >
            {finalEvolutions.map((evolution) => (
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

                {/* Form Variations */}
                {evolution.forms &&
                  Array.isArray(evolution.forms) &&
                  evolution.forms.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <div className="text-xs text-gray-600 font-medium text-center">
                        {dictionary.ui.pokemonDetails.forms}
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                        {evolution.forms.map((form: FormVariant) => (
                          <FormVariationCard
                            key={form.id}
                            form={form}
                            pokemonName={evolution.name}
                            lang={lang}
                            onClick={onFormClick || (() => {})}
                            dictionary={dictionary}
                            fallback={fallback}
                          />
                        ))}
                      </div>
                    </div>
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
          <div className="flex flex-col items-center">
            <EvolutionCard
              pokemon={evolutionChain}
              dictionary={dictionary}
              lang={lang}
              onClick={onPokemonClick}
              fallback={fallback}
            />

            {/* Form Variations */}
            {evolutionChain.forms &&
              Array.isArray(evolutionChain.forms) &&
              evolutionChain.forms.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-xs text-gray-600 font-medium text-center">
                    {dictionary.ui.pokemonDetails.forms}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                    {evolutionChain.forms.map((form: FormVariant) => (
                      <FormVariationCard
                        key={form.id}
                        form={form}
                        pokemonName={evolutionChain.name}
                        lang={lang}
                        onClick={onFormClick || (() => {})}
                        dictionary={dictionary}
                        fallback={fallback}
                      />
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <EvolutionArrow
              nextEvolutionId={
                hasMiddleEvolution ? middleEvolution?.id || "middle" : "branch"
              }
              showCondition={false}
              variant="vertical"
            />
          </div>

          {/* Middle Evolution (if exists) */}
          {hasMiddleEvolution && middleEvolution && (
            <>
              <div className="flex flex-col items-center">
                <EvolutionCard
                  pokemon={middleEvolution}
                  dictionary={dictionary}
                  lang={lang}
                  onClick={onPokemonClick}
                  fallback={fallback}
                />

                {/* Form Variations for middle evolution */}
                {middleEvolution.forms &&
                  Array.isArray(middleEvolution.forms) &&
                  middleEvolution.forms.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-xs text-gray-600 font-medium text-center">
                        {dictionary.ui.pokemonDetails.forms}
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                        {middleEvolution.forms.map((form: FormVariant) => (
                          <FormVariationCard
                            key={form.id}
                            form={form}
                            pokemonName={middleEvolution.name}
                            lang={lang}
                            onClick={onFormClick || (() => {})}
                            dictionary={dictionary}
                            fallback={fallback}
                          />
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Arrow to final evolutions */}
              <div className="flex justify-center">
                <EvolutionArrow
                  nextEvolutionId="branch"
                  showCondition={false}
                  variant="vertical"
                />
              </div>
            </>
          )}

          {/* Final Evolution Options */}
          <div className="grid grid-cols-2 gap-3 px-2">
            {finalEvolutions.map((evolution) => (
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

                {/* Form Variations */}
                {evolution.forms &&
                  Array.isArray(evolution.forms) &&
                  evolution.forms.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-gray-600 font-medium text-center">
                        {dictionary.ui.pokemonDetails.forms}
                      </div>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {evolution.forms.map((form: FormVariant) => (
                          <FormVariationCard
                            key={form.id}
                            form={form}
                            pokemonName={evolution.name}
                            lang={lang}
                            onClick={onFormClick || (() => {})}
                            dictionary={dictionary}
                            fallback={fallback}
                          />
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
