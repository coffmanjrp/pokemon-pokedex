import { POKEMON_TYPE_COLORS, PokemonTypeName } from "@/types/pokemon";
import { AnimationConfig } from "./types";

export function createElectricSpark({
  pokemon,
  targetElement,
}: AnimationConfig) {
  const primaryColor =
    POKEMON_TYPE_COLORS[pokemon.types[0]?.type.name as PokemonTypeName] ||
    "#68A090";

  const spark = document.createElement("div");
  spark.style.cssText = `
    position: absolute;
    inset: -2px;
    border-radius: 12px;
    background: linear-gradient(45deg, ${primaryColor}, transparent, ${primaryColor});
    opacity: 0;
    pointer-events: none;
    z-index: 5;
    animation: spark-border 0.8s ease-out;
  `;

  // Add keyframes for spark animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spark-border {
      0% { opacity: 0; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.02); }
      100% { opacity: 0; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  targetElement.appendChild(spark);

  setTimeout(() => {
    if (targetElement.contains(spark)) {
      targetElement.removeChild(spark);
    }
    if (document.head.contains(style)) {
      document.head.removeChild(style);
    }
  }, 800);
}
