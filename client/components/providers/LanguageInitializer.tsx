"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  initializeLanguageFromStorage,
  initializeLanguageAndDictionary,
} from "@/store/slices/uiSlice";
import { getStoredLanguage, setStoredLanguage } from "@/lib/languageStorage";
import { Dictionary, Locale } from "@/lib/dictionaries";

interface LanguageInitializerProps {
  lang?: Locale;
  dictionary?: Dictionary;
}

export function LanguageInitializer({
  lang,
  dictionary,
}: LanguageInitializerProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (lang && dictionary) {
      // Initialize both language and dictionary from server-side props
      dispatch(initializeLanguageAndDictionary({ language: lang, dictionary }));
    } else {
      // Fallback: Initialize language from localStorage after client-side hydration
      dispatch(initializeLanguageFromStorage());
    }

    // Ensure cookie is set if localStorage has a value but cookie doesn't exist
    const storedLang = getStoredLanguage();
    if (storedLang) {
      // This will set both localStorage and cookie (cookie might be missing)
      setStoredLanguage(storedLang);
    }
  }, [dispatch, lang, dictionary]);

  return null; // This component doesn't render anything
}
