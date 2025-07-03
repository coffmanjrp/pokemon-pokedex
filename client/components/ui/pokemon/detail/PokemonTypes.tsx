"use client";

import { Pokemon } from "@/types/pokemon";
import { Dictionary } from "@/lib/dictionaries";
import { TypeBadge } from "../../common/Badge";

interface PokemonTypesProps {
  types: Pokemon["types"];
  dictionary?: Dictionary;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PokemonTypes({
  types,
  dictionary,
  size = "md",
  className,
}: PokemonTypesProps) {
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "flex gap-1 justify-center mb-2";
      case "lg":
        return "flex gap-2 justify-center mb-4";
      default:
        return "flex gap-1 justify-center mb-3";
    }
  };

  const defaultClassName = getSizeClass();

  return (
    <div className={className || defaultClassName}>
      {types.map((typeInfo, index) => {
        // Use dictionary directly from props to ensure server/client consistency
        const displayName =
          dictionary?.ui.pokemonTypes[
            typeInfo.type.name as keyof typeof dictionary.ui.pokemonTypes
          ] || typeInfo.type.name;

        return (
          <TypeBadge
            key={`${typeInfo.type.id}-${typeInfo.slot || index}`}
            type={typeInfo.type.name}
            displayName={displayName}
            size={size}
          />
        );
      })}
    </div>
  );
}
