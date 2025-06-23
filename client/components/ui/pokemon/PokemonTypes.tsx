'use client';

import { Pokemon } from '@/types/pokemon';
import { getTypeName } from '@/lib/pokemonUtils';
import { useAppSelector } from '@/store/hooks';
import { TypeBadge } from '../common/Badge';

interface PokemonTypesProps {
  types: Pokemon['types'];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  language?: 'en' | 'ja';
}

export function PokemonTypes({ types, size = 'md', className, language: propLanguage }: PokemonTypesProps) {
  const { language: storeLanguage } = useAppSelector((state) => state.ui);
  const language = propLanguage || storeLanguage;

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'flex gap-1 justify-center mb-2';
      case 'lg':
        return 'flex gap-2 justify-center mb-4';
      default:
        return 'flex gap-1 justify-center mb-3';
    }
  };

  const defaultClassName = getSizeClass();

  return (
    <div className={className || defaultClassName}>
      {types.map((typeInfo, index) => {
        const displayName = getTypeName(typeInfo.type.name, language);

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