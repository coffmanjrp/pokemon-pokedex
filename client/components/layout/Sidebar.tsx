'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setLanguage } from '@/store/slices/uiSlice';
import { useRouter, usePathname } from 'next/navigation';
import { Locale, generateAlternateLanguageUrl } from '@/lib/dictionaries';
import { setStoredLanguage } from '@/lib/languageStorage';
import { GENERATIONS } from '@/lib/data/generations';
import { Logo } from './Logo';
import { LanguageToggle } from './LanguageToggle';

interface SidebarProps {
  lang: Locale;
  currentGeneration: number;
  onGenerationChange: (generation: number) => void;
}

export function Sidebar({ lang, currentGeneration, onGenerationChange }: SidebarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLanguageToggle = () => {
    const newLang = lang === 'en' ? 'ja' : 'en';
    const newUrl = generateAlternateLanguageUrl(pathname, newLang);
    
    // Save to localStorage first
    setStoredLanguage(newLang);
    
    // Update Redux state
    dispatch(setLanguage(newLang));
    
    // Navigate to new URL
    router.push(newUrl);
  };

  const handleGenerationClick = (generationId: number) => {
    onGenerationChange(generationId);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={`
        fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 shadow-lg z-40 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header with Logo */}
          <div className="p-6 border-b border-gray-200">
            <Logo />
          </div>

          {/* Generation Buttons */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                {lang === 'ja' ? '世代選択' : 'Generations'}
              </h3>
              <div className="space-y-2">
                {GENERATIONS.map((generation) => (
                  <button
                    key={generation.id}
                    onClick={() => handleGenerationClick(generation.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition-colors duration-200
                      ${currentGeneration === generation.id
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                      }
                    `}
                  >
                    <div className="font-medium text-sm">
                      {generation.name[lang]}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {generation.region[lang]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Language Toggle at Bottom */}
          <div className="p-6 border-t border-gray-200">
            <LanguageToggle
              language={lang}
              onToggle={handleLanguageToggle}
            />
          </div>
        </div>
      </nav>
    </>
  );
}