'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setTypeFilters, setGenerationFilter, clearFilters } from '@/store/slices/pokemonSlice';
import { setFilterModalOpen } from '@/store/slices/uiSlice';
import { PokemonTypeName } from '@/types/pokemon';
import { Locale } from '@/lib/dictionaries';
import { getTypeName } from '@/lib/pokemonUtils';
import { Modal } from './Modal';
import { TypeFilter } from './TypeFilter';
import { GenerationFilter } from './GenerationFilter';
import { Badge } from './Badge';
import toast from 'react-hot-toast';

interface FilterModalProps {
  lang?: Locale;
}

export function FilterModal({ lang = 'en' }: FilterModalProps) {
  const dispatch = useAppDispatch();
  const { isFilterModalOpen } = useAppSelector((state) => state.ui);
  const { filters } = useAppSelector((state) => state.pokemon);
  
  const [localTypes, setLocalTypes] = useState<PokemonTypeName[]>(
    filters.types.map(t => t.name as PokemonTypeName)
  );
  const [localGeneration, setLocalGeneration] = useState<number | null>(filters.generation);

  const handleClose = () => {
    dispatch(setFilterModalOpen(false));
  };

  const handleTypeToggle = (type: PokemonTypeName) => {
    setLocalTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleApplyFilters = () => {
    // Convert type names to the format expected by the store
    const typeObjects = localTypes.map(typeName => ({
      id: typeName,
      name: typeName,
      url: '',
    }));
    
    dispatch(setTypeFilters(typeObjects));
    dispatch(setGenerationFilter(localGeneration));
    handleClose();
  };

  const handleClearFilters = () => {
    console.log('FilterModal: Clearing all filters and dismissing toasts');
    setLocalTypes([]);
    setLocalGeneration(null);
    dispatch(clearFilters());
    // Force dismiss all toasts when clearing filters
    toast.dismiss();
  };

  const hasActiveFilters = localTypes.length > 0 || localGeneration !== null;
  const filterCount = localTypes.length + (localGeneration !== null ? 1 : 0);

  return (
    <Modal
      isOpen={isFilterModalOpen}
      onClose={handleClose}
      title={lang === 'en' ? 'Filter Pokémon' : 'ポケモンフィルター'}
      className="max-w-lg"
    >
      <div className="p-6 space-y-6">
        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">
                {lang === 'en' ? `Active Filters (${filterCount})` : `適用中のフィルター (${filterCount})`}
              </span>
              <button
                onClick={handleClearFilters}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                {lang === 'en' ? 'Clear all' : 'すべてクリア'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {localTypes.map(type => (
                <Badge key={type} className="bg-blue-100 text-blue-800 text-xs">
                  {getTypeName(type, lang)}
                </Badge>
              ))}
              {localGeneration && (
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  {lang === 'en' ? `Gen ${localGeneration}` : `第${localGeneration}世代`}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Type Filter */}
        <TypeFilter 
          selectedTypes={localTypes}
          onTypeToggle={handleTypeToggle}
          lang={lang}
        />

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Generation Filter */}
        <GenerationFilter
          selectedGeneration={localGeneration}
          onGenerationChange={setLocalGeneration}
          lang={lang}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {lang === 'en' ? 'Cancel' : 'キャンセル'}
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {lang === 'en' ? 'Apply Filters' : 'フィルターを適用'}
            {filterCount > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {filterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}