import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from './slices/pokemonSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;