/**
 * Pokemon type utility functions
 * Type-related helper functions for Pokemon type system
 */

import {
  POKEMON_TYPES,
  TYPE_COLORS,
  TYPE_EFFECTIVENESS,
  TYPE_EFFECTS,
  type PokemonTypeName,
} from "@/lib/data/types";

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if a string is a valid Pokemon type
 * @param type - String to check
 * @returns True if the string is a valid Pokemon type
 */
export function isPokemonType(type: string): type is PokemonTypeName {
  return POKEMON_TYPES.includes(type as PokemonTypeName);
}

/**
 * Get all Pokemon types
 * @returns Readonly array of all Pokemon types
 */
export function getAllPokemonTypes(): readonly PokemonTypeName[] {
  return POKEMON_TYPES;
}

/**
 * Get the color for a specific Pokemon type
 * @param type - Pokemon type name
 * @returns Hex color code or undefined if type not found
 */
export function getTypeColor(type: PokemonTypeName): string {
  return TYPE_COLORS[type];
}

/**
 * Get type color by type name (string version with type checking)
 * @param typeName - Pokemon type name as string
 * @returns Hex color code for the type
 */
export function getTypeColorByName(typeName: string): string {
  const normalizedTypeName = typeName.toLowerCase();
  return isPokemonType(normalizedTypeName)
    ? TYPE_COLORS[normalizedTypeName]
    : "#A8A878"; // Default to normal type
}

/**
 * Get type weaknesses for a specific Pokemon type
 * @param type - Pokemon type name
 * @returns Array of types this type is weak to
 */
export function getTypeWeaknesses(
  type: PokemonTypeName,
): readonly PokemonTypeName[] {
  return TYPE_EFFECTIVENESS[type] || [];
}

/**
 * Get animation effects for a specific Pokemon type
 * @param type - Pokemon type name
 * @returns Array of emoji effects for animations
 */
export function getTypeEffects(type: PokemonTypeName): readonly string[] {
  return TYPE_EFFECTS[type] || TYPE_EFFECTS.normal;
}

/**
 * Check if a type is weak to another type
 * @param defendingType - The type being attacked
 * @param attackingType - The type of the attack
 * @returns True if the defending type is weak to the attacking type
 */
export function isWeakTo(
  defendingType: PokemonTypeName,
  attackingType: PokemonTypeName,
): boolean {
  return TYPE_EFFECTIVENESS[defendingType]?.includes(attackingType) || false;
}

/**
 * Get damage multiplier between two types
 * @param attackingType - The type of the attack
 * @param defendingType - The type being attacked
 * @returns Damage multiplier (2.0 for super effective, 0.5 for not very effective, 1.0 for normal)
 */
export function getDamageMultiplier(
  attackingType: PokemonTypeName,
  defendingType: PokemonTypeName,
): number {
  // This is a simplified version - full type chart would be more complex
  if (isWeakTo(defendingType, attackingType)) {
    return 2.0; // Super effective
  }

  // Check if attacking type is weak to defending type (reverse effectiveness)
  if (isWeakTo(attackingType, defendingType)) {
    return 0.5; // Not very effective
  }

  return 1.0; // Normal effectiveness
}
