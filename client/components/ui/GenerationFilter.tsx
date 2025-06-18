'use client';

import { cn } from '@/lib/utils';

interface GenerationFilterProps {
  selectedGeneration: number | null;
  onGenerationChange: (generation: number | null) => void;
}

const GENERATIONS = [
  { id: 1, name: 'Generation I', range: '1-151', region: 'Kanto' },
  { id: 2, name: 'Generation II', range: '152-251', region: 'Johto' },
  { id: 3, name: 'Generation III', range: '252-386', region: 'Hoenn' },
  { id: 4, name: 'Generation IV', range: '387-493', region: 'Sinnoh' },
  { id: 5, name: 'Generation V', range: '494-649', region: 'Unova' },
  { id: 6, name: 'Generation VI', range: '650-721', region: 'Kalos' },
  { id: 7, name: 'Generation VII', range: '722-809', region: 'Alola' },
  { id: 8, name: 'Generation VIII', range: '810-905', region: 'Galar' },
  { id: 9, name: 'Generation IX', range: '906+', region: 'Paldea' },
];

export function GenerationFilter({ selectedGeneration, onGenerationChange }: GenerationFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation</h3>
      
      {/* All Generations Option */}
      <button
        onClick={() => onGenerationChange(null)}
        className={cn(
          'w-full p-3 rounded-lg border-2 text-left transition-all duration-200',
          selectedGeneration === null
            ? 'border-blue-500 bg-blue-50 text-blue-900'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        )}
      >
        <div className="font-medium">All Generations</div>
        <div className="text-sm text-gray-600">Show all Pokémon</div>
      </button>

      {/* Individual Generations */}
      <div className="space-y-2">
        {GENERATIONS.map((gen) => (
          <button
            key={gen.id}
            onClick={() => onGenerationChange(gen.id)}
            className={cn(
              'w-full p-3 rounded-lg border-2 text-left transition-all duration-200',
              selectedGeneration === gen.id
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{gen.name}</div>
                <div className="text-sm text-gray-600">{gen.region} Region</div>
              </div>
              <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                #{gen.range}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}