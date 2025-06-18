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
    const data = await this.fetchFromPokeAPI(`/pokemon/${id}`);
    return this.transformPokemonData(data);
  }

  async getPokemons(limit: number, offset: number): Promise<PokemonConnection> {
    const listData = await this.fetchFromPokeAPI(`/pokemon?limit=${limit}&offset=${offset}`);
    
    const pokemonPromises = listData.results.map(async (pokemon: any) => {
      const pokemonData = await this.fetchFromPokeAPI(`/pokemon/${pokemon.name}`);
      return this.transformPokemonData(pokemonData);
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

  private transformPokemonData(data: any): Pokemon {
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
    };
  }

  private extractIdFromUrl(url: string): string {
    const matches = url.match(/\/(\d+)\/$/);
    return matches?.[1] ?? '0';
  }
}

export const pokemonService = new PokemonService();