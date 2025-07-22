# Language Implementation Guide

This guide documents the process of adding new language support to the Pokemon Pokedex application, based on the Chinese language implementation completed on 2025-07-22.

## Overview

The application supports multiple languages through:
1. **UI Translations**: Static text in dictionary JSON files
2. **Pokemon Data**: Dynamic data from Supabase (originally from PokeAPI)
3. **Middleware**: Automatic language detection and routing

## Prerequisites

Before adding a new language:
1. Verify the language is supported by PokeAPI: https://pokeapi.co/api/v2/language/
2. Identify the PokeAPI language code (e.g., "ko" for Korean, "es" for Spanish)
3. Prepare comprehensive UI translations (400+ strings)

## Implementation Steps

### 1. Create Language Dictionary File

Create `client/lib/dictionaries/[lang].json` with all UI translations. Copy an existing dictionary (e.g., `en.json`) as a template:

```bash
cp client/lib/dictionaries/en.json client/lib/dictionaries/[lang].json
```

Key sections to translate:
- `common`: App name, navigation, general UI text
- `pokemonTypes`: All 18 Pokemon type names
- `pokemonDetails`: Detail page labels
- `stats`: Pokemon stat names
- `error`: Error messages
- `emptyStates`: Empty state messages
- `meta`: SEO metadata
- `forms`: Pokemon form names
- `tagline`: Unofficial site notice
- `footer`: Copyright and disclaimer

### 2. Update Type Definitions

Edit `client/lib/dictionaries.ts`:

```typescript
export type Locale = "en" | "ja" | "zh-Hans" | "zh-Hant" | "[new-lang]";
```

### 3. Update Dictionary Loader

Edit `client/lib/get-dictionary.ts`:

```typescript
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  ja: () => import('./dictionaries/ja.json').then((module) => module.default),
  "zh-Hans": () => import('./dictionaries/zh-Hans.json').then((module) => module.default),
  "zh-Hant": () => import('./dictionaries/zh-Hant.json').then((module) => module.default),
  "[new-lang]": () => import('./dictionaries/[new-lang].json').then((module) => module.default),
};
```

### 4. Update Middleware

Edit `client/middleware.ts`:

```typescript
const locales = ["en", "ja", "zh-Hans", "zh-Hant", "[new-lang]"];
```

Optional: Add User-Agent detection for automatic language selection:

```typescript
// In getUserAgentLanguage function
const [newLang]Indicators = [
  "[lang-code]",
  "[country]",
  "[native-name]",
  // Add relevant indicators
];

for (const indicator of [newLang]Indicators) {
  if (userAgentLower.includes(indicator.toLowerCase())) {
    return "[new-lang]";
  }
}
```

### 5. Update Language Options

Edit `client/lib/data/languages.ts`:

```typescript
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "en", labelKey: "english", flag: "🇺🇸" },
  { value: "ja", labelKey: "japanese", flag: "🇯🇵" },
  { value: "zh-Hans", labelKey: "simplifiedChinese", flag: "🇨🇳" },
  { value: "zh-Hant", labelKey: "traditionalChinese", flag: "🇹🇼" },
  { value: "[new-lang]", labelKey: "[languageLabelKey]", flag: "[flag-emoji]" },
];
```

Add the language label key to `LanguageLabels` interface in the same file.

### 6. Update Static Generation

Update all `generateStaticParams` functions to include the new language:

1. `client/app/[lang]/layout.tsx`
2. `client/app/[lang]/pokemon/[id]/page.tsx`

```typescript
export async function generateStaticParams() {
  return [
    { lang: "en" }, 
    { lang: "ja" }, 
    { lang: "zh-Hans" }, 
    { lang: "zh-Hant" },
    { lang: "[new-lang]" }
  ];
}
```

### 7. Update Language Storage

Edit `client/lib/languageStorage.ts` to include the new language in validation:

```typescript
// In getStoredLanguage function
if (stored && (stored === "en" || stored === "ja" || stored === "zh-Hans" || stored === "zh-Hant" || stored === "[new-lang]")) {
  return stored as Locale;
}

// In getLanguageFromCookie function
if (value === "en" || value === "ja" || value === "zh-Hans" || value === "zh-Hant" || value === "[new-lang]") {
  return value as Locale;
}
```

### 8. Update Pokemon Data Functions

The following functions in `client/lib/pokemonUtils.ts` need to be updated to support the new language:

#### getPokemonName
```typescript
const languageCodes = {
  ja: ["ja", "ja-Hrkt"],
  "zh-Hans": ["zh-Hans"],
  "zh-Hant": ["zh-Hant"],
  "[new-lang]": ["[pokeapi-lang-code]"],
};
```

Add condition to check for the new language:
```typescript
if ((language === "ja" || language === "zh-Hans" || language === "zh-Hant" || language === "[new-lang]") && pokemon.species?.names) {
```

#### getPokemonDescription
```typescript
const languageMap: Record<string, string[]> = {
  en: ["en"],
  ja: ["ja", "ja-Hrkt"],
  "zh-Hans": ["zh-Hans"],
  "zh-Hant": ["zh-Hant"],
  "[new-lang]": ["[pokeapi-lang-code]"],
};
```

#### getPokemonGenus
Same pattern as getPokemonDescription.

#### getEvolutionPokemonName
Same pattern as getPokemonName - update both variant and non-variant sections.

#### getMoveFlavorText
Same pattern as getPokemonDescription.

#### getGenusFallback
```typescript
const fallbackTexts: Record<Locale, string> = {
  en: "Pokémon",
  ja: "ポケモン",
  "zh-Hans": "宝可梦",
  "zh-Hant": "寶可夢",
  "[new-lang]": "[localized-pokemon]",
};
```

### 9. Update All Dictionary Files

Add the new language option to the languages section in ALL dictionary files:

```json
"languages": {
  "en": "English",
  "ja": "日本語",
  "simplifiedChinese": "简体中文",
  "traditionalChinese": "繁體中文",
  "[languageLabelKey]": "[Native Language Name]"
}
```

### 10. Type Check and Test

Run type checking to ensure all changes are valid:

```bash
npm run type-check
```

## Testing Checklist

- [ ] Language switcher shows new language option
- [ ] UI text displays correctly in new language
- [ ] Pokemon names load in new language
- [ ] Pokemon descriptions show in new language
- [ ] Pokemon genus (classification) shows in new language
- [ ] Evolution chain names are translated
- [ ] Move tooltips show translated descriptions
- [ ] Type names are translated
- [ ] URLs work correctly (`/[lang]/pokemon/25`)
- [ ] Middleware detects language correctly
- [ ] Build completes successfully

## Data Availability Note

Pokemon data translations depend on what's available in PokeAPI. Not all languages have complete data for:
- Pokemon names (species names)
- Pokemon descriptions (flavor text)
- Pokemon genus (classification)
- Move descriptions

The application will fall back to English when translations are missing.

## Build Impact

Adding languages increases build time and number of static pages:

| Languages | Pages | Build Time |
|-----------|-------|------------|
| 2 (current) | 2,786 | ~3m 45s |
| 3 (+1) | 4,179 | ~5m 30s |
| 4 (+2) | 5,572 | ~7m 15s |

Consider build time impact before adding many languages.

## Common Issues

1. **TypeScript Errors**: Ensure all type definitions are updated
2. **Missing Translations**: Some Pokemon data may not be available in all languages
3. **Build Failures**: Check that all generateStaticParams functions are updated
4. **Middleware Issues**: Verify language detection logic is correct

## Example: Korean Language Addition

Here's a quick example of adding Korean language support:

1. Create `ko.json` dictionary
2. Update `Locale` type: `"en" | "ja" | "zh-Hans" | "zh-Hant" | "ko"`
3. Add to middleware locales: `["en", "ja", "zh-Hans", "zh-Hant", "ko"]`
4. Update all Pokemon data functions with `ko: ["ko"]`
5. Add language option: `{ value: "ko", labelKey: "korean", flag: "🇰🇷" }`
6. Update static generation arrays
7. Run type check and test