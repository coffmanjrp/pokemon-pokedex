# Deployment Documentation

Comprehensive guide for deployment, infrastructure, and optimization strategies.

## Table of Contents

- [Deployment Architecture](#deployment-architecture)
- [Environment Configuration](#environment-configuration)
- [Vercel Deployment](#vercel-deployment)
- [Railway Deployment](#railway-deployment)
- [Cache Architecture](#cache-architecture)
- [Build Optimization](#build-optimization)
- [Performance Monitoring](#performance-monitoring)
- [Troubleshooting](#troubleshooting)

## Deployment Architecture

### Hybrid Deployment Strategy

```
┌──────────────────────────────────────────────┐
│                  Production Environment           │
├───────────────────────┬───────────────────────┤
│      Vercel (Frontend)     │   Railway (Backend)   │
├───────────────────────┼───────────────────────┤
│ • Next.js 15 App         │ • GraphQL Server      │
│ • Static Generation      │ • Apollo Server       │
│ • Edge Functions         │ • Express            │
│ • Global CDN             │ • Auto-scaling       │
└───────────────────────┴───────────────────────┘
```

### Production URLs

- **Frontend**: `https://pokemon-pokedex-client.vercel.app`
- **Backend**: `https://pokemon-pokedex-server.railway.app`
- **GraphQL Endpoint**: `https://pokemon-pokedex-server.railway.app/graphql`

## Environment Configuration

### Frontend Environment Variables (Vercel)

```env
# Production
NEXT_PUBLIC_GRAPHQL_URL=https://pokemon-pokedex-server.railway.app/graphql
NEXT_PUBLIC_APP_URL=https://pokemon-pokedex-client.vercel.app

# Build Configuration
NODE_OPTIONS=--max-old-space-size=8192
ENABLE_GENERATIONAL_BUILD=true

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=xxxxx
```

### Backend Environment Variables (Railway)

```env
# Server Configuration
PORT=4000
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=https://*.vercel.app,https://pokemon-pokedex-client.vercel.app

# External APIs
POKEAPI_BASE_URL=https://pokeapi.co/api/v2

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

## Vercel Deployment

### Initial Setup

1. **Import Project**
   ```bash
   vercel
   # Follow prompts to link GitHub repo
   ```

2. **Configure Build Settings**
   ```json
   {
     "buildCommand": "npm run build:fast",
     "outputDirectory": ".next",
     "framework": "nextjs",
     "nodeVersion": "20.x"
   }
   ```

3. **Environment Variables**
   - Add all frontend environment variables
   - Set preview and production separately

### vercel.json Configuration

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "npm run build:fast",
  "functions": {
    "app/api/pokemon/[id]/route.ts": {
      "maxDuration": 30
    },
    "app/api/pokemon/[id]/full/route.ts": {
      "maxDuration": 30
    }
  },
  "images": {
    "domains": ["raw.githubusercontent.com"],
    "formats": ["image/avif", "image/webp"],
    "minimumCacheTTL": 31536000
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Build Optimization

1. **Parallel Build System**
   - Uses `npm run build:fast`
   - Builds generations in parallel
   - ~77% faster than standard build

2. **Static Page Generation**
   - 2,786 pages pre-generated
   - Organized by generation
   - Incremental Static Regeneration disabled

3. **Image Optimization**
   - Automatic AVIF/WebP conversion
   - 1-year cache TTL
   - Dynamic quality adjustment

## Railway Deployment

### Initial Setup

1. **Create New Project**
   ```bash
   railway login
   railway init
   ```

2. **Link GitHub Repository**
   - Connect to server directory
   - Enable automatic deploys

3. **Configure Build**
   ```toml
   # railway.toml
   [build]
   builder = "NIXPACKS"
   buildCommand = "npm run build"
   
   [deploy]
   startCommand = "npm start"
   healthcheckPath = "/health"
   healthcheckTimeout = 30
   restartPolicyType = "ON_FAILURE"
   restartPolicyMaxRetries = 3
   ```

### Environment Setup

- Add all backend environment variables
- Configure custom domain (optional)
- Enable HTTPS (automatic)

### Monitoring

- Built-in metrics dashboard
- Log streaming
- Deployment history
- Resource usage tracking

## Cache Architecture

### Current Implementation (Redis Removed)

```
┌──────────────────────────────────────────────┐
│                  Caching Strategy                 │
├───────────────────────┬───────────────────────┤
│    Client (Browser)     │    Server (CDN)        │
├───────────────────────┼───────────────────────┤
│ • localStorage (24hr)  │ • Cache-Control       │
│ • Apollo InMemory      │ • Edge caching        │
│ • 5 generation limit   │ • Stale-while-reval   │
└───────────────────────┴───────────────────────┘
```

### Client-Side Caching

1. **localStorage**
   - 24-hour TTL
   - UTF-8 encoding for international names
   - Automatic compression
   - Smart eviction (5 generation limit)

2. **Apollo Client**
   - InMemoryCache configuration
   - Normalized caching
   - Optimistic updates

### Server-Side Caching

1. **CDN Headers**
   ```typescript
   res.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
   ```

2. **Vercel Edge Caching**
   - Automatic edge caching
   - Global distribution
   - Smart invalidation

## Build Optimization

### Language Optimization

Reduced from 9 to 2 languages for build performance:

- **Before**: 12,537 pages, 45+ minute builds
- **After**: 2,786 pages, 12-13 minute builds
- **Reduction**: 78% fewer pages

### Parallel Build System

```javascript
// build-parallel-generations.js
const maxParallel = Math.min(os.cpus().length, 4);

for (let i = 0; i < generations.length; i += maxParallel) {
  const batch = generations.slice(i, i + maxParallel);
  await Promise.all(
    batch.map(gen => buildGeneration(gen))
  );
}
```

### Build Performance Metrics

| Build Type | Time | Memory | Pages |
|------------|------|--------|-------|
| Standard   | 52m  | 16GB   | 2786  |
| Optimized  | 27m  | 12GB   | 2786  |
| Parallel   | 13m  | 8GB    | 2786  |

### Memory Management

1. **Node Options**
   ```bash
   NODE_OPTIONS="--max-old-space-size=8192"
   ```

2. **TypeScript Incremental**
   ```json
   {
     "compilerOptions": {
       "incremental": true
     }
   }
   ```

3. **Next.js Configuration**
   ```javascript
   module.exports = {
     typescript: {
       ignoreBuildErrors: false
     },
     eslint: {
       ignoreDuringBuilds: false
     }
   };
   ```

## Performance Monitoring

### Vercel Analytics

1. **Web Vitals**
   - LCP: Target < 2.5s
   - FID: Target < 100ms
   - CLS: Target < 0.1

2. **Custom Events**
   ```typescript
   import { track } from '@vercel/analytics';
   
   track('pokemon_viewed', {
     pokemon_id: id,
     generation: generation
   });
   ```

### Railway Metrics

- CPU usage monitoring
- Memory consumption
- Response time tracking
- Error rate monitoring

### Performance Optimization Checklist

- [ ] Enable Vercel Analytics
- [ ] Configure error tracking
- [ ] Set up uptime monitoring
- [ ] Enable CDN caching
- [ ] Optimize images
- [ ] Minimize JavaScript
- [ ] Enable compression

## Troubleshooting

### Common Deployment Issues

#### Vercel Build Failures

1. **Out of Memory**
   ```bash
   # Add to environment variables
   NODE_OPTIONS=--max-old-space-size=8192
   ```

2. **Timeout Errors**
   - Use parallel build system
   - Reduce number of pages
   - Increase timeout limits

3. **Module Resolution**
   ```bash
   # Clear cache and rebuild
   vercel --force
   ```

#### Railway Issues

1. **Cold Start Delays**
   - Keep service warm with health checks
   - Implement connection pooling
   - Use persistent connections

2. **502 Errors**
   - Check server logs
   - Verify environment variables
   - Monitor resource usage

3. **CORS Errors**
   - Verify CORS_ORIGIN setting
   - Check wildcard patterns
   - Test with curl

### Deployment Rollback

#### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

#### Railway
- Use deployment history
- One-click rollback
- Automatic rollback on failure

### Health Checks

1. **Frontend Health**
   ```bash
   curl https://pokemon-pokedex-client.vercel.app/api/health
   ```

2. **Backend Health**
   ```bash
   curl https://pokemon-pokedex-server.railway.app/health
   ```

3. **GraphQL Health**
   ```bash
   curl -X POST https://pokemon-pokedex-server.railway.app/graphql \
     -H "Content-Type: application/json" \
     -d '{"query": "{ __typename }"}'   ```