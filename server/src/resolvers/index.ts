import { pokemonService } from '../services/pokemonService';

export const resolvers = {
  Query: {
    hello: () => 'Hello from Pokemon GraphQL Server!',
    
    pokemon: async (_: any, { id }: { id: string }) => {
      try {
        return await pokemonService.getPokemonById(id);
      } catch (error) {
        console.error('Error fetching pokemon:', error);
        throw new Error(`Failed to fetch pokemon with id: ${id}`);
      }
    },

    pokemons: async (_: any, { limit = 20, offset = 0 }: { limit?: number; offset?: number }) => {
      try {
        return await pokemonService.getPokemons(limit, offset);
      } catch (error) {
        console.error('Error fetching pokemons:', error);
        throw new Error('Failed to fetch pokemons');
      }
    },

    // Selective data loading queries for performance optimization
    pokemonBasic: async (_: any, { id }: { id: string }) => {
      try {
        return await pokemonService.getPokemonBasicById(id);
      } catch (error) {
        console.error('Error fetching basic pokemon:', error);
        throw new Error(`Failed to fetch basic pokemon with id: ${id}`);
      }
    },

    pokemonFull: async (_: any, { id }: { id: string }) => {
      try {
        // Use the existing pokemon resolver for full data
        return await resolvers.Query.pokemon(_, { id });
      } catch (error) {
        console.error('Error fetching full pokemon:', error);
        throw new Error(`Failed to fetch full pokemon with id: ${id}`);
      }
    },

    pokemonsBasic: async (_: any, { limit = 20, offset = 0 }: { limit?: number; offset?: number }) => {
      try {
        return await pokemonService.getPokemonsBasic(limit, offset);
      } catch (error) {
        console.error('Error fetching basic pokemons:', error);
        throw new Error('Failed to fetch basic pokemons');
      }
    },

    pokemonsFull: async (_: any, { limit = 20, offset = 0 }: { limit?: number; offset?: number }) => {
      try {
        // Use the existing pokemons resolver for full data
        return await resolvers.Query.pokemons(_, { limit, offset });
      } catch (error) {
        console.error('Error fetching full pokemons:', error);
        throw new Error('Failed to fetch full pokemons');
      }
    },
  },
};