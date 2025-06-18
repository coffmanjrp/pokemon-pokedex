'use client';

import { cn } from '@/lib/utils';

interface FilterButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function FilterButton({ onClick, className, children }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 bg-blue-600 text-white rounded-lg',
        'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
        'transition-colors duration-200 font-medium',
        className
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
      {children || 'Filter'}
    </button>
  );
}