# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pokemon Pokedex application built with Next.js 15 (App Router), React 19, TypeScript, and TailwindCSS. Features a Ruby/Sapphire-inspired game design with modern responsive layout and comprehensive multilingual support.

**Current Status**: Production-ready Pokemon Pokedex with comprehensive detail pages, enhanced evolution chains, complete SSG implementation for all 1302+ Pokemon (including Mega, Gigantamax, and regional forms), performance optimizations, and sidebar-based generation navigation. All 2613 static pages generated successfully with zero build errors. Major codebase cleanup completed with optimized component architecture and TypeScript compliance. **Mobile and tablet experience fully optimized** with responsive design, touch-friendly navigation, and enhanced UX across all screen sizes. **Hybrid deployment fully operational** with frontend deployed on Vercel and backend on Railway with CORS wildcard pattern matching for dynamic URLs. **Layout and scrolling optimization completed** with proper sidebar-to-content spacing, overlay positioning, and Pokemon grid scrolling functionality restored.

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
- **Deployment**: Railway with automatic CI/CD and CORS wildcard pattern matching
- **Data Source**: PokeAPI (https://pokeapi.co/api/v2/)
- **Caching**: Redis-based intelligent caching system with selective data retention
- **Architecture**: Layered caching strategy (PokeAPI → Redis Cache → GraphQL Server → Apollo Client → React Components)
- **Data Loading**: Selective query optimization - SSG builds use full data, runtime browsing uses lightweight queries
- **CORS Configuration**: Wildcard pattern support for dynamic Vercel deployment URLs

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
- **Layout Optimization**: Sidebar-to-content spacing optimized, overlay positioning improved
- **Grid Rendering**: Virtual scrolling replaced with optimized standard grid for better reliability and scrolling functionality
- **Component Architecture**: PokemonGrid component refactored from VirtualPokemonGrid with proper container overflow management

## Development Commands

```bash
# Frontend development
npm run dev              # Start Next.js development server
npm run build           # Build for production (includes type checking and linting)
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript type checking

# Testing
npm run test            # Run Jest test suite
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report

# Code quality
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run pre-commit      # Run pre-commit hooks (lint-staged)

# Performance analysis
npm run analyze         # Run bundle analyzer (same as ANALYZE=true npm run build)
npm run analyze:server  # Analyze server bundle
npm run analyze:browser # Analyze browser bundle

# Backend development
cd server && npm run dev      # Start GraphQL server in development
cd server && npm run build    # Build GraphQL server  
cd server && npm run start    # Start production GraphQL server
```

## Development Environment

### Code Quality Pipeline
- **TypeScript**: Strict mode enabled with enhanced type safety
- **Testing**: Jest + React Testing Library with comprehensive mocks
- **Formatting**: Prettier with automated formatting on commit
- **Pre-commit Hooks**: Husky + lint-staged for code quality enforcement
- **CI/CD**: GitHub Actions with multi-node testing and automated checks

### Required Checks Before Committing
1. **Type checking**: `npm run type-check` - Must pass without errors
2. **Linting**: `npm run lint` - Must pass ESLint rules
3. **Testing**: `npm run test` - All tests must pass
4. **Build**: `npm run build` - Must complete successfully

### Automated Quality Checks
- Pre-commit hooks automatically run on staged files:
  - ESLint with auto-fix
  - Prettier formatting
  - TypeScript type checking on changed files
- GitHub Actions CI runs on all PRs:
  - Full test suite on Node.js 18.x and 20.x
  - Type checking and linting
  - Build verification
- Deployment automation:
  - Frontend: Vercel auto-deployment on main branch push
  - Backend: Railway/Render auto-deployment with health checks

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
│   │       └── pokemon/          # Pokemon-specific UI components (PokemonGrid, PokemonCard, etc.)
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
- **Performance**: Optimized grid rendering, smart caching, image optimization, iOS Safari scroll optimization
- **Detail Pages**: Comprehensive Pokemon information with evolution chains and form variants
- **Type System**: Official Pokemon type colors and effectiveness calculations

## Development Workflow

### Branch Management
1. Always work on feature branches
2. Use conventional commit messages
3. Create PRs with descriptive titles and summaries

### Pre-commit Requirements
1. **Run type checking**: `npm run type-check` - Must pass without errors
2. **Run tests**: `npm run test` - All tests must pass
3. **Run linting**: `npm run lint` - Must pass ESLint rules
4. **Build verification**: `npm run build` - Must complete successfully

### Quality Assurance
- Test responsive design on multiple screen sizes
- Verify Pokemon data accuracy with official sources
- Check performance impact with bundle analyzer
- Ensure all automated checks pass in GitHub Actions

### Commit Strategy
- Commit per todo item for better traceability
- Use English for commit messages and PR descriptions
- Include performance and accessibility considerations

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

### Container Overflow Management
- Main content containers use `overflow-auto` for proper scrolling
- Pokemon grid containers avoid `min-h-full` classes that prevent natural height
- Flex layouts with `flex-1` allow proper content distribution and scrolling

### Performance Best Practices
- Run `npm run analyze` for bundle analysis before major releases
- Ensure image optimization settings are maintained in next.config.ts
- Monitor Core Web Vitals in production environment
- Use priority loading for first 5 Pokemon cards in initial render

### Testing Strategy
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: End-to-end user flow testing
- **Performance Tests**: Bundle size and load time monitoring
- **Type Safety**: Comprehensive TypeScript strict mode compliance

### Code Quality Standards
- **TypeScript**: Strict mode with enhanced type safety features
- **ESLint**: Extended Next.js configuration with custom rules
- **Prettier**: Consistent code formatting across the codebase
- **Pre-commit Hooks**: Automated quality checks before commits

## Deployment Strategy

### Hybrid Architecture (Fully Operational)
- **Frontend**: Vercel (Next.js optimized platform) - DEPLOYED
- **Backend**: Railway (GraphQL + Redis) - DEPLOYED
- **Benefits**: Best-in-class hosting for each component, cost-effective, scalable
- **Status**: Production-ready with CORS wildcard pattern matching for dynamic URLs

### Environment Configuration
```bash
# Frontend (Vercel)
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend.railway.app/graphql

# Backend (Railway)
CORS_ORIGIN=https://*.vercel.app
PORT=4000
REDIS_URL=redis://localhost:6379
```

### Deployment Commands
```bash
# Frontend deployment (automatic via Vercel)
git push origin main

# Backend deployment (automatic via Railway)
git push origin main  # Triggers Railway deployment

# Manual backend deployment
cd server && npm run build && npm start
```

### Production URLs
- **Frontend**: `https://pokemon-pokedex.vercel.app`
- **Backend**: `https://pokemon-pokedex-server.railway.app`
- **GraphQL Playground**: `https://pokemon-pokedex-server.railway.app/graphql`

### Monitoring & Health Checks
- Frontend: Vercel Analytics and Web Vitals
- Backend: Health endpoint at `/health`
- Redis: Connection status monitoring
- GraphQL: Apollo Server metrics

## External APIs

- **PokeAPI**: Primary data source for Pokemon information (v2 API)
- **Redis Cache**: Server-side caching with 5-minute TTL (Railway Redis or Upstash)
- **GraphQL Server**: Custom Apollo Server with intelligent caching (Railway/Render)
- **Apollo Client Cache**: Browser-side caching for efficient data management