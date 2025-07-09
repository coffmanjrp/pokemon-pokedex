import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ScrollPosition {
  generation: number;
  scrollTop?: number; // For standard grid
  pokemonIndex?: number; // For virtual scroll
  pokemonId?: string; // The Pokemon ID clicked
  timestamp: number;
}

interface NavigationState {
  scrollPositions: Record<number, ScrollPosition>; // Keyed by generation
  lastVisitedPokemon: string | null;
  returnFromDetail: boolean;
}

const initialState: NavigationState = {
  scrollPositions: {},
  lastVisitedPokemon: null,
  returnFromDetail: false,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    saveScrollPosition: (state, action: PayloadAction<ScrollPosition>) => {
      const { generation } = action.payload;
      state.scrollPositions[generation] = action.payload;
    },
    setLastVisitedPokemon: (state, action: PayloadAction<string>) => {
      state.lastVisitedPokemon = action.payload;
    },
    setReturnFromDetail: (state, action: PayloadAction<boolean>) => {
      state.returnFromDetail = action.payload;
    },
    clearScrollPosition: (state, action: PayloadAction<number>) => {
      delete state.scrollPositions[action.payload];
    },
    clearAllScrollPositions: (state) => {
      state.scrollPositions = {};
      state.lastVisitedPokemon = null;
      state.returnFromDetail = false;
    },
  },
});

export const {
  saveScrollPosition,
  setLastVisitedPokemon,
  setReturnFromDetail,
  clearScrollPosition,
  clearAllScrollPositions,
} = navigationSlice.actions;

export default navigationSlice.reducer;
