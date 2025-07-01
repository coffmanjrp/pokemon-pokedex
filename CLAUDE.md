# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pokemon Pokedex application built with Next.js 15 (App Router), React 19, TypeScript, and TailwindCSS. Features a Ruby/Sapphire-inspired game design with modern responsive layout and comprehensive multilingual support.

**Current Status**: Production-ready Pokemon Pokedex with comprehensive detail pages, enhanced evolution chains, performance optimizations, and sidebar-based generation navigation. **Pokemon detail pages use SSG** for optimal performance with individual Pokemon data pre-generated at build time. **Pokemon list pages now use full client-side rendering** with intelligent cache system for seamless generation switching - ISR removed to prevent generation data conflicts. **Intelligent generational build system** with automatic detection and memory-efficient processing by Pokemon generation. Major codebase cleanup completed with optimized component architecture and TypeScript compliance. **Mobile and tablet experience fully optimized** with responsive design, touch-friendly navigation, and enhanced UX across all screen sizes. **Hybrid deployment fully operational** with frontend deployed on Vercel and backend on Railway with CORS wildcard pattern matching for dynamic URLs. **Layout and scrolling optimization completed** with proper sidebar-to-content spacing, overlay positioning, and Pokemon grid scrolling functionality restored. **Generation switching completely fixed** - implemented full cache system with localStorage persistence, eliminated generation data mixing issues, and restored seamless Pokemon list loading across all generations. **UTF-8 character encoding issue fixed** - resolved Japanese Pokemon name corruption in card lists through base64 localStorage encoding with backward compatibility. **Comprehensive Redux dictionary support implemented** across all Pokemon detail child components with unified translation system using shared getFallbackText utility and complete i18n coverage for evolution conditions and sandbox components. **Next.js API Routes system fully implemented** - comprehensive REST API endpoints for Pokemon data access with GraphQL integration, multiple query types (basic/full), evolution chain analysis, debug capabilities, and dynamic Pokemon gender display based on PokeAPI data with color-coded symbols and enhanced multilingual localization. **Complete 5-language support implemented** - Spanish (es) added alongside English, Japanese, Traditional Chinese (zh-Hant), and Simplified Chinese (zh-Hans) with comprehensive Pokemon name translations, form badges, evolution conditions, and UI elements. **Dictionary system architecture enhanced** - Sidebar and AnimatedLoadingScreen components converted from hardcoded language conditions to unified dictionary system for better maintainability and consistency. **Language toggle enhanced** - converted from cycling button to intuitive dropdown menu with upward positioning for better mobile UX. **Evolution chain component architecture refactored** - 467-line monolithic component split into modular, reusable components (EvolutionCard, FormVariationCard, EvolutionArrow) with dedicated custom hook (useEvolutionAnimation) and utility functions, improving maintainability and code organization. **Pokemon component architecture fully organized** - 22+ Pokemon components systematically organized into logical folder structure with list/ and detail/ directories, improved import paths, and clear separation of concerns between Pokemon list page and detail page components for enhanced maintainability and developer experience.

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
- **Build Performance**: Bundle analyzer integration, optimized webpack configuration
- **Layout Optimization**: Sidebar-to-content spacing optimized, overlay positioning improved
- **Grid Rendering**: Virtual scrolling replaced with optimized standard grid for better reliability and scrolling functionality
- **Component Architecture**: PokemonGrid component refactored from VirtualPokemonGrid with proper container overflow management
- **Generation Switching**: Enhanced reliability with 8-second timeout handling and seamless data preservation
- **Apollo Client Integration**: Fully migrated to standard fetchMore() patterns with automatic cache management
- **SEO & Metadata**: Comprehensive Open Graph, Twitter Cards, and multilingual metadata implementation
- **Internationalization**: Redux-based dictionary system with shared getFallbackText utility across all components
- **UX Optimization**: Reduced generation switching timeout from 15 seconds to 8 seconds for improved responsiveness

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
│   │   │   ├── route.ts           # API documentation and route listing
│   │   │   ├── pokemon/
│   │   │   │   ├── route.ts       # Pokemon list API endpoint
│   │   │   │   └── [id]/          # Pokemon detail API routes
│   │   │   │       ├── route.ts   # Basic Pokemon detail endpoint
│   │   │   │       ├── basic/     # Explicit basic Pokemon data
│   │   │   │       ├── full/      # Complete Pokemon data with evolution
│   │   │   │       └── evolution/ # Evolution chain analysis
│   │   │   └── graphql/           # GraphQL debug and testing endpoints
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
│   │       └── pokemon/          # Pokemon-specific UI components (organized architecture)
│   │           ├── list/         # Pokemon list page components
│   │           │   ├── PokemonGrid.tsx               # Main Pokemon grid display
│   │           │   ├── PokemonCard.tsx               # Individual Pokemon cards
│   │           │   ├── PokemonLoadingIndicator.tsx   # Loading states
│   │           │   ├── PokemonProgressFooter.tsx     # Progress indicators
│   │           │   ├── GenerationSwitchingOverlay.tsx # Generation switching UI
│   │           │   └── PokemonCardSkeleton.tsx       # Loading skeletons
│   │           ├── detail/       # Pokemon detail page components
│   │           │   ├── PokemonBasicInfo.tsx          # Hero section and main info
│   │           │   ├── PokemonTopNavigationTabs.tsx  # Tab navigation system
│   │           │   ├── PokemonMoves.tsx              # Moves and abilities
│   │           │   ├── PokemonDescription.tsx        # Flavor text descriptions
│   │           │   ├── PokemonGameHistory.tsx        # Game appearances
│   │           │   ├── PokemonDetailHeader.tsx       # Page header
│   │           │   ├── PokemonImage.tsx              # Pokemon image display
│   │           │   ├── PokemonTypes.tsx              # Type badges
│   │           │   ├── PokemonStatsSection.tsx       # Statistics display
│   │           │   └── [15+ other detail components] # Additional detail components
│   │           ├── sprites/      # Sprite gallery components
│   │           │   ├── PokemonSpritesGallery.tsx     # Main sprites gallery
│   │           │   ├── SpritesTab.tsx                # Sprite tab content
│   │           │   └── SpriteCard.tsx                # Individual sprite cards
│   │           └── evolution/    # Evolution chain components (refactored architecture)
│   │               ├── PokemonEvolutionChain.tsx     # Main evolution chain component
│   │               ├── EvolutionCard.tsx             # Individual Pokemon card
│   │               ├── FormVariationCard.tsx         # Form variation display
│   │               └── EvolutionArrow.tsx           # Evolution arrow with conditions
│   ├── lib/                      # Utility functions and configurations
│   │   ├── evolution/            # Evolution-specific utilities
│   │   │   └── evolutionConditions.ts              # Evolution condition rendering logic
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
│   ├── hooks/                    # Custom React hooks
│   │   ├── usePokemonList.ts     # Pokemon list management with cache system, generation switching, and Apollo Client integration
│   │   ├── useBackgroundPreload.ts # Background data preloading optimization
│   │   ├── useNavigationCache.ts   # Navigation caching logic
│   │   └── useEvolutionAnimation.ts # Evolution chain animation handling
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
- **Generation Navigation**: Sidebar with generation buttons (1-9) and seamless generation switching
- **Cache Performance**: Client-side intelligent caching with localStorage persistence and 24-hour TTL
- **Multilingual Support**: Complete 5-language support (English/Japanese/Traditional Chinese/Simplified Chinese/Spanish) with middleware-based routing and unified dictionary system
- **Responsive Design**: Mobile-first with tablet and desktop optimizations
- **Mobile/Tablet Experience**: Hamburger menu navigation, touch-optimized UI, responsive grid layouts
- **Performance**: Multi-level caching, optimized grid rendering, smart cache management, image optimization, iOS Safari scroll optimization
- **Detail Pages**: Comprehensive Pokemon information with evolution chains and form variants
- **Type System**: Official Pokemon type colors and effectiveness calculations
- **SEO Optimization**: Enhanced metadata with Open Graph, Twitter Cards, and multilingual support
- **Social Sharing**: Dynamic Pokemon images for attractive social media previews
- **API Routes**: Comprehensive REST API endpoints for Pokemon data access with multiple query types (basic/full/evolution) and GraphQL integration

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

#### Organized Pokemon Component Structure
The Pokemon component architecture has been systematically organized for optimal maintainability and developer experience:

**Pokemon List Components (`/components/ui/pokemon/list/`)**
- **Purpose**: Components used on the main Pokemon grid/list page
- **Key Components**:
  - `PokemonGrid.tsx` - Main grid layout with responsive design
  - `PokemonCard.tsx` - Individual Pokemon cards with animation effects
  - `PokemonLoadingIndicator.tsx` - Loading states during data fetching
  - `PokemonProgressFooter.tsx` - Generation loading progress
  - `GenerationSwitchingOverlay.tsx` - Generation switching UI overlay
  - `PokemonCardSkeleton.tsx` - Skeleton loading states

**Pokemon Detail Components (`/components/ui/pokemon/detail/`)**
- **Purpose**: Components used on individual Pokemon detail pages
- **Key Components**:
  - `PokemonBasicInfo.tsx` - Hero section with main Pokemon information
  - `PokemonTopNavigationTabs.tsx` - Tab navigation system for detail content
  - `PokemonMoves.tsx` - Moves, abilities, and learnset information
  - `PokemonDescription.tsx` - Flavor text descriptions from games
  - `PokemonGameHistory.tsx` - Game appearances and version history
  - `PokemonStatsSection.tsx` - Base stats with visual representations
  - `PokemonTypes.tsx` - Type badges and effectiveness
  - `PokemonImage.tsx` - Pokemon artwork and sprite display
  - Plus 10+ additional specialized detail components

**Specialized Component Groups**
- **Sprites** (`/sprites/`) - Sprite gallery and image management components
- **Evolution** (`/evolution/`) - Evolution chain display with modular architecture
- **Common** (`/common/`) - Shared UI components (Badge, DataEmptyState, etc.)

#### Architecture Benefits
1. **Clear Separation of Concerns**: List vs Detail page components clearly separated
2. **Improved Maintainability**: Developers can quickly locate relevant components
3. **Reduced Cognitive Load**: Logical grouping reduces mental overhead
4. **Scalable Structure**: Easy to add new components in appropriate directories
5. **Import Path Clarity**: Clear import hierarchies with relative path relationships

### State Management
- **Redux Toolkit**: Pokemon data and UI state management with generation cache system
- **Apollo Client**: GraphQL client with intelligent caching and fetchMore() integration
- **Generation-Based Loading**: Progressive batch loading system with cache fallback
- **LocalStorage Cache**: Persistent cache with compression, TTL management, and automatic cleanup

### Navigation System
- **Sidebar Navigation**: Fixed sidebar with generation buttons (1-9), hamburger menu for mobile
- **Generation Switching**: Seamless generation switching with cache restoration and data preservation
- **Generation Ranges**: Kanto (1-151), Johto (152-251), Hoenn (252-386), etc.
- **Progressive Loading**: Initial batch loading with automatic background loading and cache integration
- **Mobile Navigation**: Touch-optimized hamburger menu with overlay and logo positioning

### Static Site Generation & Client-side Cache System
- **Pokemon Detail Pages**: Built in 9 separate batches by generation for optimal memory usage (2600+ pages total)
- **Pokemon List Pages**: Full client-side rendering with intelligent cache system - ISR removed to prevent generation data conflicts
- **Environment-Controlled**: Build strategy controlled via environment variables for flexibility
- **Memory Efficiency**: Reduces build memory usage by ~90% (2600→300 pages per generation)
- **Smart ID Validation**: GraphQL-based detection of valid Pokemon IDs for detail pages
- **Build Performance**: Improved stability and reduced timeout errors with generation-based batching
- **Individual Generation Builds**: Support for building specific generations (build:gen-1 through build:gen-9)
- **Cache Benefits**: Client-side performance + generation data integrity + seamless switching

#### Build Commands & Automatic Detection
```bash
# Intelligent build (automatically detects mode)
npm run build  # Uses ENABLE_GENERATIONAL_BUILD environment variable

# Standard fast build (all generations at once)
npm run build:legacy

# Force generational build
npm run build:generational
ENABLE_GENERATIONAL_BUILD=true npm run build

# Specific generation build (development/testing)
npm run build:gen-1  # Generation 1 only (Kanto)
npm run build:gen-2  # Generation 2 only (Johto)
# ... through build:gen-9 (Paldea)

# Legacy commands (still work)
BUILD_GENERATION=1 npm run build:legacy
```

#### Automatic Build Mode Detection
The build system automatically chooses the optimal build strategy:
- **Standard Mode**: Fast build with all generations (default for development)
- **Generational Mode**: Memory-efficient build by generation (when `ENABLE_GENERATIONAL_BUILD=true`)
- **Single Generation**: Individual generation testing (development/debugging)

#### Environment Variables
- `ENABLE_GENERATIONAL_BUILD=true`: Enable generation-by-generation building
- `BUILD_GENERATION=X`: Build only specific generation (1-9) with legacy build
- Used in both Vercel production and local development environments

#### Vercel Production Setup
To enable generational builds in Vercel:
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add: `ENABLE_GENERATIONAL_BUILD` = `true`
3. Deploy - the build system will automatically use generational mode
4. No changes to Build Command needed (uses `npm run build`)

#### Local Development Usage
```bash
# Test standard build (default)
npm run build

# Test generational build locally
ENABLE_GENERATIONAL_BUILD=true npm run build

# Test specific generation
npm run build:gen-1

# Compare build outputs
npm run build:legacy  # Standard
npm run build:generational  # Generational
```

### Internationalization
- **Languages**: Complete 5-language support (English/Japanese/Traditional Chinese/Simplified Chinese/Spanish) with middleware-based routing
- **Structure**: `/[lang]/` routes with server-side dictionary loading
- **Translation**: Pokemon names, types, abilities, moves via PokeAPI integration with species.names[] data
- **Language Detection**: Intelligent detection with regional fallbacks (zh-TW→zh-Hant, zh-CN→zh-Hans)
- **UI Components**: All components support 5-language localization with unified dictionary system
- **Dictionary Architecture**: Components converted from hardcoded language conditions to dictionary-based translations for better maintainability
- **Form Translations**: Pokemon form badges (Mega, Gigantamax, Regional variants) in all languages

### API Routes System
- **REST API Integration**: Next.js API Routes providing REST endpoints alongside GraphQL backend
- **Multiple Query Types**: Basic, Full, and Evolution-specific endpoints for optimized data fetching
- **Debug Capabilities**: GraphQL debug endpoints for testing and development
- **Endpoint Structure**:
  - `/api/pokemon` - Pokemon list with query parameters
  - `/api/pokemon/[id]` - Basic Pokemon detail data
  - `/api/pokemon/[id]/basic` - Explicit basic Pokemon data endpoint
  - `/api/pokemon/[id]/full` - Complete Pokemon data with evolution chains
  - `/api/pokemon/[id]/evolution` - Dedicated evolution chain analysis
  - `/api/graphql/debug` - GraphQL query testing and debugging
- **GraphQL Integration**: API Routes serve as REST layer over existing GraphQL backend
- **Environment Configuration**: Automatic GraphQL endpoint detection with fallback to localhost

## Common Issues & Solutions

### Generation Navigation State
- Use Redux state for current generation: `useAppSelector((state) => state.pokemon.currentGeneration)`
- Sidebar handles generation filtering and updates Redux state
- **Generation Filtering**: Client-side filtering of Pokemon based on generation selection
- **ISR Integration**: Server-rendered initial content with client-side filtering enhancement

### Language Navigation
- Use `href="{/${language}/}"` instead of `href="/"` in navigation components
- Extract current language using `usePathname()` and `getLocaleFromPathname()`
- **Language Toggle**: Dropdown menu with upward positioning for better mobile UX
- **4-Language Support**: English, Japanese, Traditional Chinese, Simplified Chinese with native labels and flags

### Mobile/Tablet UI
- Touch targets are minimum 44px for accessibility compliance
- Hamburger menu with `bg-black/30` overlay for optimal visibility
- Tab count indicators hidden on mobile with `hidden sm:inline-flex`
- iOS Safari scroll optimization with `WebkitOverflowScrolling: 'touch'`

### Container Overflow Management
- Main content containers use `overflow-auto` for proper scrolling
- Pokemon grid containers avoid `min-h-full` classes that prevent natural height
- Flex layouts with `flex-1` allow proper content distribution and scrolling

### Generation Switching & Cache Management
- **Cache-First Strategy**: Check localStorage cache before API requests for instant loading
- **Data Integrity**: Generation-aware data fetching prevents data mixing between generations  
- **Cache Persistence**: 24-hour TTL with automatic compression and smart cleanup
- **UTF-8 Encoding**: Base64 localStorage encoding preserves Japanese and Chinese Pokemon names and prevents character corruption
- **Character Encoding**: Resolved `���シャマリ` → `オシャマリ` corruption in Japanese card lists through proper UTF-8 handling, supports Chinese characters
- **Silent Failover**: Timeout protection with graceful fallback to ensure seamless UX
- **Apollo Client Integration**: Standard fetchMore() patterns with automatic cache management
- **Cache Restoration**: Instant generation switching with cached data preservation
- **Backward Compatibility**: Automatic detection of legacy cache format with graceful migration

### SEO & Social Media Optimization
- **Enhanced Metadata**: Comprehensive Open Graph and Twitter Card implementation
- **Multilingual SEO**: Language-specific metadata for all 4 supported languages (English/Japanese/Traditional Chinese/Simplified Chinese)
- **Dynamic Images**: Daily rotating featured Pokemon images for social sharing
- **Canonical URLs**: Proper canonical and alternate language URL structure
- **Rich Snippets**: Optimized meta descriptions with Pokemon-specific information
- **Social Previews**: High-quality Pokemon artwork for attractive social media cards

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