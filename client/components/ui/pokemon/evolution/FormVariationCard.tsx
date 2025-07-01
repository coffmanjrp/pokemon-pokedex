import Image from "next/image";
import React from "react";
import { FormVariant, PokemonTypeSlot } from "@/types/pokemon";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { getTypeName } from "@/lib/pokemonUtils";
import {
  getFormDisplayName,
  getFormBadgeName,
  getFormBadgeColor,
} from "@/lib/formUtils";
import { POKEMON_TYPE_COLORS } from "@/types/pokemon";

interface FormVariationCardProps {
  form: FormVariant;
  pokemonName: string;
  lang: Locale;
  onClick: (
    e: React.MouseEvent,
    form: FormVariant,
    pokemonName: string,
  ) => void;
  dictionary: Dictionary | null;
  fallback: string;
}

export function FormVariationCard({
  form,
  pokemonName,
  lang,
  onClick,
  dictionary,
  fallback,
}: FormVariationCardProps) {
  return (
    <div
      key={form.id}
      onClick={(e) => onClick(e, form, pokemonName)}
      className="group flex flex-col items-center p-2 bg-white rounded-lg shadow-sm hover:shadow-md hover:scale-105 hover:-translate-y-1 transition-all duration-200 border border-gray-100 hover:border-blue-200 cursor-pointer"
    >
      {/* Form Image */}
      <div className="relative w-12 h-12 mb-1">
        {form.sprites.other?.officialArtwork?.frontDefault ||
        form.sprites.frontDefault ? (
          <Image
            src={
              form.sprites.other?.officialArtwork?.frontDefault ||
              form.sprites.frontDefault ||
              ""
            }
            alt={getFormDisplayName(pokemonName, form.formName, lang)}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-xs">
              {dictionary?.ui.pokemonDetails.noFormImage || fallback}
            </span>
          </div>
        )}
      </div>

      {/* Form Info */}
      <div className="text-center">
        {/* Form Badge */}
        <div className="mb-1">
          {(() => {
            const badgeName = getFormBadgeName(form.formName, lang);
            const badgeColor = getFormBadgeColor(form.formName);
            return badgeName ? (
              <span className={`px-1 py-0.5 text-xs rounded ${badgeColor}`}>
                {badgeName}
              </span>
            ) : null;
          })()}
        </div>

        {/* Form Types */}
        <div className="flex gap-1 justify-center">
          {form.types &&
            form.types.slice(0, 2).map((typeInfo: PokemonTypeSlot) => (
              <span
                key={typeInfo.type.name}
                className="w-3 h-3 rounded-full border border-white"
                style={{
                  backgroundColor:
                    POKEMON_TYPE_COLORS[
                      typeInfo.type.name as keyof typeof POKEMON_TYPE_COLORS
                    ],
                }}
                title={getTypeName(typeInfo.type.name, lang)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
