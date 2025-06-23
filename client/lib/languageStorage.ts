import { Language } from '@/store/slices/uiSlice';

const LANGUAGE_STORAGE_KEY = 'pokemon-pokedex-language';
const LANGUAGE_COOKIE_KEY = 'pokemon-pokedex-lang';

/**
 * Get stored language preference from localStorage
 * Returns null if not available or not supported
 */
export function getStoredLanguage(): Language | null {
  // Check if we're on the client side
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && (stored === 'en' || stored === 'ja')) {
      return stored as Language;
    }
  } catch (error) {
    // localStorage might not be available (e.g., in private mode)
    console.warn('Failed to read language preference from localStorage:', error);
  }
  
  return null;
}

/**
 * Save language preference to localStorage and cookie
 */
export function setStoredLanguage(language: Language): void {
  // Check if we're on the client side
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    // Also set a cookie so middleware can access it
    document.cookie = `${LANGUAGE_COOKIE_KEY}=${language}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
  } catch (error) {
    // localStorage might not be available (e.g., in private mode)
    console.warn('Failed to save language preference to localStorage:', error);
  }
}

/**
 * Clear stored language preference
 */
export function clearStoredLanguage(): void {
  // Check if we're on the client side
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    // Also clear the cookie
    document.cookie = `${LANGUAGE_COOKIE_KEY}=; path=/; max-age=0`;
  } catch (error) {
    console.warn('Failed to clear language preference from localStorage:', error);
  }
}

/**
 * Get language preference from cookie (for server-side access)
 */
export function getLanguageFromCookie(cookieString: string): Language | null {
  const cookies = cookieString.split(';').map(c => c.trim());
  const languageCookie = cookies.find(c => c.startsWith(`${LANGUAGE_COOKIE_KEY}=`));
  
  if (languageCookie) {
    const value = languageCookie.split('=')[1];
    if (value === 'en' || value === 'ja') {
      return value as Language;
    }
  }
  
  return null;
}