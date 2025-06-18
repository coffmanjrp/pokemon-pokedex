'use client';

import Link from 'next/link';

interface PokemonDetailHeaderProps {
  language: 'en' | 'ja';
}

export function PokemonDetailHeader({ language }: PokemonDetailHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {language === 'en' ? 'Back to Pokedex' : 'ポケモン図鑑に戻る'}
        </Link>
      </div>
    </div>
  );
}