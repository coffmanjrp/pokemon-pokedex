'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { EvolutionDetail, PokemonTypeSlot, EvolutionTrigger, FormVariant } from '@/types/pokemon';
import { Locale } from '@/lib/dictionaries';
import { getTypeName, getEvolutionPokemonName } from '@/lib/pokemonUtils';
import { getFormDisplayName } from '@/lib/formUtils';
import { POKEMON_TYPE_COLORS } from '@/types/pokemon';

interface PokemonEvolutionChainProps {
  evolutionChain: EvolutionDetail;
  lang: Locale;
}

export function PokemonEvolutionChain({ evolutionChain, lang }: PokemonEvolutionChainProps) {
  const renderEvolutionChain = (evolution: EvolutionDetail): React.ReactElement[] => {
    const chain: React.ReactElement[] = [];
    

    const addEvolutionStage = (currentEvolution: EvolutionDetail) => {
      if (!currentEvolution) return;
      const pokemonName = getEvolutionPokemonName(currentEvolution, lang);
      const pokemonId = currentEvolution.id || '0';
      const imageUrl = currentEvolution.sprites?.other?.officialArtwork?.frontDefault || currentEvolution.sprites?.frontDefault;

      // Add Pokemon card
      chain.push(
        <div key={`pokemon-${currentEvolution.id}`} className="flex flex-col items-center">
          <Link
            href={`/${lang}/pokemon/${pokemonId}`}
            className="group flex flex-col items-center p-3 md:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
          >
            {/* Pokemon Image */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 mb-3">
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
              <p className="font-semibold text-gray-900">{pokemonName}</p>
              
              {/* Types */}
              <div className="flex gap-1 mt-2 justify-center">
                {currentEvolution.types && currentEvolution.types.map((typeInfo: PokemonTypeSlot) => (
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

          {/* Form Variations - Always Visible */}
          {currentEvolution.forms && Array.isArray(currentEvolution.forms) && currentEvolution.forms.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-xs text-gray-600 font-medium text-center">
                {lang === 'en' ? 'Forms' : 'すがた'}
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                {currentEvolution.forms.map((form: FormVariant) => (
                  <Link
                    key={form.id}
                    href={`/${lang}/pokemon/${form.id}`}
                    className="group flex flex-col items-center p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
                  >
                    {/* Form Image */}
                    <div className="relative w-12 h-12 mb-1">
                      {form.sprites.other?.officialArtwork?.frontDefault || form.sprites.frontDefault ? (
                        <Image
                          src={form.sprites.other?.officialArtwork?.frontDefault || form.sprites.frontDefault || ''}
                          alt={getFormDisplayName(pokemonName, form.formName, lang)}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">?</span>
                        </div>
                      )}
                    </div>

                    {/* Form Info */}
                    <div className="text-center">
                      <p className="text-xs text-gray-700 font-medium truncate max-w-20">
                        {getFormDisplayName(pokemonName, form.formName, lang)}
                      </p>
                      
                      {/* Form Category Badge */}
                      <div className="mt-1">
                        {form.isRegionalVariant && (
                          <span className="px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                            {lang === 'en' ? 'Regional' : '地方'}
                          </span>
                        )}
                        {form.isMegaEvolution && (
                          <span className="px-1 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">
                            {lang === 'en' ? 'Mega' : 'メガ'}
                          </span>
                        )}
                        {form.isDynamax && (
                          <span className="px-1 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                            {lang === 'en' ? 'G-Max' : 'キョダイ'}
                          </span>
                        )}
                      </div>

                      {/* Form Types */}
                      <div className="flex gap-1 mt-1 justify-center">
                        {form.types && form.types.slice(0, 2).map((typeInfo: PokemonTypeSlot) => (
                          <span
                            key={typeInfo.type.name}
                            className="w-3 h-3 rounded-full border border-white"
                            style={{ backgroundColor: POKEMON_TYPE_COLORS[typeInfo.type.name as keyof typeof POKEMON_TYPE_COLORS] }}
                            title={getTypeName(typeInfo.type.name, lang)}
                          />
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      );

      // Add evolution arrow and next stage if evolution exists
      if (currentEvolution.evolvesTo && Array.isArray(currentEvolution.evolvesTo) && currentEvolution.evolvesTo.length > 0) {
        const nextEvolution = currentEvolution.evolvesTo[0];
        
        
        // Add arrow
        chain.push(
          <div key={`arrow-${nextEvolution.id}`} className="flex flex-col md:flex-row items-center mx-2 md:mx-4">
            <div className="w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-blue-500 rotate-180 md:rotate-90 mb-2 md:mb-0 md:mr-2"></div>
            <div className="bg-blue-50 px-3 py-2 rounded-lg text-sm text-blue-800 font-medium text-center whitespace-nowrap border border-blue-100 shadow-sm">
              {Array.isArray(nextEvolution.evolutionDetails) && nextEvolution.evolutionDetails.length > 0 ? 
                renderEvolutionCondition(nextEvolution.evolutionDetails[0], lang) : 
                (lang === 'en' ? 'Unknown' : '不明')
              }
            </div>
          </div>
        );
        
        // Recursively add next evolution
        addEvolutionStage(nextEvolution);
      }
    };

    addEvolutionStage(evolution);
    return chain;
  };

  const renderEvolutionCondition = (trigger: EvolutionTrigger, lang: Locale): string => {
    if (!trigger || typeof trigger !== 'object') {
      return lang === 'en' ? 'Unknown' : '不明';
    }


    const conditions = [];

    // Check for minLevel (more explicit check)
    if (trigger.minLevel !== null && trigger.minLevel !== undefined && typeof trigger.minLevel === 'number') {
      conditions.push(lang === 'en' ? `Level ${trigger.minLevel}` : `レベル${trigger.minLevel}`);
    }

    if (trigger.item) {
      const itemName = trigger.item.name.replace(/-/g, ' ');
      
      // Item name translation for Japanese
      const getItemName = (itemName: string, lang: string): string => {
        if (lang === 'en') return itemName;
        
        const itemTranslations: Record<string, string> = {
          'thunder stone': 'かみなりのいし',
          'fire stone': 'ほのおのいし',
          'water stone': 'みずのいし',
          'leaf stone': 'リーフのいし',
          'moon stone': 'つきのいし',
          'sun stone': 'たいようのいし',
          'shiny stone': 'ひかりのいし',
          'dusk stone': 'やみのいし',
          'dawn stone': 'めざめいし',
          'ice stone': 'こおりのいし',
          'oval stone': 'まんまるいし',
          'kings rock': 'おうじゃのしるし',
          'metal coat': 'メタルコート',
          'dragon scale': 'りゅうのウロコ',
          'upgrade': 'アップグレード',
          'dubious disc': 'あやしいパッチ',
          'protector': 'プロテクター',
          'electirizer': 'エレキブースター',
          'magmarizer': 'マグマブースター',
          'razor claw': 'するどいツメ',
          'razor fang': 'するどいキバ',
          'reaper cloth': 'れいかいのぬの',
          'deep sea tooth': 'しんかいのキバ',
          'deep sea scale': 'しんかいのウロコ',
          'prism scale': 'きれいなウロコ',
          'sachet': 'においぶくろ',
          'whipped dream': 'ホイップポップ',
          'strawberry sweet': 'いちごアメざいく',
          'berry sweet': 'ベリーアメざいく',
          'love sweet': 'ハートアメざいく',
          'star sweet': 'スターアメざいく',
          'clover sweet': 'よつばアメざいく',
          'flower sweet': 'おはなアメざいく',
          'ribbon sweet': 'リボンアメざいく'
        };
        
        return itemTranslations[itemName.toLowerCase()] || itemName;
      };
      
      const translatedItemName = getItemName(itemName, lang);
      conditions.push(lang === 'en' ? `Use ${itemName}` : `${translatedItemName}を使用`);
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
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
{lang === 'en' ? 'Evolution Chain' : '進化の流れ'}
      </h2>
      {/* Mobile: Vertical layout, Desktop: Horizontal layout */}
      <div className="flex justify-center">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0 px-2 md:px-4">
          {renderEvolutionChain(evolutionChain)}
        </div>
      </div>
    </div>
  );
}