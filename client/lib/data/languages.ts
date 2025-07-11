import { Locale } from "@/lib/dictionaries";

export interface LanguageOption {
  value: Locale;
  labelKey: keyof LanguageLabels;
  flag: string;
}

export interface LanguageLabels {
  english: string;
  japanese: string;
  traditionalChinese: string;
  simplifiedChinese: string;
  spanish: string;
  korean: string;
  french: string;
  italian: string;
  german: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "en", labelKey: "english", flag: "🇺🇸" },
  { value: "ja", labelKey: "japanese", flag: "🇯🇵" },
];
