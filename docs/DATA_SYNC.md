# Pokemon Data Sync Documentation

This document explains how to sync Pokemon data from PokeAPI to Supabase.

## Overview

The sync system fetches Pokemon data from PokeAPI and stores it in Supabase for improved performance and reliability. The system respects PokeAPI rate limits and handles errors gracefully.

## Prerequisites

1. Supabase database schema must be set up (see `/docs/sql/`)
2. Environment variables configured in `server/.env`:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Available Commands

### Test Sync
Test the sync with a single Pokemon (Pikachu):
```bash
cd server
npm run sync:test
```

### Sync Single Pokemon
Sync a specific Pokemon by ID:
```bash
npm run sync:pokemon 25    # Sync Pikachu
npm run sync:pokemon 150   # Sync Mewtwo
```

### Sync Generation
Sync all Pokemon from a specific generation:
```bash
npm run sync:gen 1    # Sync Generation 1 (Kanto)
npm run sync:gen 2    # Sync Generation 2 (Johto)
# ... up to generation 9
```

### Sync Pokemon Forms
Sync special Pokemon forms (Mega, Regional, etc.):
```bash
npm run sync:forms
```

### Full Sync
Sync ALL Pokemon data (takes 2-3 hours):
```bash
npm run sync:all
```

## Data Structure

### Pokemon Table
- Basic Pokemon data (name, height, weight, etc.)
- Types, stats, abilities as JSONB
- Sprites and moves data
- Species information including localized names
- Generation number for filtering

### Evolution Chains Table
- Complete evolution chain data
- Stored separately for performance

### Pokemon Forms Table
- Special forms (Mega, Regional, Gigantamax)
- Links to base Pokemon
- Form-specific data

## Sync Process

1. **Rate Limiting**: 50ms delay between API calls
2. **Batch Processing**: Processes Pokemon in batches of 20
3. **Error Handling**: Continues on individual failures
4. **Progress Tracking**: Real-time progress updates
5. **Data Validation**: Ensures data integrity

## Performance Considerations

- **Generation Sync**: ~5-10 minutes per generation
- **Full Sync**: ~2-3 hours for all data
- **Memory Usage**: Batch processing prevents memory issues
- **Network**: Respects PokeAPI rate limits

## Monitoring

During sync, you'll see:
- Progress updates (X/Y completed)
- Success/failure counts
- Error details for debugging
- Time elapsed

## Error Recovery

If sync fails:
1. Check error logs for specific Pokemon IDs
2. Re-run sync for failed Pokemon individually
3. Use generation sync to retry specific generations

## Best Practices

1. **Initial Setup**: Run test sync first
2. **Incremental Sync**: Sync by generation during development
3. **Full Sync**: Run during off-peak hours
4. **Monitoring**: Check Supabase dashboard for data

## Troubleshooting

### Common Issues

1. **Rate Limit Errors**
   - The system has built-in delays
   - If persistent, increase delay in `pokemonSyncService.ts`

2. **Network Timeouts**
   - Retry individual Pokemon
   - Check internet connection

3. **Memory Issues**
   - Reduce batch size in `pokemonSyncService.ts`
   - Sync smaller generations individually

### Verification

After sync, verify data in Supabase:
```sql
-- Check Pokemon count
SELECT generation, COUNT(*) 
FROM pokemon 
GROUP BY generation 
ORDER BY generation;

-- Check for missing data
SELECT id, name 
FROM pokemon 
WHERE sprites IS NULL 
OR types = '[]';
```

## Future Improvements

1. **Incremental Updates**: Only sync changed data
2. **Parallel Processing**: Speed up sync time
3. **Webhooks**: Auto-sync on PokeAPI updates
4. **Data Validation**: More comprehensive checks