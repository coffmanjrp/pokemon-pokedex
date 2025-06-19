# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pokemon Pokedex application built with Next.js 15 (App Router), React 19, TypeScript, and TailwindCSS. Features a Ruby/Sapphire-inspired game design with modern responsive layout and comprehensive multilingual support.

**Current Status**: Feature-complete Pokemon Pokedex with comprehensive detail pages, SSG implementation, advanced search/filter functionality, complete App Router i18n multilingual support, and production-ready build. Successfully migrated from Pages Router i18n to modern Next.js 15 middleware-based approach. Main areas for future enhancement: testing coverage, environment configuration, and error boundaries.

## Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router and React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS with Ruby/Sapphire game-inspired design
- **State Management**: Redux Toolkit
- **GraphQL Client**: Apollo Client
- **Internationalization**: Native App Router i18n with middleware-based language detection and server-side dictionary loading

### Backend (GraphQL Server)
- **Server**: Apollo Server with Express
- **Language**: TypeScript
- **Data Source**: PokeAPI (https://pokeapi.co/api/v2/)

## Development Commands

```bash
# Frontend development
npm run dev              # Start Next.js development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript type checking

# Backend development (FULLY IMPLEMENTED)
cd server && npm run dev      # Start GraphQL server in development
cd server && npm run build    # Build GraphQL server  
cd server && npm run start    # Start production GraphQL server
```

## Project Structure

```
pokemon-pokedex/
├── client/                          # Frontend Next.js application
│   ├── app/                        # App Router with i18n structure
│   │   ├── [lang]/                # Language-based routing
│   │   │   ├── page.tsx           # Main Pokemon grid page (client wrapper)
│   │   │   ├── client.tsx         # Client-side Pokemon list logic
│   │   │   ├── layout.tsx         # Language-aware layout
│   │   │   └── pokemon/[id]/      # Pokemon detail pages
│   │   │       ├── page.tsx       # Server component with metadata
│   │   │       ├── client.tsx     # Client-side detail logic
│   │   │       └── not-found.tsx  # 404 page for missing Pokemon
│   │   └── layout.tsx             # Root layout with providers
│   ├── middleware.ts               # Language detection and routing
│   ├── components/                # React components (fully multilingual)
│   │   ├── layout/                # Header, Footer, navigation components
│   │   ├── pokemon/              # Pokemon-specific components
│   │   └── ui/                   # Reusable UI components with i18n
│   ├── lib/                      # Utility functions and configurations
│   │   ├── dictionaries/         # Translation files
│   │   │   ├── en.json           # English translations
│   │   │   └── ja.json           # Japanese translations
│   │   ├── dictionaries.ts       # Type definitions and utilities
│   │   ├── get-dictionary.ts     # Server-only dictionary loader
│   │   └── pokemonUtils.ts       # Pokemon data translation utilities
│   ├── hooks/                    # Custom React hooks
│   ├── store/                    # Redux Toolkit configuration
│   └── types/                    # TypeScript type definitions
└── server/                       # GraphQL server (FULLY IMPLEMENTED - Apollo Server + Express)
    ├── src/
    │   ├── index.ts            # Server entry point with CORS and health check
    │   ├── schema/             # Complete GraphQL schema definitions
    │   ├── resolvers/          # Working resolvers with error handling
    │   ├── services/           # Pokemon service with PokeAPI integration
    │   └── types/              # TypeScript type definitions
    ├── dist/                   # Compiled server code
    └── .env.example           # Environment configuration template
```

## Key Features

### Implemented Features
- **Pokemon Display**: Card-based layout with official artwork and sprites
- **Type System**: Official Pokemon type colors and badges
- **Advanced Search & Filtering**: 
  - Search by Pokemon name and ID with real-time results
  - Type-based filtering with visual type badges
  - Generation-based filtering (1-9) with region names (Kanto, Johto, etc.)
  - Auto-loading mechanism for generation filters to ensure complete results
- **Infinite Scroll**: Intersection Observer with debouncing and smart loading
- **State Management**: Redux Toolkit with client-side filtering and deduplication
- **Native App Router i18n**: Complete English/Japanese support with middleware-based routing
  - Language detection from browser headers with automatic redirection
  - Server-side dictionary loading for optimal performance
  - Complete filter system multilingual support (FilterModal, TypeFilter, GenerationFilter)
  - Pokemon data translations (names, types, abilities, moves, game versions)
  - URL-based language switching (/en/, /ja/) with proper SEO
- **Responsive Design**: Desktop-first with mobile and tablet optimizations

### Search & Filter Implementation
- **Client-Side Filtering**: All filtering happens after data is loaded for instant results
- **Auto-Loading for Generations**: When generation filter is applied, automatically loads sufficient Pokemon to display all Pokemon from that generation
- **Filter Summary**: Shows active filters and result counts
- **Empty States**: Helpful messages when no results found

### Design System
- Ruby/Sapphire game-inspired UI components
- Official Pokemon type colors
- Responsive design (Desktop → Mobile → Tablet)
- Loading and error state designs
- Modern card-based layout

## Development Workflow

1. Always work on feature branches
2. Use conventional commit messages
3. Run type checking before commits
4. Test responsive design on multiple screen sizes
5. Verify Pokemon data accuracy with official sources

## Technical Implementation

### State Management Architecture
- **Redux Toolkit**: Centralized state management with two main slices
  - `pokemonSlice`: Pokemon data, filters, and loading states
  - `uiSlice`: UI state including language, modals, and user preferences
- **Apollo Client**: GraphQL client integration with Redux
- **Client-Side Filtering**: All filtering happens on cached data for instant results

### Search & Filter System
- **Search Types**: Name, ID, and exact match capabilities
- **Type Filtering**: Visual type badges with official Pokemon type colors
- **Generation Filtering**: 
  - Generations 1-9 with region names (Kanto, Johto, Hoenn, etc.)
  - Auto-loading mechanism: automatically loads sufficient Pokemon to display all from selected generation
  - Progress indicators during auto-loading
- **Filter State**: Maintains active filters and result counts

### Data Loading Strategy
- **Infinite Scroll**: Intersection Observer API with debouncing
- **Duplicate Prevention**: Client-side deduplication in both Redux slice and hooks
- **Smart Loading**: Auto-loading for generation filters ensures complete datasets
- **Loading States**: Differentiated between regular loading and auto-loading states

### Generation Ranges
```typescript
const GENERATION_RANGES = {
  1: { start: 1, end: 151, region: 'Kanto' },
  2: { start: 152, end: 251, region: 'Johto' },
  3: { start: 252, end: 386, region: 'Hoenn' },
  4: { start: 387, end: 493, region: 'Sinnoh' },
  5: { start: 494, end: 649, region: 'Unova' },
  6: { start: 650, end: 721, region: 'Kalos' },
  7: { start: 722, end: 809, region: 'Alola' },
  8: { start: 810, end: 905, region: 'Galar' },
  9: { start: 906, end: 1025, region: 'Paldea' }
};
```

### App Router i18n Architecture

The application implements native Next.js 15 App Router i18n with comprehensive bilingual support (English/Japanese):

#### Core i18n Components

**1. Middleware-Based Language Detection**
```typescript
// middleware.ts - Automatic language detection and routing
export function middleware(request: NextRequest) {
  // Detects language from Accept-Language header
  // Redirects to appropriate /en/ or /ja/ route
}
```

**2. Server-Side Dictionary Loading**
```typescript
// lib/get-dictionary.ts - Type-safe server-only translations
export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale]?.() ?? dictionaries.en()
}
```

**3. Language-Based Routing Structure**
```
app/[lang]/              # Dynamic language routing
├── page.tsx            # Server component with dictionary loading
├── layout.tsx          # Language-aware layout
└── pokemon/[id]/       # Nested dynamic routes
```

#### Translation Architecture

**UI Text Translation**
- Server-side dictionary loading with `getDictionary(locale)`
- Type-safe `Dictionary` interface for all UI elements
- JSON translation files in `lib/dictionaries/en.json` and `ja.json`
- Filter system completely multilingual (FilterModal, TypeFilter, GenerationFilter)

**Pokemon Data Translation**
- Direct PokeAPI integration for authentic Japanese Pokemon content
- Centralized utility functions in `pokemonUtils.ts`
- Support for names, types, abilities, moves, and game versions

#### Filter System i18n Support
- **FilterButton**: "Filter" / "フィルター" with active count badge
- **FilterModal**: Complete UI translations (titles, buttons, labels)
- **TypeFilter**: All 18 Pokemon types with Japanese names
- **GenerationFilter**: Generation names (第1世代) and regions (カントー地方)

#### Implementation Files
- `/client/middleware.ts`: Language detection and automatic routing
- `/client/lib/dictionaries.ts`: Type definitions and utility functions
- `/client/lib/get-dictionary.ts`: Server-only dictionary loader with caching
- `/client/lib/dictionaries/`: Translation files for UI text
- `/client/lib/pokemonUtils.ts`: Pokemon data translation utilities
- `/client/app/[lang]/`: Language-based page structure

#### Translation Coverage
- ✅ Pokemon names (via PokeAPI species data)
- ✅ All Pokemon types with official translations
- ✅ 50+ Pokemon abilities
- ✅ All Pokemon game versions
- ✅ Move names with formatting
- ✅ Generation names and regions
- ✅ Complete UI text (search, filters, navigation, etc.)
- ✅ Height/Weight units and labels
- ✅ Stats and technical information
- ✅ Navigation consistency (back buttons, error pages, detail page links)

## Common Issues & Solutions

### Filter State Access
- When accessing filter state in components, ensure you import filters from Redux state:
  ```typescript
  const { filters } = useAppSelector((state) => state.pokemon);
  ```
- The `filters` object contains: `search`, `types`, and `generation` properties

### Runtime Errors
- "filters is not defined": Add filters selector to component (see above)
- Loading state conflicts: Check that auto-loading and regular loading states are properly differentiated

### Language Navigation Issues
- **Problem**: Navigation links not preserving language context (e.g., detail page back button going to `/en/` instead of `/ja/`)
- **Solution**: Use `href="{/${language}/}"` instead of `href="/"` in all navigation components
- **Implementation**: Extract current language using `usePathname()` and `getLocaleFromPathname()` for client components

## Current Development Priorities

### High Priority (Immediate)
1. **Pokemon Detail Pages**: Individual Pokemon display with routing (TODO comment exists in page.tsx:23)
2. **Test Suite Implementation**: Unit tests, integration tests, E2E tests (currently no tests exist)
3. **Environment Configuration**: Create actual .env files from .env.example templates
4. **Error Boundaries**: React error boundaries for graceful error handling

### Medium Priority (Next Phase)
5. **Dark Theme Completion**: Apply dark mode styles (infrastructure already exists)
6. **Accessibility Features**: ARIA labels, keyboard navigation, screen reader support
7. **SEO Optimization**: Metadata, Open Graph tags, structured data
8. **Server Caching**: Redis or in-memory caching for PokeAPI requests

### Low Priority (Future)
9. **PWA Implementation**: Service worker, offline support, app manifest
10. **Performance Analysis**: Bundle optimization and monitoring

## Implementation Status

### ✅ Fully Implemented
- **GraphQL Backend**: Complete Apollo Server with cursor-based pagination and extended schema
- **Pokemon Detail Pages**: SSG implementation with comprehensive data display and componentized architecture
- **Advanced Filtering**: Search, type filters, generation filters with auto-loading
- **State Management**: Redux Toolkit with proper error handling and deduplication
- **Responsive UI**: Complete component library with Ruby/Sapphire theming
- **Infinite Scroll**: Optimized with Intersection Observer and debouncing
- **Native App Router i18n**: Complete English/Japanese implementation with:
  - Middleware-based language detection and automatic routing (/en/, /ja/)
  - Server-side dictionary loading for optimal performance (no client bundles)
  - Complete filter system multilingual support (FilterModal, TypeFilter, GenerationFilter)
  - PokeAPI-integrated Japanese Pokemon names, types, abilities, and moves
  - 308 static pages generated (151 Pokemon × 2 languages)
  - SEO-optimized with proper hreflang and language-specific metadata
  - Language-consistent navigation preserves user's language choice across all pages
- **Image Optimization**: Next.js Image with fallbacks, lazy loading, and size variants
- **Rich Data Display**: Moves, Pokedex entries, game history, and comprehensive stats
- **SEO Optimization**: Meta tags, Open Graph, Twitter Cards for all Pokemon pages
- **Component Architecture**: Modular, maintainable components with clear separation of concerns

### ⚠️ Partially Implemented
- **Theme System**: Dark mode infrastructure exists but styles not applied
- **Error Handling**: Basic error states exist but no error boundaries
- **Performance**: Good optimization but no bundle analysis or monitoring

### ❌ Missing
- **Testing**: No test suite exists (Jest, React Testing Library, Cypress needed)
- **Production Config**: Environment files need to be created from examples
- **Error Boundaries**: React error boundaries for graceful error handling

## External APIs

- **PokeAPI**: Primary data source for Pokemon information (v2 API)
- **GraphQL Server**: Custom Apollo Server wrapper with efficient data fetching
- **Cursor-Based Pagination**: Implemented for optimal performance
- **Auto-Loading Logic**: Ensures complete generation datasets when filters are applied

## Recent Major Updates

### App Router i18n Migration (December 2024)
- **Migration from Pages Router**: Complete transition from next-i18next to native Next.js 15 App Router i18n
- **Architecture Overhaul**: New `[lang]` directory structure with middleware-based language detection
- **Performance Improvements**: 
  - Removed 384 i18n dependencies (next-i18next, react-i18next, i18next)
  - Server-side dictionary loading eliminates client-side translation bundles
  - 308 static pages generated (151 Pokemon × 2 languages) via SSG
- **Complete Filter System i18n**:
  - FilterButton: "Filter" / "フィルター" with active count badges
  - FilterModal: Full UI translation (titles, buttons, error messages)
  - TypeFilter: All 18 Pokemon types with official Japanese names
  - GenerationFilter: Generation names (第1世代) and regions (カントー地方)
- **Enhanced Language Switching**:
  - URL-based language switching with proper navigation (/en/ ↔ /ja/)
  - Automatic language detection from browser Accept-Language headers
  - Middleware redirects for seamless user experience
- **SEO Optimization**: Language-specific metadata, proper hreflang attributes, and crawlable URLs
- **Language-Aware Navigation**: All navigation links preserve language context (detail pages, error pages, back buttons)

### Pokemon Detail Pages Implementation (December 2024)
- **SSG Implementation**: Static Site Generation for first 151 Pokemon with ISR support
- **Comprehensive Data Display**: 
  - Pokemon descriptions and Pokedex entries in multiple languages
  - Complete move lists with tabbed interface (Level-up, TM/TR, Egg moves, Tutors)
  - Game appearance history grouped by generations and regions
  - Enhanced stats visualization with progress bars and totals
  - High-quality sprite gallery and official artwork display
- **Performance Optimizations**:
  - Next.js Image component with proper sizing and lazy loading
  - Server-side data fetching with Apollo Client SSR support
  - Client-side deduplication and smart caching
- **GraphQL Schema Extensions**:
  - Added moves, species, flavor text entries, and game indices
  - Enhanced PokeAPI integration with species data fetching
  - Comprehensive type definitions for all Pokemon data

### Build Status
- ✅ **Production Build**: Successfully compiles with Next.js 15 App Router
- ✅ **Static Generation**: 308 pages generated (151 Pokemon × 2 languages + base pages)
- ✅ **i18n Implementation**: Native App Router i18n with middleware routing
- ✅ **Type Safety**: Full TypeScript coverage with no build errors
- ✅ **ESLint Compliance**: All linting rules passed
- ✅ **Bundle Optimization**: Server-side translations eliminate client-side i18n bundles
- ✅ **Dependency Reduction**: Removed 384 i18n packages for better performance

### Component Architecture
- **PokemonBasicInfo**: Pokemon hero section with core information (image, name, types, stats, abilities)
- **PokemonDetailHeader**: Navigation header with back button for detail pages
- **PokemonDetailSection**: Reusable section wrapper for consistent styling across detail pages
- **PokemonSpritesGallery**: Complete sprites and artwork display with official artwork and game sprites
- **PokemonDescription**: Multi-language Pokedex entries with expandable sections
- **PokemonMoves**: Advanced move display with filtering and categorization
- **PokemonGameHistory**: Game appearance tracking across all generations
- **PokemonStats**: Enhanced statistics with visual progress indicators
- **PokemonImage**: Optimized image component with size variants and fallbacks