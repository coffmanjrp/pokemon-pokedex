/**
 * Real Pokemon Form IDs that exist in PokeAPI
 * This list contains all form Pokemon IDs (10000+) that actually exist
 * Used for pagination in the "Other" generation to skip non-existent IDs
 */

import blacklistConfig from '../../../shared/blacklist.json';

const ALL_FORM_IDS: number[] = [
  // Mega Evolutions
  10033, // Mega Venusaur
  10034, // Mega Charizard X
  10035, // Mega Charizard Y
  10036, // Mega Blastoise
  10037, // Mega Alakazam
  10038, // Mega Gengar
  10039, // Mega Kangaskhan
  10040, // Mega Pinsir
  10041, // Mega Gyarados
  10042, // Mega Aerodactyl
  10043, // Mega Mewtwo X
  10044, // Mega Mewtwo Y
  10045, // Mega Ampharos
  10046, // Mega Scizor
  10047, // Mega Heracross
  10048, // Mega Houndoom
  10049, // Mega Tyranitar
  10050, // Mega Blaziken
  10051, // Mega Gardevoir
  10052, // Mega Mawile
  10053, // Mega Aggron
  10054, // Mega Medicham
  10055, // Mega Manectric
  10056, // Mega Banette
  10057, // Mega Absol
  10058, // Mega Latias
  10059, // Mega Latios
  10060, // Mega Garchomp
  10061, // Mega Lucario
  10062, // Mega Abomasnow

  // Alolan Forms
  10091, // Alolan Rattata
  10092, // Alolan Raticate
  10093, // Alolan Raichu
  10094, // Alolan Sandshrew
  10095, // Alolan Sandslash
  10096, // Alolan Vulpix
  10097, // Alolan Ninetales
  10098, // Alolan Diglett
  10099, // Alolan Dugtrio
  10100, // Alolan Meowth
  10101, // Alolan Persian
  10102, // Alolan Geodude
  10103, // Alolan Graveler
  10104, // Alolan Golem
  10105, // Alolan Grimer
  10106, // Alolan Muk
  10107, // Alolan Exeggutor
  10108, // Alolan Marowak
  10109, // Alolan Geodude (missing from original list)
  10110, // Alolan Graveler (missing from original list)
  10111, // Alolan Golem (missing from original list)
  10112, // Alolan Grimer (missing from original list) 
  10113, // Alolan Muk (missing from original list)
  10115, // Alolan Marowak (missing from original list)
  10149, // Alolan Marowak Totem (missing from original list)

  // Galarian Forms
  10158, // Galarian Meowth
  10159, // Galarian Ponyta
  10160, // Galarian Rapidash
  10161, // Galarian Slowpoke
  10162, // Galarian Slowbro
  10163, // Galarian Farfetch'd
  10164, // Galarian Weezing
  10165, // Galarian Mr. Mime
  10166, // Galarian Articuno
  10167, // Galarian Zapdos
  10168, // Galarian Moltres
  10169, // Galarian Slowking
  10170, // Galarian Corsola
  10171, // Galarian Zigzagoon
  10172, // Galarian Linoone
  10173, // Galarian Darumaka
  10174, // Galarian Darmanitan
  10175, // Galarian Yamask
  10176, // Galarian Stunfisk
  10177, // Galarian Darmanitan (additional form)
  10178, // Galarian Darmanitan (Zen Mode)
  10179, // Galarian Yamask (additional form)
  10180, // Galarian Stunfisk (additional form)

  // Hisuian Forms
  10229, // Hisuian Growlithe (additional ID)
  10230, // Hisuian Arcanine (additional ID)
  10231, // Hisuian Voltorb (additional ID)
  10232, // Hisuian Electrode (additional ID)
  10233, // Hisuian Typhlosion (additional ID)
  10234, // Hisuian Growlithe
  10235, // Hisuian Arcanine
  10236, // Hisuian Voltorb
  10237, // Hisuian Electrode
  10238, // Hisuian Typhlosion
  10239, // Hisuian Qwilfish
  10240, // Hisuian Sneasel
  10241, // Hisuian Samurott
  10242, // Hisuian Lilligant
  10243, // Hisuian Basculin
  10244, // Hisuian Zorua
  10245, // Hisuian Zoroark
  10246, // Hisuian Braviary
  10247, // Hisuian Sliggoo
  10248, // Hisuian Goodra
  10249, // Hisuian Avalugg
  10250, // Hisuian Decidueye

  // Paldean Forms
  10251, // Paldean Tauros (Combat Breed)
  10252, // Paldean Tauros (Blaze Breed)
  10253, // Paldean Tauros (Aqua Breed)
  10254, // Paldean Wooper

  // Other Forms (Koraidon/Miraidon forms)
  10264, // Ultimate Necrozma
  10265, // Koraidon (Apex Build)
  10266, // Miraidon (Apex Build)
  10267, // Koraidon (Limited Build)
  10268, // Miraidon (Limited Build)
  10269, // Koraidon (Sprinting Build)
  10270, // Miraidon (Drive Mode)
  10271, // Koraidon (Swimming Build)
  10272, // Miraidon (Aquatic Mode)
  10273, // Koraidon (Gliding Build)
  10274, // Miraidon (Glide Mode)
  10275, // Ogerpon (Cornerstone Mask)
  10276, // Terapagos (Terastal)
  10277, // Terapagos (Stellar)
];

// Filter out blacklisted IDs
export const REAL_FORM_IDS: number[] = ALL_FORM_IDS
  .filter(id => !blacklistConfig.blacklistedFormIds.includes(id))
  .sort((a, b) => a - b); // Sort for consistent ordering

/**
 * Get Pokemon form IDs for pagination
 * @param startIndex - Starting index in the real ID list
 * @param limit - Number of IDs to return
 * @returns Array of form IDs for the specified range
 */
export function getFormIdsForPagination(startIndex: number, limit: number): number[] {
  return REAL_FORM_IDS.slice(startIndex, startIndex + limit);
}

/**
 * Get total count of real form IDs
 * @returns Total number of Pokemon forms that actually exist
 */
export function getTotalRealFormCount(): number {
  return REAL_FORM_IDS.length;
}

/**
 * Check if there are more forms after the given index
 * @param currentIndex - Current index in the real ID list
 * @param limit - Current page size
 * @returns True if there are more forms to load
 */
export function hasMoreForms(currentIndex: number, limit: number): boolean {
  return currentIndex + limit < REAL_FORM_IDS.length;
}

// Form ID to base Pokemon ID mapping (duplicated from client for server use)
const FORM_TO_BASE_ID_MAP: Record<number, number> = {
  // Mega Evolutions
  10033: 3, 10034: 6, 10035: 6, 10036: 9, 10037: 65, 10038: 94, 10039: 115,
  10040: 127, 10041: 130, 10042: 142, 10043: 150, 10044: 150, 10045: 181,
  10046: 212, 10047: 214, 10048: 229, 10049: 248, 10050: 257, 10051: 282,
  10052: 303, 10053: 306, 10054: 308, 10055: 310, 10056: 354, 10057: 359,
  10058: 380, 10059: 381, 10060: 445, 10061: 448, 10062: 460,
  
  // Alolan Forms
  10091: 19, 10092: 20, 10093: 26, 10094: 27, 10095: 28, 10096: 37, 10097: 38,
  10098: 50, 10099: 51, 10100: 52, 10101: 53, 10102: 74, 10103: 75, 10104: 76,
  10105: 88, 10106: 89, 10107: 103, 10108: 105, 10109: 74, 10110: 75, 10111: 76,
  10112: 88, 10113: 89, 10115: 105, 10149: 105,
  
  // Galarian Forms
  10158: 52, 10159: 77, 10160: 78, 10161: 79, 10162: 80, 10163: 83, 10164: 110,
  10165: 122, 10166: 144, 10167: 145, 10168: 146, 10169: 199, 10170: 222,
  10171: 263, 10172: 264, 10173: 554, 10174: 555, 10175: 562, 10176: 618,
  10177: 555, 10178: 555, 10179: 562, 10180: 618,
  
  // Hisuian Forms
  10229: 58, 10230: 59, 10231: 100, 10232: 101, 10233: 157, 10234: 58, 10235: 59,
  10236: 100, 10237: 101, 10238: 157, 10239: 211, 10240: 215, 10241: 503,
  10242: 549, 10243: 550, 10244: 570, 10245: 571, 10246: 628, 10247: 705,
  10248: 706, 10249: 713, 10250: 724,
  
  // Paldean Forms
  10251: 128, 10252: 128, 10253: 128, 10254: 194,
  
  // Other Forms
  10264: 800, 10265: 1007, 10266: 1008, 10267: 1007, 10268: 1008, 10269: 1007,
  10270: 1008, 10271: 1007, 10272: 1008, 10273: 1007, 10274: 1008, 10275: 1017,
  10276: 1024, 10277: 1024
};

/**
 * Get base Pokemon ID for a form ID (server-side implementation)
 * @param formId - The form Pokemon ID
 * @returns The base Pokemon ID, or the original ID if not a form
 */
function getBasePokemonId(formId: number): number {
  return FORM_TO_BASE_ID_MAP[formId] || formId;
}

/**
 * Get Pokemon form IDs sorted by display ID (base Pokemon ID) then actual ID
 * @returns Array of form IDs sorted by base Pokemon ID, then by actual form ID
 */
export function getSortedFormIdsByDisplayId(): number[] {
  return [...REAL_FORM_IDS].sort((a, b) => {
    const displayIdA = getBasePokemonId(a);
    const displayIdB = getBasePokemonId(b);
    
    // Primary sort: display ID (base Pokemon ID)
    if (displayIdA !== displayIdB) {
      return displayIdA - displayIdB;
    }
    
    // Secondary sort: actual form ID
    return a - b;
  });
}

/**
 * Get Pokemon form IDs for pagination using display ID sort order
 * @param startIndex - Starting index in the sorted ID list
 * @param limit - Number of IDs to return
 * @returns Array of form IDs for the specified range, sorted by display ID
 */
export function getSortedFormIdsForPagination(startIndex: number, limit: number): number[] {
  const sortedFormIds = getSortedFormIdsByDisplayId();
  return sortedFormIds.slice(startIndex, startIndex + limit);
}