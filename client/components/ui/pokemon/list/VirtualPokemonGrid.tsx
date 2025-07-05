"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { VariableSizeGrid as Grid } from "react-window";
import { Pokemon } from "@/types/pokemon";
import { PokemonCard } from "./PokemonCard";
import { Locale } from "@/lib/dictionaries";

interface VirtualPokemonGridProps {
  pokemons: Pokemon[];
  onPokemonClick: (pokemon: Pokemon) => void;
  language?: Locale;
  priority?: boolean;
  currentGeneration?: number;
}

// Cell renderer component
const CellRenderer = ({
  columnIndex,
  rowIndex,
  style,
  data,
}: {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    pokemons: Pokemon[];
    columns: number;
    onPokemonClick: (pokemon: Pokemon) => void;
    language: Locale;
    priority: boolean;
    currentGeneration?: number;
    gap: number;
  };
}) => {
  const {
    pokemons,
    columns,
    onPokemonClick,
    language,
    priority,
    currentGeneration,
    gap,
  } = data;
  const index = rowIndex * columns + columnIndex;

  if (index >= pokemons.length) {
    return null;
  }

  const pokemon = pokemons[index];

  if (!pokemon) {
    return null;
  }

  // Adjust style to add gap
  const adjustedStyle = {
    ...style,
    left: Number(style.left) + gap * (columnIndex + 1),
    top: Number(style.top) + gap * (rowIndex + 1),
    width: Number(style.width) - gap,
    height: Number(style.height) - gap,
  };

  return (
    <div style={adjustedStyle}>
      <PokemonCard
        pokemon={pokemon}
        onClick={onPokemonClick}
        className="h-full"
        priority={priority && index < 10}
        lang={language}
        {...(currentGeneration && { currentGeneration })}
      />
    </div>
  );
};

export const VirtualPokemonGrid = ({
  pokemons,
  onPokemonClick,
  language = "en",
  priority = false,
  currentGeneration,
}: VirtualPokemonGridProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate columns based on screen width
  const getColumns = useCallback(() => {
    if (typeof window === "undefined") return 3;
    const width = window.innerWidth;
    if (width < 640) return 1; // Mobile
    if (width < 768) return 2; // Small tablet
    if (width < 1024) return 3; // Tablet
    if (width < 1280) return 4; // Small desktop
    return 5; // Large desktop
  }, []);

  const [columns, setColumns] = useState(getColumns());

  // Gap between cards
  const gap =
    typeof window !== "undefined" && window.innerWidth < 640 ? 12 : 16;

  // Fixed card height for each breakpoint
  const getItemHeight = useCallback(() => {
    if (typeof window === "undefined") return 320;
    const width = window.innerWidth;
    return width < 640 ? 288 : 320; // h-72 (288px) on mobile, h-80 (320px) on desktop
  }, []);

  const itemHeight = getItemHeight();

  // Update dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: window.innerHeight - 200, // Account for header and footer
        });
      }
      setColumns(getColumns());
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [getColumns]);

  const rowCount = Math.ceil(pokemons.length / columns);

  // Calculate column width dynamically
  const columnWidth = useCallback(() => {
    const totalGaps = gap * (columns + 1);
    return (dimensions.width - totalGaps) / columns;
  }, [dimensions.width, columns, gap]);

  // Row height is fixed
  const rowHeight = useCallback(() => itemHeight + gap, [itemHeight, gap]);

  return (
    <div ref={containerRef} className="w-full h-full px-3 sm:px-4 py-4">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Grid
          columnCount={columns}
          columnWidth={columnWidth}
          height={dimensions.height}
          rowCount={rowCount}
          rowHeight={rowHeight}
          width={dimensions.width}
          itemData={{
            pokemons,
            columns,
            onPokemonClick,
            language,
            priority,
            ...(currentGeneration && { currentGeneration }),
            gap,
          }}
        >
          {CellRenderer}
        </Grid>
      )}
    </div>
  );
};
