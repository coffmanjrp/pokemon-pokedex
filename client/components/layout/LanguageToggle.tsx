'use client';

import { cn } from '@/lib/utils';
import { Locale } from '@/lib/dictionaries';

interface LanguageToggleProps {
  language: Locale;
  onToggle: () => void;
  className?: string;
}

export function LanguageToggle({ language, onToggle, className }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'px-3 py-1 rounded-md text-sm font-medium',
        'border border-gray-300 hover:bg-gray-50',
        'transition-colors duration-200',
        className
      )}
    >
      {language === 'en' ? '🇺🇸 EN' : '🇯🇵 JP'}
    </button>
  );
}