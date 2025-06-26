import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getStoredLanguage, setStoredLanguage } from "@/lib/languageStorage";

export type Language = "en" | "ja";

interface UIState {
  language: Language;
  isMenuOpen: boolean;
  isLoading: boolean;
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    timestamp: number;
  }>;
}

// Server-side safe initial state - always use default for SSR
const initialState: UIState = {
  language: "en", // Always start with 'en' for SSR compatibility
  isMenuOpen: false,
  isLoading: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      // Persist to localStorage when language changes via user interaction
      setStoredLanguage(action.payload);
    },
    // Initialize language from localStorage after hydration (without persisting back)
    initializeLanguageFromStorage: (state) => {
      const stored = getStoredLanguage();
      if (stored) {
        state.language = stored;
        // Don't call setStoredLanguage here to avoid overwriting
      }
    },
    setMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMenuOpen = action.payload;
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<
        Omit<UIState["notifications"][0], "id" | "timestamp">
      >,
    ) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload,
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setLanguage,
  initializeLanguageFromStorage,
  setMenuOpen,
  toggleMenu,
  setGlobalLoading,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
