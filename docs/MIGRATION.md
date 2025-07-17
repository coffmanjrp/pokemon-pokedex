# Migration Documentation

Guide for database migration to Supabase and adding new language support.

## Table of Contents

- [Supabase Migration Plan](#supabase-migration-plan)
- [Adding New Language Support](#adding-new-language-support)

## Supabase Migration Plan

Architecture transformation to resolve current performance and stability issues.

### Current Architecture

```
PokeAPI → Railway (GraphQL) → Vercel (Client)
```

### Target Architecture

```
PokeAPI → Railway (Data Sync) → Supabase (Database) → Vercel (Client)
```

### Implementation Tasks

#### 1. Supabase Setup (1 day)

- Create Supabase project
- Design database schema
- Configure authentication (for future features)
- Set up Row Level Security policies

#### 2. Database Schema Design

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

-- Pokemon forms
CREATE TABLE pokemon_forms (
  id INTEGER PRIMARY KEY,
  pokemon_id INTEGER REFERENCES pokemon(id),
  form_name VARCHAR(100),
  form_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_pokemon_generation ON pokemon(generation);
CREATE INDEX idx_pokemon_types ON pokemon USING GIN(types);
CREATE INDEX idx_pokemon_name ON pokemon(name);
CREATE INDEX idx_forms_pokemon_id ON pokemon_forms(pokemon_id);
```

#### 3. Data Migration (2-3 days)

- Create data sync script in Railway server
- Initial bulk import of all Pokemon data
- Set up incremental sync job (weekly/monthly)
- Data validation and integrity checks

```typescript
// Example sync script
class PokemonDataSync {
  async syncAllPokemon() {
    const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    for (const gen of generations) {
      await this.syncGeneration(gen);
    }
    
    await this.syncPokemonForms();
    await this.syncEvolutionChains();
  }
  
  async syncGeneration(generation: number) {
    const pokemon = await this.fetchGenerationFromPokeAPI(generation);
    await this.upsertToSupabase(pokemon);
  }
}
```

#### 4. Client Integration (3-4 days)

- Install and configure Supabase client SDK
- Replace Apollo Client queries with Supabase queries
- Implement caching strategy with Supabase
- Update Redux store to work with Supabase
- Migrate authentication logic (if applicable)

```typescript
// Supabase client setup
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Example query
export async function getPokemonByGeneration(generation: number) {
  const { data, error } = await supabase
    .from('pokemon')
    .select('*')
    .eq('generation', generation)
    .order('id');
    
  return { data, error };
}
```

#### 5. Railway Server Transformation (1 day)

- Convert from GraphQL API to data sync service
- Implement scheduled sync jobs
- Add error handling and retry logic
- Set up monitoring for sync failures

```typescript
// Cron job configuration
import cron from 'node-cron';

// Run sync every Sunday at 2 AM
cron.schedule('0 2 * * 0', async () => {
  console.log('Starting weekly Pokemon data sync...');
  await syncService.syncAllPokemon();
});
```

#### 6. Testing & Optimization (1-2 days)

- Performance testing and benchmarking
- Query optimization with proper indexes
- Cache strategy refinement
- Load testing with expected traffic

### Expected Improvements

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Build Time | 40+ min | <5 min | 88% faster |
| API Response | 100-500ms | 10-50ms | 90% faster |
| Reliability | ~95% | 99.9%+ | 4.9% increase |
| Cold Starts | Yes | No | Eliminated |

### Migration Benefits

#### 1. Performance
- Direct database queries instead of GraphQL overhead
- Edge-cached responses globally
- No cold start delays
- Optimized indexes for common queries

#### 2. Reliability
- Eliminate Railway server instability
- No PokeAPI rate limiting during builds
- Automatic failover and backups
- 99.9% uptime SLA

#### 3. Developer Experience
- Type-safe database queries with generated types
- Real-time subscriptions for live features
- Built-in authentication for future features
- Better local development with Supabase CLI

#### 4. Future Features Enabled
- User accounts and favorites
- Team builder with saved teams
- Battle simulator with real-time updates
- Community features (comments, ratings)
- Trading system
- Custom Pokemon collections

### Migration Schedule

**Week 1**: Supabase setup and schema design
- Day 1-2: Project setup and configuration
- Day 3-4: Schema design and optimization
- Day 5: Initial testing and validation

**Week 2**: Data migration and sync implementation
- Day 1-3: Build sync scripts
- Day 4-5: Run initial data import
- Day 6-7: Verify data integrity

**Week 3**: Client integration and testing
- Day 1-2: Replace Apollo with Supabase client
- Day 3-4: Update components and hooks
- Day 5-7: Comprehensive testing

**Week 4**: Optimization and production deployment
- Day 1-2: Performance optimization
- Day 3-4: Load testing
- Day 5: Production deployment
- Day 6-7: Monitoring and fixes

### Risk Mitigation

1. **Data Consistency**
   - Maintain current architecture during migration
   - Run both systems in parallel initially
   - Implement data validation checks

2. **Rollback Plan**
   - Keep Railway server operational
   - Feature flags for gradual rollout
   - Complete data export capabilities

3. **Performance Risks**
   - Comprehensive load testing
   - Gradual traffic migration
   - Monitor all metrics closely

### Cost Analysis

| Service | Current Cost | Projected Cost |
|---------|-------------|----------------|
| Railway | $20/month | $5/month (sync only) |
| Vercel | $20/month | $20/month |
| Supabase | $0 | $25/month (Pro) |
| **Total** | **$40/month** | **$50/month** |

*Note: Supabase free tier may be sufficient initially*

## Adding New Language Support

Step-by-step guide for adding a new language to the Pokemon Pokedex application.

### Prerequisites

1. Verify language support in PokeAPI: https://pokeapi.co/api/v2/language/
2. Identify the PokeAPI language code (e.g., "de" for German)
3. Prepare comprehensive UI translations (400+ strings)

### Implementation Steps

#### 1. Create Language Dictionary File

Create `client/lib/dictionaries/[lang].json` with all UI translations:

```json
{
  "common": {
    "appName": "Pokédex",
    "search": "Suchen",
    "loading": "Laden...",
    // ... 50+ common translations
  },
  "pokemon": {
    "abilities": "Fähigkeiten",
    "stats": "Statistiken",
    // ... 100+ Pokemon-specific translations
  },
  // ... more sections
}
```

#### 2. Update Type System

Add language to Locale type in `client/lib/dictionaries.ts`:

```typescript
export type Locale = 'en' | 'ja' | 'de'; // Add new language
```

#### 3. Configure Dictionary Loading

Update `client/lib/get-dictionary.ts`:

```typescript
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  ja: () => import('./dictionaries/ja.json').then((module) => module.default),
  de: () => import('./dictionaries/de.json').then((module) => module.default), // Add
};
```

#### 4. Update Language Storage

Modify `client/lib/languageStorage.ts`:

```typescript
const SUPPORTED_LANGUAGES = ['en', 'ja', 'de']; // Add new language

export function isValidLanguage(lang: string): boolean {
  return SUPPORTED_LANGUAGES.includes(lang);
}
```

#### 5. Configure Routing

Update `client/middleware.ts`:

```typescript
const locales = ['en', 'ja', 'de']; // Add new language
```

#### 6. Update Static Generation

Add to all `generateStaticParams` functions:

```typescript
export async function generateStaticParams() {
  const languages = ['en', 'ja', 'de']; // Add new language
  // ... rest of function
}
```

#### 7. Add Pokemon Data Integration

Update `client/lib/pokemonUtils.ts`:

```typescript
function getPokeAPILanguageCode(locale: Locale): string {
  const mapping: Record<Locale, string> = {
    'en': 'en',
    'ja': 'ja',
    'de': 'de', // Add mapping
  };
  return mapping[locale] || 'en';
}
```

#### 8. Update Language Toggle

Modify `client/components/layout/LanguageToggle.tsx`:

```typescript
const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'de', name: 'Deutsch' }, // Add new option
];
```

#### 9. Update All Dictionaries

Add new language option to ALL existing dictionary files:

```json
// In all dictionary files
"languages": {
  "en": "English",
  "ja": "日本語",
  "de": "Deutsch" // Add to all files
}
```

#### 10. Update SEO Metadata

Add alternate URLs in page components:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    alternates: {
      languages: {
        'en': `/en/pokemon/${params.id}`,
        'ja': `/ja/pokemon/${params.id}`,
        'de': `/de/pokemon/${params.id}`, // Add
      }
    }
  };
}
```

### Testing Checklist

- [ ] All UI text displays correctly
- [ ] Pokemon names load in new language
- [ ] Type/ability names are translated
- [ ] Language switcher works
- [ ] URLs are correct (/de/pokemon/25)
- [ ] SEO metadata is generated
- [ ] Build completes successfully
- [ ] No TypeScript errors

### Build Impact

Adding a language increases build time and pages:

| Languages | Pages | Build Time |
|-----------|-------|------------|
| 2 (current) | 2,786 | ~13 min |
| 3 (+1) | 4,179 | ~20 min |
| 4 (+2) | 5,572 | ~26 min |

### Rollback Process

To remove a language:

1. Remove from all type definitions
2. Remove dictionary file
3. Update all configuration files
4. Remove from static generation
5. Rebuild and deploy

### Notes

- PokeAPI may not have complete data for all languages
- English is used as fallback when translations are missing
- Consider build time impact before adding many languages
- Test thoroughly with actual Pokemon data