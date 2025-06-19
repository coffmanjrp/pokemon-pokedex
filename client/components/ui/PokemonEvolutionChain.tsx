'use client';

import Link from 'next/link';
import Image from 'next/image';
import { EvolutionDetail, PokemonTypeSlot, EvolutionTrigger } from '@/types/pokemon';
import { Dictionary, Locale } from '@/lib/dictionaries';
import { getTypeName } from '@/lib/pokemonUtils';
import { POKEMON_TYPE_COLORS } from '@/types/pokemon';

interface PokemonEvolutionChainProps {
  evolutionChain: EvolutionDetail;
  dictionary: Dictionary;
  lang: Locale;
}

export function PokemonEvolutionChain({ evolutionChain, dictionary, lang }: PokemonEvolutionChainProps) {
  const renderEvolutionNode = (evolution: EvolutionDetail, level: number = 0) => {
    const pokemonName = evolution.name;
    const pokemonId = evolution.id;
    const imageUrl = evolution.sprites.other?.officialArtwork?.frontDefault || evolution.sprites.frontDefault;

    return (
      <div key={`${evolution.id}-${level}`} className="flex flex-col items-center">
        {/* Current Pokemon */}
        <div className="flex flex-col items-center mb-6">
          <Link
            href={`/${lang}/pokemon/${pokemonId}`}
            className="group flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-300"
          >
            {/* Pokemon Image */}
            <div className="relative w-24 h-24 mb-3">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={pokemonName}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
              )}
            </div>

            {/* Pokemon Info */}
            <div className="text-center">
              <p className="text-sm text-gray-500 font-medium">#{pokemonId.padStart(3, '0')}</p>
              <p className="font-semibold text-gray-900 capitalize">{pokemonName}</p>
              
              {/* Types */}
              <div className="flex gap-1 mt-2 justify-center">
                {evolution.types.map((typeInfo: PokemonTypeSlot) => (
                  <span
                    key={typeInfo.type.name}
                    className="px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: POKEMON_TYPE_COLORS[typeInfo.type.name as keyof typeof POKEMON_TYPE_COLORS] }}
                  >
                    {getTypeName(typeInfo.type.name, lang)}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>

        {/* Evolution arrows and conditions */}
        {evolution.evolvesTo.length > 0 && (
          <div className="flex flex-col items-center">
            {evolution.evolvesTo.map((nextEvolution, index) => (
              <div key={`${nextEvolution.id}-${index}`} className="flex flex-col items-center">
                {/* Evolution Condition */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-blue-500 mb-2"></div>
                  <div className="bg-blue-100 px-3 py-2 rounded-lg text-sm text-blue-800 font-medium text-center">
                    {renderEvolutionCondition(nextEvolution.evolutionDetails[0], lang)}
                  </div>
                </div>

                {/* Next Evolution */}
                {renderEvolutionNode(nextEvolution, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderEvolutionCondition = (trigger: EvolutionTrigger, lang: Locale): string => {
    if (!trigger) return lang === 'en' ? 'Unknown' : '不明';

    const conditions = [];

    if (trigger.minLevel) {
      conditions.push(lang === 'en' ? `Level ${trigger.minLevel}` : `レベル${trigger.minLevel}`);
    }

    if (trigger.item) {
      const itemName = trigger.item.name.replace(/-/g, ' ');
      conditions.push(lang === 'en' ? `Use ${itemName}` : `${itemName}を使用`);
    }

    if (trigger.trigger?.name === 'trade') {
      conditions.push(lang === 'en' ? 'Trade' : '通信交換');
    }

    if (trigger.trigger?.name === 'level-up' && !trigger.minLevel) {
      conditions.push(lang === 'en' ? 'Level up' : 'レベルアップ');
    }

    if (trigger.minHappiness) {
      conditions.push(lang === 'en' ? `Happiness ${trigger.minHappiness}+` : `なつき度${trigger.minHappiness}以上`);
    }

    if (trigger.timeOfDay) {
      const timeMap = {
        day: lang === 'en' ? 'Day' : '昼',
        night: lang === 'en' ? 'Night' : '夜',
      };
      conditions.push(timeMap[trigger.timeOfDay as keyof typeof timeMap] || trigger.timeOfDay);
    }

    if (trigger.location) {
      const locationName = trigger.location.name.replace(/-/g, ' ');
      conditions.push(lang === 'en' ? `At ${locationName}` : `${locationName}で`);
    }

    if (trigger.knownMove) {
      const moveName = trigger.knownMove.name.replace(/-/g, ' ');
      conditions.push(lang === 'en' ? `Learn ${moveName}` : `${moveName}を覚える`);
    }

    return conditions.length > 0 ? conditions.join(lang === 'en' ? ' + ' : ' + ') : (lang === 'en' ? 'Special' : '特殊');
  };

  if (!evolutionChain) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
        {dictionary.ui.pokemonDetails.evolutionChain}
      </h3>
      <div className="flex justify-center">
        <div className="max-w-4xl">
          {renderEvolutionNode(evolutionChain)}
        </div>
      </div>
    </div>
  );
}