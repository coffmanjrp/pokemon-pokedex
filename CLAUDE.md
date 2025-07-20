# CLAUDE.md

Quick reference guide for Claude Code when working with the Pokemon Pokedex codebase.

## Project Overview

Pokemon Pokedex application built with Next.js 15, React 19, TypeScript, and TailwindCSS. Features include:
- Ruby/Sapphire-inspired design with responsive layout
- 2-language support (English/Japanese) optimized for Vercel
- SSG for Pokemon details, CSR for Pokemon lists
- Hybrid deployment: Vercel (frontend) + Railway (GraphQL backend)
- Virtual scrolling, GSAP animations, comprehensive search
- SEO optimized with structured data and sitemaps

## Architecture Overview

**Frontend**: Next.js 15 App Router, TypeScript, Redux Toolkit, Apollo Client  
**Backend**: Apollo Server (Express), Railway deployment, PokeAPI integration  
**Database**: Supabase (PostgreSQL) - Migration in progress  
**Caching**: localStorage (24hr TTL) + CDN headers + Apollo InMemory  
**Build**: Parallel generation builds (~12min), 2,786 static pages  

### Detailed Architecture
@docs/ARCHITECTURE.md

### Deployment Details
@docs/DEPLOYMENT.md

## Quick Start

```bash
# Development
npm run dev                    # Frontend (port 3000)
cd server && npm run dev       # Backend (port 4000)

# Production Build
npm run build:fast            # Optimized parallel build (~12min)
npm run build                 # Standard build

# Code Quality
npm run type-check            # TypeScript checking
npm run lint                  # ESLint
npm run test                  # Jest tests

# Data Sync (Server)
cd server
npm run sync:test             # Test sync with Pikachu
npm run sync:pokemon [id]     # Sync specific Pokemon
npm run sync:gen [1-9]        # Sync generation
npm run sync:forms            # Sync special forms
npm run sync:all              # Full sync (2-3 hours)
npm run sync:evolution:enriched  # Sync evolution chains with full Pokemon data
```

### Development Guide
@docs/DEVELOPMENT.md


## Project Structure

```
pokemon-pokedex/
├── client/                          # Frontend Next.js application
│   ├── app/                        # App Router with i18n structure
│   │   ├── api/                   # Next.js API Routes for REST endpoints
│   │   ├── [lang]/                # Language-based routing
│   │   └── layout.tsx             # Root layout with providers
│   ├── components/                # React components (fully multilingual)
│   │   ├── layout/                # Sidebar, navigation, search components
│   │   └── ui/                   # Organized UI components
│   │       ├── animation/         # Animation components
│   │       ├── common/           # Common UI components
│   │       └── pokemon/          # Pokemon-specific UI components
│   │           ├── list/         # Pokemon list page components
│   │           ├── detail/       # Pokemon detail page components
│   │           ├── sprites/      # Sprite gallery components
│   │           └── evolution/    # Evolution chain components
│   ├── lib/                      # Utility functions and configurations
│   │   ├── data/                 # Centralized data files
│   │   ├── dictionaries/         # Translation files (5 active + 4 preserved)
│   │   ├── utils/                # Utility functions
│   │   ├── supabase/             # Supabase data access layer
│   │   │   ├── pokemon.ts        # Pokemon data queries
│   │   │   └── evolution.ts      # Evolution chain queries
│   │   ├── pokemonCache.ts       # Pokemon cache system
│   │   ├── supabase.ts           # Supabase client configuration
│   │   └── featureFlags.ts       # Feature flag configuration
│   ├── hooks/                    # Custom React hooks
│   │   ├── usePokemonListSupabase.ts      # Supabase list hook
│   │   ├── usePokemonDetailSupabase.ts    # Supabase detail hook
│   │   ├── usePokemonListUnified.ts       # Unified list hook
│   │   └── usePokemonDetailUnified.ts     # Unified detail hook
│   ├── store/                    # Redux Toolkit configuration
│   └── types/                    # TypeScript type definitions
│       └── supabase.ts           # Supabase database types
└── server/                       # GraphQL server
    ├── src/
    │   ├── index.ts            # Server entry point
    │   ├── schema/             # GraphQL schema definitions
    │   ├── resolvers/          # GraphQL resolvers
    │   ├── services/           # Pokemon service with PokeAPI integration
    │   └── sync/               # Supabase data sync utilities
    │       ├── pokemonDataMapper.ts    # Maps PokeAPI data to Supabase schema
    │       ├── pokemonSyncService.ts   # Handles data synchronization
    │       ├── supabaseClient.ts       # Supabase client configuration
    │       └── syncRunner.ts           # CLI sync commands
    └── dist/                   # Compiled server code
```

## Key Features

- **Pokemon Display**: SSG detail pages, CSR list pages with virtual scrolling
- **Navigation**: 9 generations + forms, seamless switching with cache, scroll position restoration
- **Search**: Multi-language with Japanese support, type filtering
- **Animations**: 26 GSAP effects with classification-based triggers
- **Performance**: localStorage + CDN caching, parallel builds, optimized images
- **SEO**: Structured data, sitemaps, Open Graph, multi-language support
- **Error Handling**: Custom error classes with recovery strategies

### Feature Details
@docs/FEATURES.md



## Common Issues & Solutions

**Generation Navigation**: Use Redux state `state.pokemon.currentGeneration`  
**Language URLs**: Use `/${language}/` not `/` in navigation  
**Mobile UI**: 44px touch targets, hamburger overlay  
**Cache**: localStorage first, 24hr TTL, UTF-8 encoding  
**Hydration**: Props-based dictionary, not Redux selectors  
**Scroll Position**: Restored when returning from detail page, reset on generation change  
**Moves Data**: Loaded from Supabase, displayed in tabs on detail pages  
**Game History Tab**: Currently unavailable (gameIndices not yet synced to Supabase)

For more solutions, see documentation in `/docs`

## Current Focus

**Supabase Migration** (High Priority) - Database migration plan to resolve Railway instability and improve performance.

### Migration Status
- ✅ Phase 1: Supabase setup completed
  - Database schema created
  - RLS policies configured
  - Connection tested successfully
- ✅ Phase 2: Data migration completed
  - Sync service implementation complete
  - CLI commands for data sync available
  - All 1025 Pokemon synced to Supabase
  - Special forms synced
  - All 541 evolution chains synced with enriched data (Gen 1-9 complete)
- ✅ Phase 3: Client integration completed
  - Supabase client SDK configured
  - Data fetch functions implemented
  - Custom hooks created (usePokemonListSupabase, usePokemonDetailSupabase)
  - Evolution chain support with Supabase data
  - Feature flags for gradual migration
  - Unified hooks for backward compatibility
- ✅ Phase 4: Testing & optimization completed
  - All evolution chains synced for all generations
  - Moves data correctly displayed on detail pages
  - GraphQL dependencies removed from static generation
  - Performance optimized with Supabase direct queries

### Migration Plan
@docs/MIGRATION.md

### Supabase Setup
@docs/SUPABASE_SETUP.md

### Data Sync Documentation
@docs/DATA_SYNC.md

### Environment Variables
- Added Supabase configuration to `.env.local` and `.env.production`
- Service role key configured for server-side operations
- All platforms (Vercel, Railway) configured with Supabase credentials
- Feature flags configured:
  - `NEXT_PUBLIC_USE_SUPABASE_FOR_LIST=true`
  - `NEXT_PUBLIC_USE_SUPABASE_FOR_DETAIL=true`
  - `NEXT_PUBLIC_USE_SUPABASE_FOR_SSG=false`

### Current Implementation
- **Data Source**: Supabase (feature flag enabled)
- **Hooks**: Unified hooks (`usePokemonListUnified`, `usePokemonDetailUnified`)
- **Backward Compatibility**: Full GraphQL support maintained
- **Performance**: Direct database queries, no GraphQL overhead

### Evolution Chain Implementation Notes
- Evolution chains stored with enriched data structure matching GraphQL
- Supports all evolution conditions (level, item, trade, happiness, etc.)
- Multi-language support for evolution messages
- Proper snake_case to camelCase transformation for TypeScript compatibility
- All 541 evolution chains synced (Gen 1-9)
- Fixed property naming issue in pokemonSyncService.ts (evolution_chain vs evolutionChain)
- All Pokemon now have correct evolution_chain URLs in species_data

### Recent Updates
1. ✅ Fixed moves data display issue - now correctly loading from Supabase
2. ✅ Removed GraphQL dependencies from generateStaticParams
3. ✅ Added development-only logging for evolution chains
4. ✅ Completed full Supabase migration

### Next Steps
1. Monitor performance in production
2. Consider removing Apollo Client dependencies completely
3. Implement SSG with Supabase (currently using CSR)
4. Optimize moves data loading for large datasets

### Future TODOs (Low Priority)
1. Implement gameIndices sync to Supabase
   - Add game_indices field to database schema
   - Update sync service to include gameIndices data
   - Enable Game History tab on Pokemon detail pages
2. Add more detailed Pokemon data (held items, encounter locations, etc.)