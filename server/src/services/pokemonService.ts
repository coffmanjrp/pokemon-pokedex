import axios from 'axios';
import { Pokemon, PokemonConnection } from '../types/pokemon';

const POKEAPI_BASE_URL = process.env['POKEAPI_BASE_URL'] || 'https://pokeapi.co/api/v2';

class PokemonService {
  private async fetchFromPokeAPI(endpoint: string) {
    try {
      const response = await axios.get(`${POKEAPI_BASE_URL}${endpoint}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching from PokeAPI: ${endpoint}`, error);
      throw error;
    }
  }

  async getPokemonById(id: string): Promise<Pokemon> {
    const [pokemonData, speciesData] = await Promise.all([
      this.fetchFromPokeAPI(`/pokemon/${id}`),
      this.fetchFromPokeAPI(`/pokemon-species/${id}`).catch(() => null), // Species data may not exist for all Pokemon
    ]);
    
    return this.transformPokemonData(pokemonData, speciesData);
  }

  async getPokemons(limit: number, offset: number): Promise<PokemonConnection> {
    const listData = await this.fetchFromPokeAPI(`/pokemon?limit=${limit}&offset=${offset}`);
    
    const pokemonPromises = listData.results.map(async (pokemon: any) => {
      const pokemonData = await this.fetchFromPokeAPI(`/pokemon/${pokemon.name}`);
      return this.transformPokemonData(pokemonData, null); // Don't fetch species for list view for performance
    });

    const pokemons = await Promise.all(pokemonPromises);
    
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

  private transformPokemonData(data: any, speciesData: any = null): Pokemon {
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
      abilities: data.abilities.map((abilityInfo: any) => ({
        isHidden: abilityInfo.is_hidden,
        slot: abilityInfo.slot,
        ability: {
          id: this.extractIdFromUrl(abilityInfo.ability.url),
          name: abilityInfo.ability.name,
          url: abilityInfo.ability.url,
        },
      })),
      moves: data.moves.map((moveInfo: any) => ({
        move: {
          id: this.extractIdFromUrl(moveInfo.move.url),
          name: moveInfo.move.name,
          url: moveInfo.move.url,
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
      })),
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
        genera: speciesData.genera.map((genus: any) => ({
          genus: genus.genus,
          language: {
            name: genus.language.name,
            url: genus.language.url,
          },
        })),
        generation: {
          id: this.extractIdFromUrl(speciesData.generation.url),
          name: speciesData.generation.name,
          url: speciesData.generation.url,
        },
        evolutionChain: speciesData.evolution_chain ? {
          id: this.extractIdFromUrl(speciesData.evolution_chain.url),
          url: speciesData.evolution_chain.url,
        } : null,
      } : null,
    };
  }

  private extractIdFromUrl(url: string): string {
    const matches = url.match(/\/(\d+)\/$/);
    return matches?.[1] ?? '0';
  }
}

export const pokemonService = new PokemonService();