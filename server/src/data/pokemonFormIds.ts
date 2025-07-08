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

  // Hisuian Forms
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