import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseVirtualGridOptions<T> {
  items: T[];
  getItemHeight: () => number;
  getColumns: () => number;
  gap?: number;
  overscan?: number;
  paddingStart?: number;
  paddingEnd?: number;
  getScrollElement?: () => Window | null;
}

export function useVirtualGrid<T>({
  items,
  getItemHeight,
  getColumns,
  gap = 16,
  overscan = 3,
  paddingStart = 0,
  paddingEnd = 0,
  getScrollElement,
}: UseVirtualGridOptions<T>) {
  const [columns, setColumns] = useState(getColumns());

  // Update columns on resize
  useEffect(() => {
    const handleResize = () => {
      setColumns(getColumns());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getColumns]);

  // Calculate total rows
  const rowCount = Math.ceil(items.length / columns);

  // Create virtualizer for rows
  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: useCallback(
      () => getItemHeight() + gap,
      [getItemHeight, gap],
    ),
    overscan,
    paddingStart,
    paddingEnd,
    scrollPaddingStart: 0,
    scrollPaddingEnd: 0,
    ...(getScrollElement && { getScrollElement }),
  });

  // Calculate virtual items with grid positions
  const virtualItems = useMemo(() => {
    const virtualRows = rowVirtualizer.getVirtualItems();
    const gridItems: Array<{
      index: number;
      row: number;
      column: number;
      item: T;
      style: React.CSSProperties;
    }> = [];

    virtualRows.forEach((virtualRow) => {
      const rowIndex = virtualRow.index;
      const baseIndex = rowIndex * columns;

      for (let col = 0; col < columns; col++) {
        const itemIndex = baseIndex + col;
        if (itemIndex >= items.length) break;

        const item = items[itemIndex];
        if (!item) continue;

        gridItems.push({
          index: itemIndex,
          row: rowIndex,
          column: col,
          item,
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: `calc((100% - ${gap * (columns - 1)}px) / ${columns})`,
            height: `${getItemHeight()}px`,
            transform: `translateX(calc(${col} * (100% + ${gap}px))) translateY(${virtualRow.start}px)`,
          },
        });
      }
    });

    return gridItems;
  }, [rowVirtualizer, columns, items, gap, getItemHeight]);

  // Calculate total height
  const totalHeight = rowVirtualizer.getTotalSize();

  // Measure function for dynamic sizing if needed
  const measureElement = useCallback(
    (el: HTMLElement | null) => {
      if (!el) return;
      rowVirtualizer.measureElement(el);
    },
    [rowVirtualizer],
  );

  return {
    virtualItems,
    totalHeight,
    measureElement,
    columns,
    rowVirtualizer,
  };
}
