import { pokemonService } from '../services/pokemonService';
import { cacheService } from '../services/cacheService';

export const resolvers = {
  Query: {
    hello: () => 'Hello from Pokemon GraphQL Server!',
    
    pokemon: async (_: any, { id }: { id: string }) => {
      try {
        // Check for cached response at query level
        const cacheKey = cacheService.getPokemonKey(parseInt(id));
        const cachedResult = await cacheService.get(cacheKey);
        
        if (cachedResult) {
          console.log(`Cache hit for pokemon query (id: ${id})`);
          return cachedResult;
        }

        const result = await pokemonService.getPokemonById(id);
        
        // Cache individual Pokemon for shorter time (10 minutes) since it's less frequently accessed
        // and contains heavy data (moves, evolution chains, etc.)
        await cacheService.set(cacheKey, result, 600);
        console.log(`Cached pokemon query result (id: ${id}) for 10 minutes`);
        
        return result;
      } catch (error) {
        console.error('Error fetching pokemon:', error);
        throw new Error(`Failed to fetch pokemon with id: ${id}`);
      }
    },

    pokemons: async (_: any, { limit = 20, offset = 0 }: { limit?: number; offset?: number }) => {
      try {
        // Check for cached response at query level
        const cacheKey = cacheService.getPokemonListKey(limit, offset);
        const cachedResult = await cacheService.get(cacheKey);
        
        if (cachedResult) {
          console.log(`Cache hit for pokemons query (limit: ${limit}, offset: ${offset})`);
          return cachedResult;
        }

        const result = await pokemonService.getPokemons(limit, offset);
        
        // Cache Pokemon list for longer (30 minutes) since it's frequently accessed
        await cacheService.set(cacheKey, result, 1800);
        console.log(`Cached pokemons query result (limit: ${limit}, offset: ${offset}) for 30 minutes`);
        
        return result;
      } catch (error) {
        console.error('Error fetching pokemons:', error);
        throw new Error('Failed to fetch pokemons');
      }
    },
  },
};