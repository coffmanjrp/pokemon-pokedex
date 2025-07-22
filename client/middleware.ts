import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLanguageFromCookie } from "@/lib/languageStorage";

const locales = ["en", "ja", "zh-Hans", "zh-Hant", "es"];
const defaultLocale = "en";

// Check User-Agent for language indicators
function getUserAgentLanguage(request: NextRequest): string | null {
  const userAgent = request.headers.get("user-agent");
  if (!userAgent) return null;

  const userAgentLower = userAgent.toLowerCase();

  // Check for Japanese language indicators in User-Agent
  const japaneseIndicators = [
    "ja",
    "ja-jp",
    "japanese",
    "japan",
    "jp",
    "ＪＰ",
    "ｊａ",
    "日本語",
  ];

  for (const indicator of japaneseIndicators) {
    if (userAgentLower.includes(indicator.toLowerCase())) {
      return "ja";
    }
  }

  // Check for Traditional Chinese indicators first (more specific)
  const traditionalChineseIndicators = [
    "zh-tw",
    "zh-hk",
    "zh-mo",
    "taiwan",
    "hong kong",
    "hongkong",
    "macau",
    "繁體",
    "繁体",
    "正體",
    "臺灣",
    "台灣",
    "台湾",
    "香港",
  ];

  for (const indicator of traditionalChineseIndicators) {
    if (userAgentLower.includes(indicator.toLowerCase())) {
      return "zh-Hant";
    }
  }

  // Check for Simplified Chinese indicators
  const simplifiedChineseIndicators = [
    "zh-cn",
    "zh-sg",
    "china",
    "chinese",
    "中文",
    "中国",
    "简体",
    "簡體",
    "大陆",
    "大陸",
    "新加坡",
  ];

  for (const indicator of simplifiedChineseIndicators) {
    if (userAgentLower.includes(indicator.toLowerCase())) {
      return "zh-Hans";
    }
  }

  // Check for Spanish language indicators
  const spanishIndicators = [
    "es",
    "es-es",
    "es-mx",
    "es-ar",
    "es-co",
    "es-cl",
    "spanish",
    "español",
    "spain",
    "españa",
    "mexico",
    "méxico",
    "argentina",
    "colombia",
    "chile",
  ];

  for (const indicator of spanishIndicators) {
    if (userAgentLower.includes(indicator.toLowerCase())) {
      return "es";
    }
  }

  return null;
}

// Get the preferred locale with priority: Cookie > User-Agent > Accept-Language > Default
function getLocale(request: NextRequest): string {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameLocale) return pathnameLocale;

  // 1. Check cookie (localStorage backup) - HIGHEST PRIORITY
  const cookieHeader = request.headers.get("cookie") || "";
  const cookieLang = getLanguageFromCookie(cookieHeader);
  if (cookieLang && locales.includes(cookieLang)) {
    return cookieLang;
  }

  // 2. Check User-Agent for language detection (Japanese, Chinese)
  const userAgentLang = getUserAgentLanguage(request);
  if (userAgentLang && locales.includes(userAgentLang)) {
    return userAgentLang;
  }

  // 3. Check the Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferredLocales = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0]?.trim())
      .filter((lang): lang is string => lang !== undefined);

    for (const preferredLocale of preferredLocales) {
      if (locales.includes(preferredLocale)) {
        return preferredLocale;
      }

      // Handle specific Chinese language variants
      if (
        preferredLocale === "zh-TW" ||
        preferredLocale === "zh-HK" ||
        preferredLocale === "zh-MO"
      ) {
        return "zh-Hant";
      }
      if (preferredLocale === "zh-CN" || preferredLocale === "zh-SG") {
        return "zh-Hans";
      }

      // Check for language prefix (e.g., 'ja' from 'ja-JP')
      const langPrefix = preferredLocale.split("-")[0];
      if (langPrefix === "zh") {
        // Default to Simplified Chinese for generic 'zh'
        return "zh-Hans";
      }
      if (langPrefix && locales.includes(langPrefix)) {
        return langPrefix;
      }
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // Redirect if there is no locale
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!_next|api|favicon.ico|logo.png).*)"],
};
