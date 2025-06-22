import { DocumentNode } from '@apollo/client';
import { 
  GET_POKEMONS_BASIC, 
  GET_POKEMON_BASIC,
  GET_POKEMONS_FULL, 
  GET_POKEMON 
} from '@/graphql/queries';

export type BuildMode = 'ssg' | 'runtime';
export type QueryType = 'list' | 'detail';

interface QuerySelectorConfig {
  buildMode?: BuildMode;
  forceMode?: BuildMode;
}

class QuerySelector {
  private buildMode: BuildMode;

  constructor() {
    // Determine build mode from environment
    this.buildMode = this.detectBuildMode();
  }

  private detectBuildMode(): BuildMode {
    // Check if we're in SSG build context
    if (typeof window === 'undefined') {
      // Server-side: check environment variables
      return process.env.BUILD_MODE === 'ssg' ? 'ssg' : 'runtime';
    }
    
    // Client-side: check for build indicators
    const buildModeEnv = process.env.NEXT_PUBLIC_BUILD_MODE;
    if (buildModeEnv === 'ssg') {
      return 'ssg';
    }
    
    // Default to runtime for client-side browsing
    return 'runtime';
  }

  /**
   * Get the appropriate query based on build mode and query type
   */
  getQuery(queryType: QueryType, config?: QuerySelectorConfig): DocumentNode {
    const effectiveBuildMode = config?.forceMode || config?.buildMode || this.buildMode;
    
    if (queryType === 'list') {
      // For Pokemon list queries
      return effectiveBuildMode === 'ssg' ? GET_POKEMONS_FULL : GET_POKEMONS_BASIC;
    } else {
      // For Pokemon detail queries
      return effectiveBuildMode === 'ssg' ? GET_POKEMON : GET_POKEMON_BASIC;
    }
  }

  /**
   * Get the current build mode
   */
  getBuildMode(): BuildMode {
    return this.buildMode;
  }

  /**
   * Check if we're in SSG build mode
   */
  isSSGMode(): boolean {
    return this.buildMode === 'ssg';
  }

  /**
   * Check if we're in runtime browsing mode
   */
  isRuntimeMode(): boolean {
    return this.buildMode === 'runtime';
  }

  /**
   * Override build mode for specific use cases
   */
  setBuildMode(mode: BuildMode): void {
    this.buildMode = mode;
  }
}

// Export singleton instance
export const querySelector = new QuerySelector();

// Export helper functions for convenience
export const getListQuery = (config?: QuerySelectorConfig) => 
  querySelector.getQuery('list', config);

export const getDetailQuery = (config?: QuerySelectorConfig) => 
  querySelector.getQuery('detail', config);

export const isSSGBuild = () => querySelector.isSSGMode();
export const isRuntimeBrowsing = () => querySelector.isRuntimeMode();