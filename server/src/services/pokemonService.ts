import axios from 'axios';
import { Pokemon, PokemonConnection } from '../types/pokemon';
import { REAL_FORM_IDS, getFormIdsForPagination, getSortedFormIdsForPagination, getTotalRealFormCount, getSortedFormIdsByDisplayId } from '../data/pokemonFormIds';

const POKEAPI_BASE_URL = process.env['POKEAPI_BASE_URL'] || 'https://pokeapi.co/api/v2';

// Create axios instance with timeout and retry configuration
const axiosInstance = axios.create({
  timeout: 10000, // 10 second timeout
  maxRedirects: 3,
});

// In-memory cache for Pokemon form to species ID mapping
const formToSpeciesCache = new Map<number, number>();

// Add rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 50; // 50ms between requests
let totalRequests = 0;
let requestsThisMinute = 0;
let minuteResetTime = Date.now() + 60000;

class PokemonService {
  // Get species ID for a form Pokemon (with lazy loading)
  private async getFormSpeciesId(formId: number): Promise<number> {
    // Check if we already have it cached
    if (formToSpeciesCache.has(formId)) {
      return formToSpeciesCache.get(formId)!;
    }
    
    try {
      // Fetch the Pokemon data to get species info
      const pokemonData = await this.fetchFromPokeAPI(`/pokemon/${formId}`);
      if (pokemonData && pokemonData.species) {
        const speciesId = parseInt(pokemonData.species.url.match(/\/(\d+)\/?$/)?.[1] || formId.toString());
        formToSpeciesCache.set(formId, speciesId);
        return speciesId;
      }
    } catch (error) {
      console.warn(`Could not fetch species mapping for form ${formId}:`, error);
    }
    
    // Fallback to the form ID itself if we can't fetch species data
    return formId;
  }
  
  // Get sorted form IDs based on species ID (using pre-sorted data)
  private async getSortedFormIds(): Promise<number[]> {
    // Use the pre-sorted form IDs from pokemonFormIds.ts
    // This avoids the need to fetch all species data at once
    return getSortedFormIdsByDisplayId();
  }
  // Rate limiting helper with monitoring
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    
    // Reset minute counter if needed
    if (now > minuteResetTime) {
      requestsThisMinute = 0;
      minuteResetTime = now + 60000;
    }
    
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    lastRequestTime = Date.now();
    totalRequests++;
    requestsThisMinute++;
    
    // Rate limiting applied
  }

  // Limit concurrent requests to prevent overwhelming PokeAPI
  private async processWithConcurrencyLimit<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    concurrencyLimit: number = 5
  ): Promise<R[]> {
    const results: R[] = [];
    for (let i = 0; i < items.length; i += concurrencyLimit) {
      const batch = items.slice(i, i + concurrencyLimit);
      const batchResults = await Promise.all(batch.map(processor));
      results.push(...batchResults);
      
      // Add small delay between batches to be nice to PokeAPI
      if (i + concurrencyLimit < items.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    return results;
  }

  private async fetchFromPokeAPI(endpoint: string, retryCount = 0): Promise<any> {
    // Apply rate limiting
    await this.enforceRateLimit();

    const maxRetries = 3;
    const delay = (attempt: number) => new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt))); // Exponential backoff
    
    try {
      const response = await axiosInstance.get(`${POKEAPI_BASE_URL}${endpoint}`);
      return response.data;
    } catch (error: any) {
      // Retry on network errors or server errors
      if (retryCount < maxRetries && (
        error.code === 'ECONNRESET' || 
        error.code === 'ETIMEDOUT' || 
        error.code === 'ENOTFOUND' ||
        (error.response && error.response.status >= 500)
      )) {
        await delay(retryCount);
        return this.fetchFromPokeAPI(endpoint, retryCount + 1);
      }
      
      // Return null instead of throwing for non-critical data
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        return null;
      }
      
      throw error;
    }
  }

  async getPokemonById(id: string): Promise<Pokemon> {
    const pokemonData = await this.fetchFromPokeAPI(`/pokemon/${id}`);
    
    // Get species data using the species URL from Pokemon data instead of Pokemon ID
    // This handles variant Pokemon correctly (e.g., Alolan forms)
    let speciesData = null;
    if (pokemonData.species && pokemonData.species.url) {
      try {
        const speciesEndpoint = pokemonData.species.url.replace('https://pokeapi.co/api/v2', '');
        speciesData = await this.fetchFromPokeAPI(speciesEndpoint);
      } catch (error) {
        console.warn(`Could not fetch species data for Pokemon ${id}:`, error);
      }
    }
    
    return await this.transformPokemonData(pokemonData, speciesData);
  }

  async getPokemons(limit: number, offset: number): Promise<PokemonConnection> {
    const listData = await this.fetchFromPokeAPI(`/pokemon?limit=${limit}&offset=${offset}`);
    
    const pokemonProcessor = async (pokemon: any) => {
      const pokemonData = await this.fetchFromPokeAPI(`/pokemon/${pokemon.name}`);
      
      if (!pokemonData) {
        console.warn(`Could not fetch Pokemon data for ${pokemon.name}`);
        return null;
      }
      
      // Get species data using the species URL from Pokemon data
      let speciesData = null;
      if (pokemonData.species && pokemonData.species.url) {
        try {
          const speciesEndpoint = pokemonData.species.url.replace('https://pokeapi.co/api/v2', '');
          speciesData = await this.fetchFromPokeAPI(speciesEndpoint);
        } catch (error) {
          console.warn(`Could not fetch species data for Pokemon ${pokemon.name}:`, error);
        }
      }
      
      return await this.transformPokemonData(pokemonData, speciesData);
    };

    // Use concurrency limit for Pokemon processing (reduced from 5 to 3)
    const pokemonResults = await this.processWithConcurrencyLimit(listData.results, pokemonProcessor, 3);
    const pokemons = pokemonResults.filter(pokemon => pokemon !== null);
    
    const edges = pokemons.map((pokemon, index) => ({
      node: pokemon,
      cursor: Buffer.from(`${offset + index}`).toString('base64'),
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage: listData.next !== null,
        hasPreviousPage: listData.previous !== null,
        startCursor: edges[0]?.cursor || null,
        endCursor: edges[edges.length - 1]?.cursor || null,
      },
      totalCount: listData.count,
    };
  }

  // Lightweight methods for selective data loading
  async getPokemonBasicById(id: string): Promise<any> {
    const pokemonData = await this.fetchFromPokeAPI(`/pokemon/${id}`);
    
    // Get basic species data (names and genera only)
    let speciesData = null;
    if (pokemonData.species && pokemonData.species.url) {
      try {
        const speciesEndpoint = pokemonData.species.url.replace('https://pokeapi.co/api/v2', '');
        speciesData = await this.fetchFromPokeAPI(speciesEndpoint);
      } catch (error) {
        console.warn(`Could not fetch species data for Pokemon ${id}:`, error);
      }
    }
    
    return this.transformPokemonBasicData(pokemonData, speciesData);
  }

  async getPokemonsBasic(limit: number, offset: number): Promise<any> {
    // Special handling for Generation 0 (Other) - Pokemon forms with IDs 10000+
    if (offset >= 10000) {
      return this.getPokemonFormsBasic(limit, offset);
    }
    
    const listData = await this.fetchFromPokeAPI(`/pokemon?limit=${limit}&offset=${offset}`);
    
    const pokemonProcessor = async (pokemon: any) => {
      const pokemonData = await this.fetchFromPokeAPI(`/pokemon/${pokemon.name}`);
      
      if (!pokemonData) {
        console.warn(`Could not fetch Pokemon data for ${pokemon.name}`);
        return null;
      }
      
      // Get basic species data (names and genera only)
      let speciesData = null;
      if (pokemonData.species && pokemonData.species.url) {
        try {
          const speciesEndpoint = pokemonData.species.url.replace('https://pokeapi.co/api/v2', '');
          speciesData = await this.fetchFromPokeAPI(speciesEndpoint);
        } catch (error) {
          console.warn(`Could not fetch species data for Pokemon ${pokemon.name}:`, error);
        }
      }
      
      return this.transformPokemonBasicData(pokemonData, speciesData);
    };

    // Use concurrency limit for Pokemon processing
    const pokemonResults = await this.processWithConcurrencyLimit(listData.results, pokemonProcessor, 3);
    const pokemons = pokemonResults.filter(pokemon => pokemon !== null);
    
    const edges = pokemons.map((pokemon, index) => ({
      node: pokemon,
      cursor: Buffer.from(`${offset + index}`).toString('base64'),
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage: listData.next !== null,
        hasPreviousPage: listData.previous !== null,
        startCursor: edges[0]?.cursor || null,
        endCursor: edges[edges.length - 1]?.cursor || null,
      },
      totalCount: listData.count,
    };
  }

  // Special handler for Pokemon forms (Generation 0)
  async getPokemonFormsBasic(limit: number, offset: number): Promise<any> {
    // Calculate which form IDs to fetch based on offset
    // Client sends offset as 10032 (10033 - 1), so we need to add 1
    const startIndex = offset >= 10032 ? offset - 10032 : 0; // Convert offset to index in form IDs array
    
    // Get sorted form IDs based on species ID
    const sortedFormIds = await this.getSortedFormIds();
    
    // Get the form IDs for this page
    const formIds = sortedFormIds.slice(startIndex, startIndex + limit);
    
    const pokemonProcessor = async (formId: number) => {
      const pokemonData = await this.fetchFromPokeAPI(`/pokemon/${formId}`);
      
      if (!pokemonData) {
        console.warn(`Could not fetch Pokemon form data for ID ${formId}`);
        return null;
      }
      
      // Get basic species data (names and genera only)
      let speciesData = null;
      if (pokemonData.species && pokemonData.species.url) {
        try {
          const speciesEndpoint = pokemonData.species.url.replace('https://pokeapi.co/api/v2', '');
          speciesData = await this.fetchFromPokeAPI(speciesEndpoint);
        } catch (error) {
          console.warn(`Could not fetch species data for Pokemon form ${formId}:`, error);
        }
      }
      
      return this.transformPokemonBasicData(pokemonData, speciesData);
    };

    // Use concurrency limit for Pokemon processing
    const pokemonResults = await this.processWithConcurrencyLimit(
      formIds.map(id => ({ id })), 
      (item) => pokemonProcessor(item.id), 
      3
    );
    const pokemons = pokemonResults.filter(pokemon => pokemon !== null);
    
    const edges = pokemons.map((pokemon, index) => ({
      node: pokemon,
      cursor: Buffer.from(`${offset + index}`).toString('base64'),
    }));

    const totalFormCount = sortedFormIds.length;
    const hasMoreForms = startIndex + limit < totalFormCount;

    return {
      edges,
      pageInfo: {
        hasNextPage: hasMoreForms,
        hasPreviousPage: startIndex > 0,
        startCursor: edges[0]?.cursor || null,
        endCursor: edges[edges.length - 1]?.cursor || null,
      },
      totalCount: totalFormCount,
    };
  }

  // Lightweight transformation for basic Pokemon data (browsing)
  private transformPokemonBasicData(data: any, speciesData: any = null): any {
    // Extract form name from the Pokemon name
    const formName = this.extractFormName(data.name);
    
    return {
      id: data.id.toString(),
      name: data.name,
      types: data.types.map((typeInfo: any) => ({
        slot: typeInfo.slot,
        type: {
          id: this.extractIdFromUrl(typeInfo.type.url),
          name: typeInfo.type.name,
          url: typeInfo.type.url,
        },
      })),
      sprites: {
        frontDefault: data.sprites.front_default,
        frontShiny: data.sprites.front_shiny,
        backDefault: data.sprites.back_default,
        backShiny: data.sprites.back_shiny,
        other: {
          officialArtwork: {
            frontDefault: data.sprites.other?.['official-artwork']?.front_default ?? undefined,
            frontShiny: data.sprites.other?.['official-artwork']?.front_shiny ?? undefined,
          },
          home: {
            frontDefault: data.sprites.other?.home?.front_default,
            frontShiny: data.sprites.other?.home?.front_shiny,
          },
        },
      },
      species: speciesData ? {
        id: speciesData.id.toString(),
        name: speciesData.name,
        names: speciesData.names.map((nameEntry: any) => ({
          name: nameEntry.name,
          language: {
            name: nameEntry.language.name,
            url: nameEntry.language.url,
          },
        })),
        genera: speciesData.genera ? speciesData.genera.map((genus: any) => ({
          genus: genus.genus,
          language: {
            name: genus.language.name,
            url: genus.language.url,
          },
        })) : [],
        genderRate: speciesData.gender_rate ?? 4, // Default to 50/50 ratio if not available
        hasGenderDifferences: speciesData.has_gender_differences ?? false,
        isBaby: speciesData.is_baby ?? false,
        isLegendary: speciesData.is_legendary ?? false,
        isMythical: speciesData.is_mythical ?? false,
      } : {
        // Return minimal species object with empty arrays when species data is not available
        id: data.id.toString(),
        name: data.name,
        names: [],
        genera: [],
        genderRate: 4, // Default to 50/50 ratio
        hasGenderDifferences: false,
        isBaby: false,
        isLegendary: false,
        isMythical: false,
      },
      // Add form-related fields
      formName: formName,
      isRegionalVariant: this.isRegionalVariant(formName),
      isMegaEvolution: this.isMegaEvolution(formName),
      isDynamax: this.isDynamax(formName),
    };
  }

  private async transformPokemonData(data: any, speciesData: any = null): Promise<Pokemon> {
    // Extract form name from the Pokemon name
    const formName = this.extractFormName(data.name);
    
    return {
      id: data.id.toString(),
      name: data.name,
      height: data.height,
      weight: data.weight,
      baseExperience: data.base_experience,
      types: data.types.map((typeInfo: any) => ({
        slot: typeInfo.slot,
        type: {
          id: this.extractIdFromUrl(typeInfo.type.url),
          name: typeInfo.type.name,
          url: typeInfo.type.url,
        },
      })),
      sprites: {
        frontDefault: data.sprites.front_default,
        frontShiny: data.sprites.front_shiny,
        backDefault: data.sprites.back_default,
        backShiny: data.sprites.back_shiny,
        other: {
          officialArtwork: {
            frontDefault: data.sprites.other?.['official-artwork']?.front_default ?? undefined,
            frontShiny: data.sprites.other?.['official-artwork']?.front_shiny ?? undefined,
          },
          home: {
            frontDefault: data.sprites.other?.home?.front_default,
            frontShiny: data.sprites.other?.home?.front_shiny,
          },
        },
      },
      stats: data.stats.map((statInfo: any) => ({
        baseStat: statInfo.base_stat,
        effort: statInfo.effort,
        stat: {
          id: this.extractIdFromUrl(statInfo.stat.url),
          name: statInfo.stat.name,
          url: statInfo.stat.url,
        },
      })),
      abilities: await this.transformAbilities(data.abilities),
      moves: await this.transformMoves(data.moves),
      gameIndices: data.game_indices.map((gameIndex: any) => ({
        gameIndex: gameIndex.game_index,
        version: {
          name: gameIndex.version.name,
          url: gameIndex.version.url,
        },
      })),
      species: speciesData ? {
        id: speciesData.id.toString(),
        name: speciesData.name,
        names: speciesData.names.map((nameEntry: any) => ({
          name: nameEntry.name,
          language: {
            name: nameEntry.language.name,
            url: nameEntry.language.url,
          },
        })),
        flavorTextEntries: speciesData.flavor_text_entries.map((entry: any) => ({
          flavorText: entry.flavor_text,
          language: {
            name: entry.language.name,
            url: entry.language.url,
          },
          version: {
            name: entry.version.name,
            url: entry.version.url,
          },
        })),
        genera: speciesData.genera ? speciesData.genera.map((genus: any) => ({
          genus: genus.genus,
          language: {
            name: genus.language.name,
            url: genus.language.url,
          },
        })) : [],
        generation: {
          id: this.extractIdFromUrl(speciesData.generation.url),
          name: speciesData.generation.name,
          url: speciesData.generation.url,
        },
        genderRate: speciesData.gender_rate ?? 4, // Default to 50/50 ratio if not available
        hasGenderDifferences: speciesData.has_gender_differences ?? false,
        isBaby: speciesData.is_baby ?? false,
        isLegendary: speciesData.is_legendary ?? false,
        isMythical: speciesData.is_mythical ?? false,
        evolutionChain: speciesData.evolution_chain ? 
          await this.getEvolutionChain(speciesData.evolution_chain.url)
        : undefined,
      } : {
        // Return minimal species object with empty arrays when species data is not available
        id: data.id.toString(),
        name: data.name,
        names: [],
        flavorTextEntries: [],
        genera: [],
        generation: null,
        genderRate: 4, // Default to 50/50 ratio
        hasGenderDifferences: false,
        isBaby: false,
        isLegendary: false,
        isMythical: false,
        evolutionChain: undefined,
      },
      // Add form-related fields
      formName: formName,
      isRegionalVariant: this.isRegionalVariant(formName),
      isMegaEvolution: this.isMegaEvolution(formName),
      isDynamax: this.isDynamax(formName),
    };
  }

  private async getEvolutionChain(evolutionChainUrl: string) {
    try {
      const endpoint = evolutionChainUrl.replace(POKEAPI_BASE_URL, '');
      const evolutionData = await this.fetchFromPokeAPI(endpoint);
      
      return {
        id: this.extractIdFromUrl(evolutionChainUrl),
        url: evolutionChainUrl,
        chain: await this.transformEvolutionChainData(evolutionData.chain),
      };
    } catch (error) {
      // Return undefined if evolution chain fetch fails
      return undefined;
    }
  }

  private async transformEvolutionChainData(chainData: any): Promise<any> {
    const pokemonData = await this.fetchFromPokeAPI(`/pokemon/${chainData.species.name}`);
    
    // Get species data using the species URL from Pokemon data
    let speciesData = null;
    if (pokemonData.species && pokemonData.species.url) {
      try {
        const speciesEndpoint = pokemonData.species.url.replace('https://pokeapi.co/api/v2', '');
        speciesData = await this.fetchFromPokeAPI(speciesEndpoint);
      } catch (error) {
        console.warn(`Could not fetch species data for Pokemon ${chainData.species.name}:`, error);
        // Fallback to chainData species URL if available
        if (chainData.species.url) {
          try {
            const fallbackEndpoint = chainData.species.url.replace('https://pokeapi.co/api/v2', '');
            speciesData = await this.fetchFromPokeAPI(fallbackEndpoint);
          } catch (fallbackError) {
            console.warn(`Fallback species fetch also failed for ${chainData.species.name}:`, fallbackError);
          }
        }
      }
    }
    
    const evolvesToPromises = chainData.evolves_to.map((evolution: any) => 
      this.transformEvolutionChainData(evolution)
    );
    const evolvesTo = await Promise.all(evolvesToPromises);

    // Fetch form variations for this Pokemon
    const forms = await this.fetchPokemonForms(speciesData);

    return {
      id: this.extractIdFromUrl(chainData.species.url),
      name: chainData.species.name,
      sprites: {
        frontDefault: pokemonData.sprites.front_default,
        frontShiny: pokemonData.sprites.front_shiny,
        backDefault: pokemonData.sprites.back_default,
        backShiny: pokemonData.sprites.back_shiny,
        other: pokemonData.sprites.other ? {
          officialArtwork: pokemonData.sprites.other['official-artwork'] ? {
            frontDefault: pokemonData.sprites.other['official-artwork'].front_default,
            frontShiny: pokemonData.sprites.other['official-artwork'].front_shiny,
          } : undefined,
          home: pokemonData.sprites.other.home ? {
            frontDefault: pokemonData.sprites.other.home.front_default,
            frontShiny: pokemonData.sprites.other.home.front_shiny,
          } : undefined,
        } : undefined,
      },
      types: pokemonData.types.map((type: any) => ({
        slot: type.slot,
        type: {
          id: this.extractIdFromUrl(type.type.url),
          name: type.type.name,
          url: type.type.url,
        },
      })),
      species: speciesData ? {
        id: speciesData.id.toString(),
        name: speciesData.name,
        names: speciesData.names.map((nameEntry: any) => ({
          name: nameEntry.name,
          language: {
            name: nameEntry.language.name,
            url: nameEntry.language.url,
          },
        })),
        flavorTextEntries: speciesData.flavor_text_entries.map((entry: any) => ({
          flavorText: entry.flavor_text,
          language: {
            name: entry.language.name,
            url: entry.language.url,
          },
          version: {
            name: entry.version.name,
            url: entry.version.url,
          },
        })),
        genera: speciesData.genera ? speciesData.genera.map((genus: any) => ({
          genus: genus.genus,
          language: {
            name: genus.language.name,
            url: genus.language.url,
          },
        })) : [],
        generation: {
          id: this.extractIdFromUrl(speciesData.generation.url),
          name: speciesData.generation.name,
          url: speciesData.generation.url,
        },
        genderRate: speciesData.gender_rate ?? 4, // Default to 50/50 ratio if not available
        hasGenderDifferences: speciesData.has_gender_differences ?? false,
        isBaby: speciesData.is_baby ?? false,
        isLegendary: speciesData.is_legendary ?? false,
        isMythical: speciesData.is_mythical ?? false,
        evolutionChain: undefined, // Avoid circular reference
        varieties: speciesData.varieties.map((variety: any) => ({
          isDefault: variety.is_default,
          pokemon: {
            id: this.extractIdFromUrl(variety.pokemon.url),
            name: variety.pokemon.name,
            url: variety.pokemon.url,
          },
        })),
      } : undefined,
      evolutionDetails: (chainData.evolution_details || []).map((detail: any) => ({
        minLevel: detail.min_level,
        item: detail.item ? {
          id: this.extractIdFromUrl(detail.item.url),
          name: detail.item.name,
          url: detail.item.url,
        } : undefined,
        trigger: {
          id: this.extractIdFromUrl(detail.trigger.url),
          name: detail.trigger.name,
          url: detail.trigger.url,
        },
        timeOfDay: detail.time_of_day || undefined,
        location: detail.location ? {
          id: this.extractIdFromUrl(detail.location.url),
          name: detail.location.name,
          url: detail.location.url,
        } : undefined,
        knownMove: detail.known_move ? {
          id: this.extractIdFromUrl(detail.known_move.url),
          name: detail.known_move.name,
          url: detail.known_move.url,
        } : undefined,
        minHappiness: detail.min_happiness,
        minBeauty: detail.min_beauty,
        minAffection: detail.min_affection,
        needsOverworldRain: detail.needs_overworld_rain,
        partySpecies: detail.party_species ? {
          id: this.extractIdFromUrl(detail.party_species.url),
          name: detail.party_species.name,
          url: detail.party_species.url,
        } : undefined,
        partyType: detail.party_type ? {
          id: this.extractIdFromUrl(detail.party_type.url),
          name: detail.party_type.name,
          url: detail.party_type.url,
        } : undefined,
        relativePhysicalStats: detail.relative_physical_stats,
        tradeSpecies: detail.trade_species ? {
          id: this.extractIdFromUrl(detail.trade_species.url),
          name: detail.trade_species.name,
          url: detail.trade_species.url,
        } : undefined,
        turnUpsideDown: detail.turn_upside_down,
      })),
      evolvesTo,
      forms,
    };
  }

  private async fetchPokemonForms(speciesData: any): Promise<any[]> {
    try {
      if (!speciesData.varieties || speciesData.varieties.length <= 1) {
        return [];
      }

      const forms = [];
      for (const variety of speciesData.varieties) {
        if (!variety.is_default) {
          const variantData = await this.fetchFromPokeAPI(variety.pokemon.url.replace('https://pokeapi.co/api/v2', ''));
          
          const formName = variantData.name.replace(`${speciesData.name}-`, '');
          const isRegionalVariant = this.isRegionalVariant(formName);
          const isMegaEvolution = this.isMegaEvolution(formName);
          const isDynamax = this.isDynamax(formName);

          forms.push({
            id: variantData.id.toString(),
            name: variantData.name,
            formName,
            sprites: {
              frontDefault: variantData.sprites.front_default,
              frontShiny: variantData.sprites.front_shiny,
              backDefault: variantData.sprites.back_default,
              backShiny: variantData.sprites.back_shiny,
              other: variantData.sprites.other ? {
                officialArtwork: variantData.sprites.other['official-artwork'] ? {
                  frontDefault: variantData.sprites.other['official-artwork'].front_default,
                  frontShiny: variantData.sprites.other['official-artwork'].front_shiny,
                } : undefined,
                home: variantData.sprites.other.home ? {
                  frontDefault: variantData.sprites.other.home.front_default,
                  frontShiny: variantData.sprites.other.home.front_shiny,
                } : undefined,
              } : undefined,
            },
            types: variantData.types.map((type: any) => ({
              slot: type.slot,
              type: {
                id: this.extractIdFromUrl(type.type.url),
                name: type.type.name,
                url: type.type.url,
              },
            })),
            isRegionalVariant,
            isMegaEvolution,
            isDynamax,
          });
        }
      }

      return forms;
    } catch (error) {
      // Return empty array if form fetch fails
      return [];
    }
  }

  private async transformAbilities(abilitiesData: any[]): Promise<any[]> {
    const abilityProcessor = async (abilityInfo: any) => {
      try {
        // Fetch detailed ability data from PokeAPI
        const abilityDetailUrl = abilityInfo.ability.url.replace('https://pokeapi.co/api/v2', '');
        const abilityDetails = await this.fetchFromPokeAPI(abilityDetailUrl);
        
        if (!abilityDetails) {
          // Return basic ability data if detailed fetch fails
          return {
            isHidden: abilityInfo.is_hidden,
            slot: abilityInfo.slot,
            ability: {
              id: this.extractIdFromUrl(abilityInfo.ability.url),
              name: abilityInfo.ability.name,
              url: abilityInfo.ability.url,
              names: [],
            },
          };
        }

        return {
          isHidden: abilityInfo.is_hidden,
          slot: abilityInfo.slot,
          ability: {
            id: this.extractIdFromUrl(abilityInfo.ability.url),
            name: abilityInfo.ability.name,
            url: abilityInfo.ability.url,
            names: (abilityDetails.names || []).map((nameEntry: any) => ({
              name: nameEntry.name,
              language: {
                name: nameEntry.language.name,
                url: nameEntry.language.url,
              },
            })),
          },
        };
      } catch (error) {
        // Return basic ability data if detailed fetch fails
        return {
          isHidden: abilityInfo.is_hidden,
          slot: abilityInfo.slot,
          ability: {
            id: this.extractIdFromUrl(abilityInfo.ability.url),
            name: abilityInfo.ability.name,
            url: abilityInfo.ability.url,
            names: [],
          },
        };
      }
    };

    // Use concurrency limit to prevent overwhelming PokeAPI
    return await this.processWithConcurrencyLimit(abilitiesData, abilityProcessor, 3);
  }

  private async transformMoves(movesData: any[]): Promise<any[]> {
    // Limit to first 20 moves to reduce API calls
    const limitedMovesData = movesData.slice(0, 20);
    
    const moveProcessor = async (moveInfo: any) => {
      try {
        // Fetch detailed move data from PokeAPI
        const moveDetailUrl = moveInfo.move.url.replace('https://pokeapi.co/api/v2', '');
        const moveDetails = await this.fetchFromPokeAPI(moveDetailUrl);
        
        if (!moveDetails) {
          // Return basic move data if detailed fetch fails
          return {
            move: {
              id: this.extractIdFromUrl(moveInfo.move.url),
              name: moveInfo.move.name,
              url: moveInfo.move.url,
              names: [],
              type: { id: '1', name: 'normal', url: '' },
              damageClass: { id: '1', name: 'status', names: [] },
              power: null,
              accuracy: null,
              pp: null,
              priority: 0,
              target: { id: '1', name: 'target', names: [] },
              effectChance: null,
              flavorTextEntries: [],
            },
            versionGroupDetails: moveInfo.version_group_details || [],
          };
        }

        // Fetch damage class and target multilingual data
        let damageClassData = null;
        let targetData = null;
        
        try {
          if (moveDetails.damage_class && moveDetails.damage_class.url) {
            const damageClassUrl = moveDetails.damage_class.url.replace('https://pokeapi.co/api/v2', '');
            damageClassData = await this.fetchFromPokeAPI(damageClassUrl);
          }
        } catch (error) {
          console.warn(`Could not fetch damage class data for move ${moveInfo.move.name}:`, error);
        }
        
        try {
          if (moveDetails.target && moveDetails.target.url) {
            const targetUrl = moveDetails.target.url.replace('https://pokeapi.co/api/v2', '');
            targetData = await this.fetchFromPokeAPI(targetUrl);
          }
        } catch (error) {
          console.warn(`Could not fetch target data for move ${moveInfo.move.name}:`, error);
        }

        return {
          move: {
            id: this.extractIdFromUrl(moveInfo.move.url),
            name: moveInfo.move.name,
            url: moveInfo.move.url,
            names: (moveDetails.names || []).map((nameEntry: any) => ({
              name: nameEntry.name,
              language: {
                name: nameEntry.language.name,
                url: nameEntry.language.url,
              },
            })),
            type: {
              id: this.extractIdFromUrl(moveDetails.type.url),
              name: moveDetails.type.name,
              url: moveDetails.type.url,
            },
            damageClass: {
              id: this.extractIdFromUrl(moveDetails.damage_class.url),
              name: moveDetails.damage_class.name,
              names: damageClassData ? (damageClassData.names || []).map((nameEntry: any) => ({
                name: nameEntry.name,
                language: {
                  name: nameEntry.language.name,
                  url: nameEntry.language.url,
                },
              })) : [],
            },
            power: moveDetails.power,
            accuracy: moveDetails.accuracy,
            pp: moveDetails.pp,
            priority: moveDetails.priority || 0,
            target: {
              id: this.extractIdFromUrl(moveDetails.target.url),
              name: moveDetails.target.name,
              names: targetData ? (targetData.names || []).map((nameEntry: any) => ({
                name: nameEntry.name,
                language: {
                  name: nameEntry.language.name,
                  url: nameEntry.language.url,
                },
              })) : [],
            },
            effectChance: moveDetails.effect_chance,
            flavorTextEntries: (moveDetails.flavor_text_entries || []).map((entry: any) => ({
              flavorText: entry.flavor_text || null,
              language: {
                name: entry.language.name,
                url: entry.language.url,
              },
              versionGroup: {
                name: entry.version_group.name,
                url: entry.version_group.url,
              },
            })),
          },
          versionGroupDetails: moveInfo.version_group_details.map((detail: any) => ({
            levelLearnedAt: detail.level_learned_at,
            moveLearnMethod: {
              name: detail.move_learn_method.name,
              url: detail.move_learn_method.url,
            },
            versionGroup: {
              name: detail.version_group.name,
              url: detail.version_group.url,
            },
          })),
        };
      } catch (error) {
        // Return basic move data if detailed fetch fails
        return {
          move: {
            id: this.extractIdFromUrl(moveInfo.move.url),
            name: moveInfo.move.name,
            url: moveInfo.move.url,
            type: { id: '0', name: 'unknown', url: '' },
            damageClass: { id: '0', name: 'unknown', names: [] },
            power: null,
            accuracy: null,
            pp: null,
            priority: 0,
            target: { id: '0', name: 'unknown', names: [] },
            effectChance: null,
            flavorTextEntries: [],
          },
          versionGroupDetails: moveInfo.version_group_details.map((detail: any) => ({
            levelLearnedAt: detail.level_learned_at,
            moveLearnMethod: {
              name: detail.move_learn_method.name,
              url: detail.move_learn_method.url,
            },
            versionGroup: {
              name: detail.version_group.name,
              url: detail.version_group.url,
            },
          })),
        };
      }
    };

    // Use concurrency limit to prevent overwhelming PokeAPI
    return await this.processWithConcurrencyLimit(limitedMovesData, moveProcessor, 3);
  }

  private extractIdFromUrl(url: string): string {
    const matches = url.match(/\/(\d+)\/$/);
    return matches?.[1] ?? '0';
  }

  // Extract form name from Pokemon name (e.g., "charizard-mega-x" -> "mega-x")
  private extractFormName(pokemonName: string): string | null {
    // List of known base Pokemon names that might have forms
    const parts = pokemonName.split('-');
    if (parts.length <= 1) {
      return null;
    }
    
    // Remove the base Pokemon name and return the form suffix
    return parts.slice(1).join('-');
  }

  // Check if the Pokemon is a regional variant
  private isRegionalVariant(formName: string | null): boolean {
    if (!formName) return false;
    
    const regionalKeywords = ['alola', 'alolan', 'galar', 'galarian', 'hisui', 'hisuian', 'paldea', 'paldean'];
    return regionalKeywords.some(keyword => formName.toLowerCase().includes(keyword));
  }

  // Check if the Pokemon is a Mega Evolution
  private isMegaEvolution(formName: string | null): boolean {
    if (!formName) return false;
    
    return formName.toLowerCase().includes('mega');
  }

  // Check if the Pokemon is a Gigantamax form
  private isDynamax(formName: string | null): boolean {
    if (!formName) return false;
    
    return formName.toLowerCase().includes('gmax');
  }
}

export const pokemonService = new PokemonService();