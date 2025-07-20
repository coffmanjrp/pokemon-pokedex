/**
 * Real Pokemon Form IDs that exist in PokeAPI
 * This list contains all form Pokemon IDs (10000+) that actually exist
 * Used for pagination in the "Other" generation to skip non-existent IDs
 */

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

  // Primal Forms
  10077, // Primal Kyogre
  10078, // Primal Groudon

  // Alolan Forms
  10091,
  10092,
  10094,
  10095,
  10096,
  10097,
  10098,
  10099,
  10100,
  10101,
  10102,
  10103,
  10104,
  10105,
  10106,
  10107,
  10108,
  10109,
  10110,
  10111,
  10112,
  10113,
  10114,
  10115,

  // Galarian Forms
  10158,
  10159,
  10160,
  10161,
  10162,
  10163,
  10164,
  10165,
  10166,
  10167,
  10168,
  10169,
  10170,
  10171,
  10172,
  10173,
  10174,
  10175,
  10176,
  10177,
  10178,
  10179,
  10180,

  // Hisuian Forms
  10229,
  10230,
  10231,
  10232,
  10233,
  10234,
  10235,
  10236,
  10237,
  10238,
  10239,
  10240,
  10241,
  10242,
  10243,
  10244,
  10245,
  10246,
  10247,
  10248,
  10249,
  10250,

  // Paldean Forms
  10251,
  10252,
  10253,
  10254,

  // Gigantamax Forms
  10195, // Gigantamax Venusaur
  10196, // Gigantamax Charizard
  10197, // Gigantamax Blastoise
  10198, // Gigantamax Butterfree
  10199, // Gigantamax Pikachu
  10200, // Gigantamax Meowth
  10201, // Gigantamax Machamp
  10202, // Gigantamax Gengar
  10203, // Gigantamax Kingler
  10204, // Gigantamax Lapras
  10205, // Gigantamax Eevee
  10206, // Gigantamax Snorlax
  10207, // Gigantamax Garbodor
  10208, // Gigantamax Melmetal
  10209, // Gigantamax Rillaboom
  10210, // Gigantamax Cinderace
  10211, // Gigantamax Inteleon
  10212, // Gigantamax Corviknight
  10213, // Gigantamax Orbeetle
  10214, // Gigantamax Drednaw
  10215, // Gigantamax Coalossal
  10216, // Gigantamax Flapple
  10217, // Gigantamax Appletun
  10218, // Gigantamax Sandaconda
  10219, // Gigantamax Toxtricity
  10220, // Gigantamax Centiskorch
  10221, // Gigantamax Hatterene
  10222, // Gigantamax Grimmsnarl
  10223, // Gigantamax Alcremie
  10224, // Gigantamax Copperajah
  10225, // Gigantamax Duraludon
  10226, // Gigantamax Urshifu (Single Strike)
  10227, // Gigantamax Urshifu (Rapid Strike)

  // Other Forms
  10275,
  10276,
  10277,
];

// Blacklisted form IDs that have no sprite data
const BLACKLISTED_FORM_IDS = [
  10093, 10149, 10264, 10265, 10266, 10267, 10268, 10269, 10270, 10271,
];

/**
 * Real form IDs after filtering out blacklisted ones
 */
export const REAL_FORM_IDS: number[] = ALL_FORM_IDS.filter(
  (id) => !BLACKLISTED_FORM_IDS.includes(id),
).sort((a, b) => a - b); // Sort for consistent ordering
