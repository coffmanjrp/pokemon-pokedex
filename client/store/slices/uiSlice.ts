import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'en' | 'ja';

interface UIState {
  language: Language;
  isMenuOpen: boolean;
  isFilterModalOpen: boolean;
  isLoading: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
}

const initialState: UIState = {
  language: 'en',
  isMenuOpen: false,
  isFilterModalOpen: false,
  isLoading: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    setMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMenuOpen = action.payload;
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    setFilterModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isFilterModalOpen = action.payload;
    },
    toggleFilterModal: (state) => {
      state.isFilterModalOpen = !state.isFilterModalOpen;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setLanguage,
  setMenuOpen,
  toggleMenu,
  setFilterModalOpen,
  toggleFilterModal,
  setGlobalLoading,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;