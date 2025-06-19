# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pokemon Pokedex application built with Next.js 15 (App Router), React 19, TypeScript, and TailwindCSS. Features a Ruby/Sapphire-inspired game design with modern responsive layout and comprehensive multilingual support.

**Current Status**: Feature-complete Pokemon Pokedex with comprehensive detail pages including enhanced evolution chains with form variants, enhanced move data display with detailed statistics, SSG implementation, advanced search/filter functionality, complete App Router i18n multilingual support, and production-ready build. Successfully migrated from Pages Router i18n to modern Next.js 15 middleware-based approach. Recently enhanced with Pokemon form variation support and comprehensive move statistics display (Generation 9 compatible). Main areas for future enhancement: testing coverage, environment configuration, and error boundaries.

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
- ✅ Pokemon names (via PokeAPI species data)
- ✅ All Pokemon types with official translations
- ✅ 50+ Pokemon abilities
- ✅ All Pokemon game versions
- ✅ Move names with formatting
- ✅ Generation names and regions
- ✅ Complete UI text (search, filters, navigation, etc.)
- ✅ Height/Weight units and labels
- ✅ Stats and technical information
- ✅ Navigation consistency (back buttons, error pages, detail page links)

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

## Current Development Priorities

### High Priority (Immediate)
1. **Pokemon Breeding Information**: Egg groups, breeding compatibility, egg moves, hatching steps
2. **Pokemon Location/Habitat Information**: Game location data, encounter rates, habitat descriptions
3. **Test Suite Implementation**: Unit tests, integration tests, E2E tests (currently no tests exist)
4. **Environment Configuration**: Create actual .env files from .env.example templates
5. **Error Boundaries**: React error boundaries for graceful error handling

### Medium Priority (Next Phase)
6. **Pokemon Comparison Feature**: Side-by-side stat comparison between Pokemon
7. **Pokemon Cry/Sound Playback**: Audio playback functionality for Pokemon cries
8. **Type Effectiveness Calculator**: Weakness/resistance calculator with damage multipliers
9. **Pokemon Size Comparison**: Visual size comparison with human scale
10. **Accessibility Features**: ARIA labels, keyboard navigation, screen reader support
11. **SEO Optimization**: Metadata, Open Graph tags, structured data
12. **Server Caching**: Redis or in-memory caching for PokeAPI requests

### Low Priority (Future)
13. **Pokemon Encounter Data**: Encounter rates and location data from games
14. **Pokemon Team Builder**: Team composition and strategy tools
15. **Shiny Variant Display**: Toggle for shiny Pokemon variants
16. **PWA Implementation**: Service worker, offline support, app manifest
17. **Performance Analysis**: Bundle optimization and monitoring

## Implementation Status

### ✅ Fully Implemented
- **GraphQL Backend**: Complete Apollo Server with cursor-based pagination and extended schema
- **Pokemon Detail Pages**: SSG implementation with comprehensive data display and componentized architecture
- **Advanced Filtering**: Search, type filters, generation filters with auto-loading
- **State Management**: Redux Toolkit with proper error handling and deduplication
- **Responsive UI**: Complete component library with Ruby/Sapphire theming
- **Infinite Scroll**: Optimized with Intersection Observer and debouncing
- **Native App Router i18n**: Complete English/Japanese implementation with:
  - Middleware-based language detection and automatic routing (/en/, /ja/)
  - Server-side dictionary loading for optimal performance (no client bundles)
  - Complete filter system multilingual support (FilterModal, TypeFilter, GenerationFilter)
  - PokeAPI-integrated Japanese Pokemon names, types, abilities, and moves
  - 308 static pages generated (151 Pokemon × 2 languages)
  - SEO-optimized with proper hreflang and language-specific metadata
  - Language-consistent navigation preserves user's language choice across all pages
- **Image Optimization**: Next.js Image with fallbacks, lazy loading, and size variants
- **Rich Data Display**: Moves, Pokedex entries, game history, and comprehensive stats
- **SEO Optimization**: Meta tags, Open Graph, Twitter Cards for all Pokemon pages
- **Component Architecture**: Modular, maintainable components with clear separation of concerns
- **Pokemon Form Variations**: Complete support for Pokemon form variants including:
  - Regional variants (Alolan, Galarian, Hisuian, Paldean) with proper categorization
  - Mega Evolution forms (Mega, Mega X, Mega Y) with visual indicators
  - Gigantamax forms (G-Max) with distinct styling
  - 40+ form translations for English/Japanese localization
  - Enhanced evolution chains with form display and navigation
  - Type-safe form detection and classification

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

## Recent Major Updates

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
- ✅ **Static Generation**: 308 pages generated (151 Pokemon × 2 languages + base pages)
- ✅ **i18n Implementation**: Native App Router i18n with middleware routing
- ✅ **Type Safety**: Full TypeScript coverage with no build errors
- ✅ **ESLint Compliance**: All linting rules passed
- ✅ **Bundle Optimization**: Server-side translations eliminate client-side i18n bundles
- ✅ **Dependency Reduction**: Removed 384 i18n packages for better performance

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