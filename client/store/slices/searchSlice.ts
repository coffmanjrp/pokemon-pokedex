import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Pokemon, PokemonTypeName } from "@/types/pokemon";

export interface SearchFilters {
  types: PokemonTypeName[];
  generations: number[];
  minId?: number;
  maxId?: number;
}

export interface SearchResult {
  pokemon: Pokemon;
  matchType: "name" | "id" | "type" | "ability";
  matchedValue: string;
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  results: SearchResult[];
  suggestions: string[];
  filters: SearchFilters;
  searchHistory: string[];
  isSearchMode: boolean; // Whether we're currently in search mode
  error: string | null;
  totalResults: number;
  hasNextPage: boolean;
  endCursor: string | null;
}

const initialState: SearchState = {
  query: "",
  isSearching: false,
  results: [],
  suggestions: [],
  filters: {
    types: [],
    generations: [],
  },
  searchHistory: [],
  isSearchMode: false,
  error: null,
  totalResults: 0,
  hasNextPage: false,
  endCursor: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },

    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },

    setResults: (state, action: PayloadAction<SearchResult[]>) => {
      state.results = action.payload;
    },

    addResults: (state, action: PayloadAction<SearchResult[]>) => {
      // Filter out duplicates based on Pokemon ID
      const existingIds = new Set(state.results.map((r) => r.pokemon.id));
      const newResults = action.payload.filter(
        (result) => !existingIds.has(result.pokemon.id),
      );
      state.results.push(...newResults);
    },

    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload;
    },

    setFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    addToSearchHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query && !state.searchHistory.includes(query)) {
        state.searchHistory.unshift(query);
        // Keep only last 10 searches
        if (state.searchHistory.length > 10) {
          state.searchHistory = state.searchHistory.slice(0, 10);
        }
      }
    },

    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },

    setIsSearchMode: (state, action: PayloadAction<boolean>) => {
      state.isSearchMode = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setTotalResults: (state, action: PayloadAction<number>) => {
      state.totalResults = action.payload;
    },

    setHasNextPage: (state, action: PayloadAction<boolean>) => {
      state.hasNextPage = action.payload;
    },

    setEndCursor: (state, action: PayloadAction<string | null>) => {
      state.endCursor = action.payload;
    },

    clearSearch: (state) => {
      state.query = "";
      state.results = [];
      state.suggestions = [];
      state.isSearchMode = false;
      state.error = null;
      state.totalResults = 0;
      state.hasNextPage = false;
      state.endCursor = null;
    },

    clearFilters: (state) => {
      state.filters = {
        types: [],
        generations: [],
      };
    },

    // Type filter actions
    addTypeFilter: (state, action: PayloadAction<PokemonTypeName>) => {
      if (!state.filters.types.includes(action.payload)) {
        state.filters.types.push(action.payload);
      }
    },

    removeTypeFilter: (state, action: PayloadAction<PokemonTypeName>) => {
      state.filters.types = state.filters.types.filter(
        (type) => type !== action.payload,
      );
    },

    // Generation filter actions
    addGenerationFilter: (state, action: PayloadAction<number>) => {
      if (!state.filters.generations.includes(action.payload)) {
        state.filters.generations.push(action.payload);
      }
    },

    removeGenerationFilter: (state, action: PayloadAction<number>) => {
      state.filters.generations = state.filters.generations.filter(
        (gen) => gen !== action.payload,
      );
    },
  },
});

export const {
  setQuery,
  setIsSearching,
  setResults,
  addResults,
  setSuggestions,
  setFilters,
  addToSearchHistory,
  clearSearchHistory,
  setIsSearchMode,
  setError,
  setTotalResults,
  setHasNextPage,
  setEndCursor,
  clearSearch,
  clearFilters,
  addTypeFilter,
  removeTypeFilter,
  addGenerationFilter,
  removeGenerationFilter,
} = searchSlice.actions;

export default searchSlice.reducer;
