# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pokemon Pokedex application built with Next.js 15 (App Router), React 19, TypeScript, and TailwindCSS. Features a Ruby/Sapphire-inspired game design with modern responsive layout and comprehensive multilingual support.

**Current Status**: Feature-complete Pokemon Pokedex with comprehensive detail pages including completely redesigned Pokemon detail pages based on reference design, enhanced evolution chains with form variants, enhanced move data display with detailed statistics, SSG implementation, advanced search/filter functionality, complete App Router i18n multilingual support, and production-ready build. Successfully migrated from Pages Router i18n to modern Next.js 15 middleware-based approach. **LATEST**: Completed major detail page redesign matching reference design with 2-column layout, type effectiveness system, Normal/Shiny toggle, mobile-responsive design, comprehensive multilingual data integration with GraphQL-based ability and move name support, standardized variant Pokemon display, and enhanced Japanese naming conventions for Mega Evolution forms. All 309 static pages generate successfully. Main areas for future enhancement: testing coverage, environment configuration, and error boundaries.

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
│   │   ├── layout/                # Header, Footer, navigation components
│   │   ├── pokemon/              # Pokemon-specific components
│   │   └── ui/                   # Reusable UI components with i18n
│   ├── lib/                      # Utility functions and configurations
│   │   ├── dictionaries/         # Translation files
│   │   │   ├── en.json           # English translations
│   │   │   └── ja.json           # Japanese translations
│   │   ├── dictionaries.ts       # Type definitions and utilities
│   │   ├── get-dictionary.ts     # Server-only dictionary loader
│   │   ├── pokemonUtils.ts       # Pokemon data translation utilities
│   │   └── formUtils.ts          # Pokemon form variation utilities and translations
│   ├── hooks/                    # Custom React hooks
│   ├── store/                    # Redux Toolkit configuration
│   └── types/                    # TypeScript type definitions
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
- **Native App Router i18n**: Complete English/Japanese support with middleware-based routing
  - Language detection from browser headers with automatic redirection
  - Server-side dictionary loading for optimal performance
  - Complete filter system multilingual support (FilterModal, TypeFilter, GenerationFilter)
  - Pokemon data translations (names, types, abilities, moves, game versions)
  - URL-based language switching (/en/, /ja/) with proper SEO
- **Responsive Design**: Desktop-first with mobile and tablet optimizations
- **Evolution Chain with Form Variants**: Visual evolution trees including:
  - Regional variants (Alolan, Galarian, Hisuian, Paldean forms)
  - Mega Evolution (Mega, Mega X, Mega Y)
  - Gigantamax forms (G-Max variants)
  - Horizontal scrollable layout with form categorization
  - Clickable navigation to form-specific Pokemon pages

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

### Language Navigation Issues
- **Problem**: Navigation links not preserving language context (e.g., detail page back button going to `/en/` instead of `/ja/`)
- **Solution**: Use `href="{/${language}/}"` instead of `href="/"` in all navigation components
- **Implementation**: Extract current language using `usePathname()` and `getLocaleFromPathname()` for client components

## Development Priorities

### High Priority (Immediate)
1. **Test Suite Implementation**: Unit tests, integration tests, E2E tests (currently no tests exist)
2. **Environment Configuration**: Create actual .env files from .env.example templates
3. **Error Boundaries**: React error boundaries for graceful error handling
4. **Accessibility Features**: ARIA labels, keyboard navigation, screen reader support

### Medium Priority (Next Phase)
5. **Pokemon Breeding Information**: Egg groups, breeding compatibility, egg moves, hatching steps
6. **Pokemon Location/Habitat Information**: Game location data, encounter rates, habitat descriptions
7. **Pokemon Comparison Feature**: Side-by-side stat comparison between Pokemon
8. **Pokemon Cry/Sound Playback**: Audio playback functionality for Pokemon cries
9. **Server Caching**: Redis or in-memory caching for PokeAPI requests
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
- **GraphQL Server**: Custom Apollo Server wrapper with efficient data fetching
- **Cursor-Based Pagination**: Implemented for optimal performance
- **Auto-Loading Logic**: Ensures complete generation datasets when filters are applied

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
- ✅ **Static Generation**: 309 pages generated (154 Pokemon × 2 languages + base pages)
- ✅ **i18n Implementation**: Native App Router i18n with middleware routing
- ✅ **Type Safety**: Full TypeScript coverage with no build errors
- ✅ **ESLint Compliance**: All linting rules passed
- ✅ **Bundle Optimization**: Server-side translations eliminate client-side i18n bundles
- ✅ **Dependency Reduction**: Removed 384 i18n packages for better performance
- ✅ **Responsive Design**: Mobile-optimized layout with touch-friendly navigation
- ✅ **Variant Pokemon Support**: Standardized display for regional forms and Mega Evolution

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