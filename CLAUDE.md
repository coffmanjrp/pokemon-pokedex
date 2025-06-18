# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pokemon Pokedex application built with Next.js 15 (App Router), React 19, TypeScript, and TailwindCSS. Features a Ruby/Sapphire-inspired game design with modern responsive layout.

**Current Status**: Highly functional application with comprehensive search/filter functionality, GraphQL backend, and responsive UI. Main areas for improvement: Pokemon detail pages, testing, and production readiness.

## Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router and React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS with Ruby/Sapphire game-inspired design
- **State Management**: Redux Toolkit
- **GraphQL Client**: Apollo Client

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
│   ├── app/                        # App Router pages and layouts
│   │   ├── page.tsx               # Main Pokemon grid page
│   │   └── layout.tsx             # Root layout with providers
│   ├── components/                # React components
│   │   ├── layout/                # Layout components (Header, etc.)
│   │   ├── pokemon/              # Pokemon-specific components
│   │   └── ui/                   # Reusable UI components (PokemonGrid, etc.)
│   ├── hooks/                    # Custom React hooks
│   │   └── usePokemonList.ts     # Pokemon data fetching and filtering
│   ├── store/                    # Redux Toolkit configuration
│   │   ├── slices/              # Redux slices
│   │   │   ├── pokemonSlice.ts  # Pokemon data and filtering state
│   │   │   └── uiSlice.ts       # UI state (language, modals, etc.)
│   │   └── store.ts             # Store configuration
│   ├── types/                    # TypeScript type definitions
│   └── lib/                      # Utility functions and configurations
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
- **Bilingual Support**: English/Japanese UI with proper translations
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
- **GraphQL Backend**: Complete Apollo Server with cursor-based pagination
- **Advanced Filtering**: Search, type filters, generation filters with auto-loading
- **State Management**: Redux Toolkit with proper error handling
- **Responsive UI**: Complete component library with Ruby/Sapphire theming
- **Infinite Scroll**: Optimized with Intersection Observer and debouncing
- **Multi-language Support**: English/Japanese with proper translations
- **Image Optimization**: Next.js Image with fallbacks and lazy loading

### ⚠️ Partially Implemented
- **Theme System**: Dark mode infrastructure exists but styles not applied
- **Error Handling**: Basic error states exist but no error boundaries
- **Performance**: Good optimization but no bundle analysis or monitoring

### ❌ Missing
- **Pokemon Detail Pages**: Navigation exists but pages not implemented
- **Testing**: No test suite exists
- **Production Config**: Environment files need to be created from examples

## External APIs

- **PokeAPI**: Primary data source for Pokemon information (v2 API)
- **GraphQL Server**: Custom Apollo Server wrapper with efficient data fetching
- **Cursor-Based Pagination**: Implemented for optimal performance
- **Auto-Loading Logic**: Ensures complete generation datasets when filters are applied