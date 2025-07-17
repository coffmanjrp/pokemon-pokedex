# Features Documentation

Detailed documentation of all features and their technical implementations.

## Table of Contents

- [Animation System](#animation-system)
- [Virtual Scrolling](#virtual-scrolling)
- [Dynamic Header](#dynamic-header)
- [Move Data System](#move-data-system)
- [Generation 0 (Other Forms)](#generation-0-other-forms)
- [SEO Implementation](#seo-implementation)
- [Error Handling](#error-handling)
- [API Routes](#api-routes)
- [Search System](#search-system)
- [Classification System](#classification-system)

## Animation System

### Overview

GSAP-powered animation system with 26 distinct effects categorized by interaction type and Pokemon classification.

### Animation Categories

#### Regular Click Effects (7)
1. **rippleWave** - Classic ripple effect from click point
2. **particleBurst** - Explosive particle effect
3. **cardFlip** - 3D card rotation
4. **pokeballPop** - Pokeball-themed animation
5. **electricSpark** - Lightning effect
6. **scaleGlow** - Scale with glow effect
7. **bounceTilt** - Bounce with tilt rotation

#### Combination Effects (6)
1. **cardEcho** - Multiple card echoes
2. **cardEchoBorder** - Echo with border animation
3. **particleEchoCombo** - Particles + echo
4. **ultimateEchoCombo** - All effects combined
5. **elementalStorm** - Elemental particle storm
6. **megaEvolution** - Mega evolution effect

#### Special Pokemon Effects (3)
1. **babySparkle** - Cute sparkles for baby Pokemon
2. **legendaryAura** - Powerful aura for legendaries
3. **mythicalShimmer** - Mystical effect for mythicals

#### Hover Effects (10)
- Classification-based hover animations
- Automatic cleanup on mouse leave
- Performance optimized with throttling

### Implementation

```typescript
// Animation hook usage
import { useCardAnimation } from '@/lib/animations';

const PokemonCard = ({ pokemon }) => {
  const { animateCard } = useCardAnimation();
  
  const handleClick = (e) => {
    animateCard(e, cardRef.current, pokemon);
  };
};
```

### Animation Files
- `lib/animations/rippleWave.ts` - Basic effects
- `lib/animations/combinationEffects.ts` - Complex animations
- `lib/animations/specialEffects.ts` - Classification effects
- `lib/animations/hoverEffects.ts` - Hover animations
- `lib/animations/subtleEffects.ts` - Subtle interactions

### Sandbox Environment

Testing interface available at `/[lang]/sandbox` with:
- Categorized animation showcase
- Interactive testing
- Performance monitoring
- Effect combinations

## Virtual Scrolling

### Implementation Details

react-window based virtual scrolling for optimal performance with large datasets.

### Architecture

```typescript
interface VirtualGridProps {
  pokemon: Pokemon[];
  dictionary: Dictionary;
  language: Locale;
}

// Automatic switching logic
const VIRTUAL_SCROLL_THRESHOLD = 10;

if (pokemon.length > VIRTUAL_SCROLL_THRESHOLD) {
  return <VirtualPokemonGrid />;
} else {
  return <StandardPokemonGrid />;
}
```

### Features

1. **Dynamic Column Calculation**
   ```typescript
   const getColumnCount = (width: number) => {
     if (width < 640) return 1;      // Mobile
     if (width < 768) return 2;      // Tablet
     if (width < 1024) return 3;     // Small desktop
     if (width < 1280) return 4;     // Desktop
     return 5;                        // Large desktop
   };
   ```

2. **Row Height Calculation**
   - Base card height: 300px
   - Gap: 8px
   - Dynamic adjustment for screen size

3. **Performance Benefits**
   - Only renders visible items
   - Reduces DOM nodes from 1000+ to ~20
   - Smooth 60fps scrolling
   - Memory usage reduced by 90%

### Integration

- Seamless fallback for small datasets
- Preserves all card functionality
- Compatible with animations
- Maintains accessibility

## Dynamic Header

### Shrinking Header System

GSAP-powered header that adapts based on scroll position.

### Features

1. **Scroll Detection**
   - Triggers after 100px scroll
   - Throttled with requestAnimationFrame
   - Smooth transitions

2. **State Transitions**
   - Normal state: Full header with search bar
   - Shrunk state: Compact with icon-only search
   - Hover state: Temporary expansion

3. **Mobile Optimization**
   - Fixed height container
   - Consistent alignment
   - Touch-friendly targets

### Implementation

```typescript
const timeline = gsap.timeline();

// Shrink animation
timeline
  .to(titleRef.current, {
    scale: 0.75,
    duration: 0.3,
    ease: 'power2.out'
  })
  .to(searchBarRef.current, {
    opacity: 0,
    x: -20,
    duration: 0.2
  }, '-=0.2');
```

## Move Data System

### Multilingual Move Support

Comprehensive Pokemon move data with full internationalization.

### Data Structure

```typescript
interface Move {
  id: number;
  name: string;
  names: LocalizedName[];
  damage_class: {
    name: string;
    names: LocalizedName[];
  };
  type: Type;
  power: number | null;
  accuracy: number | null;
  pp: number;
  target: {
    name: string;
    names: LocalizedName[];
  };
  flavor_text_entries: FlavorText[];
}
```

### Features

1. **Localized Names**: All move names in supported languages
2. **Damage Classes**: Physical, Special, Status with translations
3. **Move Descriptions**: Tooltip-based flavor text display
4. **Target Information**: Localized target descriptions
5. **Data Source**: Latest game data (Scarlet/Violet)

### UI Implementation

- Grouped by damage class
- Type-colored badges
- Power/Accuracy display
- Interactive tooltips
- Mobile-optimized layout

## Generation 0 (Other Forms)

### Overview

Special handling for Pokemon forms including Mega Evolutions, Regional Variants, and other special forms.

### Technical Implementation

1. **Non-Sequential IDs**
   - Form IDs: 10033-10277
   - Uses `REAL_FORM_IDS` array
   - Special pagination logic

2. **Blacklist System**
   ```json
   {
     "blacklistedFormIds": [
       10264, 10265, 10266, 10267,
       10268, 10269, 10270, 10271
     ]
   }
   ```

3. **Form Categories**
   - Mega Evolutions (10033-10062)
   - Alolan Forms (10091-10115)
   - Galarian Forms (10158-10180)
   - Hisuian Forms (10229-10250)
   - Paldean Forms (10251-10254)

### Special Features

- Form-to-species mapping
- Display ID management
- Enhanced sorting by base Pokemon
- URL parameter preservation
- Scroll position restoration

## SEO Implementation

### Comprehensive SEO Strategy

1. **robots.txt**
   ```
   User-agent: *
   Disallow: /api/
   Disallow: /sandbox
   Sitemap: https://domain.com/sitemap.xml
   ```

2. **Dynamic Sitemap**
   - 2,786 pages indexed
   - Multi-language support
   - Automatic generation
   - Priority weighting

3. **Structured Data (JSON-LD)**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "VideoGameCharacter",
     "name": "Pikachu",
     "gameAppearance": {
       "@type": "VideoGame",
       "name": "Pokémon"
     }
   }
   ```

4. **Meta Tags**
   - Dynamic Open Graph tags
   - Twitter Card support
   - Canonical URLs
   - Alternate language links

### Benefits

- Enhanced search visibility
- Rich snippets in search results
- Improved crawling efficiency
- Multi-language SEO support

## Error Handling

### Unified Error System

Custom error classes with multi-language support and recovery strategies.

### Error Classes

```typescript
// Base error class
export class AppError extends Error {
  code: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

// Specific error types
export class APIError extends AppError { ... }
export class ValidationError extends AppError { ... }
export class NetworkError extends AppError { ... }
export class CacheError extends AppError { ... }
```

### Error Handler Service

1. **Centralized Processing**
   - Error classification
   - Context enrichment
   - Recovery suggestions
   - Multi-language messages

2. **Error Logging**
   - localStorage persistence
   - 7-day retention
   - Batch reporting to server
   - Performance monitoring

3. **Error Boundaries**
   - App-level error boundary
   - Page-level boundaries
   - Graceful fallbacks
   - Reset functionality

### Recovery Strategies

- **Network Errors**: Retry with exponential backoff
- **API Errors**: Fallback to cached data
- **Cache Errors**: Automatic cleanup
- **Validation Errors**: User guidance

## API Routes

### REST API Endpoints

Next.js API Routes providing REST interface alongside GraphQL.

### Available Endpoints

1. **Pokemon List**
   ```
   GET /api/pokemon?limit=20&offset=0
   ```

2. **Pokemon Detail**
   ```
   GET /api/pokemon/[id]
   GET /api/pokemon/[id]/basic
   GET /api/pokemon/[id]/full
   ```

3. **Evolution Chain**
   ```
   GET /api/pokemon/[id]/evolution
   ```

4. **Error Reporting**
   ```
   POST /api/errors
   POST /api/errors/batch
   ```

### Implementation

- GraphQL client integration
- Response caching
- Error handling
- Type safety

## Search System

### Advanced Pokemon Search

Real-time search with multi-language support and intelligent filtering.

### Features

1. **Multi-language Support**
   - Japanese hiragana/katakana conversion
   - Fuzzy matching
   - Accent-insensitive search

2. **Search Modes**
   - Name search
   - Type filtering
   - Ability search
   - Move search

3. **Performance**
   - Debounced input (300ms)
   - Client-side filtering
   - Cached results
   - Instant feedback

### Implementation

```typescript
const searchPokemon = (query: string, pokemon: Pokemon[]) => {
  const normalized = normalizeSearchQuery(query);
  
  return pokemon.filter(p => {
    const nameMatch = p.name.includes(normalized);
    const localizedMatch = p.localizedNames?.some(
      n => n.includes(normalized)
    );
    return nameMatch || localizedMatch;
  });
};
```

## Classification System

### Pokemon Classifications

Visual badge system for special Pokemon categories.

### Classifications

1. **Baby Pokemon**
   - Pink badge
   - Japanese: ベイビィ
   - Special hover effects

2. **Legendary Pokemon**
   - Yellow badge
   - Japanese: 伝説
   - Aura animations

3. **Mythical Pokemon**
   - Purple badge
   - Japanese: 幻
   - Shimmer effects

### Implementation

- Strategy pattern for badge logic
- Unified color system
- Animation integration
- Multi-language support

### Badge Component

```typescript
<PokemonBadge
  pokemon={pokemon}
  dictionary={dictionary}
  size="sm"
  showClassification
  showForm
/>
```