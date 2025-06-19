'use client';

import { Pokemon, POKEMON_TYPE_COLORS, PokemonTypeName } from '@/types/pokemon';
import { cn } from '@/lib/utils';
import { getPokemonName } from '@/lib/pokemonUtils';
import { useAppSelector } from '@/store/hooks';
import { PokemonImage } from './PokemonImage';
import { PokemonTypes } from './PokemonTypes';
import { StatBar } from './StatBar';
import { Badge } from './Badge';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: (pokemon: Pokemon) => void;
  className?: string;
}

export function PokemonCard({ pokemon, onClick, className }: PokemonCardProps) {
  const { language } = useAppSelector((state) => state.ui);
  const primaryType = pokemon.types[0]?.type.name as PokemonTypeName;
  const primaryColor = POKEMON_TYPE_COLORS[primaryType] || '#68A090';

  const handleClick = () => {
    onClick?.(pokemon);
  };

  const formatPokemonId = (id: string) => {
    return `#${id.padStart(3, '0')}`;
  };

  const formatName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const displayName = getPokemonName(pokemon, language);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50',
        'border-2 border-gray-200 shadow-lg transition-all duration-300',
        'hover:shadow-xl hover:scale-105 hover:-translate-y-1',
        'cursor-pointer group',
        className
      )}
      onClick={handleClick}
      style={{
        borderColor: primaryColor,
        boxShadow: `0 4px 20px ${primaryColor}20`,
      }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, ${primaryColor} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${primaryColor} 0%, transparent 50%)`,
        }}
      />

      {/* Pokemon ID */}
      <div className="absolute top-3 right-3 z-10">
        <Badge 
          className="text-xs font-bold"
          style={{ backgroundColor: primaryColor }}
        >
          {formatPokemonId(pokemon.id)}
        </Badge>
      </div>

      {/* Pokemon Image */}
      <div className="relative h-48 flex items-center justify-center p-4">
        <PokemonImage pokemon={pokemon} />
      </div>

      {/* Pokemon Info */}
      <div className="p-4 pt-0">
        {/* Name */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
          {language === 'ja' ? displayName : formatName(displayName)}
        </h3>

        {/* Types */}
        <PokemonTypes types={pokemon.types} />

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
          <div className="flex justify-between">
            <span>Height:</span>
            <span className="font-semibold">{(pokemon.height / 10).toFixed(1)}m</span>
          </div>
          <div className="flex justify-between">
            <span>Weight:</span>
            <span className="font-semibold">{(pokemon.weight / 10).toFixed(1)}kg</span>
          </div>
        </div>

        {/* HP Stat Bar */}
        {pokemon.stats.length > 0 && (
          <StatBar
            label="HP"
            value={pokemon.stats[0].baseStat}
            maxValue={150}
            color={primaryColor}
          />
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}