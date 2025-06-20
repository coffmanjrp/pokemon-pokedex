import { NextResponse } from 'next/server';

export async function GET() {
  const endpoints = {
    title: 'Pokemon Pokedex API Debug Endpoints',
    description: 'API routes for debugging GraphQL data',
    version: '1.0.0',
    endpoints: [
      {
        path: '/api/pokemon/[id]',
        method: 'GET',
        description: 'Get complete Pokemon data including evolution chain',
        example: '/api/pokemon/2',
        parameters: {
          id: 'Pokemon ID (1-1025)'
        }
      },
      {
        path: '/api/evolution/[id]',
        method: 'GET',
        description: 'Get detailed evolution chain analysis for a Pokemon',
        example: '/api/evolution/2',
        parameters: {
          id: 'Pokemon ID (1-1025)'
        }
      }
    ],
    examples: {
      'Bulbasaur (Base)': {
        pokemon: '/api/pokemon/1',
        evolution: '/api/evolution/1'
      },
      'Ivysaur (Middle)': {
        pokemon: '/api/pokemon/2',
        evolution: '/api/evolution/2'
      },
      'Venusaur (Final)': {
        pokemon: '/api/pokemon/3',
        evolution: '/api/evolution/3'
      },
      'Charmander (Base)': {
        pokemon: '/api/pokemon/4',
        evolution: '/api/evolution/4'
      },
      'Charmeleon (Middle)': {
        pokemon: '/api/pokemon/5',
        evolution: '/api/evolution/5'
      },
      'Charizard (Final)': {
        pokemon: '/api/pokemon/6',
        evolution: '/api/evolution/6'
      }
    },
    usage: {
      note: 'These endpoints are for debugging purposes to inspect the raw GraphQL data',
      evolution_debugging: 'Use /api/evolution/[id] to see detailed analysis of evolution conditions',
      pokemon_debugging: 'Use /api/pokemon/[id] to see complete Pokemon data structure'
    }
  };

  return NextResponse.json(endpoints, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}