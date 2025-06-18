'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn(
      "text-2xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent",
      className
    )}>
      Pokédex
    </div>
  );
}