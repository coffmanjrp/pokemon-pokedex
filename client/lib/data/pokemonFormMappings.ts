/**
 * Pokemon Form ID Mappings
 * Maps Pokemon form IDs (10000+) to their base Pokemon IDs
 * Used for displaying correct Pokemon numbers in badges and navigation
 */

import blacklistConfig from "../../../shared/blacklist.json";

export interface FormMapping {
  formId: number;
  basePokemonId: number;
  formName: string;
  category:
    | "mega"
    | "alolan"
    | "galarian"
    | "hisuian"
    | "paldean"
    | "gigantamax"
    | "other";
}

/**
 * Comprehensive mapping of Pokemon forms to their base IDs
 * Source: PokeAPI form data
 */
const ALL_POKEMON_FORM_MAPPINGS: FormMapping[] = [
  // Mega Evolutions
  { formId: 10033, basePokemonId: 3, formName: "mega", category: "mega" }, // Mega Venusaur
  { formId: 10034, basePokemonId: 6, formName: "mega-x", category: "mega" }, // Mega Charizard X
  { formId: 10035, basePokemonId: 6, formName: "mega-y", category: "mega" }, // Mega Charizard Y
  { formId: 10036, basePokemonId: 9, formName: "mega", category: "mega" }, // Mega Blastoise
  { formId: 10037, basePokemonId: 65, formName: "mega", category: "mega" }, // Mega Alakazam
  { formId: 10038, basePokemonId: 94, formName: "mega", category: "mega" }, // Mega Gengar
  { formId: 10039, basePokemonId: 115, formName: "mega", category: "mega" }, // Mega Kangaskhan
  { formId: 10040, basePokemonId: 127, formName: "mega", category: "mega" }, // Mega Pinsir
  { formId: 10041, basePokemonId: 130, formName: "mega", category: "mega" }, // Mega Gyarados
  { formId: 10042, basePokemonId: 142, formName: "mega", category: "mega" }, // Mega Aerodactyl
  { formId: 10043, basePokemonId: 150, formName: "mega-x", category: "mega" }, // Mega Mewtwo X
  { formId: 10044, basePokemonId: 150, formName: "mega-y", category: "mega" }, // Mega Mewtwo Y
  { formId: 10045, basePokemonId: 181, formName: "mega", category: "mega" }, // Mega Ampharos
  { formId: 10046, basePokemonId: 212, formName: "mega", category: "mega" }, // Mega Scizor
  { formId: 10047, basePokemonId: 214, formName: "mega", category: "mega" }, // Mega Heracross
  { formId: 10048, basePokemonId: 229, formName: "mega", category: "mega" }, // Mega Houndoom
  { formId: 10049, basePokemonId: 248, formName: "mega", category: "mega" }, // Mega Tyranitar
  { formId: 10050, basePokemonId: 257, formName: "mega", category: "mega" }, // Mega Blaziken
  { formId: 10051, basePokemonId: 282, formName: "mega", category: "mega" }, // Mega Gardevoir
  { formId: 10052, basePokemonId: 303, formName: "mega", category: "mega" }, // Mega Mawile
  { formId: 10053, basePokemonId: 306, formName: "mega", category: "mega" }, // Mega Aggron
  { formId: 10054, basePokemonId: 308, formName: "mega", category: "mega" }, // Mega Medicham
  { formId: 10055, basePokemonId: 310, formName: "mega", category: "mega" }, // Mega Manectric
  { formId: 10056, basePokemonId: 354, formName: "mega", category: "mega" }, // Mega Banette
  { formId: 10057, basePokemonId: 359, formName: "mega", category: "mega" }, // Mega Absol
  { formId: 10058, basePokemonId: 380, formName: "mega", category: "mega" }, // Mega Latias
  { formId: 10059, basePokemonId: 381, formName: "mega", category: "mega" }, // Mega Latios
  { formId: 10060, basePokemonId: 445, formName: "mega", category: "mega" }, // Mega Garchomp
  { formId: 10061, basePokemonId: 448, formName: "mega", category: "mega" }, // Mega Lucario
  { formId: 10062, basePokemonId: 460, formName: "mega", category: "mega" }, // Mega Abomasnow

  // Alolan Forms
  { formId: 10091, basePokemonId: 19, formName: "alola", category: "alolan" }, // Alolan Rattata
  { formId: 10092, basePokemonId: 20, formName: "alola", category: "alolan" }, // Alolan Raticate
  { formId: 10093, basePokemonId: 26, formName: "alola", category: "alolan" }, // Alolan Raichu
  { formId: 10094, basePokemonId: 27, formName: "alola", category: "alolan" }, // Alolan Sandshrew
  { formId: 10095, basePokemonId: 28, formName: "alola", category: "alolan" }, // Alolan Sandslash
  { formId: 10096, basePokemonId: 37, formName: "alola", category: "alolan" }, // Alolan Vulpix
  { formId: 10097, basePokemonId: 38, formName: "alola", category: "alolan" }, // Alolan Ninetales
  { formId: 10098, basePokemonId: 50, formName: "alola", category: "alolan" }, // Alolan Diglett
  { formId: 10099, basePokemonId: 51, formName: "alola", category: "alolan" }, // Alolan Dugtrio
  { formId: 10100, basePokemonId: 52, formName: "alola", category: "alolan" }, // Alolan Meowth
  { formId: 10101, basePokemonId: 53, formName: "alola", category: "alolan" }, // Alolan Persian
  { formId: 10102, basePokemonId: 74, formName: "alola", category: "alolan" }, // Alolan Geodude
  { formId: 10103, basePokemonId: 75, formName: "alola", category: "alolan" }, // Alolan Graveler
  { formId: 10104, basePokemonId: 76, formName: "alola", category: "alolan" }, // Alolan Golem
  { formId: 10105, basePokemonId: 88, formName: "alola", category: "alolan" }, // Alolan Grimer
  { formId: 10106, basePokemonId: 89, formName: "alola", category: "alolan" }, // Alolan Muk
  { formId: 10107, basePokemonId: 103, formName: "alola", category: "alolan" }, // Alolan Exeggutor
  { formId: 10108, basePokemonId: 105, formName: "alola", category: "alolan" }, // Alolan Marowak
  { formId: 10109, basePokemonId: 74, formName: "alola", category: "alolan" }, // Alolan Geodude
  { formId: 10110, basePokemonId: 75, formName: "alola", category: "alolan" }, // Alolan Graveler
  { formId: 10111, basePokemonId: 76, formName: "alola", category: "alolan" }, // Alolan Golem
  { formId: 10112, basePokemonId: 88, formName: "alola", category: "alolan" }, // Alolan Grimer
  { formId: 10113, basePokemonId: 89, formName: "alola", category: "alolan" }, // Alolan Muk
  { formId: 10115, basePokemonId: 105, formName: "alola", category: "alolan" }, // Alolan Marowak
  {
    formId: 10149,
    basePokemonId: 105,
    formName: "alola-totem",
    category: "alolan",
  }, // Alolan Marowak Totem

  // Galarian Forms
  { formId: 10158, basePokemonId: 52, formName: "galar", category: "galarian" }, // Galarian Meowth
  { formId: 10159, basePokemonId: 77, formName: "galar", category: "galarian" }, // Galarian Ponyta
  { formId: 10160, basePokemonId: 78, formName: "galar", category: "galarian" }, // Galarian Rapidash
  { formId: 10161, basePokemonId: 79, formName: "galar", category: "galarian" }, // Galarian Slowpoke
  { formId: 10162, basePokemonId: 80, formName: "galar", category: "galarian" }, // Galarian Slowbro
  { formId: 10163, basePokemonId: 83, formName: "galar", category: "galarian" }, // Galarian Farfetch'd
  {
    formId: 10164,
    basePokemonId: 110,
    formName: "galar",
    category: "galarian",
  }, // Galarian Weezing
  {
    formId: 10165,
    basePokemonId: 122,
    formName: "galar",
    category: "galarian",
  }, // Galarian Mr. Mime
  {
    formId: 10166,
    basePokemonId: 144,
    formName: "galar",
    category: "galarian",
  }, // Galarian Articuno
  {
    formId: 10167,
    basePokemonId: 145,
    formName: "galar",
    category: "galarian",
  }, // Galarian Zapdos
  {
    formId: 10168,
    basePokemonId: 146,
    formName: "galar",
    category: "galarian",
  }, // Galarian Moltres
  {
    formId: 10169,
    basePokemonId: 199,
    formName: "galar",
    category: "galarian",
  }, // Galarian Slowking
  {
    formId: 10170,
    basePokemonId: 222,
    formName: "galar",
    category: "galarian",
  }, // Galarian Corsola
  {
    formId: 10171,
    basePokemonId: 263,
    formName: "galar",
    category: "galarian",
  }, // Galarian Zigzagoon
  {
    formId: 10172,
    basePokemonId: 264,
    formName: "galar",
    category: "galarian",
  }, // Galarian Linoone
  {
    formId: 10173,
    basePokemonId: 554,
    formName: "galar",
    category: "galarian",
  }, // Galarian Darumaka
  {
    formId: 10174,
    basePokemonId: 555,
    formName: "galar",
    category: "galarian",
  }, // Galarian Darmanitan
  {
    formId: 10175,
    basePokemonId: 562,
    formName: "galar",
    category: "galarian",
  }, // Galarian Yamask
  {
    formId: 10176,
    basePokemonId: 618,
    formName: "galar",
    category: "galarian",
  }, // Galarian Stunfisk

  // Hisuian Forms
  { formId: 10234, basePokemonId: 58, formName: "hisui", category: "hisuian" }, // Hisuian Growlithe
  { formId: 10235, basePokemonId: 59, formName: "hisui", category: "hisuian" }, // Hisuian Arcanine
  { formId: 10236, basePokemonId: 100, formName: "hisui", category: "hisuian" }, // Hisuian Voltorb
  { formId: 10237, basePokemonId: 101, formName: "hisui", category: "hisuian" }, // Hisuian Electrode
  { formId: 10238, basePokemonId: 157, formName: "hisui", category: "hisuian" }, // Hisuian Typhlosion
  { formId: 10239, basePokemonId: 211, formName: "hisui", category: "hisuian" }, // Hisuian Qwilfish
  { formId: 10240, basePokemonId: 215, formName: "hisui", category: "hisuian" }, // Hisuian Sneasel
  { formId: 10241, basePokemonId: 503, formName: "hisui", category: "hisuian" }, // Hisuian Samurott
  { formId: 10242, basePokemonId: 549, formName: "hisui", category: "hisuian" }, // Hisuian Lilligant
  { formId: 10243, basePokemonId: 550, formName: "hisui", category: "hisuian" }, // Hisuian Basculin
  { formId: 10244, basePokemonId: 570, formName: "hisui", category: "hisuian" }, // Hisuian Zorua
  { formId: 10245, basePokemonId: 571, formName: "hisui", category: "hisuian" }, // Hisuian Zoroark
  { formId: 10246, basePokemonId: 628, formName: "hisui", category: "hisuian" }, // Hisuian Braviary
  { formId: 10247, basePokemonId: 705, formName: "hisui", category: "hisuian" }, // Hisuian Sliggoo
  { formId: 10248, basePokemonId: 706, formName: "hisui", category: "hisuian" }, // Hisuian Goodra
  { formId: 10249, basePokemonId: 713, formName: "hisui", category: "hisuian" }, // Hisuian Avalugg
  { formId: 10250, basePokemonId: 724, formName: "hisui", category: "hisuian" }, // Hisuian Decidueye

  // Paldean Forms
  {
    formId: 10251,
    basePokemonId: 128,
    formName: "paldea-combat",
    category: "paldean",
  }, // Paldean Tauros (Combat Breed)
  {
    formId: 10252,
    basePokemonId: 128,
    formName: "paldea-blaze",
    category: "paldean",
  }, // Paldean Tauros (Blaze Breed)
  {
    formId: 10253,
    basePokemonId: 128,
    formName: "paldea-aqua",
    category: "paldean",
  }, // Paldean Tauros (Aqua Breed)
  {
    formId: 10254,
    basePokemonId: 194,
    formName: "paldea",
    category: "paldean",
  }, // Paldean Wooper

  // Other Special Forms
  { formId: 10264, basePokemonId: 800, formName: "ultra", category: "other" }, // Ultra Necrozma
  { formId: 10265, basePokemonId: 1007, formName: "apex", category: "other" }, // Koraidon (Apex Build)
  { formId: 10266, basePokemonId: 1008, formName: "apex", category: "other" }, // Miraidon (Apex Build)
  {
    formId: 10267,
    basePokemonId: 1007,
    formName: "limited",
    category: "other",
  }, // Koraidon (Limited Build)
  {
    formId: 10268,
    basePokemonId: 1008,
    formName: "limited",
    category: "other",
  }, // Miraidon (Limited Build)
  {
    formId: 10269,
    basePokemonId: 1007,
    formName: "sprinting",
    category: "other",
  }, // Koraidon (Sprinting Build)
  { formId: 10270, basePokemonId: 1008, formName: "drive", category: "other" }, // Miraidon (Drive Mode)
  {
    formId: 10271,
    basePokemonId: 1007,
    formName: "swimming",
    category: "other",
  }, // Koraidon (Swimming Build)
  {
    formId: 10272,
    basePokemonId: 1008,
    formName: "aquatic",
    category: "other",
  }, // Miraidon (Aquatic Mode)
  {
    formId: 10273,
    basePokemonId: 1007,
    formName: "gliding",
    category: "other",
  }, // Koraidon (Gliding Build)
  { formId: 10274, basePokemonId: 1008, formName: "glide", category: "other" }, // Miraidon (Glide Mode)
  {
    formId: 10275,
    basePokemonId: 1017,
    formName: "cornerstone-mask",
    category: "other",
  }, // Ogerpon (Cornerstone Mask)
  {
    formId: 10276,
    basePokemonId: 1024,
    formName: "terastal",
    category: "other",
  }, // Terapagos (Terastal)
  {
    formId: 10277,
    basePokemonId: 1024,
    formName: "stellar",
    category: "other",
  }, // Terapagos (Stellar)
];

// Filter out blacklisted form IDs
export const POKEMON_FORM_MAPPINGS: FormMapping[] =
  ALL_POKEMON_FORM_MAPPINGS.filter(
    (mapping) => !blacklistConfig.blacklistedFormIds.includes(mapping.formId),
  );

/**
 * Create a map for fast lookup of base Pokemon IDs
 */
export const FORM_TO_BASE_ID_MAP = new Map<number, number>(
  POKEMON_FORM_MAPPINGS.map((mapping) => [
    mapping.formId,
    mapping.basePokemonId,
  ]),
);

/**
 * Create a reverse map for finding all forms of a base Pokemon
 */
export const BASE_TO_FORMS_MAP = new Map<number, number[]>();
POKEMON_FORM_MAPPINGS.forEach((mapping) => {
  const existingForms = BASE_TO_FORMS_MAP.get(mapping.basePokemonId) || [];
  BASE_TO_FORMS_MAP.set(mapping.basePokemonId, [
    ...existingForms,
    mapping.formId,
  ]);
});

/**
 * Get the base Pokemon ID for a given form ID
 * @param formId - The form Pokemon ID (usually 10000+)
 * @returns The base Pokemon ID, or the original ID if it's not a form
 */
export function getBasePokemonId(formId: number): number {
  return FORM_TO_BASE_ID_MAP.get(formId) || formId;
}

/**
 * Check if a Pokemon ID is a form (alternate version)
 * @param id - The Pokemon ID to check
 * @returns True if the ID represents a Pokemon form
 */
export function isFormPokemon(id: number): boolean {
  return FORM_TO_BASE_ID_MAP.has(id);
}

/**
 * Get all form variants for a given base Pokemon ID
 * @param basePokemonId - The base Pokemon ID
 * @returns Array of form IDs for this Pokemon
 */
export function getFormVariants(basePokemonId: number): number[] {
  return BASE_TO_FORMS_MAP.get(basePokemonId) || [];
}

/**
 * Get form information for a given form ID
 * @param formId - The form Pokemon ID
 * @returns FormMapping object with details about the form
 */
export function getFormInfo(formId: number): FormMapping | undefined {
  return POKEMON_FORM_MAPPINGS.find((mapping) => mapping.formId === formId);
}

/**
 * Get Pokemon display ID (base ID for forms, original ID for base Pokemon)
 * @param pokemonId - Either a base Pokemon ID or form ID
 * @returns The ID to display in badges and UI elements
 */
export function getPokemonDisplayId(pokemonId: number): number {
  return getBasePokemonId(pokemonId);
}

/**
 * Get all real form IDs that exist in PokeAPI
 * @returns Sorted array of all real Pokemon form IDs
 */
export function getRealFormIds(): number[] {
  return POKEMON_FORM_MAPPINGS.filter(
    (mapping) => mapping.formId >= 10033 && mapping.formId <= 10277,
  )
    .map((mapping) => mapping.formId)
    .sort((a, b) => a - b);
}

/**
 * Get form IDs within a specific range (for pagination)
 * @param startIndex - Starting index in the real ID list
 * @param limit - Number of IDs to return
 * @returns Array of form IDs for the specified range
 */
export function getFormIdsForRange(
  startIndex: number,
  limit: number,
): number[] {
  const allFormIds = getRealFormIds();
  return allFormIds.slice(startIndex, startIndex + limit);
}

/**
 * Get total count of real form IDs
 * @returns Total number of Pokemon forms that actually exist
 */
export function getTotalFormCount(): number {
  // Count only forms that are in Generation 0 range (10033-10277)
  return POKEMON_FORM_MAPPINGS.filter(
    (mapping) => mapping.formId >= 10033 && mapping.formId <= 10277,
  ).length;
}
