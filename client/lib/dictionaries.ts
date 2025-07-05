export type Locale =
  | "en"
  | "ja"
  | "zh-Hant"
  | "zh-Hans"
  | "es"
  | "ko"
  | "fr"
  | "it"
  | "de";

// Dictionary type definition
export interface Dictionary {
  ui: {
    search: {
      placeholder: string;
      noResults: string;
      noResultsDescription: string;
      noFilterResults: string;
    };
    filters: {
      title: string;
      type: string;
      generation: string;
      clear: string;
      apply: string;
      showingResults: string;
      totalPokemon: string;
      filterByType: string;
      showTypeFilter: string;
      hideTypeFilter: string;
    };
    types: {
      normal: string;
      fire: string;
      water: string;
      electric: string;
      grass: string;
      ice: string;
      fighting: string;
      poison: string;
      ground: string;
      flying: string;
      psychic: string;
      bug: string;
      rock: string;
      ghost: string;
      dragon: string;
      dark: string;
      steel: string;
      fairy: string;
    };
    classifications: {
      baby: string;
      legendary: string;
      mythical: string;
    };
    navigation: {
      home: string;
      back: string;
      next: string;
      previous: string;
      generationsTitle: string;
    };
    loading: {
      loadingPokemon: string;
      loadingMore: string;
      loadingGeneration: string;
      loadingDetails: string;
      loadingRegion: string;
      generationLabel: string;
      pokemonCount: string;
      rangeLabel: string;
      loadingMoreProgress: string;
      allRegionPokemonLoaded: string;
      generationInfo: string;
      close: string;
      loadingPokedex: string;
    };
    error: {
      title: string;
      tryAgain: string;
      pokemonNotFound: string;
      goHome: string;
      unknown: string;
    };
    common: {
      loading: string;
    };
    notFound: {
      title: string;
      description: string;
      returnHome: string;
    };
    pokemonDetails: {
      height: string;
      weight: string;
      baseExperience: string;
      abilities: string;
      stats: string;
      types: string;
      moves: string;
      description: string;
      gameHistory: string;
      sprites: string;
      evolutionChain: string;
      type: string;
      category: string;
      power: string;
      accuracy: string;
      physical: string;
      special: string;
      status: string;
      noMovesFound: string;
      forms: string;
      trade: string;
      levelUp: string;
      day: string;
      night: string;
      specialCondition: string;
      versions: string;
      normal: string;
      shiny: string;
      artwork: string;
      officialArtwork: string;
      pokemonHome: string;
      gameSprites: string;
      animated: string;
      dreamWorld: string;
      showdown: string;
      icons: string;
      noSpritesAvailable: string;
      spriteLabels: {
        officialArtwork: string;
        shinyOfficialArtwork: string;
        homeFront: string;
        homeShinyFront: string;
        homeFemale: string;
        homeShinyFemale: string;
        dreamWorld: string;
        dreamWorldFemale: string;
        showdownFront: string;
        showdownBack: string;
        showdownShinyFront: string;
        showdownShinyBack: string;
        gameFront: string;
        gameBack: string;
        gameShinyFront: string;
        gameShinyBack: string;
        gameFemaleFront: string;
        gameFemaleBack: string;
        animatedFrontGenV: string;
        animatedBackGenV: string;
        animatedShinyFrontGenV: string;
        animatedShinyBackGenV: string;
        iconGenVII: string;
        femaleIconGenVII: string;
        xyFront: string;
        xyShinyFront: string;
      };
      noMovesData: string;
      noGameHistoryData: string;
      originGeneration: string;
      gameAppearances: string;
      remakes: string;
      otherGames: string;
      totalAppearances: string;
      generations: string;
      latestDescription: string;
      allDescriptions: string;
      version: string;
      noDescriptionsInLanguage: string;
      weaknesses: string;
      noMajorWeaknesses: string;
      story: string;
      level: string;
      use: string;
      learn: string;
      at: string;
      with: string;
      happiness: string;
      gender: string;
      genderless: string;
      male: string;
      female: string;
      hidden: string;
      defaultSpecies: string;
      noAdditionalInfo: string;
      noImage: string;
      noFormImage: string;
      loadingEvolutionChain: string;
      noStatsData: string;
      noStatsAvailable: string;
    };
    stats: {
      hp: string;
      attack: string;
      defense: string;
      "special-attack": string;
      "special-defense": string;
      speed: string;
      total: string;
    };
    moves: {
      levelUp: string;
      machine: string;
      egg: string;
      tutor: string;
      level: string;
      learnedAt: string;
      noMovesFoundForMethod: string;
    };
    generation: {
      displayTemplate: string;
    };
    generations: {
      [key: string]: string;
    };
    theme: {
      light: string;
      dark: string;
      toggle: string;
    };
    language: {
      english: string;
      japanese: string;
      traditionalChinese: string;
      simplifiedChinese: string;
      spanish: string;
      korean: string;
      french: string;
      italian: string;
      german: string;
      toggle: string;
    };
    sandbox: {
      title: string;
      subtitle: string;
      instructions: string;
    };
    generationSwitching: {
      switchingTo: string;
      generationRange: string;
    };
    emptyStates: {
      moves: string;
      descriptions: string;
      games: string;
      sprites: string;
      evolution: string;
      abilities: string;
      general: string;
    };
    forms: {
      categories: {
        normal: string;
        regionalVariant: string;
        megaEvolution: string;
        gigantamax: string;
        alternativeForm: string;
      };
      badges: {
        alolan: string;
        galarian: string;
        hisuian: string;
        paldean: string;
        mega: string;
        megaX: string;
        megaY: string;
        gmax: string;
        primal: string;
      };
      translations: {
        alolan: string;
        galarian: string;
        hisuian: string;
        paldean: string;
        alola: string;
        galar: string;
        hisui: string;
        paldea: string;
        mega: string;
        "mega-x": string;
        "mega-y": string;
        gmax: string;
        primal: string;
        origin: string;
        altered: string;
        sky: string;
        land: string;
        therian: string;
        incarnate: string;
        resolute: string;
        ordinary: string;
        zen: string;
        standard: string;
        blade: string;
        shield: string;
        unbound: string;
        confined: string;
        complete: string;
        "10-percent": string;
        "50-percent": string;
        "dusk-mane": string;
        "dawn-wings": string;
        ultra: string;
        "red-meteor": string;
        "blue-meteor": string;
        "yellow-meteor": string;
        "green-meteor": string;
        "orange-meteor": string;
        "indigo-meteor": string;
        "violet-meteor": string;
      };
    };
    gameVersions: {
      red: string;
      blue: string;
      yellow: string;
      gold: string;
      silver: string;
      crystal: string;
      ruby: string;
      sapphire: string;
      emerald: string;
      firered: string;
      leafgreen: string;
      diamond: string;
      pearl: string;
      platinum: string;
      heartgold: string;
      soulsilver: string;
      black: string;
      white: string;
      colosseum: string;
      xd: string;
      "black-2": string;
      "white-2": string;
      x: string;
      y: string;
      "omega-ruby": string;
      "alpha-sapphire": string;
      sun: string;
      moon: string;
      "ultra-sun": string;
      "ultra-moon": string;
      "lets-go-pikachu": string;
      "lets-go-eevee": string;
      sword: string;
      shield: string;
      "brilliant-diamond": string;
      "shining-pearl": string;
      "legends-arceus": string;
      scarlet: string;
      violet: string;
    };
    pokemonTypes: {
      normal: string;
      fire: string;
      water: string;
      electric: string;
      grass: string;
      ice: string;
      fighting: string;
      poison: string;
      ground: string;
      flying: string;
      psychic: string;
      bug: string;
      rock: string;
      ghost: string;
      dragon: string;
      dark: string;
      steel: string;
      fairy: string;
    };
    moveLearnMethods: {
      "level-up": string;
      machine: string;
      egg: string;
      tutor: string;
      "light-ball-egg": string;
      "colosseum-purification": string;
      "xd-shadow": string;
      "xd-purification": string;
      "form-change": string;
    };
    evolutionItems: {
      "thunder-stone": string;
      "fire-stone": string;
      "water-stone": string;
      "leaf-stone": string;
      "moon-stone": string;
      "sun-stone": string;
      "shiny-stone": string;
      "dusk-stone": string;
      "dawn-stone": string;
      "ice-stone": string;
      "oval-stone": string;
      "kings-rock": string;
      "metal-coat": string;
      "dragon-scale": string;
      upgrade: string;
      "dubious-disc": string;
      protector: string;
      electirizer: string;
      magmarizer: string;
      "razor-claw": string;
      "razor-fang": string;
      "reaper-cloth": string;
      "deep-sea-tooth": string;
      "deep-sea-scale": string;
      "prism-scale": string;
      sachet: string;
      "whipped-dream": string;
      "strawberry-sweet": string;
      "berry-sweet": string;
      "love-sweet": string;
      "star-sweet": string;
      "clover-sweet": string;
      "flower-sweet": string;
      "ribbon-sweet": string;
    };
  };
  meta: {
    title: string;
    description: string;
    homeTitle: string;
    homeDescription: string;
    pokemonTitle: string;
    pokemonDescription: string;
    pokemonDescriptionShort: string;
    pokemonKeywords: string;
    homeKeywords: string;
    pokemonImageAlt: string;
    fallbackImageAlt: string;
    locale: string;
  };
}

export const getLocaleFromPathname = (pathname: string): Locale => {
  const segments = pathname.split("/");
  const locale = segments[1] as Locale;
  return locale &&
    ["en", "ja", "zh-Hant", "zh-Hans", "es", "ko", "fr", "it", "de"].includes(
      locale,
    )
    ? locale
    : "en";
};

export const generateAlternateLanguageUrl = (
  pathname: string,
  newLocale: Locale,
): string => {
  const segments = pathname.split("/");
  const currentLocale = segments[1];

  if (
    currentLocale &&
    ["en", "ja", "zh-Hant", "zh-Hans", "es", "ko", "fr", "it", "de"].includes(
      currentLocale,
    )
  ) {
    segments[1] = newLocale;
    return segments.join("/");
  }

  return `/${newLocale}${pathname}`;
};

// Simple template replacement function
export const interpolate = (
  template: string,
  params: Record<string, string | number>,
): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
};
