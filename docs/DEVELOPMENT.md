# Development Documentation

Comprehensive guide for development environment setup, workflows, and build systems.

## Table of Contents

- [Development Environment](#development-environment)
- [Development Commands](#development-commands)
- [Code Quality Pipeline](#code-quality-pipeline)
- [Build System](#build-system)
- [Testing](#testing)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## Development Environment

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Git
- VS Code (recommended) or any modern IDE

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-username/pokemon-pokedex.git
cd pokemon-pokedex

# Install dependencies
npm install

# Start development servers
npm run dev        # Frontend (Next.js)
cd server && npm run dev  # Backend (GraphQL)
```

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Backend (.env)
```env
PORT=4000
CORS_ORIGIN=http://localhost:3000
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
```

## Development Commands

### Frontend Commands

```bash
# Development
npm run dev              # Start development server (port 3000)
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
npm run format          # Format with Prettier
npm run format:check    # Check formatting

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report

# Analysis
npm run analyze         # Bundle size analysis
npm run analyze:server  # Server bundle analysis
npm run analyze:browser # Browser bundle analysis

# Build Variants
npm run build:fast      # Parallel build with auto-merge
npm run build:generational  # Build by generation
npm run build:parallel  # Parallel generation builds
npm run build:gen-1     # Build specific generation
```

### Backend Commands

```bash
cd server

# Development
npm run dev      # Start with nodemon (port 4000)
npm run build    # Compile TypeScript
npm run start    # Start production server

# Code Quality
npm run lint     # Run ESLint
npm run type-check  # TypeScript checking
```

## Code Quality Pipeline

### TypeScript Configuration

- **Strict Mode**: Enabled for maximum type safety
- **Target**: ES2020
- **Module**: ESNext with Node module resolution
- **Incremental Compilation**: Enabled for faster builds

### ESLint Rules

- Based on Next.js recommended configuration
- Custom rules for consistency:
  - No console.log in production
  - Prefer const over let
  - Explicit return types for functions
  - No unused variables

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Pre-commit Hooks

Husky + lint-staged configuration:

1. **ESLint**: Auto-fix on staged files
2. **Prettier**: Format all supported files
3. **TypeScript**: Type check changed files
4. **Tests**: Run related tests

## Build System

### Standard Build

```bash
npm run build
```

- Runs type checking first
- Executes Next.js build
- Generates static pages for all Pokemon
- Total time: ~52 minutes

### Optimized Parallel Build

```bash
npm run build:fast
```

- Builds generations in parallel
- Automatic merging of builds
- Cleanup after completion
- Total time: ~12-13 minutes (77% faster)

### Build Process Flow

```
1. Type Checking
      │
      ▼
2. Lint Checking
      │
      ▼
3. Generation Builds (Parallel)
      ├── Gen 1 (151 Pokemon)
      ├── Gen 2 (100 Pokemon)
      ├── Gen 3 (135 Pokemon)
      ├── ... (up to Gen 9)
      └── Gen 0 (Forms)
      │
      ▼
4. Merge Builds
      │
      ▼
5. Optimization
      ├── Image optimization
      ├── Code splitting
      └── Tree shaking
      │
      ▼
6. Output (.next/)
```

### Build Configuration

#### Vercel Settings
```json
{
  "buildCommand": "npm run build:fast",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "nodeVersion": "20.x"
}
```

#### Memory Optimization
```bash
# Increase Node memory for builds
NODE_OPTIONS="--max-old-space-size=8192" npm run build
```

## Testing

### Test Setup

- **Framework**: Jest with React Testing Library
- **Environment**: jsdom
- **Coverage**: Target 80%+ coverage

### Running Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test -- components/PokemonCard.test.tsx

# Run in watch mode
npm run test:watch
```

### Test Structure

```
__tests__/
├── components/      # Component tests
├── hooks/          # Custom hook tests
├── lib/            # Utility function tests
├── pages/          # Page component tests
└── api/            # API route tests
```

### Writing Tests

```typescript
import { render, screen } from '@testing-library/react';
import { PokemonCard } from '@/components/pokemon/PokemonCard';

describe('PokemonCard', () => {
  it('renders Pokemon name', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });
});
```

## Development Workflow

### Branch Strategy

```
main
 │
 ├── feature/feature-name
 ├── fix/bug-description
 ├── chore/task-description
 └── docs/documentation-update
```

### Commit Convention

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test updates
- `chore`: Maintenance tasks

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/pokemon-teams
   ```

2. **Develop and Test**
   - Write code
   - Add tests
   - Run quality checks

3. **Pre-PR Checklist**
   - [ ] Type checking passes
   - [ ] All tests pass
   - [ ] ESLint has no errors
   - [ ] Build completes successfully
   - [ ] Documentation updated

4. **Create PR**
   - Clear title and description
   - Link related issues
   - Add reviewers

5. **CI Checks**
   - GitHub Actions runs automatically
   - Must pass all checks

6. **Code Review**
   - Address feedback
   - Update as needed

7. **Merge**
   - Squash and merge
   - Delete feature branch

### Local Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
2. **GraphQL Playground**: Available at http://localhost:4000/graphql
3. **Redux DevTools**: Install browser extension for state debugging
4. **React DevTools**: Helpful for component debugging

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 4000
lsof -ti:4000 | xargs kill -9
```

#### Build Memory Issues
```bash
# Increase memory allocation
NODE_OPTIONS="--max-old-space-size=8192" npm run build
```

#### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf tsconfig.tsbuildinfo
npm run type-check
```

#### Module Resolution Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Performance Debugging

1. **Bundle Analysis**
   ```bash
   npm run analyze
   ```

2. **Lighthouse Testing**
   - Run in Chrome DevTools
   - Target scores: 90+ for all metrics

3. **React Profiler**
   - Use React DevTools Profiler
   - Identify render bottlenecks

### Debugging GraphQL

1. **Enable Debug Mode**
   ```typescript
   const server = new ApolloServer({
     debug: true,
     introspection: true,
   });
   ```

2. **Query Logging**
   - Check server logs for queries
   - Monitor PokeAPI rate limits

3. **Cache Inspection**
   - Check localStorage in browser
   - Verify cache keys and TTL