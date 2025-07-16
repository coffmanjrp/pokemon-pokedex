# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pokemon Pokedex application built with Next.js 15 (App Router), React 19, TypeScript, and TailwindCSS. Features a Ruby/Sapphire-inspired game design with modern responsive layout and comprehensive multilingual support.

**Current Status**: Production-ready Pokemon Pokedex with comprehensive detail pages, enhanced evolution chains, performance optimizations, and sidebar-based generation navigation. Pokemon detail pages use SSG for optimal performance with individual Pokemon data pre-generated at build time. Pokemon list pages use full client-side rendering with intelligent cache system for seamless generation switching. Hybrid deployment fully operational with frontend deployed on Vercel and backend on Railway. **Language support optimized to 2 languages (English and Japanese) for maximum Vercel build performance** - static pages reduced from 12,537 to 2,786 (78% reduction). All dictionary files preserved for Korean, French, German, Italian, Spanish, Traditional Chinese, and Simplified Chinese for future re-enablement. Icon system consolidation completed using react-icons library (Heroicons v2 for UI elements, Font Awesome for specialized symbols) for consistent styling, better accessibility, and improved maintainability. Pokemon classification system fully implemented with multilingual badge support (Baby→ベイビィ, Legendary→伝説, Mythical→幻) across both supported languages, comprehensive animation system with 26 distinct effects including classification-based hover animations, and enhanced sandbox environment with categorized animation testing. Recent improvements include Pokemon cache system optimization with enhanced UTF-8 character encoding for Japanese Pokemon names, server-side Pokemon service enhancements with intelligent caching strategies, resolution of animation cleanup issues ensuring smooth user experience, virtual scrolling implementation with react-window for large datasets (threshold: 10+ Pokemon), dynamic header shrinking system with smooth GSAP animations that preserves search functionality through icon display, streamlined search interface with simplified input mechanism eliminating dropdown suggestions for improved UI stability and performance, complete move data multilingual support with tooltip-based descriptions using react-tooltip, damage class localization through dictionary system, and data source annotations. Generation 0 (Other) implementation now includes centralized blacklist system for excluding Pokemon forms without sprite data, enhanced Pokemon form ID display and sorting functionality based on base Pokemon species ID for improved user experience, proper form-to-species mapping with intelligent caching for optimal performance, scroll position restoration system with session storage persistence for seamless navigation experience, and optimized user interface with hidden generation information in footer and loading screens for cleaner presentation. Pokemon badge system fully refactored with Strategy Pattern implementation for improved maintainability, unified color schemes for all badge types, and centralized badge logic in utility functions. Generation 0 URL parameter persistence and scroll position restoration system fully implemented with enhanced navigation that preserves user context when transitioning between detail and list pages. Enhanced progress footer system with GSAP-powered linear progress bar animations, continuous display from loading start to completion, and smooth state transitions during batch loading operations. Placeholder Pokemon images now use lightweight SVG Data URLs with "?" symbol instead of external PNG files, eliminating Next.js Image Optimization API errors and reducing build size by 1.2MB. **Redis cache removed** in favor of cost-effective localStorage (client) and CDN caching (server) strategy, with Cache-Control headers for 24-hour TTL and rate limiting for PokeAPI protection. **Vercel build optimizations** include custom vercel.json configuration, parallel generation builds, and TypeScript incremental compilation. **SSG build performance** dramatically improved from ~52 minutes to ~12 minutes through parallel generation builds - each generation builds in isolated directory, preventing file conflicts and enabling true parallelization. **Parallel build system** implemented with dynamic parallelism calculation, automatic build merging, and cleanup functionality, reducing build time by ~77% while maintaining full SSG benefits. **SEO optimization** fully implemented with robots.txt, automatic sitemap.xml generation for all 2,786 pages, Schema.org structured data (JSON-LD) for rich snippets, and dynamic canonical URL generation system. **Unified error handling system** implemented with custom error classes (AppError, APIError, ValidationError, NetworkError, CacheError), centralized error handler service with multi-language support, persistent error logging with localStorage, Next.js 15 App Router error boundaries, and user-friendly error recovery suggestions.

## Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router and React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS with Ruby/Sapphire game-inspired design
- **State Management**: Redux Toolkit
- **GraphQL Client**: Apollo Client
- **Internationalization**: Native App Router i18n with middleware-based language detection and server-side dictionary loading supporting 2 languages (English, Japanese) - 7 additional languages temporarily disabled for Vercel build optimization

### Backend (GraphQL Server)
- **Server**: Apollo Server with Express
- **Language**: TypeScript
- **Deployment**: Railway with automatic CI/CD and CORS wildcard pattern matching
- **Data Source**: PokeAPI (https://pokeapi.co/api/v2/)
- **Caching**: CDN-based caching with Cache-Control headers (24-hour TTL)
- **Architecture**: Simplified caching strategy (PokeAPI → GraphQL Server → CDN → Apollo Client → localStorage)
- **Data Loading**: Selective query optimization - SSG builds use full data, runtime browsing uses lightweight queries
- **CORS Configuration**: Wildcard pattern support for dynamic Vercel deployment URLs

### Data Loading Strategy
- **Pokemon Detail Pages**: Static Site Generation (SSG) with generational batch processing for optimal build performance
- **Pokemon List Pages**: Client-side rendering with intelligent cache system - ISR removed to prevent generation data conflicts
- **Generational Build System**: SSG builds are processed by Pokemon generation (1-9) to reduce memory usage and improve stability
- **Client-side Caching**: Dual-layer caching strategy (localStorage persistence + Apollo Client memory cache) for optimal performance
- **Generation Cache System**: Full localStorage cache with 24-hour TTL, base64 UTF-8 encoding for Japanese character preservation, automatic compression, and smart cache management
- **Data Loading Flow**: Empty initial data → Client-side generation-aware fetching → Intelligent cache fallback → Progressive loading
- **Hybrid Rendering**: Server Components for metadata and layout, Client Components for all Pokemon data interaction

### Performance Optimizations
- **Image Optimization**: AVIF/WebP formats, 1-year caching, dynamic quality settings
- **Bundle Optimization**: Tree shaking, package optimization, code splitting
- **Cache Strategy**: Long-term static asset caching, intelligent API response caching
- **Virtual Scrolling**: react-window implementation for efficient rendering of large Pokemon datasets (11+ Pokemon)
- **Hybrid Grid System**: Automatic switching between standard grid (≤10 Pokemon) and virtual scrolling (11+ Pokemon)
- **Generation Switching**: Enhanced reliability with 8-second timeout handling and seamless data preservation
- **Apollo Client Integration**: Standard fetchMore() patterns with automatic cache management
- **Enhanced Railway Reliability**: Improved Apollo Client retry logic with 7 retry attempts, 90-second timeouts, and exponential backoff for 502/503/504 errors to handle Railway server stability issues during Vercel SSG builds
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

# API Testing
# Error logging endpoints are available:
# POST /api/errors         # Single error reporting
# POST /api/errors/batch   # Batch error reporting
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

- **Pokemon Display**: Card-based layout with official artwork and sprites
- **Generation Navigation**: Sidebar with generation buttons (1-9) and seamless generation switching
- **Advanced Search**: Streamlined Pokemon search interface with real-time search, multi-language support (including Japanese hiragana/katakana conversion), type filtering, and search result clearing functionality
- **Cache Performance**: Client-side intelligent caching with localStorage persistence and 24-hour TTL
- **Multilingual Support**: Optimized 2-language support (English/Japanese) with middleware-based routing and unified dictionary system - 7 additional languages temporarily disabled for maximum Vercel build performance
- **Pokemon Classification System**: Multilingual badge system for Baby (ベイビィ), Legendary (伝説), and Mythical (幻) Pokemon with visual indicators and specialized hover effects
- **Interactive Animation System**: 26 distinct animation effects categorized into Regular Click Effects, Special Hover Effects, and Classification-based Hover Effects with smooth cleanup transitions
- **Animation Sandbox**: Comprehensive testing environment with categorized animations, hover/click differentiation, and visual feedback indicators
- **Responsive Design**: Mobile-first with tablet and desktop optimizations
- **Performance**: Multi-level caching, virtual scrolling with react-window, hybrid grid system, smart cache management, image optimization
- **Detail Pages**: Comprehensive Pokemon information with evolution chains, form variants, and classification badges
- **Move Information**: Multilingual move names, descriptions, damage classes, and targets with tooltip display using react-tooltip
- **Type System**: Official Pokemon type colors and effectiveness calculations
- **SEO Optimization**: Comprehensive SEO implementation with robots.txt, sitemap.xml, structured data (JSON-LD), Open Graph, Twitter Cards, and multilingual support
- **Error Handling**: Unified error handling system with custom error classes, multi-language support, persistent logging, and user-friendly recovery suggestions
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
- **List Components** (`/components/ui/pokemon/list/`) - Pokemon grid with hybrid virtual scrolling, cards, loading states with special classification hover effects
- **Virtual Scrolling** (`VirtualPokemonGrid.tsx`) - react-window based grid with responsive column calculation and automatic performance optimization
- **Detail Components** (`/components/ui/pokemon/detail/`) - Pokemon detail pages, stats, moves, descriptions, and classification badges
- **Classification Components** (`/detail/PokemonClassificationBadge.tsx`) - Reusable multilingual badge component with size variants
- **Sprites Components** (`/sprites/`) - Sprite gallery and image management
- **Evolution Components** (`/evolution/`) - Evolution chain display with modular architecture
- **Common Components** (`/common/`) - Shared UI components (PokemonBadge, LoadingSpinner, InfoTooltip, etc.)
- **InfoTooltip Component** (`/common/InfoTooltip.tsx`) - Reusable tooltip component with customizable icon prop for move descriptions
- **PokemonBadge Component** (`/common/PokemonBadge.tsx`) - Unified badge component with Strategy Pattern for classification and form badges

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
- **Parallel Build System**: True parallel generation builds with isolated directories preventing file conflicts
- **Dynamic Parallelism**: Automatically calculates optimal parallel builds based on CPU cores and memory
- **Build Merging**: Automatic merging of generation builds into single `.next` directory for production
- **Environment-Controlled**: Build strategy controlled via `ENABLE_GENERATIONAL_BUILD` and `NEXT_OUT_DIR` environment variables
- **Memory Efficiency**: Reduces build memory usage by ~90% (2600→300 pages per generation)

**Build Commands**:
```bash
npm run build                    # Intelligent build (auto-detects mode)
npm run build:legacy            # Standard build (all generations)
npm run build:generational      # Force generational build
npm run build:parallel          # Parallel generation builds
npm run build:merge             # Merge generation builds
npm run build:fast              # Production-ready parallel build with auto merge & cleanup
npm run build:gen-1             # Specific generation build
```

**Build Performance**:
- Standard build: ~52 minutes
- Query optimized build: ~27 minutes
- Parallel build: ~12-13 minutes (77% improvement)

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

### Pokemon Badge System Architecture
- **Unified Badge Component**: Single `PokemonBadge` component handles all badge types (classification, form, custom)
- **Strategy Pattern Implementation**: Configuration-driven badge logic using priority-ordered arrays
- **Badge Configuration Files**:
  - `client/lib/utils/pokemonBadgeUtils.ts` - Centralized badge logic with Strategy Pattern
  - Badge configurations defined as arrays with condition functions, dictionary keys, and color mappings
- **Color Scheme Management**: Unified color palette for all badge types with region-specific styling
  - **Classifications**: Baby (pink), Legendary (yellow), Mythical (purple)
  - **Regional Variants**: Alolan (yellow), Galarian (blue), Hisuian (green), Paldean (orange)
  - **Forms**: Mega Evolution (purple), Gigantamax (red), Primal (indigo), Special (gray)
- **Configuration Structure**:
  ```typescript
  interface BadgeConfig {
    id: string;
    condition: (pokemon: Pokemon) => boolean;
    badgeKey: string;
    colorKey: string;
    variant: BadgeVariant;
  }
  ```
- **Key Functions**:
  - `getClassificationBadge()` - Returns badge info for Pokemon classifications
  - `getFormBadge()` - Returns badge info for Pokemon forms
  - `getBadgeInfo()` - Unified interface for badge data retrieval
- **Benefits**: Eliminates nested if-statements, improves maintainability, enables easy addition of new badge types

### Internationalization
- **Languages**: Optimized 2-language support (English/Japanese) with middleware-based routing - 7 additional languages temporarily disabled for Vercel build optimization
- **Structure**: `/[lang]/` routes with server-side dictionary loading
- **Translation**: Pokemon names, types, abilities, moves, game versions, forms, regions, and classification badges via PokeAPI integration
- **Language Detection**: Intelligent detection with regional fallbacks
- **Dictionary Architecture**: Components converted from hardcoded language conditions to dictionary-based translations
- **Dictionary Files**: 2 active language files in `client/lib/dictionaries/[lang].json` (en, ja) - zh-Hans, zh-Hant, es, ko, fr, de, it preserved for future re-enablement
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

### Generation 0 (Other) Navigation
- **URL Parameter Persistence**: Generation 0 parameters are properly preserved during detail page navigation
- **Detail Page URLs**: Include `?from=generation-0` parameter for proper back navigation
- **Scroll Position Restoration**: Automatic scroll position restoration when returning from detail pages using session storage
- **UI Optimization**: Generation information (number and ID ranges) hidden in footer and loading screens for cleaner presentation

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
- **Backend**: Railway (GraphQL only)
- **Status**: Production-ready with CORS wildcard pattern matching for dynamic URLs

### Environment Configuration
```bash
# Frontend (Vercel)
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend.railway.app/graphql

# Backend (Railway)
CORS_ORIGIN=https://*.vercel.app
PORT=4000
# Redis removed - using localStorage and CDN caching instead
```

### Production URLs
- **Frontend**: `https://pokemon-pokedex.vercel.app`
- **Backend**: `https://pokemon-pokedex-server.railway.app`

## External APIs

- **PokeAPI**: Primary data source for Pokemon information (v2 API)
- **GraphQL Server**: Custom Apollo Server with intelligent caching
- **Apollo Client Cache**: Browser-side caching for efficient data management
- **CDN Cache**: Server-side caching with 24-hour TTL via Cache-Control headers

## Virtual Scrolling Implementation

### Architecture
- **Library**: react-window (VariableSizeGrid component) with react-virtualized-auto-sizer
- **Hybrid System**: Automatic switching based on Pokemon count threshold (10 Pokemon)
- **Performance**: Only renders visible items, reducing DOM nodes and improving scroll performance
- **Responsive**: Dynamic column calculation based on screen width (1-5 columns)
- **Layout**: Tighter card spacing (8px gap) with proper padding implementation

### Key Files
- `VirtualPokemonGrid.tsx`: Main virtual scrolling component with responsive grid layout
- `PokemonGrid.tsx`: Hybrid controller that switches between standard and virtual grids
- **Integration**: Seamless fallback to standard grid for smaller datasets

### Technical Features
- **Memory Efficient**: Only renders visible Pokemon cards in viewport
- **Smooth Scrolling**: Optimized for large datasets (Generation 1: 151 Pokemon)
- **Mobile Responsive**: Adaptive column count (Mobile: 1 col, Desktop: 5 cols)
- **TypeScript**: Full type safety with proper interface definitions
- **Accessibility**: Maintains Pokemon card accessibility and navigation features
- **Scroll Event Integration**: Compatible with header shrink functionality

## Header Shrink System

### Overview
Dynamic header that shrinks on scroll to maximize content visibility while maintaining access to key features.

### Features
- **Automatic Shrinking**: Header reduces height after 100px scroll
- **Smooth Animations**: GSAP-powered transitions with easing effects
- **Search Icon Preservation**: Search functionality remains accessible via icon
- **Mobile Optimization**: Consistent title and icon alignment with hamburger menu
- **Hover Restoration**: Header expands on mouse hover for full functionality

### Technical Implementation
- **Scroll Detection**: Throttled scroll events with requestAnimationFrame
- **GSAP Timeline**: Coordinated animations for multiple elements
- **Component States**: Title scaling (0.75x), search bar fade out, type filter collapse
- **Mobile Layout**: Fixed height container (h-10) for consistent alignment
- **Desktop Layout**: Flexible layout with smooth transitions

## Move Data System

### Multilingual Move Support
- **Move Names**: Fetched from PokeAPI with full multilingual support through GraphQL
- **Move Descriptions**: Flavor text entries in all supported languages displayed via tooltips
- **Damage Classes**: Localized through dictionary system (Physical→物理, Special→特殊, Status→変化)
- **Move Targets**: Complete multilingual support with dictionary fallback system
- **Data Source**: Move data is from the latest Pokémon games (Scarlet/Violet) with annotations

### Implementation Details
- **GraphQL Query**: Enhanced to include `names`, `flavorTextEntries`, and target `names` for moves
- **Server-side**: Pokemon service fetches damage class and target multilingual data from PokeAPI
- **Client-side**: Utility functions in `pokemonUtils.ts` for move data localization
- **UI Components**: InfoTooltip component for displaying move descriptions on hover
- **Dictionary System**: Extended with `moveTargets` section for all active languages

## Generation 0 (Other) - Pokemon Forms

### Overview
Generation 0 displays special Pokemon forms including Mega Evolutions, Regional Variants (Alolan, Galarian, Hisuian, Paldean), and other special forms. The system uses non-sequential Pokemon IDs (10000+ range) with special pagination handling.

### Blacklist System
- **Configuration File**: `/shared/blacklist.json` - Centralized blacklist for Pokemon forms without sprite data
- **Blacklisted IDs**: 10264-10271 (Koraidon/Miraidon forms without sprites)
- **Implementation**: Both server and client automatically filter out blacklisted IDs
- **Maintenance**: Simply edit the JSON file to add/remove blacklisted Pokemon

### Technical Implementation
- **Server-side**: Special handling in `getPokemonFormsBasic()` for offset >= 10000
- **Non-sequential IDs**: Uses `REAL_FORM_IDS` array for pagination instead of continuous ranges
- **Client-side**: Modified `getTotalFormCount()` to count only Generation 0 forms (10033-10277)
- **Cache Support**: Full localStorage caching with UTF-8 encoding for form names
- **Form ID Sorting**: Enhanced sorting system using base Pokemon species ID for logical ordering of forms
- **Species Mapping**: Intelligent form-to-species mapping with in-memory caching for optimal performance
- **Display ID Management**: Proper display ID calculation for form Pokemon showing base species ID
- **Module Resolution**: Blacklist data moved to both server and client directories for Railway deployment compatibility
- **Navigation Enhancement**: URL parameter persistence and scroll position restoration for seamless user experience
- **UI Optimization**: Generation information hidden in footer and loading screens for cleaner presentation

### Key Files
- `/server/src/data/pokemonFormIds.ts` - Server-side form ID list with blacklist filtering and sorting logic
- `/client/lib/data/pokemonFormMappings.ts` - Client-side form mappings with blacklist filtering  
- `/server/src/data/blacklist.json` - Server-side blacklist configuration (copied from shared)
- `/client/lib/data/blacklist.json` - Client-side blacklist configuration (copied from shared)
- `/shared/blacklist.json` - Original centralized blacklist configuration (reference)
- `/client/lib/data/generations.ts` - Generation 0 configuration with range 10033-10277
- `/server/src/services/pokemonService.ts` - Enhanced Pokemon service with form sorting and caching
- `/client/lib/pokemonUtils.ts` - Utility functions for Pokemon display ID and form handling
- `/client/components/ui/pokemon/detail/PokemonDetailHeader.tsx` - Enhanced back navigation with URL parameter preservation
- `/client/components/ui/pokemon/list/PokemonProgressFooter.tsx` - Progress footer with Generation 0 UI optimization
- `/client/components/ui/pokemon/list/GenerationSwitchingOverlay.tsx` - Loading overlay with Generation 0 UI optimization

## Cache Architecture (Redis Removed)

### Current Caching Strategy
The application now uses a cost-effective dual-layer caching approach:

1. **Client-side (localStorage)**
   - 24-hour TTL for Pokemon data
   - UTF-8 encoding for Japanese/Chinese characters
   - Automatic compression
   - 5 generation limit for storage management

2. **Server-side (CDN)**
   - Cache-Control headers: `public, max-age=86400, stale-while-revalidate=604800`
   - Vercel's automatic edge caching
   - No infrastructure costs

3. **Rate Limiting**
   - 50ms minimum interval between PokeAPI requests
   - Request monitoring and logging
   - Automatic retry with exponential backoff

### Benefits
- **Cost Reduction**: No Redis infrastructure costs
- **Performance**: localStorage provides instant data access
- **Simplicity**: Fewer moving parts and dependencies
- **Reliability**: No Redis connection issues

## Build Optimization Strategy

### Language Reduction for Vercel Build Performance
The application now supports only 2 languages (English and Japanese) to maximize Vercel build performance and ensure successful deployments within time limits.

#### Changes Made:
- **Languages Disabled**: Korean (ko), French (fr), German (de), Italian (it), Spanish (es), Traditional Chinese (zh-Hant), Simplified Chinese (zh-Hans)
- **Pages Reduced**: From 12,537 to 2,786 static pages (78% reduction)
- **Build Time Target**: Reduced from 45+ minutes to under 20 minutes
- **Dictionary Files Preserved**: All dictionary JSON files maintained for future re-enablement
- **Infrastructure Maintained**: Language detection, routing, and dictionary loading system unchanged

#### Apollo Client Enhancements:
- **Increased Retry Logic**: From 5 to 7 retry attempts for SSR operations
- **Extended Timeouts**: From 60s to 90s for Railway stability
- **Better Error Handling**: Enhanced retry conditions for 502/503/504 errors from Railway
- **Build Configuration**: Extended `staticPageGenerationTimeout` from 120s to 180s

#### Vercel Build Optimizations:
- **Custom Configuration**: `vercel.json` with optimized build settings and memory allocation
- **Parallel Generation Builds**: New script for building multiple generations concurrently
- **Function Timeouts**: Extended to 30 seconds for complex queries
- **Node Memory**: Increased to 8GB with `NODE_OPTIONS` environment variable

#### Re-enablement Process:
To re-enable additional languages:
1. Update `Locale` type in `client/lib/dictionaries.ts`
2. Add languages back to `client/middleware.ts` locales array
3. Update `client/lib/get-dictionary.ts` dictionary imports
4. Restore language validation in `client/lib/languageStorage.ts`
5. Update `LANGUAGE_OPTIONS` in `client/lib/data/languages.ts`
6. Add metadata alternates URLs back to page components
7. Update all language-specific switch statements and conditionals

## Project Improvement Plan

### Phase 1: Immediate Actions (Completed)
1. **Debug Code Cleanup** ✅
   - Removed all console.log statements from server-side code
   - Cleaned up debug logs in API routes
   - Improved production security and performance

2. **Error Logging API Implementation** ✅
   - Implemented error batch reporting API endpoint (/api/errors/batch)
   - Implemented single error reporting API endpoint (/api/errors)
   - Added server submission functionality to errorLogger.ts
   - Added server logging functionality to errorHandler.ts

### Phase 2: Quality Improvements (Next Steps)
1. **Test Coverage Enhancement** 🔴 High Priority
   - Add component tests for core UI components (PokemonCard, PokemonGrid, SearchBar)
   - Create utility function tests (pokemonUtils, cacheUtils)
   - Implement API route tests
   - Add Redux store tests
   - Target: 80% code coverage

2. **Accessibility Improvements** 🟡 Medium Priority
   - Add missing aria-labels to interactive elements
   - Enhance keyboard navigation
   - Improve screen reader support
   - Ensure WCAG 2.1 AA compliance

3. **Package Updates** 🟡 Medium Priority
   - Update client-side packages (Next.js, ESLint, TailwindCSS)
   - Update server-side packages
   - Resolve Dependabot PR conflicts and merge safe updates

### Phase 3: Advanced Features (Future)
1. **Security Enhancements** 🟡 Medium Priority
   - Add Content-Security-Policy headers
   - Implement Strict-Transport-Security
   - Configure Permissions-Policy

2. **Performance Monitoring** 🟢 Low Priority
   - Activate PerformanceMonitor component
   - Create Web Vitals dashboard
   - Set up performance alerts

3. **Language Support Strategy** 🟢 Low Priority
   - Plan for gradual re-enablement of additional languages
   - Balance build time vs. language coverage
   - Enhance CDN caching strategy

4. **Progressive Web App** 🟢 Low Priority
   - Implement Service Worker
   - Add offline caching
   - Enable app installation

### Phase 4: Database Migration to Supabase 🔴 High Priority
Architecture transformation to resolve current performance and stability issues.

#### Current Architecture
```
PokeAPI → Railway (GraphQL) → Vercel (Client)
```

#### Target Architecture
```
PokeAPI → Railway (Data Sync) → Supabase (Database) → Vercel (Client)
```

#### Implementation Tasks
1. **Supabase Setup** (1 day)
   - Create Supabase project
   - Design database schema
   - Configure authentication (for future features)
   - Set up Row Level Security policies

2. **Database Schema Design**
   ```sql
   -- Main Pokemon table
   CREATE TABLE pokemon (
     id INTEGER PRIMARY KEY,
     name VARCHAR(50) NOT NULL,
     height INTEGER,
     weight INTEGER,
     base_experience INTEGER,
     types JSONB,
     stats JSONB,
     abilities JSONB,
     sprites JSONB,
     moves JSONB,
     species_data JSONB,
     generation INTEGER,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Evolution chains
   CREATE TABLE evolution_chains (
     id INTEGER PRIMARY KEY,
     chain_data JSONB,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Indexes for performance
   CREATE INDEX idx_pokemon_generation ON pokemon(generation);
   CREATE INDEX idx_pokemon_types ON pokemon USING GIN(types);
   CREATE INDEX idx_pokemon_name ON pokemon(name);
   ```

3. **Data Migration** (2-3 days)
   - Create data sync script in Railway server
   - Initial bulk import of all Pokemon data
   - Set up incremental sync job (weekly/monthly)
   - Data validation and integrity checks

4. **Client Integration** (3-4 days)
   - Install and configure Supabase client SDK
   - Replace Apollo Client queries with Supabase queries
   - Implement caching strategy with Supabase
   - Update Redux store to work with Supabase
   - Migrate authentication logic (if applicable)

5. **Railway Server Transformation** (1 day)
   - Convert from GraphQL API to data sync service
   - Implement scheduled sync jobs
   - Add error handling and retry logic
   - Set up monitoring for sync failures

6. **Testing & Optimization** (1-2 days)
   - Performance testing and benchmarking
   - Query optimization with proper indexes
   - Cache strategy refinement
   - Load testing with expected traffic

#### Expected Improvements
- **Build Time**: 40+ minutes → Under 5 minutes
- **API Response Time**: 100-500ms → 10-50ms
- **Reliability**: 99.9%+ uptime (no Railway cold starts)
- **Cost**: Similar or reduced (Supabase free tier + minimal Railway usage)
- **Scalability**: Automatic with Supabase edge functions

#### Migration Benefits
1. **Performance**
   - Direct database queries instead of GraphQL overhead
   - Edge-cached responses globally
   - No cold start delays

2. **Reliability**
   - Eliminate Railway server instability
   - No PokeAPI rate limiting during builds
   - Automatic failover and backups

3. **Developer Experience**
   - Type-safe database queries
   - Real-time subscriptions for live features
   - Built-in authentication for future features
   - Better local development with Supabase CLI

4. **Future Features Enabled**
   - User accounts and favorites
   - Team builder with saved teams
   - Battle simulator with real-time updates
   - Community features (comments, ratings)

#### Migration Schedule
- **Week 1**: Supabase setup and schema design
- **Week 2**: Data migration and sync implementation
- **Week 3**: Client integration and testing
- **Week 4**: Optimization and production deployment

#### Risk Mitigation
- Maintain current architecture during migration
- Implement feature flags for gradual rollout
- Comprehensive testing before full cutover
- Rollback plan with data export capabilities

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