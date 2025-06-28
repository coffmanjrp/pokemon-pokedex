"use client";

import React from "react";
import { Pokemon } from "@/types/pokemon";
import { Locale } from "@/lib/dictionaries";
import { GenerationData } from "@/lib/data/generations";
import { PokemonGrid } from "@/components/ui/pokemon/PokemonGrid";

interface GenerationPageClientProps {
  pokemon: Pokemon[];
  generation: GenerationData;
  lang: Locale;
}

export default function GenerationPageClient({
  pokemon,
  generation,
  lang,
}: GenerationPageClientProps) {
  // Pokemon data is static for generation pages
  const currentPokemon = pokemon;

  const generationName = generation.name[lang];
  const regionName = generation.region[lang];
  const pokemonCount = pokemon.length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          {/* Generation Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-gray-800 dark:text-white md:text-5xl">
              {generationName}
            </h1>
            <h2 className="mb-4 text-2xl font-semibold text-blue-600 dark:text-blue-400 md:text-3xl">
              {regionName}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              {lang === "ja"
                ? `${regionName}のポケモン${pokemonCount}匹を表示しています。各ポケモンをクリックすると詳細情報をご覧いただけます。`
                : `Displaying ${pokemonCount} Pokemon from the ${regionName} region. Click on any Pokemon to view detailed information.`}
            </p>
          </div>

          {/* Generation Stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                {lang === "ja" ? "ポケモン数" : "Pokemon Count"}
              </h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {pokemonCount}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                {lang === "ja" ? "図鑑番号範囲" : "Pokedex Range"}
              </h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                #{generation.pokemonRange.start.toString().padStart(3, "0")} - #
                {generation.pokemonRange.end.toString().padStart(3, "0")}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                {lang === "ja" ? "代表ゲーム" : "Main Games"}
              </h3>
              <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                {generation.games
                  .map((game) => game.charAt(0).toUpperCase() + game.slice(1))
                  .join(", ")}
              </p>
            </div>
          </div>

          {/* Generation Navigation */}
          <div className="mb-8 flex items-center justify-center gap-4">
            {generation.id > 1 && (
              <a
                href={`/${lang}/generation/${generation.id - 1}`}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <span>←</span>
                <span>
                  {lang === "ja" ? "前の世代" : "Previous Generation"}
                </span>
              </a>
            )}
            <span className="rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-800 dark:bg-gray-700 dark:text-white">
              {generationName}
            </span>
            {generation.id < 9 && (
              <a
                href={`/${lang}/generation/${generation.id + 1}`}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <span>{lang === "ja" ? "次の世代" : "Next Generation"}</span>
                <span>→</span>
              </a>
            )}
          </div>

          {/* Breadcrumb Navigation */}
          <nav className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <a
              href={`/${lang}`}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {lang === "ja" ? "ホーム" : "Home"}
            </a>
            <span className="mx-2">›</span>
            <span className="text-gray-800 dark:text-white">
              {generationName} ({regionName})
            </span>
          </nav>

          {/* Pokemon Grid */}
          <PokemonGrid
            pokemons={currentPokemon}
            onPokemonClick={(pokemon) => {
              window.location.href = `/${lang}/pokemon/${pokemon.id}`;
            }}
            loading={false}
          />

          {/* Generation Info Footer */}
          <div className="mt-12 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
              {lang === "ja"
                ? `${generationName}について`
                : `About ${generationName}`}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {lang === "ja"
                ? `${generationName}は${regionName}を舞台とした世代で、${pokemonCount}匹の新しいポケモンが登場しました。代表的なゲームには${generation.games
                    .map((game) => game.charAt(0).toUpperCase() + game.slice(1))
                    .join("、")}があります。`
                : `${generationName} is set in the ${regionName} region and introduced ${pokemonCount} new Pokemon. The main games include ${generation.games
                    .map((game) => game.charAt(0).toUpperCase() + game.slice(1))
                    .join(", ")}.`}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
