'use client';

import { useEffect, useState } from 'react';
import { querySelector, isSSGBuild, isRuntimeBrowsing } from '@/lib/querySelector';

interface DataStrategyInfo {
  buildMode: 'ssg' | 'runtime';
  listQueryType: 'basic' | 'full';
  detailQueryType: 'basic' | 'full';
  cacheStrategy: 'aggressive' | 'selective';
  performanceProfile: 'speed' | 'completeness';
}

export function useDataStrategy(): DataStrategyInfo {
  const [strategyInfo, setStrategyInfo] = useState<DataStrategyInfo>(() => {
    const buildMode = querySelector.getBuildMode();
    
    return {
      buildMode,
      listQueryType: buildMode === 'ssg' ? 'full' : 'basic',
      detailQueryType: buildMode === 'ssg' ? 'full' : 'basic',
      cacheStrategy: buildMode === 'ssg' ? 'aggressive' : 'selective',
      performanceProfile: buildMode === 'ssg' ? 'completeness' : 'speed'
    };
  });

  useEffect(() => {
    const buildMode = querySelector.getBuildMode();
    
    setStrategyInfo({
      buildMode,
      listQueryType: buildMode === 'ssg' ? 'full' : 'basic',
      detailQueryType: buildMode === 'ssg' ? 'full' : 'basic',
      cacheStrategy: buildMode === 'ssg' ? 'aggressive' : 'selective',
      performanceProfile: buildMode === 'ssg' ? 'completeness' : 'speed'
    });
  }, []);

  return strategyInfo;
}

// Debug info getter for development
export function getDataStrategyDebugInfo() {
  const buildMode = querySelector.getBuildMode();
  
  return {
    buildMode,
    listQueryType: buildMode === 'ssg' ? 'full' : 'basic',
    detailQueryType: buildMode === 'ssg' ? 'full' : 'basic',
    cacheStrategy: buildMode === 'ssg' ? 'aggressive' : 'selective',
    performanceProfile: buildMode === 'ssg' ? 'completeness' : 'speed'
  };
}