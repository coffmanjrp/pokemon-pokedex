'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLanguage, toggleTheme } from '@/store/slices/uiSlice';
import { setSearchFilter } from '@/store/slices/pokemonSlice';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { FilterButton } from './FilterButton';

export function Header() {
  const dispatch = useAppDispatch();
  const { language, theme } = useAppSelector((state) => state.ui);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    dispatch(setSearchFilter(value));
  };

  const handleLanguageToggle = () => {
    dispatch(setLanguage(language === 'en' ? 'ja' : 'en'));
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
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
              language={language}
              onToggle={handleLanguageToggle}
            />

            <ThemeToggle
              theme={theme}
              onToggle={handleThemeToggle}
            />

            <FilterButton />
          </div>
        </div>
      </div>
    </header>
  );
}