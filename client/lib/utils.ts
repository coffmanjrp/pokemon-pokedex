import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TYPE_COLORS } from "@/lib/data/typeColors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get Pokemon type color by type name
 * @param typeName - Pokemon type name
 * @returns Hex color code for the type
 */
export function getTypeColor(typeName: string): string {
  return TYPE_COLORS[typeName.toLowerCase()] || "#A8A878"; // Default to normal type
}
