'use client';

import Image from 'next/image';
import { Pokemon } from '@/types/pokemon';

interface PokemonImageProps {
  pokemon: Pokemon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

export function PokemonImage({ 
  pokemon, 
  size = 'md', 
  className,
  priority = false 
}: PokemonImageProps) {
  const getImageUrl = () => {
    return (
      pokemon.sprites.other?.officialArtwork?.frontDefault ||
      pokemon.sprites.other?.home?.frontDefault ||
      pokemon.sprites.frontDefault ||
      '/placeholder-pokemon.png'
    );
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-16 h-16';
      case 'md':
        return 'w-32 h-32';
      case 'lg':
        return 'w-48 h-48';
      case 'xl':
        return 'w-64 h-64';
      default:
        return 'w-32 h-32';
    }
  };

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return '64px';
      case 'md':
        return '128px';
      case 'lg':
        return '192px';
      case 'xl':
        return '256px';
      default:
        return '128px';
    }
  };

  const defaultClassName = `relative ${getSizeClasses()} group-hover:scale-110 transition-transform duration-300`;

  return (
    <div className={className || defaultClassName}>
      <Image
        src={getImageUrl()}
        alt={pokemon.name}
        fill
        className="object-contain drop-shadow-lg"
        sizes={getSizes()}
        priority={priority}
        quality={60} // Further reduced for faster loading
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        loading="lazy"
        unoptimized={getImageUrl().includes('.gif')} // Preserve GIF animations
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder-pokemon.png';
        }}
      />
    </div>
  );
}