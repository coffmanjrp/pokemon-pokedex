'use client';

import { ReactNode } from 'react';

interface PokemonDetailSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function PokemonDetailSection({ title, children, className = '' }: PokemonDetailSectionProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-8 mb-8 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {title}
      </h2>
      {children}
    </div>
  );
}