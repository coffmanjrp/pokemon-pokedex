"use client";

import React from "react";
import { EvolutionDetail } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { EvolutionCard } from "../components/EvolutionCard";
import { EvolutionCondition } from "../components/EvolutionCondition";

interface GridDesignProps {
  evolutionChain: EvolutionDetail;
  dictionary: Dictionary;
  lang: Locale;
}

export function GridDesign({
  evolutionChain,
  dictionary,
  lang,
}: GridDesignProps) {
  const evolutions = evolutionChain.evolvesTo || [];
  const topRow = evolutions.slice(0, 4);
  const bottomRow = evolutions.slice(4, 8);

  return (
    <div className="py-8">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex flex-col items-center space-y-8">
          {/* Top row */}
          <div className="grid grid-cols-4 gap-8">
            {topRow.map((evolution) => (
              <div key={evolution.id} className="flex flex-col items-center">
                <EvolutionCard
                  pokemon={evolution}
                  dictionary={dictionary}
                  lang={lang}
                  size="md"
                />
                {evolution.evolutionDetails && (
                  <div className="mt-2">
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

          {/* Connection lines and Eevee */}
          <div className="relative" style={{ width: "600px", height: "150px" }}>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 600 150"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Top connections */}
              {topRow.map((_, index) => (
                <line
                  key={`top-${index}`}
                  x1={75 + index * 150}
                  y1="0"
                  x2="300"
                  y2="75"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              ))}
              {/* Bottom connections */}
              {bottomRow.map((_, index) => (
                <line
                  key={`bottom-${index}`}
                  x1={75 + index * 150}
                  y1="150"
                  x2="300"
                  y2="75"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              ))}
            </svg>

            {/* Eevee in center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <EvolutionCard
                pokemon={evolutionChain}
                dictionary={dictionary}
                lang={lang}
                size="lg"
              />
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-4 gap-8">
            {bottomRow.map((evolution) => (
              <div key={evolution.id} className="flex flex-col items-center">
                <EvolutionCard
                  pokemon={evolution}
                  dictionary={dictionary}
                  lang={lang}
                  size="md"
                />
                {evolution.evolutionDetails && (
                  <div className="mt-2">
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

      {/* Mobile View - Vertical Grid */}
      <div className="md:hidden">
        <div className="flex flex-col items-center space-y-6">
          {/* Eevee */}
          <EvolutionCard
            pokemon={evolutionChain}
            dictionary={dictionary}
            lang={lang}
            size="md"
          />

          {/* Arrow */}
          <div className="w-0 h-0 border-l-12 border-r-12 border-b-16 border-l-transparent border-r-transparent border-b-blue-500 rotate-180"></div>

          {/* Evolutions in 2x4 grid */}
          <div className="grid grid-cols-2 gap-4">
            {evolutions.map((evolution) => (
              <div
                key={evolution.id}
                className="flex flex-col items-center space-y-2"
              >
                <EvolutionCard
                  pokemon={evolution}
                  dictionary={dictionary}
                  lang={lang}
                  size="sm"
                />
                {evolution.evolutionDetails && (
                  <EvolutionCondition
                    evolutionDetails={evolution.evolutionDetails}
                    dictionary={dictionary}
                    lang={lang}
                    variant="compact"
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
