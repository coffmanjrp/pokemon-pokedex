import { Pokemon } from "@/types/pokemon";
import { Dictionary } from "@/lib/dictionaries";

export interface SpriteInfo {
  url: string;
  label: string;
  category: string;
}

export interface SpriteCategory {
  id: string;
  label: string;
}

/**
 * Helper function to create sprite info objects using dictionary labels
 */
const createSpriteInfo = (
  url: string | undefined,
  labelKey: string,
  category: string,
  dictionary: Dictionary | null,
  fallback: string,
): SpriteInfo | null => {
  if (!url) return null;
  return {
    url,
    label:
      dictionary?.ui.pokemonDetails.spriteLabels?.[
        labelKey as keyof typeof dictionary.ui.pokemonDetails.spriteLabels
      ] || fallback,
    category,
  };
};

/**
 * Extracts all available sprites from a Pokemon object
 */
export const collectSprites = (
  pokemon: Pokemon,
  dictionary: Dictionary | null,
  fallback: string,
): SpriteInfo[] => {
  const allSprites: SpriteInfo[] = [];

  // Official Artwork
  if (pokemon.sprites.other?.officialArtwork?.frontDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.officialArtwork.frontDefault,
        "officialArtwork",
        "official",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.other?.officialArtwork?.frontShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.officialArtwork.frontShiny,
        "shinyOfficialArtwork",
        "official",
        dictionary,
        fallback,
      )!,
    );
  }

  // Home Sprites
  if (pokemon.sprites.other?.home?.frontDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.home.frontDefault,
        "homeFront",
        "home",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.other?.home?.frontShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.home.frontShiny,
        "homeShinyFront",
        "home",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.other?.home?.frontFemale) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.home.frontFemale,
        "homeFemale",
        "home",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.other?.home?.frontShinyFemale) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.home.frontShinyFemale,
        "homeShinyFemale",
        "home",
        dictionary,
        fallback,
      )!,
    );
  }

  // Dream World Sprites
  if (pokemon.sprites.other?.dreamWorld?.frontDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.dreamWorld.frontDefault,
        "dreamWorld",
        "dreamWorld",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.other?.dreamWorld?.frontFemale) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.dreamWorld.frontFemale,
        "dreamWorldFemale",
        "dreamWorld",
        dictionary,
        fallback,
      )!,
    );
  }

  // Showdown Sprites
  if (pokemon.sprites.other?.showdown?.frontDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.showdown.frontDefault,
        "showdownFront",
        "showdown",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.other?.showdown?.backDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.showdown.backDefault,
        "showdownBack",
        "showdown",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.other?.showdown?.frontShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.showdown.frontShiny,
        "showdownShinyFront",
        "showdown",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.other?.showdown?.backShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.other.showdown.backShiny,
        "showdownShinyBack",
        "showdown",
        dictionary,
        fallback,
      )!,
    );
  }

  // Default Game Sprites
  if (pokemon.sprites.frontDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.frontDefault,
        "gameFront",
        "game",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.backDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.backDefault,
        "gameBack",
        "game",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.frontShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.frontShiny,
        "gameShinyFront",
        "game",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.backShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.backShiny,
        "gameShinyBack",
        "game",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.frontFemale) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.frontFemale,
        "gameFemaleFront",
        "game",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.backFemale) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.backFemale,
        "gameFemaleBack",
        "game",
        dictionary,
        fallback,
      )!,
    );
  }

  // Generation V Animated Sprites
  if (
    pokemon.sprites.versions?.generationV?.blackWhite?.animated?.frontDefault
  ) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationV.blackWhite.animated.frontDefault,
        "animatedFrontGenV",
        "animated",
        dictionary,
        fallback,
      )!,
    );
  }

  if (
    pokemon.sprites.versions?.generationV?.blackWhite?.animated?.backDefault
  ) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationV.blackWhite.animated.backDefault,
        "animatedBackGenV",
        "animated",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.versions?.generationV?.blackWhite?.animated?.frontShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationV.blackWhite.animated.frontShiny,
        "animatedShinyFrontGenV",
        "animated",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.versions?.generationV?.blackWhite?.animated?.backShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationV.blackWhite.animated.backShiny,
        "animatedShinyBackGenV",
        "animated",
        dictionary,
        fallback,
      )!,
    );
  }

  // Generation VII Icons
  if (pokemon.sprites.versions?.generationVII?.icons?.frontDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationVII.icons.frontDefault,
        "iconGenVII",
        "icons",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.versions?.generationVII?.icons?.frontFemale) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationVII.icons.frontFemale,
        "femaleIconGenVII",
        "icons",
        dictionary,
        fallback,
      )!,
    );
  }

  // Generation VI Sprites
  if (pokemon.sprites.versions?.generationVI?.xy?.frontDefault) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationVI.xy.frontDefault,
        "xyFront",
        "xy",
        dictionary,
        fallback,
      )!,
    );
  }

  if (pokemon.sprites.versions?.generationVI?.xy?.frontShiny) {
    allSprites.push(
      createSpriteInfo(
        pokemon.sprites.versions.generationVI.xy.frontShiny,
        "xyShinyFront",
        "xy",
        dictionary,
        fallback,
      )!,
    );
  }

  return allSprites;
};

/**
 * Creates sprite categories based on available sprites and dictionary labels
 */
export const createSpriteCategories = (
  sprites: SpriteInfo[],
  dictionary: Dictionary | null,
  fallback: string,
): SpriteCategory[] => {
  const categoryMap = {
    official: dictionary?.ui.pokemonDetails.officialArtwork || fallback,
    home: dictionary?.ui.pokemonDetails.pokemonHome || fallback,
    game: dictionary?.ui.pokemonDetails.gameSprites || fallback,
    animated: dictionary?.ui.pokemonDetails.animated || fallback,
    dreamWorld: dictionary?.ui.pokemonDetails.dreamWorld || fallback,
    showdown: dictionary?.ui.pokemonDetails.showdown || fallback,
    xy: "X/Y", // Static label as it's the same in all languages
    icons: dictionary?.ui.pokemonDetails.icons || fallback,
  };

  return Object.entries(categoryMap)
    .filter(([categoryId]) =>
      sprites.some((sprite) => sprite.category === categoryId),
    )
    .map(([id, label]) => ({ id, label }));
};
