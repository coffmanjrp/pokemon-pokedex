import React from 'react';

interface DataEmptyStateProps {
  type: 'moves' | 'descriptions' | 'games' | 'sprites' | 'evolution' | 'abilities' | 'general';
  language: 'en' | 'ja';
  customMessage?: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
}

const emptyStateMessages = {
  moves: {
    en: 'No move data available',
    ja: '技データがありません',
  },
  descriptions: {
    en: 'No descriptions available',
    ja: '説明がありません',
  },
  games: {
    en: 'No game data available',
    ja: 'ゲームデータがありません',
  },
  sprites: {
    en: 'No sprites available',
    ja: 'スプライトがありません',
  },
  evolution: {
    en: 'No evolution data available',
    ja: '進化データがありません',
  },
  abilities: {
    en: 'No abilities available',
    ja: '特性データがありません',
  },
  general: {
    en: 'No data available',
    ja: 'データがありません',
  },
};

const defaultIcons = {
  moves: '⚔️',
  descriptions: '📖',
  games: '🎮',
  sprites: '🖼️',
  evolution: '🔄',
  abilities: '✨',
  general: '📋',
};

const sizeClasses = {
  sm: {
    container: 'p-4',
    icon: 'text-2xl',
    text: 'text-sm',
  },
  md: {
    container: 'p-8',
    icon: 'text-4xl',
    text: 'text-base',
  },
  lg: {
    container: 'p-12',
    icon: 'text-6xl',
    text: 'text-lg',
  },
};

export function DataEmptyState({ 
  type, 
  language, 
  customMessage, 
  icon,
  size = 'md' 
}: DataEmptyStateProps) {
  const message = customMessage || emptyStateMessages[type][language];
  const displayIcon = icon || defaultIcons[type];
  const classes = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center text-gray-500 ${classes.container}`}>
      <div className={`mb-4 ${classes.icon}`}>
        {displayIcon}
      </div>
      <p className={`font-medium ${classes.text}`}>
        {message}
      </p>
    </div>
  );
}