export type Locale = "en" | "ja";

// Dictionary type definition
export interface Dictionary {
  ui: {
    search: {
      placeholder: string;
      noResults: string;
      noResultsDescription: string;
    };
    filters: {
      title: string;
      type: string;
      generation: string;
      clear: string;
      apply: string;
      showingResults: string;
      totalPokemon: string;
    };
    navigation: {
      home: string;
      back: string;
      next: string;
      previous: string;
    };
    loading: {
      loadingPokemon: string;
      loadingMore: string;
      loadingGeneration: string;
      loadingDetails: string;
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
    };
    stats: {
      hp: string;
      attack: string;
      defense: string;
      specialAttack: string;
      specialDefense: string;
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
      toggle: string;
    };
    sandbox: {
      title: string;
      subtitle: string;
      instructions: string;
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
  };
}

export const getLocaleFromPathname = (pathname: string): Locale => {
  const segments = pathname.split("/");
  const locale = segments[1] as Locale;
  return locale && ["en", "ja"].includes(locale) ? locale : "en";
};

export const generateAlternateLanguageUrl = (
  pathname: string,
  newLocale: Locale,
): string => {
  const segments = pathname.split("/");
  const currentLocale = segments[1];

  if (currentLocale && ["en", "ja"].includes(currentLocale)) {
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
