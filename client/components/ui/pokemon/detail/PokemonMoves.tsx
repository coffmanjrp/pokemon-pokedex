"use client";

import { useState } from "react";
import { PokemonMove } from "@/types/pokemon";
import {
  getMoveLearnMethodName,
  getMoveName,
  getTypeName,
  getMoveFlavorText,
  getMoveTargetName,
} from "@/lib/pokemonUtils";
import { TabNavigation } from "../../common/TabNavigation";
import { DataEmptyState } from "../../common/DataEmptyState";
import { TypeBadge, LevelBadge } from "../../common/Badge";
import { InfoTooltip } from "../../common/InfoTooltip";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";
import { Locale, interpolate } from "@/lib/dictionaries";

interface PokemonMovesProps {
  moves?: PokemonMove[];
  language: Locale;
}

type LearnMethod = "level-up" | "machine" | "egg" | "tutor" | "other";

export function PokemonMoves({ moves, language }: PokemonMovesProps) {
  const [selectedMethod, setSelectedMethod] = useState<LearnMethod>("level-up");
  const { dictionary } = useAppSelector((state) => state.ui);

  if (!moves || moves.length === 0) {
    return <DataEmptyState type="moves" language={language} />;
  }

  // Group moves by learn method (simplified - no generation filtering)
  const movesByMethod = moves.reduce(
    (acc, move) => {
      move.versionGroupDetails.forEach((detail) => {
        const method = detail.moveLearnMethod.name as LearnMethod;
        if (!acc[method]) {
          acc[method] = [];
        }

        // Check if move already exists for this method
        const existing = acc[method].find(
          (m) => m.move.name === move.move.name,
        );
        if (!existing) {
          acc[method].push({
            ...move,
            versionGroupDetails: [detail],
          });
        } else {
          // Update level if this is a level-up move with a higher level
          const existingLevel =
            existing.versionGroupDetails[0]?.levelLearnedAt || 0;
          const newLevel = detail.levelLearnedAt || 0;
          if (method === "level-up" && newLevel > existingLevel) {
            existing.versionGroupDetails[0] = detail;
          }
        }
      });
      return acc;
    },
    {} as Record<LearnMethod, PokemonMove[]>,
  );

  // Use props language for consistent fallback behavior between server and client
  const fallback = getFallbackText(language);

  const text = {
    type: dictionary?.ui.pokemonDetails.type || fallback,
    category: dictionary?.ui.pokemonDetails.category || fallback,
    power: dictionary?.ui.pokemonDetails.power || fallback,
    accuracy: dictionary?.ui.pokemonDetails.accuracy || fallback,
    physical: dictionary?.ui.pokemonDetails.physical || fallback,
    special: dictionary?.ui.pokemonDetails.special || fallback,
    status: dictionary?.ui.pokemonDetails.status || fallback,
    noMovesFound: dictionary?.ui.pokemonDetails.noMovesFound || fallback,
    target: dictionary?.ui.pokemonDetails.target || "Target",
    description: dictionary?.ui.pokemonDetails.description || "Description",
  };


  const methodTabs: LearnMethod[] = ["level-up", "machine", "egg", "tutor"];
  const availableMethods = methodTabs.filter(
    (method) => movesByMethod[method]?.length > 0,
  );

  const tabsData = availableMethods.map((method) => ({
    id: method,
    label: dictionary ? getMoveLearnMethodName(method, dictionary) : method,
    count: movesByMethod[method]?.length || 0,
  }));

  const currentMoves = movesByMethod[selectedMethod] || [];

  return (
    <div className="space-y-6">
      <TabNavigation
        tabs={tabsData}
        activeTab={selectedMethod}
        onTabChange={setSelectedMethod}
        variant="underline"
      />

      {/* Moves List */}
      {currentMoves.length > 0 ? (
        <div className="grid gap-3">
          {currentMoves
            .sort((a, b) => {
              // Sort level-up moves by level
              if (selectedMethod === "level-up") {
                const levelA = a.versionGroupDetails[0]?.levelLearnedAt || 0;
                const levelB = b.versionGroupDetails[0]?.levelLearnedAt || 0;
                return levelA - levelB;
              }
              // Sort others alphabetically
              return a.move.name.localeCompare(b.move.name);
            })
            .map((move, index) => (
              <div
                key={`${move.move.name}-${index}`}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
              >
                <div className="space-y-4">
                  {/* Header with move name and level */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {getMoveName(move.move, language)}
                      </h4>
                      {selectedMethod === "level-up" && (
                        <LevelBadge
                          level={
                            move.versionGroupDetails[0]?.levelLearnedAt || 0
                          }
                          variant="level"
                        />
                      )}
                    </div>
                    {/* Description tooltip icon */}
                    {move.move.flavorTextEntries && move.move.flavorTextEntries.length > 0 && (
                      <InfoTooltip
                        id={`move-${move.move.id}-tooltip`}
                        content={
                          <>
                            <p className="text-sm leading-relaxed">
                              {getMoveFlavorText(move.move, language)}
                            </p>
                            {move.move.target && (
                              <div className="mt-2 text-xs opacity-80">
                                {text.target}: {getMoveTargetName(move.move.target, language, dictionary || undefined)}
                              </div>
                            )}
                          </>
                        }
                      />
                    )}
                  </div>

                  {/* Move details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-sm">
                    {/* Type */}
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                        {text.type}
                      </div>
                      <TypeBadge
                        type={move.move.type.name}
                        displayName={
                          dictionary
                            ? getTypeName(move.move.type.name, dictionary)
                            : move.move.type.name
                        }
                        size="sm"
                      />
                    </div>

                    {/* Damage Class */}
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                        {text.category}
                      </div>
                      <span className="text-gray-900 font-medium">
                        {move.move.damageClass.name === 'physical' ? text.physical :
                         move.move.damageClass.name === 'special' ? text.special :
                         move.move.damageClass.name === 'status' ? text.status :
                         move.move.damageClass.name}
                      </span>
                    </div>

                    {/* Power */}
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                        {text.power}
                      </div>
                      <span className="text-gray-900 font-semibold text-base">
                        {move.move.power || "-"}
                      </span>
                    </div>

                    {/* Accuracy */}
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                        {text.accuracy}
                      </div>
                      <span className="text-gray-900 font-semibold text-base">
                        {move.move.accuracy ? `${move.move.accuracy}%` : "-"}
                      </span>
                    </div>

                    {/* PP */}
                    <div>
                      <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                        PP
                      </div>
                      <span className="text-gray-900 font-semibold text-base">
                        {move.move.pp || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {interpolate(dictionary?.ui.moves.noMovesFoundForMethod || fallback, {
            method: dictionary
              ? getMoveLearnMethodName(selectedMethod, dictionary)
              : selectedMethod,
          })}
        </div>
      )}
    </div>
  );
}
