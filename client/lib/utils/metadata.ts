/**
 * Utility functions for metadata generation
 */

/**
 * Get the base URL for the application
 * Prioritizes NEXT_PUBLIC_APP_URL, then VERCEL_URL, then fallback
 */
export function getBaseUrl(): string {
  // Production URL from environment variable
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Vercel automatic URL (for preview deployments)
  // Note: VERCEL_URL is automatically provided by Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback for local development
  return "http://localhost:3000";
}

/**
 * Generate canonical URL for a given path
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Generate alternate language URLs for SEO
 */
export function getAlternateUrls(
  path: string,
  languages: string[],
): Record<string, string> {
  const baseUrl = getBaseUrl();
  const alternates: Record<string, string> = {};

  languages.forEach((lang) => {
    // Remove language prefix from path if it exists
    const pathWithoutLang = path.replace(/^\/[a-z]{2}(\/|$)/, "/");
    const normalizedPath = pathWithoutLang.startsWith("/")
      ? pathWithoutLang
      : `/${pathWithoutLang}`;
    alternates[lang] = `${baseUrl}/${lang}${normalizedPath}`;
  });

  return alternates;
}
