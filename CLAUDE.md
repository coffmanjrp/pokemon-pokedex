# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pokemon Pokedex application built with Next.js 15 (App Router), React 19, TypeScript, and TailwindCSS. Features a Ruby/Sapphire-inspired game design with modern responsive layout and comprehensive multilingual support.

**Current Status**: Production-ready Pokemon Pokedex with comprehensive detail pages, enhanced evolution chains, complete SSG implementation for all 1302+ Pokemon (including Mega, Gigantamax, and regional forms), performance optimizations, and sidebar-based generation navigation. All 2613 static pages generated successfully with zero build errors. Major codebase cleanup completed with optimized component architecture and TypeScript compliance. **Mobile and tablet experience fully optimized** with responsive design, touch-friendly navigation, and enhanced UX across all screen sizes.

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
- **Caching**: Redis-based intelligent caching system with selective data retention
- **Architecture**: Layered caching strategy (PokeAPI → Redis Cache → GraphQL Server → Apollo Client → React Components)
- **Data Loading**: Selective query optimization - SSG builds use full data, runtime browsing uses lightweight queries

### Data Loading Strategy
- **SSG Build Mode**: Complete Pokemon data for static generation of all 1302+ Pokemon
- **Runtime Mode**: Lightweight queries with progressive enhancement
- **Smart Caching**: Multi-level caching strategy for optimal performance
- **Valid ID Detection**: GraphQL-based validation to generate only existing Pokemon pages

### Performance Optimizations
- **Image Optimization**: AVIF/WebP formats, 1-year caching, dynamic quality settings
- **Bundle Optimization**: Tree shaking, package optimization, code splitting
- **Cache Strategy**: Long-term static asset caching, intelligent API response caching
- **Build Performance**: Bundle analyzer integration, optimized webpack configuration

## Development Commands

```bash
# Frontend development
npm run dev              # Start Next.js development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript type checking

# Backend development
cd server && npm run dev      # Start GraphQL server in development
cd server && npm run build    # Build GraphQL server  
cd server && npm run start    # Start production GraphQL server

# Performance analysis
ANALYZE=true npm run build    # Run bundle analyzer
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
│   │   ├── layout/                # Sidebar, navigation components
│   │   ├── pokemon/              # Pokemon-specific components
│   │   └── ui/                   # Organized UI components
│   │       ├── animation/         # Animation components (PageTransition, AnimatedLoadingScreen)
│   │       ├── common/           # Common UI components (Badge, LoadingSpinner, ToastProvider, etc.)
│   │       └── pokemon/          # Pokemon-specific UI components (20+ modular components)
│   ├── lib/                      # Utility functions and configurations
│   │   ├── data/                 # Centralized data files for better organization
│   │   │   ├── formTranslations.ts    # Pokemon form translations and utilities
│   │   │   ├── generations.ts         # Generation data and helper functions
│   │   │   ├── typeTranslations.ts    # Type colors and translations
│   │   │   └── index.ts              # Unified data exports
│   │   ├── dictionaries/         # Translation files
│   │   │   ├── en.json           # English translations
│   │   │   └── ja.json           # Japanese translations
│   │   ├── dictionaries.ts       # Type definitions and utilities
│   │   ├── get-dictionary.ts     # Server-only dictionary loader
│   │   ├── pokemonUtils.ts       # Pokemon data translation utilities (refactored)
│   │   ├── formUtils.ts          # Pokemon form variation utilities
│   │   └── querySelector.ts      # GraphQL query selection based on build mode
│   ├── hooks/                    # Optimized React hooks (cleaned up from 12 to 2 active hooks)
│   │   ├── usePokemonList.ts     # Pokemon list management with selective loading
│   │   └── useBackgroundPreload.ts # Background data preloading optimization
│   ├── store/                    # Redux Toolkit configuration
│   └── types/                    # TypeScript type definitions
└── server/                       # GraphQL server (FULLY IMPLEMENTED - Apollo Server + Express)
    ├── src/
    │   ├── index.ts            # Server entry point with CORS and health check
    │   ├── schema/             # Complete GraphQL schema definitions (with selective loading types)
    │   ├── resolvers/          # Working resolvers with selective data loading support
    │   ├── services/           # Pokemon service with PokeAPI integration and cache optimization
    │   └── types/              # TypeScript type definitions
    ├── dist/                   # Compiled server code
    └── .env.example           # Environment configuration template
```

## Key Features

- **Pokemon Display**: Card-based layout with official artwork and sprites
- **Generation Navigation**: Sidebar with generation buttons (1-9) and progressive loading
- **Multilingual Support**: Complete English/Japanese localization with middleware-based routing
- **Responsive Design**: Mobile-first with tablet and desktop optimizations
- **Mobile/Tablet Experience**: Hamburger menu navigation, touch-optimized UI, responsive grid layouts
- **Performance**: Virtual scrolling, smart caching, image optimization, iOS Safari scroll optimization
- **Detail Pages**: Comprehensive Pokemon information with evolution chains and form variants
- **Type System**: Official Pokemon type colors and effectiveness calculations

## Development Workflow

1. Always work on feature branches
2. Use conventional commit messages
3. Run type checking before commits
4. Test responsive design on multiple screen sizes
5. Verify Pokemon data accuracy with official sources

## Technical Implementation

### State Management
- **Redux Toolkit**: Pokemon data and UI state management
- **Apollo Client**: GraphQL client with intelligent caching
- **Generation-Based Loading**: Progressive batch loading system

### Navigation System
- **Sidebar Navigation**: Fixed sidebar with generation buttons (1-9), hamburger menu for mobile
- **Generation Ranges**: Kanto (1-151), Johto (152-251), Hoenn (252-386), etc.
- **Progressive Loading**: Initial 20 Pokemon load immediately, background loading for remainder
- **Mobile Navigation**: Touch-optimized hamburger menu with overlay and logo positioning

### Static Site Generation
- **Complete Coverage**: All 1302+ Pokemon with forms/variants included
- **Smart ID Validation**: GraphQL-based detection of valid Pokemon IDs
- **Zero Build Errors**: Intelligent skipping of non-existent Pokemon
- **Performance**: 2613 static pages generated in ~5 seconds

### Internationalization
- **Languages**: English/Japanese support with middleware-based routing
- **Structure**: `/[lang]/` routes with server-side dictionary loading
- **Translation**: Pokemon names, types, abilities, moves via PokeAPI integration

## Common Issues & Solutions

### Generation Navigation State
- Use Redux state for current generation: `useAppSelector((state) => state.pokemon.currentGeneration)`
- Sidebar handles generation switching and updates Redux state

### Language Navigation
- Use `href="{/${language}/}"` instead of `href="/"` in navigation components
- Extract current language using `usePathname()` and `getLocaleFromPathname()`

### Mobile/Tablet UI
- Touch targets are minimum 44px for accessibility compliance
- Hamburger menu with `bg-black/30` overlay for optimal visibility
- Tab count indicators hidden on mobile with `hidden sm:inline-flex`
- iOS Safari scroll optimization with `WebkitOverflowScrolling: 'touch'`

### Performance Best Practices
- Run `ANALYZE=true npm run build` for bundle analysis before major releases
- Ensure image optimization settings are maintained in next.config.ts
- Monitor Core Web Vitals in production environment
- Use priority loading for first 5 Pokemon cards in initial render

## External APIs

- **PokeAPI**: Primary data source for Pokemon information (v2 API)
- **Redis Cache**: Server-side caching with 5-minute TTL
- **GraphQL Server**: Custom Apollo Server with intelligent caching
- **Apollo Client Cache**: Browser-side caching for efficient data management