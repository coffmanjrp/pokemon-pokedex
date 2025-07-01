"use client";

import Image from "next/image";
import { SpriteInfo } from "@/lib/spriteCollector";

interface SpriteCardProps {
  sprite: SpriteInfo;
  pokemonName: string;
  selectedCategory: string;
}

export function SpriteCard({
  sprite,
  pokemonName,
  selectedCategory,
}: SpriteCardProps) {
  // Determine image size based on category
  const getImageSize = () => {
    if (selectedCategory === "official") {
      return { className: "w-48 h-48", sizes: "192px" };
    }
    if (selectedCategory === "animated") {
      return { className: "w-32 h-32", sizes: "128px" };
    }
    return { className: "w-24 h-24", sizes: "96px" };
  };

  const { className, sizes } = getImageSize();

  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <div className={`relative mx-auto mb-3 ${className}`}>
        <Image
          src={sprite.url}
          alt={`${pokemonName} ${sprite.label}`}
          fill
          className="object-contain"
          sizes={sizes}
          unoptimized={selectedCategory === "animated"} // For animated GIFs
        />
      </div>
      <div className="text-sm text-gray-600 font-medium">{sprite.label}</div>
    </div>
  );
}
