# Architecture Documentation

Comprehensive technical architecture documentation for the Pokemon Pokedex application.

## Table of Contents

- [System Architecture](#system-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Data Loading Strategy](#data-loading-strategy)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Navigation System](#navigation-system)
- [Icon System](#icon-system)
- [Internationalization](#internationalization)
- [Pokemon Badge System](#pokemon-badge-system)

## System Architecture

### Overview

The Pokemon Pokedex is a full-stack application with a hybrid deployment architecture:

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   PokeAPI   │────▶│ Railway      │────▶│   Vercel    │
│  (Data API) │     │ (GraphQL)    │     │  (Frontend) │
└─────────────┘     └──────────────┘     └─────────────┘
```

### Frontend (Next.js 15)

- **Framework**: Next.js 15 with App Router and React 19
- **Language**: TypeScript with strict mode
- **Styling**: TailwindCSS with Ruby/Sapphire game-inspired design
- **State Management**: Redux Toolkit
- **GraphQL Client**: Apollo Client with intelligent caching
- **Internationalization**: Native App Router i18n with middleware-based language detection

### Backend (GraphQL Server)

- **Server**: Apollo Server with Express
- **Language**: TypeScript
- **Deployment**: Railway with automatic CI/CD
- **Data Source**: PokeAPI (https://pokeapi.co/api/v2/)
- **Caching**: CDN-based caching with Cache-Control headers (24-hour TTL)
- **CORS Configuration**: Wildcard pattern support for dynamic Vercel deployment URLs

## Frontend Architecture

### Next.js 15 App Router Structure

```
app/
├── [lang]/                  # Internationalized routes
│   ├── layout.tsx          # Language-specific layout
│   ├── page.tsx            # Home page
│   └── pokemon/
│       └── [id]/           # Dynamic Pokemon routes
├── api/                    # API Routes
│   ├── errors/             # Error logging endpoints
│   └── pokemon/            # REST API endpoints
└── layout.tsx              # Root layout
```

### Key Architectural Decisions

1. **App Router over Pages Router**: Leverages React Server Components for better performance
2. **TypeScript Strict Mode**: Ensures type safety across the application
3. **Redux Toolkit**: Simplified state management with built-in best practices
4. **Apollo Client**: Powerful GraphQL client with caching capabilities

## Backend Architecture

### GraphQL Server Structure

```
server/
├── src/
│   ├── index.ts            # Server entry point
│   ├── schema/             # GraphQL type definitions
│   ├── resolvers/          # Query/Mutation resolvers
│   ├── services/           # Business logic
│   └── data/               # Static data (form IDs, etc.)
└── dist/                   # Compiled output
```

### Key Features

- **Rate Limiting**: 50ms minimum interval between PokeAPI requests
- **Retry Logic**: 7 attempts with exponential backoff for failed requests
- **In-Memory Caching**: Form-to-species mapping cache
- **Health Checks**: `/health` endpoint for monitoring

## Data Loading Strategy

### Pokemon Detail Pages (SSG)

- **Build Strategy**: Static Site Generation with generational batch processing
- **Optimization**: 9 separate builds by generation to reduce memory usage
- **Total Pages**: ~2,786 static pages (2 languages × 1,393 Pokemon)
- **Build Time**: ~12-13 minutes with parallel processing

### Pokemon List Pages (CSR)

- **Rendering**: Full client-side rendering
- **Caching**: localStorage with 24-hour TTL
- **Loading**: Progressive batch loading (20 Pokemon at a time)
- **Performance**: Instant navigation with cache-first strategy

### Caching Architecture

```
Client Request
      │
      ▼
Check localStorage (24hr TTL)
      │
      ├─ Hit ──────▶ Return cached data
      │
      └─ Miss
           │
           ▼
      Apollo Client
           │
           ▼
      GraphQL Server
           │
           ▼
      CDN Cache
           │
           └─ Miss ──▶ PokeAPI
```

## Component Architecture

### Directory Structure

```
components/
├── layout/                 # App-level layout components
│   ├── Sidebar.tsx        # Generation navigation
│   ├── SearchBar.tsx      # Pokemon search
│   └── LanguageToggle.tsx # Language switcher
├── ui/
│   ├── common/            # Reusable UI components
│   ├── pokemon/           # Pokemon-specific components
│   │   ├── list/         # List view components
│   │   ├── detail/       # Detail view components
│   │   ├── sprites/      # Sprite gallery
│   │   └── evolution/    # Evolution chains
│   └── animation/         # Animation components
└── providers/             # Context providers
```

### Component Design Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Use component composition
3. **Props over State**: Prefer props for data flow
4. **TypeScript First**: All components are fully typed

### Key Components

#### PokemonCard
- Displays Pokemon basic info in grid
- Handles click animations (26 different effects)
- Responsive design with hover states
- Classification badges (Baby, Legendary, Mythical)

#### VirtualPokemonGrid
- react-window implementation for large datasets
- Automatic switching at 10+ Pokemon threshold
- Responsive column calculation (1-5 columns)
- Memory efficient rendering

#### PokemonDetailHeader
- Dynamic header with shrink-on-scroll
- Search functionality preservation
- GSAP animations for smooth transitions
- Mobile-optimized layout

## State Management

### Redux Store Structure

```typescript
interface RootState {
  pokemon: {
    currentGeneration: number;
    pokemonList: Pokemon[];
    pokemonDetail: Pokemon | null;
    loading: boolean;
    error: string | null;
  };
  ui: {
    sidebarOpen: boolean;
    searchQuery: string;
    selectedTypes: string[];
    language: string;
    dictionary: Dictionary;
  };
  navigation: {
    scrollPositions: Record<string, number>;
    previousRoute: string | null;
  };
  search: {
    results: Pokemon[];
    isSearching: boolean;
  };
}
```

### State Management Patterns

1. **Generation-Based Loading**: Pokemon loaded by generation
2. **Cache Integration**: Redux state synced with localStorage
3. **Optimistic Updates**: UI updates before API confirmation
4. **Error Recovery**: Automatic retry with fallback data

## Navigation System

### Sidebar Navigation

- **Fixed Position**: Always visible on desktop
- **Generation Buttons**: Quick access to all 9 generations
- **Mobile Menu**: Hamburger menu with overlay
- **Active State**: Visual indication of current generation

### Generation Switching Flow

1. User clicks generation button
2. Redux state updates immediately
3. Check localStorage cache
4. Load from cache or fetch from API
5. Update UI with loading states
6. Preserve scroll position

### URL Structure

```
/[lang]/                    # Home page
/[lang]/pokemon/[id]        # Pokemon detail
/[lang]/sandbox             # Animation testing
/[lang]/?generation=0       # Generation filter
```

## Icon System

### React Icons Integration

 The application uses react-icons library for consistent icon management:

#### Heroicons v2 (Primary)
- Navigation icons (menu, close, chevrons)
- UI elements (search, filters)
- Consistent 24x24 sizing
- Outline style for better visibility

#### Font Awesome (Specialized)
- Gender symbols (♂ Mars, ♀ Venus)
- Color-coded (blue/pink)
- Used in Pokemon detail pages

### Implementation Example

```typescript
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';
import { FaMars, FaVenus } from 'react-icons/fa';

// Search icon
<HiMagnifyingGlass className="h-5 w-5 text-gray-400" />

// Gender icons
{gender === 'male' && <FaMars className="h-4 w-4 text-blue-500" />}
{gender === 'female' && <FaVenus className="h-4 w-4 text-pink-500" />}
```

## Internationalization

### Supported Languages

Currently active:
- English (en)
- Japanese (ja)

Preserved for future:
- Korean (ko)
- French (fr)
- German (de)
- Italian (it)
- Spanish (es)
- Chinese Simplified (zh-Hans)
- Chinese Traditional (zh-Hant)

### i18n Architecture

1. **Middleware-based routing**: Automatic language detection
2. **Server-side dictionary loading**: No client-side translation files
3. **Type-safe translations**: TypeScript interfaces for all text
4. **PokeAPI integration**: Automatic language-specific data fetching

### Dictionary Structure

```typescript
interface Dictionary {
  common: {
    appName: string;
    search: string;
    // ... 50+ common translations
  };
  pokemon: {
    abilities: string;
    stats: string;
    // ... 100+ Pokemon-specific translations
  };
  // ... more sections
}
```

## Pokemon Badge System

### Strategy Pattern Implementation

The badge system uses a configuration-driven approach:

```typescript
interface BadgeConfig {
  id: string;
  condition: (pokemon: Pokemon) => boolean;
  badgeKey: string;
  colorKey: string;
  variant: BadgeVariant;
}

const CLASSIFICATION_BADGES: BadgeConfig[] = [
  {
    id: 'baby',
    condition: (p) => p.species?.is_baby === true,
    badgeKey: 'baby',
    colorKey: 'pink',
    variant: 'classification'
  },
  // ... more badges
];
```

### Badge Types

1. **Classification Badges**
   - Baby (ベイビィ) - Pink
   - Legendary (伝説) - Yellow
   - Mythical (幻) - Purple

2. **Form Badges**
   - Regional variants (Alolan, Galarian, etc.)
   - Mega Evolutions
   - Gigantamax forms

3. **Custom Badges**
   - Event Pokemon
   - Special forms

### Benefits

- **Maintainability**: Easy to add new badges
- **Performance**: No nested conditionals
- **Consistency**: Unified styling system
- **Type Safety**: Full TypeScript support