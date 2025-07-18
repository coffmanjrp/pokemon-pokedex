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
│   │   └── pokemonCache.ts       # Pokemon cache system
│   ├── hooks/                    # Custom React hooks
│   ├── store/                    # Redux Toolkit configuration
│   └── types/                    # TypeScript type definitions
└── server/                       # GraphQL server
    ├── src/
    │   ├── index.ts            # Server entry point
    │   ├── schema/             # GraphQL schema definitions
    │   ├── resolvers/          # GraphQL resolvers
    │   └── services/           # Pokemon service with PokeAPI integration
    └── dist/                   # Compiled server code
```

## Key Features

- **Pokemon Display**: SSG detail pages, CSR list pages with virtual scrolling
- **Navigation**: 9 generations + forms, seamless switching with cache
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

For more solutions, see documentation in `/docs`

## Current Focus

**Supabase Migration** (High Priority) - Database migration plan to resolve Railway instability and improve performance.

### Migration Status
- ✅ Phase 1: Supabase setup completed
  - Database schema created
  - RLS policies configured
  - Connection tested successfully
- 🚧 Phase 2: Data migration scripts (In Progress)
- ⏳ Phase 3: Client integration
- ⏳ Phase 4: Testing & optimization

### Migration Plan
@docs/MIGRATION.md

### Supabase Setup
@docs/SUPABASE_SETUP.md

### Environment Variables
- Added Supabase configuration to `.env.local` and `.env.production`
- Service role key configured for server-side operations
- All platforms (Vercel, Railway) configured with Supabase credentials