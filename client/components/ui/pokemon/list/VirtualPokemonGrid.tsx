"use client";

import { useCallback, forwardRef, useImperativeHandle, useRef } from "react";
import { VariableSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Pokemon } from "@/types/pokemon";
import { PokemonCard } from "./PokemonCard";
import { Locale } from "@/lib/dictionaries";

export interface VirtualPokemonGridHandle {
  scrollToItem: (index: number) => void;
  scrollToTop: () => void;
}

interface VirtualPokemonGridProps {
  pokemons: Pokemon[];
  onPokemonClick: (pokemon: Pokemon) => void;
  language?: Locale;
  priority?: boolean;
  currentGeneration?: number;
  onScroll?: (event: { scrollTop: number }) => void;
}

// Padding configuration
const PADDING_SIZE = 8; // 8px padding (equivalent to p-2)

// Inner element with padding
const innerElementType = forwardRef<
  HTMLDivElement,
  { style?: React.CSSProperties }
>(({ style = {}, ...rest }, ref) => (
  <div
    ref={ref}
    style={{
      ...style,
      width: style.width ? `${parseFloat(style.width as string)}px` : undefined,
      height: style.height
        ? `${parseFloat(style.height as string) + PADDING_SIZE * 2}px`
        : undefined,
      paddingTop: `${PADDING_SIZE}px`,
      paddingLeft: `${PADDING_SIZE}px`,
      paddingRight: `${PADDING_SIZE}px`,
      paddingBottom: `${PADDING_SIZE}px`,
    }}
    {...rest}
  />
));

innerElementType.displayName = "InnerElement";

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
  };
}) => {
  const {
    pokemons,
    columns,
    onPokemonClick,
    language,
    priority,
    currentGeneration,
  } = data;
  const index = rowIndex * columns + columnIndex;

  if (index >= pokemons.length) {
    return null;
  }

  const pokemon = pokemons[index];

  if (!pokemon) {
    return null;
  }

  // Adjust style to account for padding
  const adjustedStyle = {
    ...style,
    left: `${parseFloat(style.left as string) + PADDING_SIZE}px`,
    top: `${parseFloat(style.top as string) + PADDING_SIZE}px`,
  };

  return (
    <div style={adjustedStyle} className="p-1.5 sm:p-2">
      <PokemonCard
        pokemon={pokemon}
        onClick={onPokemonClick}
        className="h-full"
        priority={priority && index < 10}
        lang={language}
        pokemonIndex={index}
        {...(currentGeneration !== undefined && { currentGeneration })}
      />
    </div>
  );
};

export const VirtualPokemonGrid = forwardRef<
  VirtualPokemonGridHandle,
  VirtualPokemonGridProps
>(
  (
    {
      pokemons,
      onPokemonClick,
      language = "en",
      priority = false,
      currentGeneration,
      onScroll,
    },
    ref,
  ) => {
    const gridRef = useRef<Grid>(null);
    // Calculate columns based on width
    const getColumns = useCallback((width: number) => {
      // Account for padding when calculating columns
      const effectiveWidth = width - PADDING_SIZE * 2;
      if (effectiveWidth < 640) return 1; // Mobile
      if (effectiveWidth < 768) return 2; // Small tablet
      if (effectiveWidth < 1024) return 3; // Tablet
      if (effectiveWidth < 1280) return 4; // Small desktop
      return 5; // Large desktop
    }, []);

    // Fixed card height for each breakpoint
    const getItemHeight = useCallback((width: number) => {
      return width < 640 ? 300 : 337; // Include padding - slightly taller
    }, []);

    // Expose methods to parent component
    useImperativeHandle(
      ref,
      () => ({
        scrollToItem: (index: number) => {
          if (gridRef.current) {
            const columns = getColumns(window.innerWidth);
            const rowIndex = Math.floor(index / columns);
            const columnIndex = index % columns;
            gridRef.current.scrollToItem({
              rowIndex,
              columnIndex,
              align: "center",
            });
          }
        },
        scrollToTop: () => {
          if (gridRef.current) {
            gridRef.current.scrollTo({ scrollLeft: 0, scrollTop: 0 });
          }
        },
      }),
      [getColumns],
    );

    return (
      <AutoSizer>
        {({ height, width }) => {
          const columns = getColumns(width);
          const rowCount = Math.ceil(pokemons.length / columns);
          const itemHeight = getItemHeight(width);

          // Calculate column width evenly, accounting for padding
          const effectiveWidth = width - PADDING_SIZE * 2;
          const columnWidth = () => Math.floor(effectiveWidth / columns);

          // Fixed row height
          const rowHeight = () => itemHeight;

          return (
            <Grid
              ref={gridRef}
              columnCount={columns}
              columnWidth={columnWidth}
              height={height}
              rowCount={rowCount}
              rowHeight={rowHeight}
              width={width}
              innerElementType={innerElementType}
              itemData={{
                pokemons,
                columns,
                onPokemonClick,
                language,
                priority,
                ...(currentGeneration !== undefined && { currentGeneration }),
              }}
              onScroll={onScroll}
              className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
            >
              {CellRenderer}
            </Grid>
          );
        }}
      </AutoSizer>
    );
  },
);

VirtualPokemonGrid.displayName = "VirtualPokemonGrid";
