/**
 * Pokemon stat colors for visual distinction in charts and bars
 * Each stat has a distinct color based on its thematic representation
 */
export const STAT_COLORS: Record<string, string> = {
  hp: "bg-red-500", // HP: Red (health/life)
  attack: "bg-orange-500", // Attack: Orange (physical power)
  defense: "bg-blue-500", // Defense: Blue (protection/stability)
  "special-attack": "bg-purple-500", // Sp. Attack: Purple (magical power)
  "special-defense": "bg-green-500", // Sp. Defense: Green (resilience)
  speed: "bg-yellow-500", // Speed: Yellow (lightning/quickness)
};

/**
 * Get the color class for a specific stat
 * @param statName - The stat name (e.g., 'hp', 'attack', 'special-attack')
 * @returns The Tailwind CSS color class or a default gray color
 */
export const getStatColor = (statName: string): string => {
  return STAT_COLORS[statName] || "bg-gray-400";
};
