"use client";

import { Pokemon } from "@/types/pokemon";
import { getPokemonDescription, getVersionName } from "@/lib/pokemonUtils";
import { DataEmptyState } from "../common/DataEmptyState";
import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";

interface PokemonDescriptionProps {
  pokemon: Pokemon;
  language: "en" | "ja";
}

export function PokemonDescription({
  pokemon,
  language,
}: PokemonDescriptionProps) {
  const description = getPokemonDescription(pokemon, language);
  const { dictionary } = useAppSelector((state) => state.ui);

  const fallback = getFallbackText(language);

  const text = {
    latestDescription:
      dictionary?.ui.pokemonDetails.latestDescription || fallback,
    allDescriptions: dictionary?.ui.pokemonDetails.allDescriptions || fallback,
    versions: dictionary?.ui.pokemonDetails.versions || fallback,
    version: dictionary?.ui.pokemonDetails.version || fallback,
    noDescriptionsInLanguage:
      dictionary?.ui.pokemonDetails.noDescriptionsInLanguage || fallback,
  };

  if (
    !pokemon.species?.flavorTextEntries ||
    pokemon.species.flavorTextEntries.length === 0
  ) {
    return <DataEmptyState type="descriptions" language={language} />;
  }

  // Filter entries for the current language
  const languageEntries = pokemon.species.flavorTextEntries
    .filter(
      (entry) =>
        entry.language.name === (language === "en" ? "en" : "ja") ||
        (language === "ja" && entry.language.name === "ja-Hrkt"),
    )
    .filter((entry) => entry.flavorText && entry.flavorText.trim().length > 0);

  if (languageEntries.length === 0) {
    return (
      <DataEmptyState
        type="descriptions"
        language={language}
        customMessage={text.noDescriptionsInLanguage}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Current/Latest Description */}
      {description && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="text-sm font-medium text-blue-800 mb-2">
                {text.latestDescription}
              </div>
              <blockquote className="text-gray-700 leading-relaxed">
                &ldquo;{description}&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      )}

      {/* All Historical Descriptions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {`${text.allDescriptions} (${languageEntries.length} ${text.versions})`}
        </h3>
        <div className="space-y-3">
          {languageEntries.map((entry, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <p className="text-gray-700 leading-relaxed mb-3">
                {entry.flavorText.replace(/\f/g, " ").replace(/\n/g, " ")}
              </p>
              <footer className="flex items-center justify-between text-sm">
                <span className="text-blue-600 font-medium">
                  {getVersionName(entry.version.name, language)}
                </span>
                <span className="text-gray-400 text-xs">
                  {text.version} {index + 1}
                </span>
              </footer>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
