# Icon System

This directory contains the unified icon system for the Pokemon Pokedex application using `react-icons`.

## Usage

```tsx
import { ChevronDownIcon, ChevronUpIcon, SearchIcon, CloseIcon } from "@/components/ui/icons";

// Use in components
<ChevronDownIcon className="w-4 h-4 text-gray-500" />
<SearchIcon className="w-5 h-5" />
```

## Available Icons

### Chevron Icons

- `ChevronDownIcon` - Down arrow for dropdowns/accordions
- `ChevronUpIcon` - Up arrow for dropdowns/accordions

### Common Icons

- `SearchIcon` - Search/magnifying glass icon
- `CloseIcon` - X mark for closing/clearing
- `ArrowLeftIcon` - Left arrow for navigation
- `ArrowRightIcon` - Right arrow for navigation
- `MenuIcon` - Hamburger menu (3 lines)
- `FilterIcon` - Filter/funnel icon

## Benefits

1. **Consistency**: All icons follow the same design system (Heroicons v2)
2. **Tree-shaking**: Only imported icons are included in the bundle
3. **Maintainability**: Single source of truth for icons
4. **Flexibility**: Easy to swap icons or add new ones

## Migration from Inline SVG

When migrating from inline SVG to react-icons:

1. Replace inline SVG with appropriate icon import
2. Keep the same `className` prop for styling
3. Remove custom SVG definitions

**Before:**

```tsx
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);
```

**After:**

```tsx
import { ChevronDownIcon } from "@/components/ui/icons";

<ChevronDownIcon className="w-4 h-4 text-gray-500" />;
```

## Adding New Icons

1. Find the desired icon in [react-icons](https://react-icons.github.io/react-icons/)
2. Add the import to `index.ts`
3. Export with a descriptive alias
4. Update this README

Example:

```tsx
// In index.ts
export { HiHome as HomeIcon } from "react-icons/hi2";
```
