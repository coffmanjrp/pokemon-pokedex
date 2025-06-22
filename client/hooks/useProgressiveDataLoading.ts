'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { getDetailQuery, isRuntimeBrowsing } from '@/lib/querySelector';
import { GET_POKEMON } from '@/graphql/queries';

interface UseProgressiveDataLoadingOptions {
  pokemonId: string;
  enabled?: boolean;
  upgradeDelay?: number; // milliseconds to wait before upgrading to full data
}

export function useProgressiveDataLoading({
  pokemonId,
  enabled = true,
  upgradeDelay = 2000 // 2 seconds default delay
}: UseProgressiveDataLoadingOptions) {
  const [shouldUpgrade, setShouldUpgrade] = useState(false);
  const upgradeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Always start with appropriate query based on build mode
  const initialQuery = getDetailQuery();
  
  // Query for initial data (could be basic or full depending on mode)
  const { 
    data: initialData, 
    loading: initialLoading, 
    error: initialError 
  } = useQuery(initialQuery, {
    variables: { id: pokemonId },
    skip: !enabled,
    errorPolicy: 'ignore',
  });

  // Query for full data (only when upgrading in runtime mode)
  const { 
    data: fullData, 
    loading: fullLoading, 
    error: fullError 
  } = useQuery(GET_POKEMON, {
    variables: { id: pokemonId },
    skip: !enabled || !shouldUpgrade || !isRuntimeBrowsing(),
    errorPolicy: 'ignore',
    fetchPolicy: 'cache-first', // Check cache first to avoid duplicate requests
  });

  // Set up upgrade timer for runtime mode
  useEffect(() => {
    if (!enabled || !isRuntimeBrowsing()) {
      return;
    }

    // Clear existing timeout
    if (upgradeTimeoutRef.current) {
      clearTimeout(upgradeTimeoutRef.current);
    }

    // Set timeout to upgrade to full data
    upgradeTimeoutRef.current = setTimeout(() => {
      setShouldUpgrade(true);
    }, upgradeDelay);

    return () => {
      if (upgradeTimeoutRef.current) {
        clearTimeout(upgradeTimeoutRef.current);
      }
    };
  }, [pokemonId, enabled, upgradeDelay]);

  // Reset upgrade state when Pokemon ID changes
  useEffect(() => {
    setShouldUpgrade(false);
  }, [pokemonId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (upgradeTimeoutRef.current) {
        clearTimeout(upgradeTimeoutRef.current);
      }
    };
  }, []);

  // Determine which data to return based on state
  const getEffectiveData = () => {
    if (isRuntimeBrowsing() && shouldUpgrade && fullData) {
      // Runtime mode: return full data if available after upgrade
      return fullData;
    }
    // Return initial data (could be basic in runtime or full in SSG)
    return initialData;
  };

  const getEffectiveLoading = () => {
    if (isRuntimeBrowsing() && shouldUpgrade && fullLoading) {
      // Show loading state during upgrade
      return fullLoading;
    }
    return initialLoading;
  };

  const getEffectiveError = () => {
    if (isRuntimeBrowsing() && shouldUpgrade && fullError) {
      return fullError;
    }
    return initialError;
  };

  return {
    data: getEffectiveData(),
    loading: getEffectiveLoading(),
    error: getEffectiveError(),
    isUpgrading: isRuntimeBrowsing() && shouldUpgrade && fullLoading,
    hasUpgraded: isRuntimeBrowsing() && shouldUpgrade && !!fullData,
    isBasicData: isRuntimeBrowsing() && !shouldUpgrade,
    isFullData: !isRuntimeBrowsing() || (shouldUpgrade && !!fullData),
  };
}