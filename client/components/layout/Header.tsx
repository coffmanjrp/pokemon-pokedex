'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setLanguage, setFilterModalOpen } from '@/store/slices/uiSlice';
import { setSearchFilter } from '@/store/slices/pokemonSlice';
import { useRouter, usePathname } from 'next/navigation';
import { Locale, generateAlternateLanguageUrl } from '@/lib/dictionaries';
import Image from 'next/image';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { LanguageToggle } from './LanguageToggle';
import { FilterButton } from './FilterButton';
import { FilterModal } from '../ui/FilterModal';
import { Dictionary } from '@/lib/dictionaries';

interface HeaderProps {
  lang: Locale;
  dictionary?: Dictionary;
}

export function Header({ lang, dictionary }: HeaderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState('');

  // Check if we're on a Pokemon detail page
  const isPokemonDetailPage = pathname.includes('/pokemon/') && pathname.split('/').length >= 4;

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    dispatch(setSearchFilter(value));
  };

  const handleLanguageToggle = () => {
    const newLang = lang === 'en' ? 'ja' : 'en';
    const newUrl = generateAlternateLanguageUrl(pathname, newLang);
    
    console.log('Language toggle:', { currentLang: lang, newLang, pathname, newUrl });
    
    // Update Redux state
    dispatch(setLanguage(newLang));
    
    // Navigate to new URL
    router.push(newUrl);
  };

  const handleFilterClick = () => {
    dispatch(setFilterModalOpen(true));
  };

  return (
    <>
      <FilterModal lang={lang} />
      <header className="bg-white border-b border-gray-200 shadow-sm">
        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Logo />
            </div>

            {/* Search Bar - Hidden on Pokemon detail pages */}
            {!isPokemonDetailPage && (
              <SearchBar
                value={searchValue}
                onChange={handleSearchChange}
                className="flex-1 max-w-lg mx-8"
              />
            )}

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <LanguageToggle
                language={lang}
                onToggle={handleLanguageToggle}
              />

              {/* Filter Button - Hidden on Pokemon detail pages */}
              {!isPokemonDetailPage && (
                <FilterButton onClick={handleFilterClick} lang={lang} />
              )}
            </div>
          </div>
        </div>

        {/* Hero Section - Only show on main Pokemon list page */}
        {!isPokemonDetailPage && dictionary && (
          <div className="border-t border-gray-100 bg-gradient-to-b from-blue-50/50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8">
              <div className="flex justify-center mb-4">
                <Image
                  src="/logo.png"
                  alt={lang === 'en' ? 'Pokédex' : 'ポケモン図鑑'}
                  width={300}
                  height={112}
                  priority
                  className="h-auto w-auto max-w-xs md:max-w-md"
                />
              </div>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                {dictionary.meta.description}
              </p>
            </div>
          </div>
        )}
      </header>
    </>
  );
}