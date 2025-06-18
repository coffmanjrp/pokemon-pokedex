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
  },
};