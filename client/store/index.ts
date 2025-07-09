import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from "./slices/pokemonSlice";
import uiReducer from "./slices/uiSlice";
import searchReducer from "./slices/searchSlice";
import navigationReducer from "./slices/navigationSlice";

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    ui: uiReducer,
    search: searchReducer,
    navigation: navigationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check to prevent circular reference errors
    }),
  devTools: false, // Disable Redux DevTools to prevent serialization issues
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
