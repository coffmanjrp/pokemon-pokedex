export type Locale = 'en' | 'ja'

// Dictionary type definition
export interface Dictionary {
  ui: {
    search: {
      placeholder: string
      noResults: string
      noResultsDescription: string
    }
    filters: {
      title: string
      type: string
      generation: string
      clear: string
      apply: string
      showingResults: string
      totalPokemon: string
    }
    navigation: {
      home: string
      back: string
      next: string
      previous: string
    }
    loading: {
      loadingPokemon: string
      loadingMore: string
      loadingGeneration: string
      loadingDetails: string
    }
    error: {
      title: string
      tryAgain: string
      pokemonNotFound: string
      goHome: string
    }
    pokemonDetails: {
      height: string
      weight: string
      baseExperience: string
      abilities: string
      stats: string
      types: string
      moves: string
      description: string
      gameHistory: string
      sprites: string
      evolutionChain: string
    }
    stats: {
      hp: string
      attack: string
      defense: string
      specialAttack: string
      specialDefense: string
      speed: string
      total: string
    }
    moves: {
      levelUp: string
      machine: string
      egg: string
      tutor: string
      level: string
      learnedAt: string
    }
    generations: {
      [key: string]: string
    }
    theme: {
      light: string
      dark: string
      toggle: string
    }
    language: {
      english: string
      japanese: string
      toggle: string
    }
  }
  meta: {
    title: string
    description: string
    pokemonTitle: string
    pokemonDescription: string
    pokemonDescriptionShort: string
    pokemonKeywords: string
  }
}


export const getLocaleFromPathname = (pathname: string): Locale => {
  const segments = pathname.split('/')
  const locale = segments[1] as Locale
  return locale && ['en', 'ja'].includes(locale) ? locale : 'en'
}

export const generateAlternateLanguageUrl = (pathname: string, newLocale: Locale): string => {
  const segments = pathname.split('/')
  const currentLocale = segments[1]
  
  if (['en', 'ja'].includes(currentLocale)) {
    segments[1] = newLocale
    return segments.join('/')
  }
  
  return `/${newLocale}${pathname}`
}

// Simple template replacement function
export const interpolate = (template: string, params: Record<string, string | number>): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key]?.toString() || match
  })
}