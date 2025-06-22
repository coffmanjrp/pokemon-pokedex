import { POKEMON_TYPE_COLORS, PokemonTypeName } from '@/types/pokemon';

/**
 * Pokemon のタイプに基づいて動的な blur プレースホルダーを生成
 */
export function generatePokemonBlurDataURL(primaryType?: PokemonTypeName): string {
  const color = primaryType ? POKEMON_TYPE_COLORS[primaryType] : '#68A090';
  
  // SVG blur placeholder with Pokemon type color and subtle pattern
  const svg = `
    <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.6" />
          <stop offset="70%" style="stop-color:${color};stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.1" />
        </radialGradient>
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="2" fill="${color}" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <rect width="100%" height="100%" fill="url(#dots)"/>
      <circle cx="64" cy="64" r="30" fill="${color}" opacity="0.15"/>
    </svg>
  `.replace(/\s+/g, ' ').trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * 軽量な固定 blur placeholder (フォールバック用)
 */
export const DEFAULT_BLUR_DATA_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";