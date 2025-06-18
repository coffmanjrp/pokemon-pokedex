# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pokemon Pokedex application built with Next.js 15 (App Router), React 19, TypeScript, and TailwindCSS. Features a Ruby/Sapphire-inspired game design with modern responsive layout.

## Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router and React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS with Ruby/Sapphire game-inspired design
- **State Management**: Redux Toolkit
- **GraphQL Client**: Apollo Client

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

# Backend development (when implemented)
npm run server:dev      # Start GraphQL server in development
npm run server:build    # Build GraphQL server
npm run server:start    # Start production GraphQL server
```

## Project Structure

- `/src/app/` - App Router pages and layouts
- `/src/components/` - Reusable React components
- `/src/store/` - Redux Toolkit store and slices
- `/src/types/` - TypeScript type definitions
- `/src/lib/` - Utility functions and configurations
- `/server/` - GraphQL server implementation (Apollo Server + Express)

## Key Features

### Phase 1 (Generation 1 Pokemon)
- Pokemon card display with official artwork
- Type-based color coding (Fire=red, Water=blue, etc.)
- Infinite scroll with lazy loading
- Search and filter functionality (name, type, generation)
- Language switching (Japanese/English)
- Detailed Pokemon pages with game sprites and Pokedex entries

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

## External APIs

- **PokeAPI**: Primary data source for Pokemon information
- **GraphQL Server**: Custom wrapper for efficient data fetching and caching