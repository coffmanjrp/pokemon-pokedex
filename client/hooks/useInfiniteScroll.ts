'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  loading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
  root?: Element | null;
}

export function useInfiniteScroll({
  hasNextPage,
  loading,
  onLoadMore,
  rootMargin = '100px',
  threshold = 0.1,
  root = null,
}: UseInfiniteScrollOptions) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      console.log('Intersection observer triggered:', {
        isIntersecting: entry.isIntersecting,
        hasNextPage,
        loading,
        boundingClientRect: entry.boundingClientRect,
        intersectionRatio: entry.intersectionRatio
      });
      
      if (
        entry.isIntersecting &&
        hasNextPage &&
        !loading
      ) {
        console.log('✅ Conditions met - loading more...');
        onLoadMore();
      } else {
        console.log('❌ Conditions not met:', {
          isIntersecting: entry.isIntersecting,
          hasNextPage,
          loading
        });
      }
    },
    [hasNextPage, loading, onLoadMore]
  );

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      const element = loadMoreRef.current;
      if (!element) {
        return null;
      }

      console.log('🔧 Setting up IntersectionObserver with root:', root);

      observer = new IntersectionObserver(handleIntersection, {
        root,
        rootMargin,
        threshold,
      });

      observer.observe(element);
      console.log('👀 Started observing element');
      return observer;
    };

    // 短い遅延で安定化
    const timer = setTimeout(() => {
      setupObserver();
    }, 50);

    return () => {
      clearTimeout(timer);
      if (observer) {
        console.log('🛑 Cleaning up observer');
        observer.disconnect();
      }
    };
  }, [handleIntersection, root, rootMargin, threshold]);

  return loadMoreRef;
}