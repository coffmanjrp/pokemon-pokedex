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
    
    return await this.transformPokemonData(pokemonData, speciesData);
  }

  async getPokemons(limit: number, offset: number): Promise<PokemonConnection> {
    const listData = await this.fetchFromPokeAPI(`/pokemon?limit=${limit}&offset=${offset}`);
    
    const pokemonPromises = listData.results.map(async (pokemon: any) => {
      const [pokemonData, speciesData] = await Promise.all([
        this.fetchFromPokeAPI(`/pokemon/${pokemon.name}`),
        this.fetchFromPokeAPI(`/pokemon-species/${pokemon.name}`).catch(() => null), // Fetch species for multilingual support
      ]);
      return await this.transformPokemonData(pokemonData, speciesData);
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

  private async transformPokemonData(data: any, speciesData: any = null): Promise<Pokemon> {
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
        evolutionChain: speciesData.evolution_chain ? 
          await this.getEvolutionChain(speciesData.evolution_chain.url) : undefined,
      } : null,
    };
  }

  private async getEvolutionChain(evolutionChainUrl: string) {
    try {
      const evolutionData = await this.fetchFromPokeAPI(evolutionChainUrl.replace(POKEAPI_BASE_URL, ''));
      
      return {
        id: this.extractIdFromUrl(evolutionChainUrl),
        url: evolutionChainUrl,
        chain: await this.transformEvolutionChainData(evolutionData.chain),
      };
    } catch (error) {
      console.error('Error fetching evolution chain:', error);
      return undefined;
    }
  }

  private async transformEvolutionChainData(chainData: any): Promise<any> {
    const pokemonData = await this.fetchFromPokeAPI(`/pokemon/${chainData.species.name}`);
    const speciesData = await this.fetchFromPokeAPI(`/pokemon-species/${chainData.species.name}`);
    
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
          const isDynamax = this.isGigantamax(formName);

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
      console.error('Error fetching Pokemon forms:', error);
      return [];
    }
  }

  private isRegionalVariant(formName: string): boolean {
    const regionalForms = ['alolan', 'galarian', 'hisuian', 'paldean'];
    return regionalForms.some(form => formName.includes(form));
  }

  private isMegaEvolution(formName: string): boolean {
    return formName.includes('mega');
  }

  private isGigantamax(formName: string): boolean {
    return formName.includes('gmax');
  }

  private async transformMoves(movesData: any[]): Promise<any[]> {
    const movePromises = movesData.map(async (moveInfo: any) => {
      try {
        // Fetch detailed move data from PokeAPI
        const moveDetailUrl = moveInfo.move.url.replace('https://pokeapi.co/api/v2', '');
        const moveDetails = await this.fetchFromPokeAPI(moveDetailUrl);

        return {
          move: {
            id: this.extractIdFromUrl(moveInfo.move.url),
            name: moveInfo.move.name,
            url: moveInfo.move.url,
            type: {
              id: this.extractIdFromUrl(moveDetails.type.url),
              name: moveDetails.type.name,
              url: moveDetails.type.url,
            },
            damageClass: {
              id: this.extractIdFromUrl(moveDetails.damage_class.url),
              name: moveDetails.damage_class.name,
              names: moveDetails.damage_class.names || [],
            },
            power: moveDetails.power,
            accuracy: moveDetails.accuracy,
            pp: moveDetails.pp,
            priority: moveDetails.priority || 0,
            target: {
              id: this.extractIdFromUrl(moveDetails.target.url),
              name: moveDetails.target.name,
              names: moveDetails.target.names || [],
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
        console.error(`Error fetching move details for ${moveInfo.move.name}:`, error);
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
    });

    return await Promise.all(movePromises);
  }

  private extractIdFromUrl(url: string): string {
    const matches = url.match(/\/(\d+)\/$/);
    return matches?.[1] ?? '0';
  }
}

export const pokemonService = new PokemonService();