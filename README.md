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
| **Backend** | Apollo Server, Express, Redis |
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
# Redis Configuration (Optional - falls back to in-memory cache)
REDIS_URL=your_redis_server_url

# Server Configuration
PORT=4000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=your_client_url
```

### Client Configuration

Create `client/.env.local`:

```bash
# GraphQL Server Configuration
NEXT_PUBLIC_GRAPHQL_URL=your_graphql_server_url

# App Configuration
NEXT_PUBLIC_APP_NAME=Pokemon Pokedex
NEXT_PUBLIC_APP_VERSION=1.0.0

# Build Mode Configuration (for selective data loading)
# Set to 'ssg' during SSG build time, 'runtime' for client browsing
NEXT_PUBLIC_BUILD_MODE=runtime
BUILD_MODE=runtime
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