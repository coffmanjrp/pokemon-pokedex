import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pokemon } from '@/types/pokemon';

interface PokemonState {
  pokemons: Pokemon[];
  selectedPokemon: Pokemon | null;
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  endCursor: string | null;
}

const initialState: PokemonState = {
  pokemons: [],
  selectedPokemon: null,
  loading: false,
  error: null,
  hasNextPage: true,
  endCursor: null,
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
      // Filter out duplicates based on Pokemon ID
      const existingIds = new Set(state.pokemons.map(p => p.id));
      const newPokemons = action.payload.filter(pokemon => !existingIds.has(pokemon.id));
      
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
} = pokemonSlice.actions;

export default pokemonSlice.reducer;