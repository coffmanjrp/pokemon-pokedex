/**
 * Real Pokemon Form IDs that exist in PokeAPI
 * This list contains all form Pokemon IDs (10000+) that actually exist
 * Used for fetching forms from the pokemon table
 */

export const REAL_FORM_IDS: number[] = [
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
  10229, // Hisuian Growlithe
  10230, // Hisuian Arcanine
  10231, // Hisuian Voltorb
  10232, // Hisuian Electrode
  10233, // Hisuian Typhlosion
  10234, // Hisuian Qwilfish
  10235, // Hisuian Sneasel
  10236, // Hisuian Samurott
  10237, // Hisuian Lilligant
  10238, // Hisuian Zorua
  10239, // Hisuian Zoroark
  10240, // Hisuian Braviary
  10241, // Hisuian Sliggoo
  10242, // Hisuian Goodra
  10243, // Hisuian Avalugg
  10244, // Hisuian Decidueye

  // Paldean Forms
  10250, // Paldean Tauros (Combat Breed)
  10251, // Paldean Tauros (Blaze Breed)
  10252, // Paldean Tauros (Aqua Breed)
  10253, // Paldean Wooper
  10254, // Paldean Clodsire

  // Other Forms
  10119, // Original Color Magearna
  10120, // Zen Mode Galarian Darmanitan
  10177, // Sirfetch'd
  10178, // Mr. Rime
  10179, // Runerigus
  10180, // Obstagoon
  10181, // Perrserker
  10182, // Cursola
  10184, // Morpeko Hangry Mode
  10185, // Eiscue Noice Face
  10186, // Indeedee Male
  10187, // Indeedee Female
  10193, // Zacian Crowned Sword
  10194, // Zamazenta Crowned Shield
  10195, // Eternamax Eternatus
  10228, // Overqwil
  10245, // Ursaluna
  10246, // Basculegion Male
  10247, // Basculegion Female
  10248, // Kleavor
  10249, // Wyrdeer
];

// Blacklisted form IDs (forms that exist but should not be displayed)
export const BLACKLISTED_FORM_IDS: number[] = [
  10264, 10265, 10266, 10267, 10268, 10269, 10270, 10271,
];

// Get all valid form IDs excluding blacklisted ones
export function getValidFormIds(): number[] {
  return REAL_FORM_IDS.filter((id) => !BLACKLISTED_FORM_IDS.includes(id));
}
