'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PokemonDetailHeaderProps {
  language: 'en' | 'ja';
}

export function PokemonDetailHeader({ language }: PokemonDetailHeaderProps) {
  const searchParams = useSearchParams();
  const fromGeneration = searchParams.get('from');
  
  // If we have a generation parameter, construct the URL to go back to that generation
  const backUrl = fromGeneration && fromGeneration.startsWith('generation-') 
    ? `/${language}/?generation=${fromGeneration.split('-')[1]}` 
    : `/${language}/`;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8 pb-4">
      <Link 
        href={backUrl}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {language === 'en' ? 'Pokedex' : 'ポケモン図鑑'}
      </Link>
    </div>
  );
}