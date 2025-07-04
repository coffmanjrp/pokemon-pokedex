# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pokemon Pokedex application built with Next.js 15 (App Router), React 19, TypeScript, and TailwindCSS. Features a Ruby/Sapphire-inspired game design with modern responsive layout and comprehensive multilingual support.

**Current Status**: Production-ready Pokemon Pokedex with comprehensive detail pages, enhanced evolution chains, performance optimizations, and sidebar-based generation navigation. Pokemon detail pages use SSG for optimal performance with individual Pokemon data pre-generated at build time. Pokemon list pages use full client-side rendering with intelligent cache system for seamless generation switching. Hybrid deployment fully operational with frontend deployed on Vercel and backend on Railway. Complete 9-language support implemented (English, Japanese, Traditional Chinese, Simplified Chinese, Spanish, Korean, French, German, Italian) with comprehensive translations, Pokemon data localization through PokeAPI GraphQL integration, and complete UI coverage including SEO metadata. Icon system consolidation completed using react-icons library (Heroicons v2 for UI elements, Font Awesome for specialized symbols) for consistent styling, better accessibility, and improved maintainability. Pokemon classification system fully implemented with multilingual badge support (Baby→ベイビィ, Legendary→伝説, Mythical→幻) across all 9 languages, comprehensive animation system with 26 distinct effects including classification-based hover animations, and enhanced sandbox environment with categorized animation testing. Recent improvements include Pokemon cache system optimization with enhanced UTF-8 character encoding for Japanese Pokemon names, server-side Pokemon service enhancements with intelligent caching strategies, and resolution of animation cleanup issues ensuring smooth user experience.

## Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router and React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS with Ruby/Sapphire game-inspired design
- **State Management**: Redux Toolkit
- **GraphQL Client**: Apollo Client
- **Internationalization**: Native App Router i18n with middleware-based language detection and server-side dictionary loading supporting 9 languages (English, Japanese, Traditional Chinese, Simplified Chinese, Spanish, Korean, French, German, Italian)

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
- **Pokemon Detail Pages**: Static Site Generation (SSG) with generational batch processing for optimal build performance
- **Pokemon List Pages**: Client-side rendering with intelligent cache system - ISR removed to prevent generation data conflicts
- **Generational Build System**: SSG builds are processed by Pokemon generation (1-9) to reduce memory usage and improve stability
- **Client-side Caching**: Multi-level caching strategy (Redis backend + Apollo Client frontend + localStorage persistence) for optimal performance
- **Generation Cache System**: Full localStorage cache with 24-hour TTL, base64 UTF-8 encoding for Japanese character preservation, automatic compression, and smart cache management
- **Data Loading Flow**: Empty initial data → Client-side generation-aware fetching → Intelligent cache fallback → Progressive loading
- **Hybrid Rendering**: Server Components for metadata and layout, Client Components for all Pokemon data interaction

### Performance Optimizations
- **Image Optimization**: AVIF/WebP formats, 1-year caching, dynamic quality settings
- **Bundle Optimization**: Tree shaking, package optimization, code splitting
- **Cache Strategy**: Long-term static asset caching, intelligent API response caching
- **Grid Rendering**: Optimized standard grid for better reliability and scrolling functionality
- **Generation Switching**: Enhanced reliability with 8-second timeout handling and seamless data preservation
- **Apollo Client Integration**: Standard fetchMore() patterns with automatic cache management
- **SEO & Metadata**: Comprehensive Open Graph, Twitter Cards, and multilingual metadata implementation
- **Navigation Performance**: Next.js Link component with automatic prefetching and parallel animation processing
- **SSR/CSR Consistency**: Eliminated Next.js 15 hydration errors through props-based dictionary architecture

### Icon System Architecture
- **React Icons Integration**: Complete migration from inline SVG to react-icons library
- **Heroicons v2**: Primary icon set for UI elements (navigation, search, hamburger menu, chevrons, close buttons)
- **Font Awesome**: Specialized icons for gender symbols (FaMars ♂, FaVenus ♀) with proper color coding
- **Performance Benefits**: Reduced bundle size through tree shaking and improved icon rendering performance

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
│   │   ├── dictionaries/         # Translation files (9 languages)
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

- **Pokemon Display**: Card-based layout with official artwork and sprites
- **Generation Navigation**: Sidebar with generation buttons (1-9) and seamless generation switching
- **Advanced Search**: Real-time Pokemon search with debouncing, suggestions, multi-language support (including Japanese hiragana/katakana conversion), and type filtering
- **Cache Performance**: Client-side intelligent caching with localStorage persistence and 24-hour TTL
- **Multilingual Support**: Complete 9-language support (English/Japanese/Traditional Chinese/Simplified Chinese/Spanish/Korean/French/German/Italian) with middleware-based routing and unified dictionary system
- **Pokemon Classification System**: Multilingual badge system for Baby (ベイビィ), Legendary (伝説), and Mythical (幻) Pokemon with visual indicators and specialized hover effects
- **Interactive Animation System**: 26 distinct animation effects categorized into Regular Click Effects, Special Hover Effects, and Classification-based Hover Effects with smooth cleanup transitions
- **Animation Sandbox**: Comprehensive testing environment with categorized animations, hover/click differentiation, and visual feedback indicators
- **Responsive Design**: Mobile-first with tablet and desktop optimizations
- **Performance**: Multi-level caching, optimized grid rendering, smart cache management, image optimization
- **Detail Pages**: Comprehensive Pokemon information with evolution chains, form variants, and classification badges
- **Type System**: Official Pokemon type colors and effectiveness calculations
- **SEO Optimization**: Enhanced metadata with Open Graph, Twitter Cards, and multilingual support
- **API Routes**: Comprehensive REST API endpoints for Pokemon data access with GraphQL integration

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

### Component Architecture

**Pokemon Component Organization**:
- **List Components** (`/components/ui/pokemon/list/`) - Pokemon grid, cards, loading states with special classification hover effects
- **Detail Components** (`/components/ui/pokemon/detail/`) - Pokemon detail pages, stats, moves, descriptions, and classification badges
- **Classification Components** (`/detail/PokemonClassificationBadge.tsx`) - Reusable multilingual badge component with size variants
- **Sprites Components** (`/sprites/`) - Sprite gallery and image management
- **Evolution Components** (`/evolution/`) - Evolution chain display with modular architecture
- **Common Components** (`/common/`) - Shared UI components (Badge, LoadingSpinner, etc.)

**Benefits**: Clear separation of concerns, improved maintainability, scalable structure, reusable classification system

### State Management
- **Redux Toolkit**: Pokemon data and UI state management with generation cache system
- **Apollo Client**: GraphQL client with intelligent caching and fetchMore() integration
- **Generation-Based Loading**: Progressive batch loading system with cache fallback
- **LocalStorage Cache**: Persistent cache with compression, TTL management, and automatic cleanup
- **Pokemon Cache System**: Enhanced UTF-8 encoding support for Japanese/Chinese Pokemon names (`client/lib/pokemonCache.ts`)
- **Server-side Caching**: Intelligent selective caching strategy in Pokemon service (`server/src/services/pokemonService.ts`)

### Navigation System
- **Sidebar Navigation**: Fixed sidebar with generation buttons (1-9), hamburger menu for mobile
- **Generation Switching**: Seamless generation switching with cache restoration and data preservation
- **Generation Ranges**: Kanto (1-151), Johto (152-251), Hoenn (252-386), etc.
- **Progressive Loading**: Initial batch loading with automatic background loading and cache integration
- **Mobile Navigation**: Touch-optimized hamburger menu with overlay and logo positioning

### Build System
- **Pokemon Detail Pages**: Built in 9 separate batches by generation for optimal memory usage (2600+ pages total)
- **Pokemon List Pages**: Full client-side rendering with intelligent cache system
- **Environment-Controlled**: Build strategy controlled via `ENABLE_GENERATIONAL_BUILD` environment variable
- **Memory Efficiency**: Reduces build memory usage by ~90% (2600→300 pages per generation)

**Build Commands**:
```bash
npm run build                    # Intelligent build (auto-detects mode)
npm run build:legacy            # Standard build (all generations)
npm run build:generational      # Force generational build
npm run build:gen-1             # Specific generation build
```

### Animation System Architecture
- **Core Animation Library**: GSAP-based animation system with 26 distinct effects in `client/lib/animations/`
- **Animation Categories**:
  - **Regular Click Effects** (`rippleWave`, `particleBurst`, `cardFlip`, `pokeballPop`, `electricSpark`, `scaleGlow`, `bounceTilt`)
  - **Combination Effects** (`cardEcho`, `cardEchoBorder`, `particleEchoCombo`, `ultimateEchoCombo`, `elementalStorm`, `megaEvolution`)
  - **Special Pokemon Effects** (`babySparkle`, `legendaryAura`, `mythicalShimmer`)
  - **Hover Effects** (`babyHoverSparkle`, `legendaryHoverAura`, `mythicalHoverShimmer`)
  - **Classification Hover Effects** (`babyHeartBurst`, `legendaryBorderFlow`, `legendaryRainbowBorder`, `legendaryLightningBorder`, `mythicalElectricSpark`)
- **Animation Files**:
  - `client/lib/animations/rippleWave.ts` - Basic ripple and particle effects
  - `client/lib/animations/combinationEffects.ts` - Complex multi-layered animations
  - `client/lib/animations/specialEffects.ts` - Classification-based click animations
  - `client/lib/animations/hoverEffects.ts` - Classification-based hover animations
  - `client/lib/animations/subtleEffects.ts` - Subtle hover effects with proper cleanup functions
- **Animation Integration**: Smart classification-based triggering in Pokemon cards with throttling and cleanup management
- **Sandbox Environment**: Comprehensive testing interface at `/[lang]/sandbox` with categorized animation sections

### Internationalization
- **Languages**: Complete 9-language support (English/Japanese/Traditional Chinese/Simplified Chinese/Spanish/Korean/French/German/Italian) with middleware-based routing
- **Structure**: `/[lang]/` routes with server-side dictionary loading
- **Translation**: Pokemon names, types, abilities, moves, game versions, forms, regions, and classification badges via PokeAPI integration
- **Language Detection**: Intelligent detection with regional fallbacks
- **Dictionary Architecture**: Components converted from hardcoded language conditions to dictionary-based translations
- **Dictionary Files**: 9 language files in `client/lib/dictionaries/[lang].json` (en, ja, zh-Hans, zh-Hant, es, ko, fr, de, it)
- **Classification Translations**: Baby→ベイビィ, Legendary→伝説, Mythical→幻 with complete localization coverage

### API Routes System
- **REST API Integration**: Next.js API Routes providing REST endpoints alongside GraphQL backend
- **Multiple Query Types**: Basic, Full, and Evolution-specific endpoints for optimized data fetching
- **Endpoint Structure**: `/api/pokemon`, `/api/pokemon/[id]`, `/api/pokemon/[id]/basic`, `/api/pokemon/[id]/full`, `/api/pokemon/[id]/evolution`
- **GraphQL Integration**: API Routes serve as REST layer over existing GraphQL backend

## Common Issues & Solutions

### Generation Navigation State
- Use Redux state for current generation: `useAppSelector((state) => state.pokemon.currentGeneration)`
- Sidebar handles generation filtering and updates Redux state

### Language Navigation
- Use `href="{/${language}/}"` instead of `href="/"` in navigation components
- Extract current language using `usePathname()` and `getLocaleFromPathname()`
- Language toggle is dropdown menu with upward positioning for better mobile UX

### Mobile/Tablet UI
- Touch targets are minimum 44px for accessibility compliance
- Hamburger menu with `bg-black/30` overlay for optimal visibility
- Tab count indicators hidden on mobile with `hidden sm:inline-flex`

### Generation Switching & Cache Management
- **Cache-First Strategy**: Check localStorage cache before API requests for instant loading
- **UTF-8 Encoding**: Base64 localStorage encoding preserves Japanese and Chinese Pokemon names
- **Cache Persistence**: 24-hour TTL with automatic compression and smart cleanup
- **Apollo Client Integration**: Standard fetchMore() patterns with automatic cache management

### SSR/CSR Hydration Optimization
- **Hydration Error Resolution**: Eliminated Next.js 15 hydration mismatches by migrating from Redux-dependent text rendering to props-based dictionary architecture
- **Architecture Pattern**: Replaced `useAppSelector((state) => state.ui.dictionary)` with direct `dictionary` props
- **Props Flow**: Dictionary data flows from server components through props for consistent text rendering

## Deployment Strategy

### Hybrid Architecture
- **Frontend**: Vercel (Next.js optimized platform)
- **Backend**: Railway (GraphQL + Redis)
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

### Production URLs
- **Frontend**: `https://pokemon-pokedex.vercel.app`
- **Backend**: `https://pokemon-pokedex-server.railway.app`

## External APIs

- **PokeAPI**: Primary data source for Pokemon information (v2 API)
- **Redis Cache**: Server-side caching with 5-minute TTL
- **GraphQL Server**: Custom Apollo Server with intelligent caching
- **Apollo Client Cache**: Browser-side caching for efficient data management

## Adding New Language Support

This section provides step-by-step instructions for adding a new language to the Pokemon Pokedex application.

### Prerequisites

1. Verify that the target language is supported by PokeAPI at https://pokeapi.co/api/v2/language/
2. Identify the PokeAPI language code (e.g., "de" for German, "it" for Italian)
3. Prepare comprehensive UI translations for the new language

### Step-by-Step Process

1. **Create Language Dictionary File**: Create `client/lib/dictionaries/[lang].json` with all 400+ UI translations
2. **Update Type System**: Add new language to Locale type in `client/lib/dictionaries.ts`
3. **Configure Dictionary Loading**: Add language to `client/lib/get-dictionary.ts`
4. **Update Language Storage**: Modify validation functions in `client/lib/languageStorage.ts`
5. **Configure Routing**: Update `client/middleware.ts` to include new language
6. **Update Static Generation**: Add language to `generateStaticParams` functions
7. **Add Pokemon Data Integration**: Update `client/lib/pokemonUtils.ts` for Pokemon data fetching
8. **Update Language Toggle**: Modify `client/components/layout/LanguageToggle.tsx`
9. **Update All Dictionaries**: Add new language option to ALL existing dictionary files
10. **Update SEO Metadata**: Add alternate language URLs

### Technical Notes

- The system automatically fetches Pokemon data in the new language using PokeAPI's built-in language support
- If Pokemon data isn't available in the target language, the system falls back to English
- The generation cache system automatically supports new languages
- Both standard and generational build modes work with new languages