'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLanguage, toggleTheme, setFilterModalOpen } from '@/store/slices/uiSlice';
import { setSearchFilter } from '@/store/slices/pokemonSlice';
import { useRouter, usePathname } from 'next/navigation';
import { Locale, generateAlternateLanguageUrl } from '@/lib/dictionaries';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { FilterButton } from './FilterButton';
import { FilterModal } from '../ui/FilterModal';

interface HeaderProps {
  lang: Locale;
}

export function Header({ lang }: HeaderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useAppSelector((state) => state.ui);
  const [searchValue, setSearchValue] = useState('');

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

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleFilterClick = () => {
    dispatch(setFilterModalOpen(true));
  };

  return (
    <>
      <FilterModal lang={lang} />
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Search Bar */}
          <SearchBar
            value={searchValue}
            onChange={handleSearchChange}
            className="flex-1 max-w-lg mx-8"
          />

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <LanguageToggle
              language={lang}
              onToggle={handleLanguageToggle}
            />

            <ThemeToggle
              theme={theme}
              onToggle={handleThemeToggle}
            />

            <FilterButton onClick={handleFilterClick} lang={lang} />
          </div>
        </div>
      </div>
    </header>
    </>
  );
}