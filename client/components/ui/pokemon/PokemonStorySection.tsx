"use client";

import { useAppSelector } from "@/store/hooks";
import { getFallbackText } from "@/lib/fallbackText";

interface PokemonStorySectionProps {
  description: string | null;
  language: "en" | "ja";
}

export function PokemonStorySection({
  description,
  language,
}: PokemonStorySectionProps) {
  const { dictionary } = useAppSelector((state) => state.ui);

  const fallback = getFallbackText(language);
  const storyText = dictionary?.ui.pokemonDetails.story || fallback;
  if (!description) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{storyText}</h3>
      <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
        {description}
      </p>
    </div>
  );
}
