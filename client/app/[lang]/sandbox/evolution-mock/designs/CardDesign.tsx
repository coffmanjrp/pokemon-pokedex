"use client";

import React from "react";
import { EvolutionDetail } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { EvolutionCard } from "../components/EvolutionCard";
import { EvolutionCondition } from "../components/EvolutionCondition";
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

  return (
    <div className="py-8">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex gap-8 items-center justify-center">
          {/* Eevee Card */}
          <div className="flex-shrink-0">
            <EvolutionCard
              pokemon={evolutionChain}
              dictionary={dictionary}
              lang={lang}
              size="lg"
            />
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0">
            <HiArrowRight className="w-12 h-12 text-blue-500" />
          </div>

          {/* Evolution Options */}
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {dictionary.ui.pokemonDetails.evolutionOptions || "進化先"}
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {evolutions.map((evolution) => (
                <div
                  key={evolution.id}
                  className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <EvolutionCard
                    pokemon={evolution}
                    dictionary={dictionary}
                    lang={lang}
                    size="sm"
                    showId={false}
                  />
                  {evolution.evolutionDetails && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <EvolutionCondition
                        evolutionDetails={evolution.evolutionDetails}
                        dictionary={dictionary}
                        lang={lang}
                        variant="compact"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="space-y-6">
          {/* Eevee */}
          <div className="flex justify-center">
            <EvolutionCard
              pokemon={evolutionChain}
              dictionary={dictionary}
              lang={lang}
              size="md"
            />
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-0 h-0 border-l-12 border-r-12 border-b-16 border-l-transparent border-r-transparent border-b-blue-500 rotate-180"></div>
          </div>

          {/* Evolution Options */}
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <h3 className="text-base font-semibold mb-3 text-gray-800 text-center">
              {dictionary.ui.pokemonDetails.evolutionOptions || "進化先"}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {evolutions.map((evolution) => (
                <div
                  key={evolution.id}
                  className="bg-white rounded-lg p-2 shadow-sm"
                >
                  <EvolutionCard
                    pokemon={evolution}
                    dictionary={dictionary}
                    lang={lang}
                    size="sm"
                    showId={false}
                  />
                  {evolution.evolutionDetails && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <EvolutionCondition
                        evolutionDetails={evolution.evolutionDetails}
                        dictionary={dictionary}
                        lang={lang}
                        variant="compact"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
