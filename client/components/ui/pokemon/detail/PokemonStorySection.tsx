"use client";

import { Dictionary } from "@/lib/dictionaries";

interface PokemonStorySectionProps {
  description: string | null;
  dictionary: Dictionary;
}

export function PokemonStorySection({
  description,
  dictionary,
}: PokemonStorySectionProps) {
  // Use dictionary directly from props to ensure server/client consistency
  const storyText = dictionary.ui.pokemonDetails.story;
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
