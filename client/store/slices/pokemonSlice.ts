import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Pokemon } from "@/types/pokemon";

// Generation-specific cache data structure
interface GenerationCache {
  pokemons: Pokemon[];
  hasNextPage: boolean;
  endCursor: string | null;
  loadedCount: number;
  lastUpdated: number;
}

interface PokemonState {
  // Current display data (for backward compatibility)
  pokemons: Pokemon[];
  selectedPokemon: Pokemon | null;
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  endCursor: string | null;
  currentGeneration: number;
  generationSwitching: boolean;

  // Multi-generation cache system
  generationData: { [generation: number]: GenerationCache };
  cachedGenerations: number[];
}

const initialState: PokemonState = {
  pokemons: [],
  selectedPokemon: null,
  loading: false,
  error: null,
  hasNextPage: true,
  endCursor: null,
  currentGeneration: 1,
  generationSwitching: false,

  // Multi-generation cache
  generationData: {},
  cachedGenerations: [],
};

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPokemons: (state, action: PayloadAction<Pokemon[]>) => {
      state.pokemons = action.payload;
    },
    addPokemons: (state, action: PayloadAction<Pokemon[]>) => {
      // Filter out duplicates based on Pokemon ID
      const existingIds = new Set(state.pokemons.map((p) => p.id));
      const newPokemons = action.payload.filter(
        (pokemon) => !existingIds.has(pokemon.id),
      );

      state.pokemons.push(...newPokemons);
    },
    setSelectedPokemon: (state, action: PayloadAction<Pokemon | null>) => {
      state.selectedPokemon = action.payload;
    },
    setHasNextPage: (state, action: PayloadAction<boolean>) => {
      state.hasNextPage = action.payload;
    },
    setEndCursor: (state, action: PayloadAction<string | null>) => {
      state.endCursor = action.payload;
    },
    resetPokemonList: (state) => {
      state.pokemons = [];
      state.hasNextPage = true;
      state.endCursor = null;
    },
    setCurrentGeneration: (state, action: PayloadAction<number>) => {
      state.currentGeneration = action.payload;
    },
    setGenerationSwitching: (state, action: PayloadAction<boolean>) => {
      state.generationSwitching = action.payload;
    },

    // Multi-generation cache management
    cacheGenerationData: (
      state,
      action: PayloadAction<{
        generation: number;
        pokemons: Pokemon[];
        hasNextPage: boolean;
        endCursor: string | null;
        loadedCount: number;
      }>,
    ) => {
      const { generation, pokemons, hasNextPage, endCursor, loadedCount } =
        action.payload;
      state.generationData[generation] = {
        pokemons,
        hasNextPage,
        endCursor,
        loadedCount,
        lastUpdated: Date.now(),
      };

      // Add to cached generations if not already present
      if (!state.cachedGenerations.includes(generation)) {
        state.cachedGenerations.push(generation);
      }
    },

    addPokemonsToGeneration: (
      state,
      action: PayloadAction<{
        generation: number;
        pokemons: Pokemon[];
        hasNextPage: boolean;
        endCursor: string | null;
      }>,
    ) => {
      const { generation, pokemons, hasNextPage, endCursor } = action.payload;

      if (state.generationData[generation]) {
        // Filter out duplicates
        const existingIds = new Set(
          state.generationData[generation].pokemons.map((p) => p.id),
        );
        const newPokemons = pokemons.filter(
          (pokemon) => !existingIds.has(pokemon.id),
        );

        state.generationData[generation].pokemons.push(...newPokemons);
        state.generationData[generation].hasNextPage = hasNextPage;
        state.generationData[generation].endCursor = endCursor;
        state.generationData[generation].loadedCount += newPokemons.length;
        state.generationData[generation].lastUpdated = Date.now();
      }
    },

    loadCachedGeneration: (state, action: PayloadAction<number>) => {
      const generation = action.payload;
      const cachedData = state.generationData[generation];

      if (cachedData) {
        // Load cached data into current display state
        state.pokemons = cachedData.pokemons;
        state.hasNextPage = cachedData.hasNextPage;
        state.endCursor = cachedData.endCursor;
        state.currentGeneration = generation;
      }
    },

    clearGenerationCache: (state, action: PayloadAction<number>) => {
      const generation = action.payload;
      delete state.generationData[generation];
      state.cachedGenerations = state.cachedGenerations.filter(
        (gen) => gen !== generation,
      );
    },

    clearAllCache: (state) => {
      state.generationData = {};
      state.cachedGenerations = [];
    },
  },
});

export const {
  setLoading,
  setError,
  setPokemons,
  addPokemons,
  setSelectedPokemon,
  setHasNextPage,
  setEndCursor,
  resetPokemonList,
  setCurrentGeneration,
  setGenerationSwitching,
  cacheGenerationData,
  addPokemonsToGeneration,
  loadCachedGeneration,
  clearGenerationCache,
  clearAllCache,
} = pokemonSlice.actions;

export default pokemonSlice.reducer;
