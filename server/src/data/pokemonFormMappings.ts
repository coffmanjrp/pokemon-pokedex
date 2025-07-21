/**
 * Pokemon Form ID Mappings for server-side sync
 * Maps Pokemon form IDs (10000+) to their base Pokemon IDs
 */

export interface FormMapping {
  formId: number;
  basePokemonId: number;
  formName: string;
  category: "mega" | "alolan" | "galarian" | "hisuian" | "paldean" | "gigantamax" | "other";
}

export const POKEMON_FORM_MAPPINGS: FormMapping[] = [
  // Mega Evolutions
  { formId: 10033, basePokemonId: 3, formName: "mega", category: "mega" },
  { formId: 10034, basePokemonId: 6, formName: "mega-x", category: "mega" },
  { formId: 10035, basePokemonId: 6, formName: "mega-y", category: "mega" },
  { formId: 10036, basePokemonId: 9, formName: "mega", category: "mega" },
  { formId: 10037, basePokemonId: 65, formName: "mega", category: "mega" },
  { formId: 10038, basePokemonId: 94, formName: "mega", category: "mega" },
  { formId: 10039, basePokemonId: 115, formName: "mega", category: "mega" },
  { formId: 10040, basePokemonId: 127, formName: "mega", category: "mega" },
  { formId: 10041, basePokemonId: 130, formName: "mega", category: "mega" },
  { formId: 10042, basePokemonId: 142, formName: "mega", category: "mega" },
  { formId: 10043, basePokemonId: 150, formName: "mega-x", category: "mega" },
  { formId: 10044, basePokemonId: 150, formName: "mega-y", category: "mega" },
  { formId: 10045, basePokemonId: 181, formName: "mega", category: "mega" },
  { formId: 10046, basePokemonId: 212, formName: "mega", category: "mega" },
  { formId: 10047, basePokemonId: 214, formName: "mega", category: "mega" },
  { formId: 10048, basePokemonId: 229, formName: "mega", category: "mega" },
  { formId: 10049, basePokemonId: 248, formName: "mega", category: "mega" },
  { formId: 10050, basePokemonId: 257, formName: "mega", category: "mega" },
  { formId: 10051, basePokemonId: 282, formName: "mega", category: "mega" },
  { formId: 10052, basePokemonId: 303, formName: "mega", category: "mega" },
  { formId: 10053, basePokemonId: 306, formName: "mega", category: "mega" },
  { formId: 10054, basePokemonId: 308, formName: "mega", category: "mega" },
  { formId: 10055, basePokemonId: 310, formName: "mega", category: "mega" },
  { formId: 10056, basePokemonId: 354, formName: "mega", category: "mega" },
  { formId: 10057, basePokemonId: 359, formName: "mega", category: "mega" },
  { formId: 10058, basePokemonId: 380, formName: "mega", category: "mega" },
  { formId: 10059, basePokemonId: 381, formName: "mega", category: "mega" },
  { formId: 10060, basePokemonId: 445, formName: "mega", category: "mega" },
  { formId: 10061, basePokemonId: 448, formName: "mega", category: "mega" },
  { formId: 10062, basePokemonId: 460, formName: "mega", category: "mega" },

  // Alolan Forms
  { formId: 10091, basePokemonId: 19, formName: "alola", category: "alolan" },
  { formId: 10092, basePokemonId: 20, formName: "alola", category: "alolan" },
  { formId: 10093, basePokemonId: 26, formName: "alola", category: "alolan" },
  { formId: 10094, basePokemonId: 27, formName: "alola", category: "alolan" },
  { formId: 10095, basePokemonId: 28, formName: "alola", category: "alolan" },
  { formId: 10096, basePokemonId: 37, formName: "alola", category: "alolan" },
  { formId: 10097, basePokemonId: 38, formName: "alola", category: "alolan" },
  { formId: 10098, basePokemonId: 50, formName: "alola", category: "alolan" },
  { formId: 10099, basePokemonId: 51, formName: "alola", category: "alolan" },
  { formId: 10100, basePokemonId: 52, formName: "alola", category: "alolan" },
  { formId: 10101, basePokemonId: 53, formName: "alola", category: "alolan" },
  { formId: 10102, basePokemonId: 74, formName: "alola", category: "alolan" },
  { formId: 10103, basePokemonId: 75, formName: "alola", category: "alolan" },
  { formId: 10104, basePokemonId: 76, formName: "alola", category: "alolan" },
  { formId: 10105, basePokemonId: 88, formName: "alola", category: "alolan" },
  { formId: 10106, basePokemonId: 89, formName: "alola", category: "alolan" },
  { formId: 10107, basePokemonId: 103, formName: "alola", category: "alolan" },
  { formId: 10108, basePokemonId: 105, formName: "alola", category: "alolan" },
  { formId: 10109, basePokemonId: 74, formName: "alola", category: "alolan" },
  { formId: 10110, basePokemonId: 75, formName: "alola", category: "alolan" },
  { formId: 10111, basePokemonId: 76, formName: "alola", category: "alolan" },
  { formId: 10112, basePokemonId: 88, formName: "alola", category: "alolan" },
  { formId: 10113, basePokemonId: 89, formName: "alola", category: "alolan" },
  { formId: 10114, basePokemonId: 103, formName: "alola", category: "alolan" },
  { formId: 10115, basePokemonId: 105, formName: "alola", category: "alolan" },

  // Galarian Forms
  { formId: 10158, basePokemonId: 52, formName: "galar", category: "galarian" },
  { formId: 10159, basePokemonId: 77, formName: "galar", category: "galarian" },
  { formId: 10160, basePokemonId: 78, formName: "galar", category: "galarian" },
  { formId: 10161, basePokemonId: 79, formName: "galar", category: "galarian" },
  { formId: 10162, basePokemonId: 80, formName: "galar", category: "galarian" },
  { formId: 10163, basePokemonId: 83, formName: "galar", category: "galarian" },
  { formId: 10164, basePokemonId: 110, formName: "galar", category: "galarian" },
  { formId: 10165, basePokemonId: 122, formName: "galar", category: "galarian" },
  { formId: 10166, basePokemonId: 144, formName: "galar", category: "galarian" },
  { formId: 10167, basePokemonId: 145, formName: "galar", category: "galarian" },
  { formId: 10168, basePokemonId: 146, formName: "galar", category: "galarian" },
  { formId: 10169, basePokemonId: 199, formName: "galar", category: "galarian" },
  { formId: 10170, basePokemonId: 222, formName: "galar", category: "galarian" },
  { formId: 10171, basePokemonId: 263, formName: "galar", category: "galarian" },
  { formId: 10172, basePokemonId: 264, formName: "galar", category: "galarian" },
  { formId: 10173, basePokemonId: 554, formName: "galar", category: "galarian" },
  { formId: 10174, basePokemonId: 555, formName: "galar", category: "galarian" },
  { formId: 10175, basePokemonId: 562, formName: "galar", category: "galarian" },
  { formId: 10176, basePokemonId: 618, formName: "galar", category: "galarian" },

  // Hisuian Forms
  { formId: 10229, basePokemonId: 58, formName: "hisui", category: "hisuian" },
  { formId: 10230, basePokemonId: 59, formName: "hisui", category: "hisuian" },
  { formId: 10231, basePokemonId: 100, formName: "hisui", category: "hisuian" },
  { formId: 10232, basePokemonId: 101, formName: "hisui", category: "hisuian" },
  { formId: 10233, basePokemonId: 157, formName: "hisui", category: "hisuian" },
  { formId: 10234, basePokemonId: 211, formName: "hisui", category: "hisuian" },
  { formId: 10235, basePokemonId: 215, formName: "hisui", category: "hisuian" },
  { formId: 10236, basePokemonId: 503, formName: "hisui", category: "hisuian" },
  { formId: 10237, basePokemonId: 549, formName: "hisui", category: "hisuian" },
  { formId: 10238, basePokemonId: 570, formName: "hisui", category: "hisuian" },
  { formId: 10239, basePokemonId: 571, formName: "hisui", category: "hisuian" },
  { formId: 10240, basePokemonId: 628, formName: "hisui", category: "hisuian" },
  { formId: 10241, basePokemonId: 705, formName: "hisui", category: "hisuian" },
  { formId: 10242, basePokemonId: 706, formName: "hisui", category: "hisuian" },
  { formId: 10243, basePokemonId: 713, formName: "hisui", category: "hisuian" },
  { formId: 10244, basePokemonId: 724, formName: "hisui", category: "hisuian" },

  // Paldean Forms
  { formId: 10250, basePokemonId: 128, formName: "paldea-combat", category: "paldean" },
  { formId: 10251, basePokemonId: 128, formName: "paldea-blaze", category: "paldean" },
  { formId: 10252, basePokemonId: 128, formName: "paldea-aqua", category: "paldean" },
  { formId: 10253, basePokemonId: 194, formName: "paldea", category: "paldean" },
  { formId: 10254, basePokemonId: 980, formName: "paldea", category: "paldean" },

  // Other special forms
  { formId: 10119, basePokemonId: 801, formName: "original", category: "other" },
  { formId: 10120, basePokemonId: 555, formName: "galar-zen", category: "other" },
  { formId: 10177, basePokemonId: 865, formName: "normal", category: "other" },
  { formId: 10178, basePokemonId: 866, formName: "normal", category: "other" },
  { formId: 10179, basePokemonId: 867, formName: "normal", category: "other" },
  { formId: 10180, basePokemonId: 862, formName: "normal", category: "other" },
  { formId: 10181, basePokemonId: 863, formName: "normal", category: "other" },
  { formId: 10182, basePokemonId: 864, formName: "normal", category: "other" },
  { formId: 10184, basePokemonId: 877, formName: "hangry", category: "other" },
  { formId: 10185, basePokemonId: 875, formName: "noice", category: "other" },
  { formId: 10186, basePokemonId: 876, formName: "male", category: "other" },
  { formId: 10187, basePokemonId: 876, formName: "female", category: "other" },
  { formId: 10193, basePokemonId: 888, formName: "crowned", category: "other" },
  { formId: 10194, basePokemonId: 889, formName: "crowned", category: "other" },
  { formId: 10195, basePokemonId: 890, formName: "eternamax", category: "other" },
  { formId: 10228, basePokemonId: 904, formName: "normal", category: "other" },
  { formId: 10245, basePokemonId: 901, formName: "normal", category: "other" },
  { formId: 10246, basePokemonId: 902, formName: "male", category: "other" },
  { formId: 10247, basePokemonId: 902, formName: "female", category: "other" },
  { formId: 10248, basePokemonId: 900, formName: "normal", category: "other" },
  { formId: 10249, basePokemonId: 899, formName: "normal", category: "other" },
];

/**
 * Get the base Pokemon ID for a given form ID
 */
export function getBasePokemonId(formId: number): number | undefined {
  const mapping = POKEMON_FORM_MAPPINGS.find(m => m.formId === formId);
  return mapping?.basePokemonId;
}