"use client";

import React from "react";
import { EvolutionDetail } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { EvolutionCard } from "../components/EvolutionCard";
import { EvolutionCondition } from "../components/EvolutionCondition";

interface CircularDesignProps {
  evolutionChain: EvolutionDetail;
  dictionary: Dictionary;
  lang: Locale;
}

export function CircularDesign({
  evolutionChain,
  dictionary,
  lang,
}: CircularDesignProps) {
  const evolutions = evolutionChain.evolvesTo || [];

  return (
    <div className="py-8">
      {/* Desktop View - Circular Layout */}
      <div className="hidden md:block">
        <div
          className="relative mx-auto"
          style={{ width: "600px", height: "600px" }}
        >
          {/* Center - Eevee */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <EvolutionCard
              pokemon={evolutionChain}
              dictionary={dictionary}
              lang={lang}
              size="lg"
            />
          </div>

          {/* Circle background */}
          <div className="absolute inset-0 rounded-full border-2 border-gray-200 border-dashed"></div>

          {/* Evolution cards in circle */}
          {evolutions.map((evolution, index) => {
            const angle = (index * 360) / evolutions.length - 90; // Start from top
            const radius = 250;
            const x = 50 + Math.cos((angle * Math.PI) / 180) * (radius / 3);
            const y = 50 + Math.sin((angle * Math.PI) / 180) * (radius / 3);

            return (
              <div
                key={evolution.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                {/* Connection line */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{
                    width: "300px",
                    height: "300px",
                    left: "-150px",
                    top: "-150px",
                  }}
                >
                  <line
                    x1="150"
                    y1="150"
                    x2={150 - Math.cos((angle * Math.PI) / 180) * 100}
                    y2={150 - Math.sin((angle * Math.PI) / 180) * 100}
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                </svg>

                <div className="flex flex-col items-center space-y-2 relative z-10">
                  <EvolutionCard
                    pokemon={evolution}
                    dictionary={dictionary}
                    lang={lang}
                    size="md"
                  />
                  <EvolutionCondition
                    evolutionDetails={evolution.evolutionDetails}
                    dictionary={dictionary}
                    lang={lang}
                    variant="compact"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile View - Compact Circle */}
      <div className="md:hidden">
        <div
          className="relative mx-auto"
          style={{ width: "350px", height: "350px" }}
        >
          {/* Center - Eevee */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <EvolutionCard
              pokemon={evolutionChain}
              dictionary={dictionary}
              lang={lang}
              size="md"
            />
          </div>

          {/* Evolution cards in smaller circle */}
          {evolutions.map((evolution, index) => {
            const angle = (index * 360) / evolutions.length - 90;
            const radius = 140;
            const x = 50 + Math.cos((angle * Math.PI) / 180) * (radius / 1.75);
            const y = 50 + Math.sin((angle * Math.PI) / 180) * (radius / 1.75);

            return (
              <div
                key={evolution.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                <div className="flex flex-col items-center space-y-1">
                  <EvolutionCard
                    pokemon={evolution}
                    dictionary={dictionary}
                    lang={lang}
                    size="sm"
                    showId={false}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Evolution conditions list for mobile */}
        <div className="mt-8 space-y-2">
          {evolutions.map((evolution) => (
            <div
              key={evolution.id}
              className="flex items-center justify-between bg-gray-50 rounded-lg p-2"
            >
              <span className="text-sm font-medium">
                {evolution.species?.names?.find((n) => n.language.name === lang)
                  ?.name || evolution.name}
              </span>
              <EvolutionCondition
                evolutionDetails={evolution.evolutionDetails}
                dictionary={dictionary}
                lang={lang}
                variant="compact"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
