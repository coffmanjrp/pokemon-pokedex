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

**Frontend**: Next.js 15 App Router, TypeScript, Redux Toolkit, Supabase Client  
**Backend**: Apollo Server (Express), Railway deployment, PokeAPI integration  
**Database**: Supabase (PostgreSQL) - Migration in progress  
**Caching**: localStorage (24hr TTL) + CDN headers  
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
npm run sync:forms            # Sync special forms to pokemon_forms table
npm run sync:all              # Full sync (2-3 hours)
npm run sync:evolution:enriched  # Sync evolution chains with full Pokemon data
npm run sync:update-evolution-ids  # Update evolution_chain_id for existing Pokemon
npm run sync:find-missing-evolution  # Find Pokemon missing evolution data
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
    │   ├── sync/               # Supabase data sync utilities
    │   │   ├── pokemonDataMapper.ts    # Maps PokeAPI data to Supabase schema
    │   │   ├── pokemonSyncService.ts   # Handles data synchronization
    │   │   ├── supabaseClient.ts       # Supabase client configuration
    │   │   └── syncRunner.ts           # CLI sync commands
    │   └── data/
    │       └── pokemonFormIds.ts       # Form Pokemon IDs (10000+ range)
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

**Generation Navigation**: Use URL parameter as source of truth, sync with Redux state  
**Language URLs**: Use `/${language}/` not `/` in navigation  
**Mobile UI**: 44px touch targets, hamburger overlay  
**Cache**: localStorage first, 24hr TTL, UTF-8 encoding  
**Hydration**: Props-based dictionary, not Redux selectors  
**Scroll Position**: Restored when returning from detail page, reset on generation change  
**Moves Data**: Loaded from Supabase, displayed in tabs on detail pages  
**Game History Tab**: Currently unavailable (gameIndices not yet synced to Supabase)  
**Redux Errors**: Wrap all useEffects with try-catch, avoid dispatching undefined actions  
**TypeScript Strict**: Use conditional assignment for optional properties with exactOptionalPropertyTypes  

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
  - Special forms (141) synced to pokemon_forms table (including 33 Gigantamax forms)
  - All 541 evolution chains synced with enriched data (Gen 1-9 complete)
- ✅ Phase 3: Client integration completed
  - Supabase client SDK configured
  - Data fetch functions implemented
  - Custom hooks created (usePokemonListSupabase, usePokemonDetailSupabase)
  - Evolution chain support with Supabase data
  - Feature flags for gradual migration
  - Unified hooks for backward compatibility
  - getPokemonForms fetches from pokemon_forms table with base Pokemon relationships
- ✅ Phase 4: Testing & optimization completed
  - All evolution chains synced for all generations
  - Moves data correctly displayed on detail pages
  - GraphQL dependencies removed from static generation
  - Performance optimized with Supabase direct queries
  - Generation 0 forms working with pokemon_forms table

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
  - `NEXT_PUBLIC_USE_SUPABASE_FOR_SSG=true`

### Current Implementation
- **Data Source**: Supabase (feature flag enabled)
- **Hooks**: Unified hooks (`usePokemonListUnified`, `usePokemonDetailUnified`)
- **Backward Compatibility**: GraphQL removed, full Supabase migration
- **Performance**: Direct database queries, no GraphQL overhead

### Evolution Chain Implementation Notes
- Evolution chains stored with enriched data structure matching GraphQL
- Supports all evolution conditions (level, item, trade, happiness, etc.)
- Multi-language support for evolution messages
- Proper snake_case to camelCase transformation for TypeScript compatibility
- All 541 evolution chains synced (Gen 1-9)
- Fixed property naming issue in pokemonSyncService.ts (evolution_chain vs evolutionChain)
- All Pokemon now have correct evolution_chain URLs in species_data
- **NEW**: Direct `evolution_chain_id` column added to `pokemon` table for performance
  - Eliminates need to parse JSON for evolution chain lookups
  - Sync process automatically extracts and saves evolution chain ID
  - Client code uses direct ID first, falls back to URL parsing for compatibility
  - Migration script available: `npm run sync:update-evolution-ids`
  - Foreign key constraint links to `evolution_chains.id` for data integrity
  - Optimized queries can now use Supabase joins for single-query fetches
  - See `evolutionOptimized.ts` for advanced query examples
  - **Performance**: Single query instead of 2 separate queries
  - **Coverage**: 729/1168 Pokemon (62.4%) have evolution_chain_id
  - **Missing Data**: 439 Pokemon need sync (mainly Gen 3, 7, 9)

### Recent Updates
1. ✅ Fixed moves data display issue - now correctly loading from Supabase
2. ✅ Removed GraphQL dependencies from generateStaticParams
3. ✅ Added development-only logging for evolution chains
4. ✅ Completed full Supabase migration
5. ✅ Fixed Generation 0 forms display issue with pokemon_forms table
6. ✅ Fixed generation persistence issue after page reload
7. ✅ Resolved Redux "Actions must be plain objects" errors
8. ✅ Fixed TypeScript strict mode errors with exactOptionalPropertyTypes
9. ✅ Corrected pokemon_id mappings in pokemon_forms table (52 fixes)
10. ✅ Fixed import path for useSupabasePokemonEvolution hook
11. ✅ Implemented SSG with Supabase - build time reduced from 13min to 3m 45s (71% reduction!)
12. ✅ Completely removed Apollo Client and GraphQL dependencies
13. ✅ Renamed hooks from usePokemonListSupabase → usePokemonList for simplicity
14. ✅ Added Gigantamax Pokemon support - 33 forms added to Generation 0
15. ✅ Synced all Gigantamax forms to pokemon_forms table with proper mappings
16. ✅ Fixed Generation 0 display - all 141 forms including Gigantamax now visible
17. ✅ Fixed pokemon_forms table incorrect mappings - corrected basePokemonId in completeFormMappings.ts
18. ✅ Fixed additional 38 incorrect form mappings identified in Generation 0 - all forms now display correct Pokemon data
19. ✅ Added evolution_chain_id column for direct evolution chain lookups
20. ✅ Updated sync process to save evolution_chain_id directly
21. ✅ Created updateEvolutionChainIds.ts script for migrating existing data
22. ✅ Added foreign key constraint between pokemon.evolution_chain_id and evolution_chains.id
23. ✅ Created evolutionOptimized.ts with examples of optimized queries using joins
24. ✅ Implemented optimized evolution chain queries using Supabase JOINs
25. ✅ Updated usePokemonEvolution hook to use optimized queries
26. ✅ Identified 439 Pokemon missing evolution chains (Gen 3, 7, 9 need sync)

### Next Steps & TODOs

#### 🔴 High Priority

1. **Sync Missing Evolution Chains**
   - [ ] Sync 439 Pokemon missing evolution_chain_id
   - [ ] Focus on Generation 3 (126 Pokemon), Generation 7 (48 Pokemon), Generation 9 (105 Pokemon)
   - [ ] Run `npm run sync:gen 3`, `npm run sync:gen 7`, `npm run sync:gen 9`
   - [ ] Verify all Pokemon have evolution chains displayed

#### 🟡 Medium Priority

1. **Performance Optimization**
   - [ ] Implement pagination for large moves datasets
   - [ ] Add React Suspense for progressive loading
   - [ ] Improve virtual scrolling performance
   - [ ] Optimize Supabase caching strategy

2. **Error Handling Improvements**
   - [ ] Proper Supabase connection error handling
   - [ ] Implement automatic retry mechanism
   - [ ] User-friendly error messages

3. **Search Enhancement**
   - [ ] Leverage Supabase full-text search
   - [ ] Optimize Japanese language search
   - [ ] Improve type-based filtering performance

#### 🟢 Low Priority

1. **gameIndices Implementation**
   - [ ] Add game_indices field to database schema
   - [ ] Update sync service to include gameIndices data
   - [ ] Enable Game History tab on Pokemon detail pages

2. **Additional Data Implementation**
   - [ ] Add held items information
   - [ ] Add encounter locations data
   - [ ] Expand evolution condition details

3. **UI/UX Improvements**
   - [ ] Improve loading states
   - [ ] Optimize animations
   - [ ] Enhance mobile UI

### Completed High Priority Tasks Summary

1. ✅ **SSG Implementation** - 71% build time reduction (13min → 3m 45s)
2. ✅ **Apollo Client Removal** - ~100KB bundle size reduction, simplified dependencies
3. ✅ **Gigantamax Pokemon Support** - All 33 forms added and synced to database
4. ✅ **Environment Variable Cleanup** - Removed all GraphQL-related variables
5. ✅ **Server Test Script Cleanup** - Removed 26 unnecessary test files

All high priority optimization tasks have been successfully completed!