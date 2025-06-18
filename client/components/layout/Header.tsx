'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLanguage, toggleTheme } from '@/store/slices/uiSlice';
import { setSearchFilter } from '@/store/slices/pokemonSlice';
import { cn } from '@/lib/utils';

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
            <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
              Pokédex
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={cn(
                  'block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg',
                  'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  'placeholder-gray-500 text-gray-900',
                  'transition-colors duration-200'
                )}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={handleLanguageToggle}
              className={cn(
                'px-3 py-1 rounded-md text-sm font-medium',
                'border border-gray-300 hover:bg-gray-50',
                'transition-colors duration-200'
              )}
            >
              {language === 'en' ? '🇺🇸 EN' : '🇯🇵 JP'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className={cn(
                'p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                'transition-colors duration-200'
              )}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            {/* Filter Button */}
            <button
              className={cn(
                'px-4 py-2 bg-blue-600 text-white rounded-lg',
                'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
                'transition-colors duration-200 font-medium'
              )}
            >
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                />
              </svg>
              Filter
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}