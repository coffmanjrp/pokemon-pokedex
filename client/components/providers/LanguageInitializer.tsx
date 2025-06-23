'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { initializeLanguageFromStorage } from '@/store/slices/uiSlice';
import { getStoredLanguage, setStoredLanguage } from '@/lib/languageStorage';

export function LanguageInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize language from localStorage after client-side hydration
    dispatch(initializeLanguageFromStorage());
    
    // Ensure cookie is set if localStorage has a value but cookie doesn't exist
    const storedLang = getStoredLanguage();
    if (storedLang) {
      // This will set both localStorage and cookie (cookie might be missing)
      setStoredLanguage(storedLang);
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
}