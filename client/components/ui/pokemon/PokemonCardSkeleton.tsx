'use client';

export function PokemonCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white border-2 border-gray-200 shadow-lg animate-pulse">
      {/* Pokemon ID Skeleton */}
      <div className="absolute top-3 right-3 z-10">
        <div className="h-6 w-12 bg-gray-300 rounded-full" />
      </div>

      {/* Pokemon Image Skeleton */}
      <div className="relative h-48 flex items-center justify-center p-4">
        <div className="w-32 h-32 bg-gray-300 rounded-full" />
      </div>

      {/* Pokemon Info Skeleton */}
      <div className="p-4 pt-0">
        {/* Name Skeleton */}
        <div className="h-6 bg-gray-300 rounded mb-2 mx-auto w-3/4" />

        {/* Types Skeleton */}
        <div className="flex gap-1 justify-center mb-3">
          <div className="h-6 w-16 bg-gray-300 rounded-full" />
          <div className="h-6 w-16 bg-gray-300 rounded-full" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="h-4 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-300 rounded" />
        </div>

        {/* HP Bar Skeleton */}
        <div className="space-y-1">
          <div className="h-3 bg-gray-300 rounded w-1/3" />
          <div className="h-2 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}