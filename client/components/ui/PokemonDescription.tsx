'use client';

import { FlavorTextEntry, Genus } from '@/types/pokemon';

interface PokemonDescriptionProps {
  flavorTextEntries?: FlavorTextEntry[];
  genera?: Genus[];
  language: 'en' | 'ja';
}

export function PokemonDescription({ flavorTextEntries, genera, language }: PokemonDescriptionProps) {
  if (!flavorTextEntries || flavorTextEntries.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        {language === 'en' ? 'No description available' : '説明がありません'}
      </div>
    );
  }

  // Get description in the preferred language
  const getDescription = () => {
    const targetLang = language === 'en' ? 'en' : 'ja';
    
    // Find entry in target language
    let entry = flavorTextEntries.find(entry => 
      entry.language.name === targetLang
    );
    
    // Fallback to English if Japanese not found
    if (!entry && language === 'ja') {
      entry = flavorTextEntries.find(entry => 
        entry.language.name === 'en'
      );
    }
    
    // Use the first available entry as last resort
    if (!entry) {
      entry = flavorTextEntries[0];
    }
    
    return entry;
  };

  // Get genus (category) in the preferred language
  const getGenus = () => {
    if (!genera || genera.length === 0) return null;
    
    const targetLang = language === 'en' ? 'en' : 'ja';
    
    let genus = genera.find(g => g.language.name === targetLang);
    
    // Fallback to English if Japanese not found
    if (!genus && language === 'ja') {
      genus = genera.find(g => g.language.name === 'en');
    }
    
    // Use the first available genus as last resort
    if (!genus) {
      genus = genera[0];
    }
    
    return genus;
  };

  const description = getDescription();
  const genus = getGenus();

  return (
    <div className="space-y-4">
      {/* Category/Genus */}
      {genus && (
        <div className="text-center">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {genus.genus}
          </span>
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="bg-gray-50 rounded-lg p-6">
          <blockquote className="text-gray-700 leading-relaxed italic">
            "{description.flavorText.replace(/\f/g, ' ').replace(/\n/g, ' ')}"
          </blockquote>
          <footer className="mt-3 text-sm text-gray-500">
            — {description.version.name.charAt(0).toUpperCase() + description.version.name.slice(1)}
          </footer>
        </div>
      )}

      {/* Multiple descriptions if available */}
      {flavorTextEntries.length > 1 && (
        <details className="group">
          <summary className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium">
            {language === 'en' 
              ? `View all descriptions (${flavorTextEntries.length} versions)`
              : `すべての説明を表示 (${flavorTextEntries.length}種類)`
            }
          </summary>
          <div className="mt-4 space-y-3">
            {flavorTextEntries
              .filter(entry => entry !== description)
              .slice(0, 5) // Limit to 5 additional entries
              .map((entry, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    "{entry.flavorText.replace(/\f/g, ' ').replace(/\n/g, ' ')}"
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    {entry.version.name.charAt(0).toUpperCase() + entry.version.name.slice(1)} 
                    {entry.language.name !== 'en' && ` (${entry.language.name})`}
                  </div>
                </div>
              ))}
          </div>
        </details>
      )}
    </div>
  );
}