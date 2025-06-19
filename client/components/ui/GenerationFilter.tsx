'use client';

import { cn } from '@/lib/utils';
import { Locale } from '@/lib/dictionaries';

interface GenerationFilterProps {
  selectedGeneration: number | null;
  onGenerationChange: (generation: number | null) => void;
  lang?: Locale;
}

const GENERATIONS = [
  { id: 1, name: { en: 'Generation I', ja: '第1世代' }, range: '1-151', region: { en: 'Kanto', ja: 'カントー' } },
  { id: 2, name: { en: 'Generation II', ja: '第2世代' }, range: '152-251', region: { en: 'Johto', ja: 'ジョウト' } },
  { id: 3, name: { en: 'Generation III', ja: '第3世代' }, range: '252-386', region: { en: 'Hoenn', ja: 'ホウエン' } },
  { id: 4, name: { en: 'Generation IV', ja: '第4世代' }, range: '387-493', region: { en: 'Sinnoh', ja: 'シンオウ' } },
  { id: 5, name: { en: 'Generation V', ja: '第5世代' }, range: '494-649', region: { en: 'Unova', ja: 'イッシュ' } },
  { id: 6, name: { en: 'Generation VI', ja: '第6世代' }, range: '650-721', region: { en: 'Kalos', ja: 'カロス' } },
  { id: 7, name: { en: 'Generation VII', ja: '第7世代' }, range: '722-809', region: { en: 'Alola', ja: 'アローラ' } },
  { id: 8, name: { en: 'Generation VIII', ja: '第8世代' }, range: '810-905', region: { en: 'Galar', ja: 'ガラル' } },
  { id: 9, name: { en: 'Generation IX', ja: '第9世代' }, range: '906+', region: { en: 'Paldea', ja: 'パルデア' } },
];

export function GenerationFilter({ selectedGeneration, onGenerationChange, lang = 'en' }: GenerationFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {lang === 'en' ? 'Generation' : '世代'}
      </h3>
      
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
        <div className="font-medium">
          {lang === 'en' ? 'All Generations' : 'すべての世代'}
        </div>
        <div className="text-sm text-gray-600">
          {lang === 'en' ? 'Show all Pokémon' : 'すべてのポケモンを表示'}
        </div>
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
                <div className="font-medium">{gen.name[lang]}</div>
                <div className="text-sm text-gray-600">
                  {lang === 'en' ? `${gen.region[lang]} Region` : `${gen.region[lang]}地方`}
                </div>
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