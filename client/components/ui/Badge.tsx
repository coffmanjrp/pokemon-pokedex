'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ children, className, style }: BadgeProps) {
  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-xs font-semibold text-white',
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}