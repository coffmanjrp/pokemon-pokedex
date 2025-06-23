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

    // Selective data loading queries for performance optimization
    pokemonBasic: async (_: any, { id }: { id: string }) => {
      try {
        const cacheKey = cacheService.getPokemonBasicKey(parseInt(id));
        const cachedResult = await cacheService.get(cacheKey);
        
        if (cachedResult) {
          console.log(`Cache hit for pokemonBasic query (id: ${id})`);
          return cachedResult;
        }

        const result = await pokemonService.getPokemonBasicById(id);
        
        // Cache basic Pokemon for longer (60 minutes) since it's lightweight and frequently accessed
        await cacheService.set(cacheKey, result, 3600);
        console.log(`Cached pokemonBasic query result (id: ${id}) for 60 minutes`);
        
        return result;
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
        const cacheKey = cacheService.getPokemonBasicListKey(limit, offset);
        const cachedResult = await cacheService.get(cacheKey);
        
        if (cachedResult) {
          console.log(`Cache hit for pokemonsBasic query (limit: ${limit}, offset: ${offset})`);
          return cachedResult;
        }

        const result = await pokemonService.getPokemonsBasic(limit, offset);
        
        // Cache basic Pokemon list for longer (60 minutes) since it's lightweight and frequently accessed
        await cacheService.set(cacheKey, result, 3600);
        console.log(`Cached pokemonsBasic query result (limit: ${limit}, offset: ${offset}) for 60 minutes`);
        
        return result;
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