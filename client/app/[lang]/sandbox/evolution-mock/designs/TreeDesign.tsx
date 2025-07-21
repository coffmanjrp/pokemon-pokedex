"use client";

import React from "react";
import { EvolutionDetail } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { EvolutionCard } from "../components/EvolutionCard";
import { EvolutionCondition } from "../components/EvolutionCondition";

interface TreeDesignProps {
  evolutionChain: EvolutionDetail;
  dictionary: Dictionary;
  lang: Locale;
}

export function TreeDesign({
  evolutionChain,
  dictionary,
  lang,
}: TreeDesignProps) {
  const evolutions = evolutionChain.evolvesTo || [];

  return (
    <div className="py-8">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex flex-col items-center space-y-8">
          {/* Eevee in center */}
          <div className="relative">
            <EvolutionCard
              pokemon={evolutionChain}
              dictionary={dictionary}
              lang={lang}
              size="lg"
            />
          </div>

          {/* Evolutions in tree structure */}
          <div className="relative w-full max-w-4xl">
            {/* Connection lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ minHeight: "400px" }}
              viewBox="0 0 800 400"
              preserveAspectRatio="xMidYMid meet"
            >
              {evolutions.map((evolution, index) => {
                const angle = index * 45 - 90; // Start from top, 45 degrees apart
                const startX = 400;
                const startY = 0;
                const endX = 400 + Math.cos((angle * Math.PI) / 180) * 250;
                const endY = 200 + Math.sin((angle * Math.PI) / 180) * 150;

                return (
                  <line
                    key={evolution.id}
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                );
              })}
            </svg>

            {/* Evolution cards positioned around */}
            <div className="relative" style={{ minHeight: "400px" }}>
              {evolutions.map((evolution, index) => {
                const angle = index * 45 - 90;
                const x = 50 + Math.cos((angle * Math.PI) / 180) * 31.25;
                const y = 50 + Math.sin((angle * Math.PI) / 180) * 37.5;

                return (
                  <div
                    key={evolution.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                    }}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <EvolutionCard
                        pokemon={evolution}
                        dictionary={dictionary}
                        lang={lang}
                        size="md"
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - Vertical List */}
      <div className="md:hidden">
        <div className="flex flex-col items-center space-y-6">
          {/* Eevee */}
          <EvolutionCard
            pokemon={evolutionChain}
            dictionary={dictionary}
            lang={lang}
            size="md"
          />

          {/* Evolutions */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {evolutions.map((evolution) => (
              <div
                key={evolution.id}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-blue-500 rotate-180 mb-2"></div>
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
