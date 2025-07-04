import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getTypeColorByName } from "@/lib/utils/typeUtils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get Pokemon type color by type name
 * @param typeName - Pokemon type name
 * @returns Hex color code for the type
 */
export function getTypeColor(typeName: string): string {
  return getTypeColorByName(typeName);
}
