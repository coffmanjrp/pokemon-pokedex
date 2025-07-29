# Pokemon Pokedex

A modern, multilingual Pokemon encyclopedia built with Next.js 15, TypeScript, and Supabase.

## ✨ Features

- **Complete Pokemon Database**: All 1025+ Pokemon across 9 generations plus special forms
- **Multilingual Support**: 8 languages (English, Japanese, Chinese (Simplified/Traditional), Spanish, Italian, German, French)
- **Advanced Search**: Cross-generation search with type filtering and Japanese support
- **Rich Animations**: 26 GSAP-powered animation effects with classification-based triggers
- **Evolution Visualization**: Card-style layout for branch evolutions
- **Performance Optimized**: SSG with ~3m 45s build time, virtual scrolling, and intelligent caching
- **Detailed Information**: Stats, abilities, evolution chains, moves, sprites, and localized descriptions
- **Responsive Design**: Ruby/Sapphire-inspired UI optimized for all devices

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript, TailwindCSS |
| **State** | Redux Toolkit |
| **Database** | Supabase (PostgreSQL) |
| **Data Source** | PokeAPI |
| **Animations** | GSAP |
| **Deployment** | Vercel (Frontend) + Railway (Data Sync Server) |

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/coffmanjrp/pokemon-pokedex.git
cd pokemon-pokedex

# Install dependencies
npm run install:all

# Setup Supabase
# 1. Create a Supabase project at https://supabase.com
# 2. Run database schema setup (see docs/SUPABASE_SETUP.md)
# 3. Create environment files as shown above

# Initial data sync (one-time setup)
cd server
npm run sync:test  # Test with Pikachu
npm run sync:gen 1 # Sync Generation 1 (or use sync:all for everything)
cd ..

# Start development servers
npm run dev
```

## ⚙️ Environment Variables

### Client Configuration

Create `client/.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Feature Flags (all enabled by default after migration)
NEXT_PUBLIC_USE_SUPABASE_FOR_LIST=true
NEXT_PUBLIC_USE_SUPABASE_FOR_DETAIL=true
NEXT_PUBLIC_USE_SUPABASE_FOR_SSG=true

# App Configuration
NEXT_PUBLIC_APP_NAME=Pokemon Pokedex
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Server Configuration (Data Sync)

Create `server/.env`:

```bash
# Supabase Configuration (for data sync)
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server Configuration
PORT=4000
NODE_ENV=production
# For development: NODE_ENV=development
```

### Production Deployment

```bash
# Example production configuration
# Frontend: https://pokemon-pokedex-client.vercel.app
# Data Sync Server: https://pokemon-pokedex-server.railway.app
# Database: Supabase (managed service)
```

## 📝 Scripts

### Development
```bash
npm run dev              # Start both client and server
npm run dev:client       # Client only (port 3000)
npm run dev:server       # Server only (port 4000)
```

### Production
```bash
npm run build           # Build for production
npm run build:fast      # Optimized parallel build (~3m 45s)
npm run start           # Start production servers
```

### Code Quality
```bash
npm run lint            # ESLint
npm run type-check      # TypeScript checks
npm run test            # Run tests
```

### Data Sync (Server)
```bash
cd server
npm run sync:test              # Test sync with Pikachu
npm run sync:pokemon [id]      # Sync specific Pokemon
npm run sync:gen [1-9]         # Sync specific generation
npm run sync:forms             # Sync special forms
npm run sync:all               # Full sync (2-3 hours)
npm run sync:evolution:enriched # Sync evolution chains
```

## 📚 Documentation

- [**Quick Reference**](CLAUDE.md) - Quick guide for development
- [**Architecture**](docs/ARCHITECTURE.md) - System design and components
- [**Development**](docs/DEVELOPMENT.md) - Setup and workflows
- [**Features**](docs/FEATURES.md) - Feature documentation
- [**Deployment**](docs/DEPLOYMENT.md) - Deployment strategies
- [**Supabase Setup**](docs/SUPABASE_SETUP.md) - Database setup guide
- [**Data Sync**](docs/DATA_SYNC.md) - Pokemon data synchronization
- [**Language Implementation**](docs/LANGUAGE_IMPLEMENTATION.md) - Adding new languages
- [**Migration**](docs/MIGRATION.md) - Database migration plans

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [**PokeAPI**](https://pokeapi.co/) - Pokemon data source
- [**Pokemon Company**](https://www.pokemon.com/) - Official artwork and data
- [**Next.js**](https://nextjs.org/) - React framework
- [**Supabase**](https://supabase.com/) - Database and backend infrastructure
- [**GSAP**](https://greensock.com/gsap/) - Animation library
- [**Vercel**](https://vercel.com/) - Frontend hosting
- [**Railway**](https://railway.app/) - Data sync server hosting

---

**Built with ❤️ for Pokemon fans worldwide**