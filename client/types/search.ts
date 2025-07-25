// Search scope for Pokemon search functionality
export enum SearchScope {
  CURRENT_GENERATION = "current",
  ALL_GENERATIONS = "all",
}

// Search filters including scope
export interface SearchFilters {
  types?: string[];
  scope?: SearchScope;
}

import { Pokemon } from "./pokemon";

// Search result with metadata
export interface SearchResult {
  pokemon: Pokemon;
  matchType: "name" | "id" | "type" | "ability";
  matchedValue: string;
  generation?: number; // Added for cross-generation search
}
