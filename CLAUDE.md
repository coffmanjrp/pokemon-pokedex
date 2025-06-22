# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pokemon Pokedex application built with Next.js 15 (App Router), React 19, TypeScript, and TailwindCSS. Features a Ruby/Sapphire-inspired game design with modern responsive layout and comprehensive multilingual support.

**Current Status**: Feature-complete Pokemon Pokedex with comprehensive detail pages including completely redesigned Pokemon detail pages based on reference design, enhanced evolution chains with form variants, enhanced move data display with detailed statistics, SSG implementation, complete App Router i18n multilingual support, and production-ready build. Successfully migrated from Pages Router i18n to modern Next.js 15 middleware-based approach. **LATEST**: Completely redesigned navigation architecture from header-based to sidebar-based layout. Implemented generation-based pagination system replacing advanced filtering. Fixed critical GraphQL server stability issues with PokeAPI rate limiting, retry logic, and concurrency control. New sidebar contains logo, generation buttons (1-9), and language toggle. **NEWEST**: Simplified loading system replacing complex infinite scroll with progressive batch loading. Initial 20 Pokemon load immediately with automatic background loading of remaining Pokemon. Enhanced footer progress indicators provide visual feedback during background loading process. Fixed main content overflow issues and improved VirtualPokemonGrid layout for optimal space utilization. **RECENT**: Fully implemented GraphQL query optimization with selective data loading! SSG builds now fetch complete Pokemon data while runtime browsing uses lightweight queries for optimal performance. Progressive data loading provides seamless user experience with automatic data enhancement. **CURRENT**: Implemented comprehensive generation-based navigation with URL parameter support and smart data clearing system that eliminates visual flickering during generation switching with intelligent loading overlay.

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

### GraphQL Query Optimization (NEW)
- **SSG Build Mode**: Uses `pokemonsFull` and `pokemonFull` queries with complete data (moves, evolution chains, etc.)
- **Runtime Browsing Mode**: Uses `pokemonsBasic` and `pokemonBasic` queries with essential data only (name, image, type, classification)
- **Progressive Enhancement**: Runtime mode can automatically upgrade from basic to full data for detail pages
- **Environment Control**: Build mode determined by `BUILD_MODE` and `NEXT_PUBLIC_BUILD_MODE` environment variables
- **Cache Optimization**: Basic queries cached for 60 minutes, full queries cached for 10-30 minutes based on access patterns

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

# Selective Data Loading Configuration
# For SSG builds (complete data):
BUILD_MODE=ssg NEXT_PUBLIC_BUILD_MODE=ssg npm run build

# For runtime optimization (basic data):
BUILD_MODE=runtime NEXT_PUBLIC_BUILD_MODE=runtime npm run build
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
│   │   └── ui/                   # Reusable UI components with i18n
│   │       └── DataUpgradeIndicator.tsx # Visual feedback for data loading states
│   ├── lib/                      # Utility functions and configurations
│   │   ├── dictionaries/         # Translation files
│   │   │   ├── en.json           # English translations
│   │   │   └── ja.json           # Japanese translations
│   │   ├── dictionaries.ts       # Type definitions and utilities
│   │   ├── get-dictionary.ts     # Server-only dictionary loader
│   │   ├── pokemonUtils.ts       # Pokemon data translation utilities
│   │   ├── formUtils.ts          # Pokemon form variation utilities and translations
│   │   └── querySelector.ts      # GraphQL query selection based on build mode
│   ├── hooks/                    # Custom React hooks
│   │   ├── usePokemonList.ts     # Pokemon list management with selective loading
│   │   ├── useBackgroundPreload.ts # Background data preloading optimization
│   │   ├── useProgressiveDataLoading.ts # Progressive enhancement from basic to full data
│   │   └── useDataStrategy.ts    # Data loading strategy analysis and debugging
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

### Implemented Features
- **Pokemon Display**: Card-based layout with official artwork and sprites
- **Type System**: Official Pokemon type colors and badges
- **Generation-Based Navigation**: 
  - Sidebar navigation with generation buttons (1-9) replacing advanced filtering
  - Simple generation-based pagination with region names (Kanto, Johto, etc.)
  - Progressive batch loading (initial 20 Pokemon per generation with automatic background completion)
  - Footer progress indicators for visual loading feedback
- **Virtual Scrolling**: @tanstack/react-virtual for efficient rendering of large Pokemon lists
- **Performance Optimization**: Comprehensive optimizations including:
  - Virtual scrolling with responsive column calculation (1-5 columns based on screen size)
  - Apollo Client cache-first strategy with cursor-based pagination caching
  - Image optimization (quality: 60%, WebP/AVIF formats, blur placeholders)
  - Next.js bundle optimization with code splitting for Apollo/GraphQL
  - Image preloading hooks for smoother user experience
  - **NEW**: Selective GraphQL data loading with environment-based query routing
- **State Management**: Redux Toolkit with generation-based navigation and deduplication
- **Native App Router i18n**: Complete English/Japanese support with middleware-based routing
  - Language detection from browser headers with automatic redirection
  - Server-side dictionary loading for optimal performance
  - Complete sidebar navigation multilingual support (Sidebar, LanguageToggle, GenerationButtons)
  - Pokemon data translations (names, types, abilities, moves, game versions)
  - URL-based language switching (/en/, /ja/) with proper SEO
- **Responsive Design**: Desktop-first with mobile and tablet optimizations
- **Selective Data Loading (NEW)**: Revolutionary GraphQL query optimization system
  - SSG Build Mode: Complete data fetching (`pokemonsFull`, `pokemonFull`) for static generation
  - Runtime Browsing Mode: Lightweight queries (`pokemonsBasic`, `pokemonBasic`) for optimal performance
  - Progressive Data Enhancement: Automatic upgrade from basic to full data when needed
  - Environment-based Query Selection: `BUILD_MODE` environment variable controls data strategy
  - Visual Loading Indicators: GSAP-powered animations show data loading and upgrade states
  - Performance Impact: ~70% reduction in runtime data payload while maintaining full SSG benefits
- **Evolution Chain with Form Variants**: Visual evolution trees including:
  - Regional variants (Alolan, Galarian, Hisuian, Paldean forms)
  - Mega Evolution (Mega, Mega X, Mega Y)
  - Gigantamax forms (G-Max variants)
  - Horizontal scrollable layout with form categorization
  - Clickable navigation to form-specific Pokemon pages

### Navigation & Loading Implementation
- **Generation-Based Navigation**: Sidebar with clickable generation buttons for simple navigation
- **Progressive Batch Loading**: Initial 20 Pokemon load immediately, remaining Pokemon load automatically in background
- **Simplified Loading System**: Replaced complex infinite scroll with user-friendly footer progress indicators
- **Generation Summary**: Sticky header shows current generation region, footer displays loading progress with visual indicators

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
  - `pokemonSlice`: Pokemon data, generation navigation, and loading states
  - `uiSlice`: UI state including language, sidebar state, and user preferences
- **Apollo Client**: GraphQL client integration with Redux
- **Generation-Based Loading**: Pokemon data loads by generation chunks for optimal performance

### Navigation System (Redesigned)
- **Sidebar Navigation**: Fixed sidebar with generation buttons (1-9)
- **Generation Switching**: Simple click-based navigation between regions
- **Generation Ranges**: 
  - Generations 1-9 with region names (Kanto, Johto, Hoenn, etc.)
  - Each generation loads Pokemon within specific ID ranges
  - Clear generation summaries with loaded/total counts

### Data Loading Strategy (Redesigned)
- **Progressive Batch Loading**: Initial 20 Pokemon load immediately, remaining Pokemon load automatically in background
- **Duplicate Prevention**: Client-side deduplication in both Redux slice and hooks
- **Generation-Based Chunks**: Loads Pokemon by generation ranges for better performance
- **Visual Progress Feedback**: Footer progress indicators with percentage and progress bars
- **Simplified UX**: Replaced complex infinite scroll with user-friendly automatic loading

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
- ✅ Pokemon names (via GraphQL/PokeAPI species data for all generations)
- ✅ All Pokemon types with official translations
- ✅ 50+ Pokemon abilities
- ✅ All Pokemon game versions
- ✅ Move names via GraphQL integration with 3-tier fallback system
- ✅ Evolution items (stones, trade items, etc.) with comprehensive translations
- ✅ Generation names and regions
- ✅ Complete UI text (search, filters, navigation, etc.)
- ✅ Height/Weight units and labels
- ✅ Stats and technical information
- ✅ Navigation consistency (back buttons, error pages, detail page links)
- ✅ Detail page text refinements (ストーリー→説明, ノーマル→通常, etc.)

## Navigation System Redesign (2024-12-22)

### Issue: Complex Filtering and Server Stability Problems
**Problems**:
1. Advanced filtering system was complex and caused performance issues
2. GraphQL server experiencing ECONNRESET errors from PokeAPI due to overwhelming concurrent requests
3. White screen on development environment after loading screen completion

**Root Cause**: Server trying to load all 151 Pokemon simultaneously, overwhelming PokeAPI with requests.

### Solution: Generation-Based Navigation with Server Optimization
**Implementation Strategy**:
1. **Sidebar Navigation**: Replace header navigation with fixed sidebar containing generation buttons
2. **Progressive Loading**: Initial 20 Pokemon per generation with Load More functionality
3. **Server Rate Limiting**: Implement concurrency control and retry logic for PokeAPI requests
4. **Simple Pagination**: Generation-based navigation replacing complex filtering system

**Key Benefits**:
- ✅ Resolved all GraphQL server stability issues (no more ECONNRESET errors)
- ✅ Fast initial loading with progressive data display
- ✅ Simple, intuitive navigation using Pokemon generations
- ✅ Improved user experience with clear generation summaries

### Implementation Details
- **Enhanced pokemonService.ts**: Added concurrency limiting, retry logic with exponential backoff
- **New Sidebar component**: Logo, generation buttons (1-9), language toggle at bottom
- **Redesigned layout**: Left margin accommodation for fixed sidebar
- **Updated usePokemonList hook**: Generation-based loading with Load More functionality

## Common Issues & Solutions

### Generation Navigation State
- When accessing generation state in components, use Redux state:
  ```typescript
  const currentGeneration = useAppSelector((state) => state.pokemon.currentGeneration);
  ```
- The sidebar handles generation switching and updates the Redux state accordingly

### Runtime Errors
- "ECONNRESET errors": Resolved with server-side rate limiting and retry logic
- Generation loading conflicts: Ensure generation state is properly managed in Redux store

### Language Navigation Issues
- **Problem**: Navigation links not preserving language context (e.g., detail page back button going to `/en/` instead of `/ja/`)
- **Solution**: Use `href="{/${language}/}"` instead of `href="/"` in all navigation components
- **Implementation**: Extract current language using `usePathname()` and `getLocaleFromPathname()` for client components

## Development Priorities

### High Priority (Immediate)
1. **GraphQL Query Optimization**: Implement selective data loading strategy
   - **SSG Build Time**: Full data queries (name, image, type, classification, descriptions, moves, evolution chains, game history)
   - **Runtime Site Browsing**: Lightweight queries (name, image, type, classification only)
   - **Staged Loading**: Progressive data loading for enhanced user experience
   - **Server Context Detection**: Environment-based query routing (BUILD_MODE=ssg vs BUILD_MODE=runtime)
2. **Test Suite Implementation**: Unit tests, integration tests, E2E tests (currently no tests exist)
3. **Environment Configuration**: Create actual .env files from .env.example templates
4. **Error Boundaries**: React error boundaries for graceful error handling
5. **Accessibility Features**: ARIA labels, keyboard navigation, screen reader support

### Medium Priority (Next Phase)
6. **Pokemon Breeding Information**: Egg groups, breeding compatibility, egg moves, hatching steps
7. **Pokemon Location/Habitat Information**: Game location data, encounter rates, habitat descriptions
8. **Pokemon Comparison Feature**: Side-by-side stat comparison between Pokemon
9. **Pokemon Cry/Sound Playback**: Audio playback functionality for Pokemon cries
10. **Performance Analysis**: Bundle optimization and monitoring

### Low Priority (Future)
11. **Pokemon Encounter Data**: Enhanced encounter rates and location data from games
12. **Pokemon Team Builder**: Team composition and strategy tools
13. **PWA Implementation**: Service worker, offline support, app manifest
14. **Advanced Type Effectiveness**: Damage calculator with move interactions

## Implementation Status

### ✅ Fully Implemented
- **Complete Pokemon Detail Pages**: 2-column layout matching reference design with:
  - Large Pokemon image with type-colored background aura
  - Unified information panel with Weaknesses, Story, Versions, Stats
  - Normal/Shiny sprite toggle with functional state management
  - Type effectiveness calculation and weakness display
  - Mobile-responsive design with vertical evolution chains
  - Previous/Next navigation arrows (hidden on mobile and variants)
- **GraphQL Backend**: Complete Apollo Server with cursor-based pagination and extended schema
- **Advanced Filtering**: Search, type filters, generation filters with auto-loading
- **State Management**: Redux Toolkit with proper error handling and deduplication
- **Responsive UI**: Complete component library with Ruby/Sapphire theming
- **Infinite Scroll**: Optimized with Intersection Observer and debouncing
- **Native App Router i18n**: Complete English/Japanese implementation with:
  - Middleware-based language detection and automatic routing (/en/, /ja/)
  - Server-side dictionary loading for optimal performance (no client bundles)
  - Complete filter system multilingual support (FilterModal, TypeFilter, GenerationFilter)
  - GraphQL-based multilingual data integration with PokeAPI for abilities and moves
  - Japanese Pokemon names for all generations via species data
  - Japanese move names with 3-tier priority system (GraphQL → manual → English fallback)
  - Japanese ability names with 3-tier priority system
  - Evolution item translations and refined detail page Japanese text
  - 309 static pages generated (154 Pokemon × 2 languages + base pages)
  - SEO-optimized with proper hreflang and language-specific metadata
  - Mega Evolution naming conventions (メガリザードンX format)
- **Variant Pokemon Support**: Standardized display for Pokemon variants including:
  - Regional variants (Alolan, Galarian, Hisuian, Paldean) with base species ID display
  - Mega Evolution forms with proper Japanese naming (メガポケモン名 format)
  - Gigantamax forms with distinct styling
  - Form translation system with 40+ form translations
  - Enhanced evolution chains with form display and navigation
  - Navigation arrows hidden for variant forms to prevent confusion
- **Image Optimization**: Next.js Image with fallbacks, lazy loading, and size variants
- **Rich Data Display**: Moves with detailed statistics, Pokedex entries, game history, sprites gallery
- **SEO Optimization**: Pokemon-specific meta tags, Open Graph, Twitter Cards with rich descriptions
- **Component Architecture**: Modular, maintainable components with clean separation of concerns

### ⚠️ Partially Implemented
- **Error Handling**: Basic error states exist but no error boundaries
- **Performance**: Good optimization but no bundle analysis or monitoring

### ❌ Missing
- **Testing**: No test suite exists (Jest, React Testing Library, Cypress needed)
- **Production Config**: Environment files need to be created from examples
- **Error Boundaries**: React error boundaries for graceful error handling

## External APIs

- **PokeAPI**: Primary data source for Pokemon information (v2 API)
- **Redis Cache**: Server-side caching for Pokemon basic data and species information (5-minute TTL)
- **GraphQL Server**: Custom Apollo Server wrapper with intelligent caching strategy
- **Apollo Client Cache**: Browser-side caching for efficient data management
- **Progressive Loading**: Automatic background loading with visual progress indicators

### Pokemon Form Variations Implementation (January 2025)
- **Complete Form Support**: Added comprehensive Pokemon form variation support to evolution chains
- **Backend Enhancements**:
  - Extended GraphQL schema with PokemonForm, PokemonVariety, and FormVariant types
  - Enhanced Pokemon service to fetch and classify form variations from PokeAPI
  - Added form detection helpers for regional variants, Mega Evolution, and Gigantamax
  - Integrated form data into evolution chain transformations
- **Frontend Features**:
  - Created formUtils.ts with 40+ form translations (English/Japanese)
  - Enhanced PokemonEvolutionChain component with form variant display
  - Added compact form cards with images, types, and category badges
  - Implemented clickable navigation between base and variant forms
  - Added horizontal scrollable layout for complex evolution trees
- **Form Categories Supported**:
  - Regional variants: Alolan, Galarian, Hisuian, Paldean forms
  - Mega Evolution: Mega, Mega X, Mega Y variants
  - Gigantamax: G-Max forms with distinct styling
  - Special forms: Primal, Origin, Therian, and other unique variants
- **User Experience**:
  - Visual form indicators with color-coded badges
  - Multilingual form names and categories
  - Type visualization for each form
  - Seamless navigation between forms and base Pokemon

### Move Data Enhancement Implementation (June 2025)
- **Comprehensive Move Statistics**: Enhanced move display with Generation 9 compatible data
- **Backend Enhancements**:
  - Extended GraphQL schema with detailed move properties (type, damageClass, power, accuracy, pp)
  - Enhanced Pokemon service to fetch comprehensive move data from PokeAPI
  - Updated type definitions for both server and client with detailed move statistics
  - Fixed nullable flavor text handling for improved data reliability
- **Frontend Enhancements**:
  - Redesigned PokemonMoves component with enhanced 5-column grid layout
  - Added move type visualization with official Pokemon type colors
  - Implemented damage class categorization with bilingual support
  - Removed version group information for cleaner, focused display
  - Added responsive design optimized for both desktop and mobile viewing
- **Move Statistics Displayed**:
  - Move name and learning level (for level-up moves)
  - Type with color-coded badges using official Pokemon type colors
  - Damage class: Physical (物理), Special (特殊), Status (変化)
  - Power rating (Generation 9 compatible)
  - Accuracy percentage
  - PP (Power Points) available
- **User Experience Improvements**:
  - Simplified interface focused on core move statistics
  - Maintained tabbed organization by learn method
  - Enhanced visual hierarchy with improved spacing and typography
  - Bilingual damage class labels for international users
  - Responsive grid layout adapting to screen size

### Header Navigation Enhancement (June 2025)
- **Conditional Display Logic**: Enhanced Header component with context-aware visibility
- **Implementation Details**:
  - Added pathname detection to identify Pokemon detail pages (`/[lang]/pokemon/[id]`)
  - Conditionally hide search bar and filter button on detail pages
  - Maintain language toggle functionality across all pages (removed theme toggle)
  - Preserve responsive layout and visual consistency
- **User Experience Improvements**:
  - Cleaner detail page layout focused on Pokemon information
  - Reduced cognitive load by removing irrelevant navigation elements
  - Maintained essential navigation controls (language switching)
  - Consistent header height and spacing across page types

### Card List Page Enhancements (June 2025)
- **FilterButton Width Stabilization**: Fixed layout shifts when switching between languages
- **Implementation Details**:
  - Fixed FilterButton width to `w-36` (144px) to accommodate Japanese "フィルター" text
  - Prevents text wrapping and layout shifts when switching between English and Japanese
  - Maintains consistent button sizing across language contexts
- **Pokemon Card Enhancements**:
  - **Removed cluttered information**: Eliminated height, weight, and HP display from cards for cleaner appearance
  - **Added type-based background**: Applied subtle 10% opacity primary type color background matching detail page styling
  - **Added species classification**: Integrated Pokemon genus display (e.g., "たねポケモン", "しんかポケモン") with bold text styling
  - **Enhanced GraphQL query**: Extended `GET_POKEMONS` query to include `species.genera` field for classification data
- **User Experience Improvements**:
  - Cleaner, less cluttered card design focused on essential information
  - Consistent visual theming between list and detail views
  - Enhanced information hierarchy with species classification
  - Stable layout preventing jarring transitions during language switching
- **Technical Implementation**:
  - Path-based conditional rendering using Next.js usePathname hook
  - Clean separation of navigation concerns per page type
  - Streamlined Redux state management for UI controls

### Language State Synchronization Fix (June 2025)  
- **Page Reload Language Issue**: Fixed Japanese language display reverting to English after page reload at `/ja` URLs
- **Root Cause**: Redux store initializing with default English language state, not syncing with server-side language parameter
- **Implementation Details**:
  - Added language synchronization logic in `PokemonListClient` component
  - Implemented `useEffect` hook to sync server `lang` prop with Redux store language state
  - Ensures consistent language display between server-side routing and client-side state management
- **User Experience Improvements**:
  - Reliable Japanese language persistence across page reloads
  - Consistent language state between initial page load and subsequent interactions
  - Eliminated language state desynchronization issues in multilingual navigation

### Type-Based Background Styling (June 2025)
- **Dynamic Background Colors**: Pokemon detail pages now reflect primary type colors
- **Implementation Details**:
  - Created utility functions in `pokemonUtils.ts` for type color extraction and background generation
  - Added `getPrimaryTypeColor()`, `getTypeColorFromName()`, and `getTypeBackgroundGradient()` functions
  - Implemented subtle gradient backgrounds using primary type colors with proper opacity
  - Applied dynamic styling to `PokemonDetailClient` component for full-page theming
- **Visual Design Features**:
  - Subtle 135-degree gradient from type color (15% opacity) to neutral background
  - Maintains excellent text readability while providing visual type identification
  - Consistent with official Pokemon type color palette
  - Responsive design that works across all screen sizes
- **Technical Implementation**:
  - Type-safe color mapping with fallback to Normal type color
  - DOM manipulation to replace layout container background (removes bg-gray-50, applies type gradient)
  - React useEffect for lifecycle management with proper cleanup on unmount

### GSAP Animated Loading Screen Implementation (June 2025)
- **Professional Loading Experience**: Implemented high-quality animated splash screen using GSAP animation library
- **Pokemon-Themed Design**:
  - High-precision Pokeball SVG with detailed design (outer frame, red top section, center button)
  - Soft pastel gradient background (`from-sky-100 via-blue-100 to-emerald-100`)
  - Floating particle animation using CSS keyframes for ambient movement
  - Multilingual loading text support (English: "Loading Pokédex...", Japanese: "ポケモン図鑑を読み込み中...")
- **GSAP Animation Timeline**:
  - Pokeball entrance with bounce effect and 360° rotation animation
  - Text entrance with back.out easing for dynamic appearance
  - Staggered loading dots with pulsing scale animation
  - Smooth fade-out with scale effect (opacity: 0, scale: 1.1) on completion
- **Performance Optimizations**:
  - Shows only during initial data load (first 20 Pokemon cards)
  - Automatically transitions to main content when data is ready
  - Proper cleanup of GSAP timelines to prevent memory leaks
  - Blue particle system with 60% opacity for visibility against light background
- **User Experience**:
  - Eliminates jarring "No Pokemon found" → skeleton → content transition
  - Creates anticipation and polish for first-time visitors
  - Maintains consistent branding with Pokemon theme throughout loading process
  - Responsive design works across all device sizes

### Netflix-Style Page Transition Animation (June 2025)
- **Professional Page Transitions**: Implemented cinematic page transition animation using GSAP for Pokemon detail navigation
- **Dynamic Pokemon Type Colors**:
  - First layer uses clicked Pokemon's primary type color for personalized experience
  - Subsequent layers use randomized Pokemon type colors (no duplicates) for variety
  - 18 different type colors available from official Pokemon type palette
  - Every transition creates unique color combinations while maintaining Pokemon authenticity
- **Netflix-Inspired Animation Flow**:
  - Sequential layer animation with smooth exponential easing (`expo.out`/`expo.in`)
  - Each color layer slides up from bottom, covers screen, then exits upward
  - Overlapping transitions (-=0.3s timing) for seamless color flow
  - Final layer remains and fades out after page transition completes
- **Technical Excellence**:
  - GSAP timeline with optimized easing curves for professional feel
  - Proper memory management with automatic DOM element cleanup
  - Error handling for interrupted animations and component unmounting
  - Responsive full-screen coverage (100vw × 100vh) on all devices
- **User Experience Enhancement**:
  - Smooth transition eliminates jarring page changes typical in SPAs
  - Color-coded connection between Pokemon cards and their detail pages
  - 2-3 second cinematic experience that feels premium and polished
  - Maintains user engagement during navigation with beautiful visual feedback
  - Fixed function call issue in `getPrimaryTypeColor()` to properly use `getTypeColorFromName()`
  - Preserves existing component architecture and styling
  - Compatible with existing card designs and text contrast requirements
- **User Experience Improvements**:
  - Enhanced visual immersion with type-themed pages
  - Instant visual type recognition upon page load
  - Maintains usability and accessibility standards
  - Seamless integration with existing design system
- **Bug Fixes**:
  - ✅ Fixed type color function error where `getPrimaryTypeColor` was incorrectly checking `TYPE_TRANSLATIONS` instead of calling `getTypeColorFromName`
  - ✅ Fixed CSS color format issue where hex colors with opacity suffixes weren't recognized by browsers
  - ✅ Converted to proper RGBA format using `hexToRgba()` helper function for cross-browser compatibility
  - ✅ Removed conflicting dark mode CSS that was overriding type-based backgrounds
  - ✅ Eliminated entire dark mode system including UI components and Redux state
  - ✅ Verified correct type colors are generated (e.g., water: rgba(104, 144, 240, 0.15), grass: rgba(120, 200, 80, 0.15))
  - ✅ Removed debug console.log statements from production code

### Enhanced SEO and Metadata (June 2025)
- **Pokemon-Specific Meta Tags**: Each Pokemon detail page now has rich, unique metadata
- **Implementation Details**:
  - Enhanced title format: `{{name}} (#{{id}}) - {{type}} Pokémon | Pokédex`
  - Rich descriptions including stats, Pokemon description, and physical characteristics
  - SEO-optimized keywords with Pokemon name, type, and generation
  - Comprehensive Open Graph and Twitter Card metadata
  - Multi-language metadata support (English/Japanese)
- **Metadata Features**:
  - Pokemon stats integration (HP, Attack, Defense) in descriptions
  - Pokemon description snippets from flavor text
  - Official artwork images for social media sharing
  - Canonical URLs and language alternates for SEO
  - Proper locale settings and robot directives
- **SEO Improvements**:
  - Individual page titles with Pokemon ID and type information
  - Rich snippets with Pokemon characteristics and stats
  - Social media optimized with high-quality Pokemon artwork
  - Multi-language SEO with proper hreflang implementation
  - Search engine friendly metadata structure

### Enhanced Sprites Gallery (June 2025)
- **Comprehensive Sprite Collection**: Expanded sprite display with 8+ different categories
- **Sprite Categories**:
  - Official Artwork (default and shiny variants)
  - Pokémon HOME sprites (including female variants)
  - Dream World artwork
  - Pokémon Showdown sprites (front/back, normal/shiny)
  - Game sprites (default front/back, shiny, female variants)
  - Animated Generation V sprites (Black/White with movement)
  - Generation VI X/Y sprites
  - Generation VII icons
- **Interactive Filtering**: Tab-based category selection for organized sprite browsing
- **Responsive Layout**: Adaptive grid system based on sprite category
  - Large format for official artwork (192px)
  - Medium format for animated sprites (128px)
  - Compact format for game sprites and icons (96px)
- **Enhanced User Experience**:
  - Multi-language category labels (English/Japanese)
  - Optimized image loading with Next.js Image component
  - Support for animated GIFs (unoptimized for animation preservation)
  - Fallback messaging for empty categories
- **Technical Implementation**:
  - Extended TypeScript interfaces for comprehensive PokeAPI sprite support
  - Dynamic sprite collection and categorization system
  - Client-side filtering with React state management
  - Proper image sizing and alt text for accessibility

### Integrated Hero Section Enhancement (June 2025)
- **Comprehensive Pokemon Overview**: Consolidated stats, genus, and description into unified hero section
- **Enhanced Layout**:
  - Two-column responsive design (Physical Stats & Abilities / Base Stats)
  - Genus badge displayed alongside Pokemon ID for immediate classification
  - Main description integrated directly below Pokemon name and types
  - Battle stats with visual progress bars and color-coded stat types
- **Improved Information Architecture**:
  - Removed redundant separate sections for Stats and Description
  - Consolidated all essential Pokemon information in single, scannable view
  - Better visual hierarchy with organized stat groupings
- **Visual Enhancements**:
  - Color-coded stat bars (HP: red, Attack: orange, Defense: blue, etc.)
  - Compact stat display with right-aligned labels for better readability
  - Integrated genus classification badge with Pokemon ID
  - Responsive design adapting from single to two-column layout
- **User Experience Improvements**:
  - Reduced page scrolling by consolidating information
  - All essential Pokemon data visible in hero section
  - Cleaner page structure with fewer separate sections
  - Better mobile experience with responsive stat layout

### Enhanced Descriptions Section (June 2025)
- **Restored Historical Descriptions**: Brought back comprehensive descriptions section with enhanced design
- **Dual Display Strategy**:
  - Latest description in hero section for immediate context
  - Comprehensive historical descriptions in dedicated section
- **Enhanced Description Display**:
  - Latest description highlighted with blue accent styling
  - All historical descriptions from different game versions
  - Version-specific information with game version names
  - Hover effects and improved visual hierarchy
- **Improved Information Organization**:
  - Clear separation between current and historical descriptions
  - Game version attribution for each description
  - Sequential numbering for easy reference
  - Responsive card-based layout for better readability
- **User Experience Enhancements**:
  - Easy comparison between different game descriptions
  - Complete historical context for Pokemon lore
  - Improved visual design with borders and spacing
  - Multi-language support maintained throughout

### Tabbed Detail Interface (June 2025)
- **Unified Detail Sections**: Consolidated Description, Moves, and Game History into single tabbed interface
- **Enhanced User Experience**:
  - Tab-based navigation with visual icons (📖 Description, ⚔️ Moves, 🎮 Game History)
  - Item count badges showing number of entries per tab
  - Active tab highlighting with blue accent colors
  - Smooth transitions and hover effects
- **Improved Page Structure**:
  - Maintained separate components: Hero Section, Evolution Chain, Sprites & Artwork
  - Consolidated related information into logical groupings
  - Reduced vertical scrolling with tabbed content organization
- **Smart Content Management**:
  - Dynamic tab availability based on data presence
  - Automatic default tab selection to first available content
  - Consistent styling across all tab content areas
- **Technical Implementation**:
  - React state management for tab switching
  - Responsive tab layout adapting to screen size
  - Preserved individual component functionality within tab system
  - Clean separation between persistent and tabbed content sections

### Pokemon Detail Page Redesign Analysis (June 2025)
- **Reference Design Analysis**: Completed comprehensive analysis of target design layout
- **Current vs Target Layout Comparison**:
  - **Structure**: Vertical layout → Horizontal 2-column layout (left: large Pokemon image, right: info panel)
  - **Information Density**: Distributed sections → Consolidated right-side information panel
  - **Navigation**: Bottom tabs → Top fixed navigation tabs (About, Moves, Episodes, Cards)
  - **Evolution Chain**: Vertical arrangement → Horizontal display at bottom
  - **Visual Hierarchy**: Separated sections → Unified information panel design
- **Key Design Elements Identified**:
  - Large Pokemon image with navigation arrows (left 60%)
  - Consolidated info panel with sections: Weaknesses, Story, Versions, basic info, Stats (right 40%)
  - Clean header with Pokemon name, ID, and type badges
  - Type effectiveness (Weaknesses) display
  - Normal/Shiny version toggle functionality
  - Horizontal evolution chain at bottom
- **Implementation Strategy Defined**:
  - Implement 2-column responsive layout
  - Create unified right-side information panel
  - Add top navigation tab system
  - Implement type effectiveness calculation
  - Add Normal/Shiny sprite switching capability

### Hero Section Redesign Implementation (June 2025)
- **Complete Layout Transformation**: Implemented 2-column horizontal layout matching reference design
- **Left Column (60%)**:
  - Large Pokemon image display (384x384px) with proper scaling
  - Prepared space for navigation arrows (to be implemented)
  - Centered positioning for optimal visual impact
- **Right Column (40%)**:
  - Unified information panel with clean white background and rounded corners
  - Pokemon name and ID prominently displayed in header
  - Type badges integrated below name
  - Structured sections: Weaknesses (placeholder), Story, Versions, basic info grid, Stats
- **Information Panel Sections**:
  - **Header**: Pokemon name with ID, type badges
  - **Weaknesses**: Placeholder for type effectiveness (to be implemented)
  - **Story**: Pokemon description text with improved typography
  - **Versions**: Normal/Shiny toggle buttons (styled, functionality pending)
  - **Basic Info Grid**: Height, Category, Gender, Weight, Abilities in 3-column layout
  - **Stats**: Compact stat bars with reference design colors (red/green scheme)
- **Visual Design Improvements**:
  - Full-screen layout with gray background matching reference
  - Clean white information panel with subtle shadows
  - Improved typography hierarchy and spacing
  - Color-coded stat bars with consistent scaling (max 150 for reference)
- **Technical Implementation**:
  - Responsive grid system (5-column layout: 3+2)
  - Updated page structure removing old container constraints
  - Preserved existing component functionality while changing layout
  - Maintained multilingual support throughout redesigned interface

### Enhanced Right-Side Information Panel (June 2025)
- **Type Effectiveness Implementation**: Added comprehensive weakness calculation system
  - Created type effectiveness chart covering all 18 Pokemon types
  - `getPokemonWeaknesses()` function calculates weaknesses from Pokemon's type combination
  - Visual weakness badges with official Pokemon type colors
  - Multilingual weakness display (English/Japanese type names)
  - Hover effects and proper color-coded indicators
- **Normal/Shiny Version Toggle**: Implemented functional sprite switching
  - `getPokemonSpriteUrl()` function for dynamic sprite URL generation
  - React state management for Normal/Shiny toggle
  - Visual button states with color-coded active/inactive styling
  - Smooth image transitions with opacity effects
  - Fallback chain: Official Artwork → HOME sprites → default sprites → placeholder
- **Enhanced Abilities Display**: Improved ability information presentation
  - Support for multiple abilities (up to 2 displayed)
  - Hidden ability detection and special styling
  - Multilingual ability names using existing translation system
  - Visual indicators for hidden abilities with yellow accent
- **CSS Type Color System**: Added comprehensive type color support
  - CSS custom properties for all 18 Pokemon types in globals.css
  - `getTypeColorFromName()` utility function for consistent color application
  - Type badge hover effects and transitions
  - Proper color accessibility and contrast ratios
- **Technical Enhancements**:
  - Extended pokemonUtils.ts with type effectiveness calculations
  - React useState for shiny toggle state management
  - Next.js Image optimization for sprite display
  - Maintained existing component architecture while adding functionality
  - Preserved multilingual support across all new features
- **User Experience Improvements**:
  - Interactive type weakness visualization
  - Functional Normal/Shiny sprite comparison
  - Enhanced ability information with hidden ability indicators
  - Smooth transitions and hover effects throughout interface
  - Consistent visual hierarchy and spacing

### Background Color Adjustment (June 2025)
- **Removed Full-Page Type Background**: Eliminated global type-based background gradient for cleaner design
  - Removed DOM manipulation and useEffect background styling in PokemonDetailClient
  - Restored clean gray background (bg-gray-50) for overall page layout
  - Cleaned up unused imports and background gradient utilities
- **Added Localized Pokemon Image Background**: Implemented subtle type-colored aura around Pokemon illustration
  - Multiple layered circular background elements with type-based coloring
  - Graduated opacity levels (20% outer blur, 10% inner circle) for subtle effect
  - Blur and scale effects to create soft, glowing aura behind Pokemon image
  - Z-index layering to ensure Pokemon image displays above background effects
- **Technical Implementation**:
  - `getPrimaryTypeColor()` function for consistent type color application
  - CSS positioning with absolute layers and transform effects
  - Maintained responsive design and proper image optimization
  - Clean separation of global layout and localized effects
- **Visual Design Improvements**:
  - Focused attention on Pokemon illustration with subtle type-themed backdrop
  - Maintained readability and clean design aesthetic
  - Reduced visual noise while preserving type identity
  - Better visual hierarchy with concentrated color effects

### Top Navigation Tabs Implementation (June 2025)
- **Reference Design Compliance**: Implemented fixed top navigation tabs matching reference design layout
  - Created `PokemonTopNavigationTabs` component with sticky header navigation
  - Four main tabs: About, Moves, Description, Game History
  - Active tab highlighting with blue accent colors and background
  - Tab availability detection based on data presence for all tabs
- **Complete Content Integration**: Reorganized all Pokemon detail content under tab structure
  - **About Tab**: Contains hero section, evolution chain, and sprites gallery
  - **Moves Tab**: Full integration of existing PokemonMoves component with detailed statistics
  - **Description Tab**: Dedicated tab for Pokemon descriptions and flavor text entries
  - **Game History Tab**: Complete game appearance history across all generations
- **Improved Navigation Architecture**:
  - Sticky top navigation bar with z-index layering for persistent access
  - Tab availability detection based on data presence (e.g., moves tab only appears if Pokemon has moves)
  - Smooth tab switching with consistent content layout
  - Multilingual tab labels (English/Japanese)
- **Technical Implementation**:
  - React state management for active tab tracking
  - Content rendering optimization with conditional component loading
  - Responsive design maintained across all tab content
  - Clean separation of concerns between navigation and content components
- **User Experience Improvements**:
  - Persistent navigation access while scrolling through content
  - Clear visual indication of current tab and available options
  - Organized content structure following reference design patterns
  - Seamless integration with existing Pokemon detail functionality

### Enhanced Evolution Chain Implementation (June 2025)
- **Improved Original Design**: Enhanced existing evolution chain with better positioning and styling
  - Repositioned evolution chain between Hero Section and Sprites Gallery for logical content flow
  - Changed title from "Evolutions" to "Evolution Chain" for better clarity
  - Increased Pokemon card size from 96px to 112px for better visibility
  - Updated background styling with lighter colors and subtle shadows
- **Collapsible Form Variations**: Implemented smart form display management
  - Added collapsible form sections to reduce visual clutter
  - Show/Hide Forms button with form count indicator
  - Expandable interface maintains detailed form information while keeping clean appearance
  - State management for individual Pokemon form expansion
- **Enhanced Visual Design**:
  - Improved card styling with gray background and hover effects
  - Better shadow and border treatments for modern appearance
  - Upgraded form cards with white backgrounds for better contrast
  - Maintained all existing functionality while improving aesthetics
- **Better Content Organization**:
  - Logical placement between basic info and detailed content
  - Preserved comprehensive evolution and form information
  - Improved user experience with progressive disclosure of form details
  - Maintained multilingual support throughout interface
- **Technical Improvements**:
  - React useState for form expansion state management
  - Enhanced hover states and transitions
  - Removed unused compact component for cleaner codebase
  - Maintained TypeScript compliance and proper component architecture

### Previous/Next Pokemon Navigation Implementation (June 2025)
- **Page-Side Navigation Arrows**: Implemented fixed navigation arrows on page sides
  - Navigation arrows positioned at left-4 and right-4 with fixed positioning at page center
  - Removed white background styling for cleaner appearance matching reference design
  - Smaller arrow size (w-4 h-4) for more subtle navigation experience
  - Pokemon ID numbers displayed above arrows with 3-digit padding format
  - Pokemon names displayed below arrows with truncation for long names
- **Circular Navigation Logic**: Implemented seamless Pokemon browsing
  - Helper function `getPrevNextPokemonId()` for ID calculation
  - Automatic loop from Pokemon #1025 back to #1 (and vice versa)
  - Support for full Pokemon database navigation
- **Pokemon Name Display**: Added Pokemon name mapping for navigation
  - Helper function `getPokemonNameById()` with common Pokemon names
  - Fallback to generic "Pokemon #X" format for unmapped Pokemon
  - Truncated names with max-w-16 for consistent layout
- **Technical Implementation**:
  - Fixed positioning with z-30 index for proper layering
  - Vertical flex layout with center alignment for arrow content
  - Type-safe ID conversion from string to number
  - Link integration with Next.js routing and language support
  - SVG icons for consistent arrow styling with hover state transitions
- **User Experience Improvements**:
  - Non-overlapping navigation that doesn't interfere with Pokemon image
  - Clear visual hierarchy with ID, arrow, and name display
  - Smooth hover effects with scale and color transitions
  - Responsive design maintaining functionality across screen sizes
  - Centered position indicator in right panel for current Pokemon location

### Clean Design Styling Implementation (June 2025)
- **Enhanced Visual Hierarchy**: Improved overall color scheme and styling for cleaner appearance
  - Replaced heavy shadow-lg with subtle shadow-sm throughout the interface
  - Added consistent border-gray-100 borders for better visual definition
  - Reduced padding on main content grid from px-20 to px-16 for better balance
- **Information Panel Improvements**: Refined right-side panel styling
  - Enhanced weakness badges with improved padding (py-1.5) and hover effects
  - Added background styling to Story section with bg-gray-50 and rounded corners
  - Upgraded Version toggle buttons with better shadow and hover states
  - Improved basic info grid with subtle bg-gray-50 background
  - Enhanced stat bars with increased height (h-2) and shadow-sm effects
- **Navigation and Content Styling**: Cleaner tab and navigation appearance
  - Top navigation tabs with enhanced shadow-sm and transition-all duration-200
  - Improved border styling from border-gray-200 to border-gray-100
  - Consistent shadow-sm application across all content containers
  - Better visual separation between content sections
- **Evolution Chain Refinements**: Enhanced evolution display with cleaner styling
  - Evolution condition badges with subtle bg-blue-50 and border styling
  - Main Pokemon cards with white backgrounds instead of gray-50

### Evolution Chain Bug Fix (June 2025)
- **GraphQL Query Depth Issue Resolution**: Fixed missing evolution conditions in third-level evolution chains
  - **Problem**: Evolution conditions showing "Unknown" for Ivysaur → Venusaur despite correct API data
  - **Root Cause**: Main GraphQL query in `/client/graphql/queries.ts` missing `evolutionDetails` field for third-level `evolvesTo` section
  - **Investigation**: Created debugging API routes (`/api/pokemon/[id]` and `/api/evolution/[id]`) to compare data
  - **Solution**: Added missing `evolutionDetails` field to third-level evolution query (lines 409-453)
- **Technical Implementation**:
  - Extended GraphQL query to include complete evolution condition data for all chain levels
  - Added full evolution details schema (minLevel, item, trigger, timeOfDay, location, etc.) to third evolution stage
  - Removed debug console.log statements after successful fix
  - Ensured query structure matches API route implementation for consistency
- **User Experience Improvement**:
  - Evolution conditions now display correctly for all evolution chains
  - Bulbasaur → Ivysaur shows "Level 16" 
  - Ivysaur → Venusaur now correctly shows "Level 32" instead of "Unknown"
  - Complete evolution chain data available for all 3-stage Pokemon evolution lines

### Japanese Pokemon Names in Evolution Chains (June 2025)
- **GraphQL Schema Enhancement**: Extended evolution chain queries to include species data for multilingual name support
  - **Problem**: Evolution chains displayed English Pokemon names even in Japanese mode (e.g., "Chansey" instead of "ラッキー")
  - **Root Cause**: EvolutionDetail objects only contained basic name field without multilingual species data
  - **Solution**: Added species.names field to all evolution chain levels in GraphQL query
- **Server-Side Integration**: Leveraged existing GraphQL server species data support
  - **Query Extensions**: Added species field to 1st, 2nd, and 3rd evolution stages in GET_POKEMON query
  - **Type Safety**: Extended EvolutionDetail TypeScript interface to include optional species field
  - **Data Structure**: Utilizes same species.names structure as individual Pokemon details
- **Component Enhancement**: Implemented intelligent name resolution for evolution chains
  - **Function**: Added getEvolutionPokemonName() utility function in PokemonEvolutionChain component
  - **Language Detection**: Supports 'ja' and 'ja-Hrkt' language codes for Japanese name lookup
  - **Fallback Logic**: Gracefully falls back to capitalized English names when Japanese names unavailable
  - **Consistent Integration**: Uses same name resolution pattern as main Pokemon detail displays
- **Comprehensive Coverage**: All generations now display correct Japanese names in evolution chains
  - **Generation 1**: フシギダネ → フシギソウ → フシギバナ (Bulbasaur → Ivysaur → Venusaur)
  - **Generation 2**: ラッキー → ハピナス (Chansey → Blissey)
  - **All Generations**: Proper Japanese names for Pokemon from all 9 generations
  - **Evolution Items**: Japanese item names (かみなりのいし, ほのおのいし, etc.) combined with Japanese Pokemon names
- **Technical Implementation**:
  - **Data Source**: Pokemon names sourced directly from PokeAPI species data via GraphQL
  - **No Hardcoding**: Eliminated need for client-side Pokemon name translation mappings
  - **Performance**: Minimal additional data transfer due to existing species data infrastructure
  - **Maintainability**: Automatic support for new Pokemon as they're added to PokeAPI database

### GraphQL-Based Japanese Move Names Implementation (June 2025)
- **Complete Server-Side Integration**: Extended GraphQL schema and service layer for multilingual move names
  - **Problem**: Move names displayed in English only, requiring extensive manual translation maintenance
  - **Root Cause**: GraphQL Move type lacked multilingual names field despite PokeAPI providing this data
  - **Solution**: Added comprehensive GraphQL schema and service integration for move names
- **GraphQL Schema Enhancement**: Added native multilingual move name support
  - **Schema Extension**: Added `names: [MoveName!]!` field to Move type definition
  - **Type Definition**: Created MoveName type with name and language fields
  - **Pattern Consistency**: Follows existing multilingual patterns (MoveDamageClass.names, MoveTarget.names)
- **Server-Side Service Integration**: Enhanced Pokemon service to fetch and transform move names
  - **Data Source**: Leverages existing PokeAPI move details endpoint for comprehensive name data
  - **Service Enhancement**: Updated transformMoves() method to map PokeAPI names array to GraphQL structure
  - **TypeScript Integration**: Extended Move and MoveName interfaces in server types
  - **Performance Optimization**: No additional API calls required (utilizes existing move detail fetching)
- **Client-Side Integration**: Enhanced client to prioritize GraphQL data over manual translations
  - **Query Extension**: Added names field to GraphQL move queries
  - **Type Safety**: Updated client-side Move interface to include names array
  - **Intelligent Resolution**: Enhanced getMoveName() function with 3-tier priority system:
    1. GraphQL API data (ja, ja-Hrkt for Japanese; en for English)
    2. Manual translation table fallback (150+ moves)
    3. Formatted English name as final fallback
- **Comprehensive Coverage**: Complete Japanese move name support for all generations
  - **Scale**: Supports ~900 Pokemon moves vs 150 manual translations
  - **Accuracy**: Official PokeAPI Japanese names ensure authenticity
  - **Compatibility**: Maintains backward compatibility with existing manual translation table
  - **Examples**: "tackle" → "たいあたり", "thunderbolt" → "10まんボルト", "flamethrower" → "かえんほうしゃ"
- **Technical Implementation**:
  - **Data Flow**: PokeAPI → GraphQL Service → Client Query → UI Display
  - **Fallback Strategy**: Graceful degradation ensures no missing move names
  - **Future-Proof**: Automatic support for new moves added to PokeAPI
  - **Maintainability**: Eliminates need for extensive manual translation maintenance

### Responsive Design Mobile Optimization (June 2025)
- **Mobile Navigation Adjustments**: Optimized page-side navigation for smaller screens
  - Navigation arrows positioned at left-2 md:left-4 and right-2 md:right-4 for mobile spacing
  - Reduced arrow size from w-4 h-4 to w-3 h-3 on mobile with md:w-4 md:h-4 breakpoint
  - Compressed navigation text spacing with gap-1 md:gap-2 for better mobile layout
  - Reduced Pokemon name width from max-w-16 to max-w-12 md:max-w-16 for mobile fit
- **Content Grid Responsive Layout**: Enhanced main content grid for mobile devices
  - Reduced padding from p-8 px-16 to p-4 md:p-8 px-4 md:px-16 for mobile optimization
  - Adjusted gap spacing from gap-8 to gap-4 md:gap-8 for better mobile content flow
  - Pokemon image size optimization: w-72 h-72 md:w-96 md:h-96 for mobile screens
  - Basic info grid changed from 3-column to 2-column md:3-column layout for mobile
- **Evolution Chain Mobile Optimization**: Improved evolution display on small screens
  - Reduced padding from px-4 to px-2 md:px-4 for better horizontal scrolling
  - Pokemon card size adjustment: w-24 h-24 md:w-28 md:h-28 for mobile visibility
  - Evolution arrow spacing reduced from mx-4 to mx-2 md:mx-4 for compact layout
  - Card padding optimized from p-4 to p-3 md:p-4 for mobile touch targets
- **Navigation Tabs Mobile Enhancement**: Improved top navigation for mobile devices
  - Added overflow-x-auto for horizontal scrolling on narrow screens
  - Reduced tab padding from px-6 py-4 to px-4 md:px-6 py-3 md:py-4
  - Text size adjustment from text-sm to text-xs md:text-sm for mobile readability
  - Added whitespace-nowrap to prevent tab text wrapping on mobile
- **Content Sections Mobile Padding**: Systematic mobile padding optimization
  - All content containers adjusted from px-8 py-8 to px-4 md:px-8 py-4 md:py-8
  - Content cards padding reduced from p-8 to p-4 md:p-8 for mobile screens
  - Consistent responsive spacing throughout all Pokemon detail sections
- **Technical Implementation**:
  - Comprehensive Tailwind CSS responsive breakpoint usage (md:)
  - Mobile-first design approach with progressive enhancement
  - Maintained all functionality while optimizing for touch interface
  - Consistent responsive patterns across all components

### Navigation Logic Enhancement (June 2025)
- **Non-Circular Navigation Implementation**: Removed circular navigation loop behavior
  - Previous Pokemon navigation hidden for Pokemon #001 (first Pokemon)
  - Next Pokemon navigation hidden for Pokemon #1025 (last Pokemon)
  - Navigation helper function updated to return null for boundary conditions
- **Improved Navigation Layout**: Enhanced navigation arrow positioning
  - Pokemon numbers repositioned to the inner side (left of previous arrow, right of next arrow)
  - Horizontal layout for number and arrow combination for better visual balance
  - Simplified navigation by removing Pokemon names, keeping only arrows and ID numbers
- **Type Safety Improvements**: Enhanced TypeScript support for navigation
  - Updated function signatures to handle null values for boundary Pokemon
  - Conditional rendering with proper null checks for navigation arrows
  - Removed unnecessary getPokemonNameById function for cleaner codebase
- **User Experience Enhancement**: More intuitive navigation behavior
  - Clear start and end points for Pokemon browsing experience
  - No unexpected loops from last to first Pokemon or vice versa
  - Consistent navigation pattern matching standard web navigation practices
  - Minimalist design with only essential navigation elements (arrows + ID numbers)

### Pokemon Detail Page Redesign Implementation (June 2025)
- **Complete Reference Design Implementation**: Successfully redesigned Pokemon detail pages based on provided reference design
- **Hero Section Transformation**: Implemented 2-column horizontal layout
  - Left column (60%): Large Pokemon image with type-colored background aura
  - Right column (40%): Consolidated information panel with clean white background
  - Pokemon header moved to left side above image (name, ID, type badges)
  - Type effectiveness (Weaknesses) calculation and display system
  - Normal/Shiny sprite toggle with functional state management
- **Enhanced Information Architecture**: Restructured content organization
  - Unified right-side information panel with Story, Versions, basic info, Stats
  - Stats total display prominently shown with blue accent styling
  - Weaknesses section repositioned above Stats for better visual hierarchy
  - Left-aligned type badges for improved design consistency
- **Top Navigation Tabs System**: Implemented reference design navigation structure
  - Initially implemented with Description/Game History tabs as requested
  - Later consolidated into single About content for streamlined experience
  - Content tabs moved to Sprites Gallery component for better organization
- **Evolution Chain Enhancements**: Improved evolution display and mobile responsiveness
  - Enhanced original design with better positioning between Hero Section and Sprites Gallery
  - Mobile vertical layout implementation with properly oriented arrows
  - Form variations with English Pokemon name capitalization in evolution chains
- **Responsive Mobile Optimization**: Comprehensive mobile design improvements
  - Vertical Evolution Chain layout on mobile with downward-pointing arrows
  - Navigation arrow positioning and sizing optimization for mobile devices
  - Content grid and padding adjustments for mobile touch interface
  - Hidden navigation arrows on mobile screens for cleaner appearance
- **Clean Design Implementation**: Applied consistent styling throughout interface
  - Minimal header design with simplified "Pokedex" text and no background
  - Enhanced shadow and border treatments using shadow-sm and border-gray-100
  - Improved hover states and transition effects for better user interaction
  - Systematic color scheme and visual hierarchy improvements

## Recent Major Updates

### Smart Data Clearing System with Loading Overlay (January 2025)
- **Intelligent Data Management**: Implemented smart data clearing system that eliminates visual flickering during generation switching
- **Smart Clear Logic**: 
  - **Data Comparison**: Compares current Pokemon data with target generation range
  - **Conditional Clearing**: Only clears store when switching to different generation ranges
  - **Performance Optimization**: Preserves data for same-generation operations
  - **Logic**: `needsClearForGeneration()` function checks if first Pokemon ID is outside new generation range
- **Loading Overlay System**:
  - **Visual Continuity**: Displays overlay instead of clearing screen during generation switches
  - **Backdrop Blur**: `bg-white/90 backdrop-blur-sm` maintains visual context while indicating transition
  - **Immediate Feedback**: Shows target generation information and range during loading
  - **Smart Termination**: Overlay disappears as soon as first Pokemon loads (not when all data complete)
- **Redux State Enhancement**:
  - Added `generationSwitching: boolean` flag for precise state management
  - Separate loading states for initial load vs generation switching
  - Enhanced error handling with automatic overlay cleanup
- **User Experience Flow**:
  - **Same Generation**: No flickering, data preserved (e.g., navigating within Generation 1)
  - **Different Generation**: Smooth overlay transition with preserved background content
  - **Empty to Any**: Standard loading screen for initial data fetch
  - **Error Cases**: Automatic overlay dismissal with proper error display
- **Technical Implementation**:
  - **Conditional UI Rendering**: Different loading indicators based on context
  - **State Management**: `generationSwitching` vs `loading` state separation
  - **Performance**: Eliminates unnecessary data destruction and recreation
  - **Memory Efficiency**: Reduces garbage collection from frequent data clearing

### Generation-Based Navigation with URL Parameter Support (January 2025)
- **Comprehensive Generation Navigation System**: Implemented complete URL parameter-based navigation for seamless generation switching
- **URL Parameter Implementation**: 
  - Pokemon card clicks add generation context: `/pokemon/158?from=generation-2`
  - Sidebar generation buttons update URLs: `/?generation=2`
  - Back navigation preserves generation context across all components
  - Evolution chain links maintain generation parameters
  - Sandbox page navigation supports generation context
- **Smart Parameter Management**:
  - URL parameters only added when users actively switch generations via sidebar
  - Initial page load reads generation from URL parameter without forcing updates
  - Generation switching updates URL immediately for bookmarkable links
  - Parameter preservation across detail page navigation (previous/next arrows)
- **Critical Bug Fixes**:
  - **Generation Switching Bug**: Fixed critical issue where wrong generation Pokemon displayed during switching (e.g., #514-#533 showing in Generation 6 instead of #650-#721)
  - **Data Race Condition**: Eliminated setTimeout delays causing Redux store and UI desynchronization
  - **Immediate State Management**: Implemented instant loading state and data clearing to prevent old data display
- **Technical Implementation**:
  - Enhanced `usePokemonList.ts` with immediate data clearing and error handling
  - Added `currentGeneration` to Redux store for state consistency
  - Strict generation range filtering with debug logging
  - UI loading state prevents old generation data display
  - `PokemonBasicInfo.tsx` and `PokemonEvolutionChain.tsx` support parameter preservation
- **User Experience Improvements**:
  - Consistent generation-based navigation across entire application
  - Bookmarkable URLs with generation context
  - No unexpected generation resets or data display issues
  - Seamless navigation between Pokemon within same generation
  - Clear separation between user-initiated and automatic navigation

### Progressive Loading System Redesign (December 2024)
- **Simplified Loading Experience**: Replaced complex infinite scroll system with user-friendly progressive batch loading
- **Problem Solved**: 
  - Complex infinite scroll with Intersection Observer was causing technical issues and user confusion
  - Multiple loading states and footer overlaps were creating poor UX
  - Infinite scroll triggers weren't working reliably across generation switches
- **New Implementation**:
  - **Fast Initial Display**: Initial 20 Pokemon load immediately for quick first impression
  - **Automatic Background Loading**: Remaining Pokemon load automatically after 1.5 second delay
  - **Visual Progress Feedback**: Footer progress indicators show loading status with percentage and progress bars
  - **Clean State Management**: Loading and completion states clearly indicated with color-coded footers
- **Technical Improvements**:
  - **Simplified Hook Logic**: `usePokemonList` now handles progressive loading with `useEffect` automation
  - **Footer Design Restoration**: Returned to original footer design with loading/completion states
  - **Layout Optimization**: Fixed VirtualPokemonGrid to fill entire main area without sidebar overlap
  - **Memory Management**: Removed unused infinite scroll hooks and cleanup code
- **User Experience Benefits**:
  - **Immediate Feedback**: Users see Pokemon cards within seconds of page load
  - **Background Processing**: Remaining Pokemon load transparently without blocking interaction
  - **Clear Progress**: Visual indicators show exactly how many Pokemon are loaded vs total
  - **No Confusion**: Eliminated complex scrolling behaviors that users found unpredictable


### Card Animation System Implementation (June 2025)
- **Particle-Echo-Combo Effect Integration**: Successfully implemented particle-echo-combo animation effect for Pokemon card list
- **Animation Library Enhancement**: Extended existing modular animation system with comprehensive card click effects
  - **Particle Burst**: Type-based particles that burst radially from click position using official Pokemon type colors
  - **Border Echo**: Card border frames that expand outward with proper type-colored styling
  - **Combined Effect**: Seamless integration of both effects with proper timing and layering
- **Position Calculation Fix**: Resolved complex positioning issues in animation system
  - **Grid Container Positioning**: Added automatic `position: relative` setting for grid containers to ensure proper absolute positioning
  - **Click Position Accuracy**: Implemented accurate click position calculation relative to card elements
  - **Transform Compatibility**: Fixed issues with CSS transforms (hover effects) interfering with position calculations
  - **Overflow Handling**: Resolved `overflow-hidden` issues by placing animation elements in grid container instead of card elements
- **Technical Implementation**: 
  - **Unified Coordinate System**: All animation elements use consistent positioning relative to grid container
  - **Memory Management**: Proper cleanup of animation elements with GSAP timeline completion handlers
  - **Type Safety**: Enhanced TypeScript support for animation configuration objects
  - **Error Handling**: Added fallback mechanisms and warning systems for missing required elements
- **Build System**: Successfully compiled production build with 311 static pages generated
  - **Code Quality**: Resolved all ESLint and TypeScript errors for production deployment
  - **Performance**: Maintained optimal bundle sizes with First Load JS under 204KB for main pages
  - **Static Generation**: All Pokemon detail pages and multilingual content properly generated

### Data File Separation Refactoring (June 2025)
- **Complete Translation Data Organization**: Separated all large translation objects from utility files into dedicated data files
- **File Structure Enhancement**: Created organized `client/lib/data/` directory with individual files:
  - **abilityTranslations.ts**: 55+ Pokemon abilities in English/Japanese
  - **moveTranslations.ts**: 150+ Pokemon moves in English/Japanese  
  - **versionTranslations.ts**: Game version translations for all generations
  - **typeEffectiveness.ts**: Type weakness chart for battle calculations
  - **moveLearnMethodTranslations.ts**: Move learning method translations
  - **statTranslations.ts**: Pokemon stat name translations
  - **typeTranslations.ts**: Pokemon type name translations
  - **itemTranslations.ts**: Evolution item translations (stones, trade items, etc.)
- **Code Organization Improvements**: 
  - Removed ~350 lines of inline translation data from pokemonUtils.ts
  - Eliminated duplicate gameNames object from PokemonGameHistory.tsx
  - Centralized all translation data with consistent import patterns
  - Enhanced maintainability by separating data from logic
- **Component Updates**: Updated all components to use centralized translation files:
  - PokemonEvolutionChain.tsx now imports ITEM_TRANSLATIONS
  - PokemonGameHistory.tsx refactored to use VERSION_TRANSLATIONS
  - All utility functions updated with proper imports and type safety
- **Build Verification**: All 309 static pages generate successfully with new data organization
- **Performance Benefits**: Reduced bundle size and improved code splitting through modular data files

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
  - Extended evolution chain schema with form variant support
  - Added Pokemon form types (PokemonForm, PokemonVariety, FormVariant)
  - Form categorization with regional, mega, and gigantamax detection

### Build Status
- ✅ **Production Build**: Successfully compiles with Next.js 15 App Router
- ✅ **Static Generation**: 311 pages generated (154 Pokemon × 2 languages + base pages)
- ✅ **i18n Implementation**: Native App Router i18n with middleware routing
- ✅ **Type Safety**: Full TypeScript coverage with no build errors
- ✅ **ESLint Compliance**: All linting rules passed
- ✅ **Bundle Optimization**: Server-side translations eliminate client-side i18n bundles
- ✅ **Dependency Reduction**: Removed 384 i18n packages for better performance
- ✅ **Responsive Design**: Mobile-optimized layout with touch-friendly navigation
- ✅ **Variant Pokemon Support**: Standardized display for regional forms and Mega Evolution
- ✅ **Animation System**: GSAP-powered animation effects with proper memory management and positioning
- ✅ **Performance Optimization**: First Load JS under 204KB for main pages, optimized bundle sizes

### Component Architecture
- **PokemonBasicInfo**: Pokemon hero section with core information (image, name, types, stats, abilities)
- **PokemonDetailHeader**: Navigation header with back button for detail pages
- **Header**: Main application header with conditional display logic:
  - Shows search bar and filter button on main Pokemon list pages
  - Hides search bar and filter button on Pokemon detail pages
  - Maintains language toggle and theme toggle on all pages
  - Responsive layout that adapts to content visibility
- **PokemonDetailSection**: Reusable section wrapper for consistent styling across detail pages
- **PokemonSpritesGallery**: Complete sprites and artwork display with official artwork and game sprites
- **PokemonDescription**: Multi-language Pokedex entries with expandable sections
- **PokemonMoves**: Enhanced move display with comprehensive statistics including:
  - Move type visualization with official Pokemon type colors
  - Damage class categorization (Physical, Special, Status) in both languages
  - Generation 9 compatible move statistics (power, accuracy, PP)
  - Tabbed interface for different learn methods (Level-up, TM/TR, Egg, Tutor)
  - Responsive grid layout optimized for both desktop and mobile
  - Removed version group information for cleaner display
- **Type Background Styling**: Dynamic page theming based on Pokemon primary type:
  - Subtle gradient backgrounds using official Pokemon type colors
  - DOM manipulation to replace layout container background covering entire viewport
  - Maintains text readability with proper opacity levels (15% to 8%)
  - Fallback to Normal type color for edge cases
  - Full-page application via PokemonDetailClient with proper cleanup on navigation
- **PokemonGameHistory**: Game appearance tracking across all generations
- **PokemonStats**: Enhanced statistics with visual progress indicators
- **PokemonImage**: Optimized image component with size variants and fallbacks
- **PokemonEvolutionChain**: Enhanced evolution tree component with form variant support:
  - Horizontal scrollable layout for complex evolution chains
  - Form variation display with compact cards below each evolution stage
  - Regional variant indicators (Alolan, Galarian, Hisuian, Paldean)
  - Mega Evolution badges (Mega, Mega X, Mega Y)
  - Gigantamax form indicators (G-Max)
  - Clickable navigation to form-specific Pokemon pages
  - Multilingual form names and category labels
  - Type visualization for each form variant
- **PokemonCard**: Interactive card component with advanced animation system:
  - **Particle-Echo-Combo Effect**: Click-responsive animation combining particle burst and border echo
  - **Type-Based Particles**: Particles use official Pokemon type colors and themed symbols (🔥 for fire, ⚡ for electric, etc.)
  - **Border Echo Animation**: Card border frames that expand outward with type-colored styling
  - **Position-Accurate Effects**: Animations trigger from actual click position on card
  - **Grid Container Integration**: Proper positioning system to handle CSS transforms and overflow constraints
  - **Memory Management**: Automatic cleanup of animation elements via GSAP timeline completion handlers
- **Animation Library System**: Comprehensive modular animation framework:
  - **lib/animations/**: Modular animation system with 13+ different effects
  - **combinationEffects.ts**: Complex animations including particle-echo-combo, ultimate-echo-combo, elemental-storm, mega-evolution
  - **ANIMATIONS Registry**: Type-safe animation registry for easy effect selection and integration
  - **AnimationConfig Interface**: Standardized configuration object for consistent animation behavior
  - **Grid Container Positioning**: Automatic `position: relative` setting for proper absolute positioning
  - **Cross-Component Compatibility**: Reusable animations work across card lists, detail pages, and sandbox environments

### GraphQL-Based Ability Multilingual Support Implementation (June 2025)
- **Complete Server-Side Integration**: Extended GraphQL schema and service layer for multilingual ability names
  - **Problem**: Ability names displayed in English only, requiring extensive manual translation maintenance
  - **Root Cause**: GraphQL Ability type lacked multilingual names field despite PokeAPI providing this data
  - **Solution**: Added comprehensive GraphQL schema and service integration for ability names
- **GraphQL Schema Enhancement**: Added native multilingual ability name support
  - **Schema Extension**: Added `names: [AbilityName!]!` field to Ability type definition
  - **Type Definition**: Created AbilityName type with name and language fields
  - **Pattern Consistency**: Follows existing multilingual patterns (MoveName, SpeciesName)
- **Server-Side Service Integration**: Enhanced Pokemon service to fetch and transform ability names
  - **Data Source**: Leverages existing PokeAPI ability details endpoint for comprehensive name data
  - **Service Enhancement**: Added transformAbilities() method to map PokeAPI names array to GraphQL structure
  - **TypeScript Integration**: Extended Ability and AbilityName interfaces in both server and client types
  - **Performance Optimization**: No additional API calls required (utilizes existing ability detail fetching)
- **Client-Side Integration**: Enhanced client to prioritize GraphQL data over manual translations
  - **Query Extension**: Added names field to GraphQL ability queries for both list and detail views
  - **Type Safety**: Updated client-side Ability interface to include optional names array
  - **Component Integration**: Updated PokemonBasicInfo component to pass ability object instead of name string
  - **Intelligent Resolution**: Enhanced getAbilityName() function with 3-tier priority system:
    1. GraphQL API data (ja, ja-Hrkt for Japanese; en for English)
    2. Manual translation table fallback (55+ abilities)
    3. Formatted English name as final fallback
- **Comprehensive Coverage**: Complete Japanese ability name support for all generations
  - **Scale**: Supports ~300+ Pokemon abilities vs 55 manual translations
  - **Accuracy**: Official PokeAPI Japanese names ensure authenticity
  - **Compatibility**: Maintains backward compatibility with existing manual translation table
  - **Examples**: "overgrow" → "しんりょく", "chlorophyll" → "ようりょくそ", "blaze" → "もうか"
- **Technical Implementation**:
  - **Data Flow**: PokeAPI → GraphQL Service → Client Query → UI Display
  - **Fallback Strategy**: Graceful degradation ensures no missing ability names
  - **Future-Proof**: Automatic support for new abilities added to PokeAPI
  - **Maintainability**: Eliminates need for extensive manual translation maintenance
- **Evolution Chain Enhancement**: Fixed stomp → ふみつけ translation for Pokemon #763 evolution requirements
  - **Problem**: Evolution conditions showing "レベルアップ + stompを覚える" instead of proper Japanese
  - **Solution**: Added stomp translation to MOVE_TRANSLATIONS table
  - **Pattern**: Consistent with existing move-based evolution condition translations

### Variant Pokemon Display Standardization (January 2025)
- **Display ID Standardization**: Fixed variant Pokemon to show base species ID instead of variant ID
  - **Problem**: Variant Pokemon displayed confusing IDs (e.g., Alolan Sandslash showing #10102 instead of #028)
  - **Root Cause**: Direct use of Pokemon ID without considering species relationship
  - **Solution**: Added getPokemonDisplayId() function using species.id for variants, Pokemon.id for regular Pokemon
- **Navigation Arrow Management**: Hidden navigation arrows for variant Pokemon forms
  - **Problem**: Navigation arrows on variant Pokemon caused confusing navigation between different forms
  - **Implementation**: Added isPokemonVariant() function detecting variants by '-' in Pokemon names
  - **Logic**: Conditional rendering with !isVariant checks for both previous and next navigation arrows
- **Implementation Details**:
  - **Functions Added**: getPokemonDisplayId(), isPokemonVariant(), getPrevNextPokemonId()
  - **Type Safety**: Fixed TypeScript errors and added proper interface definitions
  - **Data Preservation**: System IDs remain unchanged in backend, only display layer affected
  - **Comprehensive Support**: Covers all variant types (Regional, Mega Evolution, Gigantamax)
- **Technical Implementation**:
  - **Display Logic**: Updated header display and footer info to use displayId instead of pokemon.id
  - **Navigation Logic**: Added conditional rendering for navigation arrows based on variant status
  - **Build Success**: All 309 static pages generated successfully with new logic
- **User Experience Improvements**:
  - **Consistent Numbering**: All variants show base species number for easier Pokemon identification
  - **Clean Navigation**: No navigation arrows on variants prevents form confusion
  - **Comprehensive Coverage**: Applied to Regional variants, Mega Evolution, and Gigantamax forms

### Japanese Mega Evolution Naming Enhancement (January 2025)
- **Mega Evolution Name Format Standardization**: Implemented proper Japanese naming conventions for Mega Evolution Pokemon
  - **Problem**: Japanese Mega Evolution names displayed as "ポケモン名（メガ）" format instead of proper "メガポケモン名" format
  - **Root Cause**: Uniform form translation logic applied to all variants without considering Japanese Mega Evolution conventions
  - **Solution**: Added special handling for Mega Evolution forms in Japanese language display
- **Special X/Y Form Handling**: Corrected Mega Charizard and Mega Mewtwo X/Y form naming
  - **Problem**: Names displayed as "メガリザードンXメガ" due to form translation search order issues
  - **Root Cause**: Form translation lookup matched "mega" before "mega-x"/"mega-y" due to includes() partial matching
  - **Solution**: Reordered MEGA_FORM_TRANSLATIONS and implemented exact-match-first search logic
- **Implementation Details**:
  - **Translation Updates**: Modified MEGA_FORM_TRANSLATIONS to prioritize specific forms (mega-x, mega-y) over general forms (mega)
  - **Search Logic Enhancement**: Implemented two-phase search (exact match first, then partial match fallback)
  - **Special Naming Rules**: 
    - **Mega Charizard/Mewtwo X/Y**: メガ + ポケモン名 + X/Y = メガリザードンX, メガミュウツーY
    - **Other Mega Evolution**: メガ + ポケモン名 = メガフシギバナ
    - **Other Forms**: ポケモン名（フォーム名） = サンドパン（アローラのすがた）
- **Functions Enhanced**: Both getPokemonName() and getEvolutionPokemonName() updated with consistent logic
- **Technical Implementation**:
  - **Form Translation Order**: mega-x, mega-y placed before mega in translation object
  - **Search Priority**: Exact string match before partial string matching
  - **Conditional Logic**: Special handling for charizard/mewtwo with mega-x/mega-y forms
  - **Debug Logging**: Enhanced logging for form translation debugging
- **User Experience Improvements**:
  - **Authentic Names**: Proper Japanese Mega Evolution naming matching official Pokemon standards
  - **Consistent Application**: Applied across both detail pages and evolution chains
  - **Clear Distinctions**: Different naming patterns for different form types maintain clarity

### Comprehensive Performance Optimization (June 2025)
- **Virtual Scrolling Implementation**: Replaced PokemonGrid with VirtualPokemonGrid for efficient large dataset rendering
  - **@tanstack/react-virtual Integration**: Implemented virtual scrolling for Pokemon card list
  - **Responsive Column Calculation**: Dynamic 1-5 column layout based on screen size (mobile to large desktop)
  - **Window Resize Handling**: Real-time column adjustment with state management
  - **Overscan Optimization**: Increased overscan to 10 items for smoother scrolling experience
  - **Memory Efficiency**: Only renders visible items plus buffer, reducing DOM nodes significantly
- **Apollo Client Cache Optimization**: Enhanced GraphQL client performance
  - **Cache-First Strategy**: Prioritized cached data over network requests
  - **Cursor-Based Pagination Caching**: Intelligent merge strategy for infinite scroll
  - **Type Policies Enhancement**: Improved Pokemon entity caching with proper key fields
  - **Error Policy**: Maintained 'all' error policy for graceful degradation
- **Image Loading Optimization**: Comprehensive image performance improvements
  - **Quality Reduction**: Reduced image quality from 75% to 60% for faster loading
  - **Modern Format Support**: Added WebP and AVIF format support in Next.js config
  - **Cache TTL**: Extended image cache to 24 hours (86400 seconds)
  - **GIF Animation Preservation**: Added unoptimized flag for animated GIFs
  - **Blur Placeholder**: Enhanced loading experience with base64 blur placeholders
- **Next.js Bundle Optimization**: Advanced webpack and build optimizations
  - **Code Splitting**: Separated Apollo Client and GraphQL into dedicated chunks
  - **Package Import Optimization**: Optimized react-hot-toast and @apollo/client imports
  - **Compression**: Enabled built-in Next.js compression
  - **Console Log Removal**: Production builds strip console logs except errors and warnings
  - **Webpack Fallbacks**: Proper fallback configuration for Node.js modules
- **Performance Utilities**: Additional optimization tools
  - **Image Preloading Hook**: useImagePreload for proactive image loading
  - **Memoization Hook**: useMemoizedPokemon for optimized Pokemon data processing
  - **Service Worker**: Basic service worker implementation for API and image caching
- **Build Results**: Maintained 311 static pages with optimized performance
  - **Bundle Analysis**: First Load JS maintained under 243 kB for main pages
  - **Static Generation**: All Pokemon detail pages and multilingual content properly generated
  - **Type Safety**: Maintained full TypeScript compliance throughout optimization

### Header Layout Optimization (June 2025)
- **Header Integration**: Moved Pokemon logo and description from scrollable content to header section
  - **Problem**: Pokemon logo and description scrolled with card list, reducing usable viewing area
  - **Root Cause**: Hero section was part of main content flow instead of header
  - **Solution**: Integrated hero content into header while maintaining clean separation
- **Non-Sticky Header Implementation**: Chose simple, non-intrusive header design
  - **Initial Approach**: Implemented sticky header with auto-hide functionality based on scroll direction
  - **User Feedback**: Sticky header interfered with card list viewing area and felt intrusive
  - **Final Solution**: Standard positioned header that scrolls naturally with content
- **Improved Content Layout**: Optimized card list viewing experience
  - **Header Structure**: Logo, search bar, filter button, and language toggle in main header
  - **Hero Section**: Large Pokemon logo and description text integrated into header on list pages
  - **Conditional Display**: Hero section only appears on main Pokemon list page, not detail pages
  - **Clean Separation**: Filter summary and card list have dedicated, unobstructed space
- **Performance Benefits**: Simplified header reduces complexity and improves performance
  - **Removed Features**: Scroll direction detection, transform animations, z-index management
  - **Cleaner DOM**: Eliminated unnecessary scroll listeners and position calculations
  - **Better UX**: Predictable, standard web behavior without unexpected header movements
- **Technical Implementation**:
  - **GraphQL Integration**: Header receives dictionary props for multilingual hero content
  - **Conditional Rendering**: Hero section visibility based on page type detection
  - **Layout Flexibility**: Header adapts between list page (with hero) and detail page (minimal)
  - **Type Safety**: Proper TypeScript interfaces for header props and dictionary integration

## Background Preloading System Implementation (June 2025)

### **Intelligent Pokemon Preloading Strategy**
- **Strategic Background Loading**: Implemented comprehensive background preloading system for Pokemon detail pages with intelligent targeting strategies
- **Multi-Tier Preloading Approach**: 4-strategy priority system for optimal user experience:
  1. **Sequential Targets**: Next 10 Pokemon after current ID (sequential browsing pattern)
  2. **Next Unloaded Targets**: 10 Pokemon after highest cached ID (smart caching strategy)
  3. **Generation Start Targets**: First 9 Pokemon of each generation (for faster generation switching)
  4. **Popular Targets**: Generation-specific popular Pokemon (starters, legendaries, evolutions)

### **Generation-Based Performance Optimization**
- **Cross-Generation Preloading**: Proactively loads the first 9 Pokemon from each generation (御三家 starters and popular Pokemon)
  - **Target Pokemon**: Generation starters and their evolutions (#1-9, #152-160, #252-260, etc.)
  - **Smart Cache Detection**: Only preloads Pokemon not already in Apollo Client cache
  - **Generation Switching Optimization**: Eliminates loading delays when users switch between generations
- **Intelligent Cache Management**: 
  - **Cache Analysis**: Scans Apollo Client cache to identify highest cached Pokemon ID
  - **Duplicate Prevention**: Avoids reloading already cached Pokemon for optimal performance
  - **Strategic Targeting**: Prioritizes Pokemon most likely to be accessed by users

### **Network-Aware Background Processing**
- **Connection Detection**: Automatically detects slow connections (2G, slow-2G, saveData mode) using Connection API
- **Adaptive Behavior**: Disables preloading on slow connections to preserve bandwidth and performance
- **Low-Priority Processing**: Uses `Priority: u=4` headers for background requests that don't interfere with main content
- **Batch Processing**: Processes preloading in batches with 500ms delays and maximum 2 concurrent requests
- **AbortController Cleanup**: Proper cancellation and memory management for interrupted operations

### **Generation Range Filtering Enhancement**
- **Cross-Generation Display Bug Fix**: Resolved issue where Pokemon from other generations (e.g., #081-#109) appeared in wrong generation context
- **Enhanced Filter Logic**: Strengthened generation range filtering in `usePokemonList.ts` with precise boundary checks
- **Accurate Pokemon Counting**: Fixed Pokemon count calculation to only include current generation Pokemon
- **Force Refetch Implementation**: Added generation switching logic with automatic refetch using correct parameters

### **Technical Implementation Details**
- **Hook Integration**: `useBackgroundPreload` hook with comprehensive configuration options
  - **Configurable Parameters**: Delay (3 seconds default), max concurrent requests (2), priority levels
  - **Status Tracking**: Real-time preloading progress with completed/total counts
  - **Development Debug**: Visual indicator in development mode showing preloading status
- **Strategic Functions**: 
  - **`getPreloadTargets()`**: Intelligent target selection with 4-tier priority system
  - **`getGenerationStartTargets()`**: Cross-generation preloading for faster switching
  - **`isIdInCache()`**: Efficient cache checking to prevent duplicate requests
  - **`executePreload()`**: Batch processing with proper error handling and cleanup
- **Redux Integration**: Enhanced generation change handling with immediate Pokemon list clearing and forced refetch
- **Error Resilience**: Graceful handling of network errors and interrupted preloading without affecting main functionality

### **User Experience Improvements**
- **Seamless Navigation**: Pokemon detail pages load instantly when users navigate sequentially
- **Fast Generation Switching**: Instant display of first 9 Pokemon when changing generations in sidebar
- **Background Processing**: All preloading happens invisibly without affecting main interface performance
- **Intelligent Predictions**: System learns from user behavior patterns to preload most relevant Pokemon
- **Mobile Optimization**: Respects data-saving preferences and connection quality for mobile users

### **Performance Benefits**
- **Reduced Loading Times**: Background preloading eliminates waiting for frequently accessed Pokemon
- **Optimal Resource Usage**: Strategic targeting prevents wasting bandwidth on unlikely-to-be-accessed Pokemon
- **Cache Efficiency**: Leverages Apollo Client cache for maximum performance with minimal memory overhead
- **Generation Navigation**: Near-instantaneous generation switching with preloaded starter Pokemon
- **Network Respect**: Adaptive behavior based on connection quality ensures optimal experience across all devices