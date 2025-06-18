import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pokemon, PokemonType } from '@/types/pokemon';

interface PokemonState {
  pokemons: Pokemon[];
  selectedPokemon: Pokemon | null;
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  endCursor: string | null;
  filters: {
    search: string;
    types: PokemonType[];
    generation: number | null;
  };
}

const initialState: PokemonState = {
  pokemons: [],
  selectedPokemon: null,
  loading: false,
  error: null,
  hasNextPage: true,
  endCursor: null,
  filters: {
    search: '',
    types: [],
    generation: null,
  },
};

const pokemonSlice = createSlice({
  name: 'pokemon',
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
      state.pokemons.push(...action.payload);
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
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setTypeFilters: (state, action: PayloadAction<PokemonType[]>) => {
      state.filters.types = action.payload;
    },
    setGenerationFilter: (state, action: PayloadAction<number | null>) => {
      state.filters.generation = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        types: [],
        generation: null,
      };
    },
    resetPokemonList: (state) => {
      state.pokemons = [];
      state.hasNextPage = true;
      state.endCursor = null;
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
  setSearchFilter,
  setTypeFilters,
  setGenerationFilter,
  clearFilters,
  resetPokemonList,
} = pokemonSlice.actions;

export default pokemonSlice.reducer;