# Pokemon Pokedex

Pokemon Pokedex application built with Next.js 15, TypeScript, and GraphQL.

## ✨ Features

- **Complete Pokemon Database**: All 1025+ Pokemon across 9 generations
- **Detailed Information**: Stats, abilities, evolution chains, moves, sprites

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 15, TypeScript, TailwindCSS |
| **State** | Redux Toolkit, Apollo Client |
| **Backend** | Apollo Server, Express |
| **Data** | PokeAPI, GraphQL |

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/coffmanjrp/pokemon-pokedex.git
cd pokemon-pokedex

# Install dependencies
npm run install:all

# Setup environment variables
# Create server/.env and client/.env.local files

# Start development servers
npm run dev
```

## ⚙️ Environment Variables

### Server Configuration

Create `server/.env`:

```bash
# Redis Configuration (Removed - using localStorage and CDN caching instead)
# REDIS_URL=redis://localhost:6379

# Server Configuration
PORT=4000
NODE_ENV=production
# For development: NODE_ENV=development

# CORS Configuration - Supports wildcard patterns for dynamic URLs
# For deployments with dynamic preview URLs
CORS_ORIGIN=https://*.your-hosting-provider.app,https://your-production-domain.com
# For development
# CORS_ORIGIN=http://localhost:3000
```

### Client Configuration

Create `client/.env.local`:

```bash
# GraphQL Server Configuration
# Production
NEXT_PUBLIC_GRAPHQL_URL=https://your-graphql-server.your-hosting-provider.app/graphql
# Development
# NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql

# Server Mode Configuration
NEXT_PUBLIC_SERVER_MODE=production
# For development: NEXT_PUBLIC_SERVER_MODE=development

# Build Mode Configuration (for selective data loading)
# Set to 'ssg' during SSG build time, 'runtime' for client browsing
NEXT_PUBLIC_BUILD_MODE=runtime
BUILD_MODE=runtime

# App Configuration
NEXT_PUBLIC_APP_NAME=Pokemon Pokedex
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Production Deployment URLs

```bash
# Example production configuration
# Frontend: https://your-app-name.your-hosting-provider.app
# Backend: https://your-backend-name.your-hosting-provider.app
# GraphQL: https://your-backend-name.your-hosting-provider.app/graphql
```

## 📝 Scripts

```bash
# Development
npm run dev              # Start both client and server
npm run dev:client       # Client only
npm run dev:server       # Server only

# Production
npm run build           # Build for production
npm run start           # Start production servers

# Quality
npm run lint            # ESLint
npm run type-check      # TypeScript checks
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [**PokeAPI**](https://pokeapi.co/) - Pokemon data source
- [**Pokemon Company**](https://www.pokemon.com/) - Official artwork and data
- [**Next.js**](https://nextjs.org/) - React framework
- [**Apollo GraphQL**](https://www.apollographql.com/) - Data layer

---

**Built with ❤️ for Pokemon fans** | [Development Guide](CLAUDE.md)