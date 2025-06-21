# Pokemon Card Animations

A collection of GSAP-powered animation effects for Pokemon cards that can be easily integrated into any component.

## Available Animations

### Basic Effects
- **ripple-wave**: Click point ripple effect with type color expansion
- **particle-burst**: Type-based particles burst radially from click point
- **card-flip**: 3D flip effect revealing additional information
- **pokeball-pop**: Pokeball appears and opens at click point
- **electric-spark**: Electric effect runs along card border
- **scale-glow**: Card scales up and glows with type color
- **bounce-tilt**: Card bounces and tilts in 3D space

### Echo Effects
- **card-echo**: Full card echoes expand outward like ripples
- **card-echo-border**: Only card border echoes expand outward

### Combo Effects
- **particle-echo-combo**: Combination of particle burst and border echo
- **ultimate-echo-combo**: Ultimate echo combo: particles + card echo + border echo

## Usage

### Method 1: Direct Function Import

```tsx
import { createParticleBurst, AnimationConfig } from '@/lib/animations';

function MyCard({ pokemon }: { pokemon: Pokemon }) {
  const handleClick = (e: React.MouseEvent) => {
    const config: AnimationConfig = {
      pokemon,
      clickEvent: e,
      targetElement: e.currentTarget as HTMLElement,
      gridContainer: document.querySelector('.grid') as HTMLElement
    };
    
    createParticleBurst(config);
  };

  return (
    <div onClick={handleClick}>
      {/* Your card content */}
    </div>
  );
}
```

### Method 2: Animation Registry

```tsx
import { ANIMATIONS, AnimationType } from '@/lib/animations';

function MyCard({ pokemon, animationType }: { 
  pokemon: Pokemon; 
  animationType: AnimationType;
}) {
  const handleClick = (e: React.MouseEvent) => {
    const animationFunction = ANIMATIONS[animationType];
    if (animationFunction) {
      animationFunction({
        pokemon,
        clickEvent: e,
        targetElement: e.currentTarget as HTMLElement,
        gridContainer: document.querySelector('.grid') as HTMLElement
      });
    }
  };

  return (
    <div onClick={handleClick}>
      {/* Your card content */}
    </div>
  );
}
```

### Method 3: Hook (Recommended)

```tsx
import { useCardAnimation } from '@/lib/animations';

function MyCard({ pokemon }: { pokemon: Pokemon }) {
  const { triggerAnimation } = useCardAnimation({
    animationType: 'particle-burst',
    gridContainer: document.querySelector('.grid') as HTMLElement
  });

  const handleClick = (e: React.MouseEvent) => {
    triggerAnimation(e, pokemon);
  };

  return (
    <div onClick={handleClick}>
      {/* Your card content */}
    </div>
  );
}
```

## Integration with Existing PokemonCard

To add animations to the existing PokemonCard component:

```tsx
// In components/ui/PokemonCard.tsx
import { useCardAnimation } from '@/lib/animations';

export function PokemonCard({ pokemon, onClick, className }: PokemonCardProps) {
  const { triggerAnimation } = useCardAnimation({
    animationType: 'particle-burst' // or any other animation
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Trigger animation before navigation
    triggerAnimation(e, pokemon);
    
    // Small delay for visual feedback before navigation
    setTimeout(() => {
      onClick?.(pokemon, cardRef.current || undefined);
    }, 200);
  };

  // Rest of your component...
}
```

## Requirements

- **GSAP**: All animations use GSAP for smooth performance
- **Pokemon Type Colors**: Uses `POKEMON_TYPE_COLORS` from types
- **Grid Container**: Echo effects require a grid container reference
- **Relative Positioning**: Cards should be in a container with relative positioning

## Performance Notes

- All animations include automatic cleanup
- Memory management handled by GSAP timelines
- Optimized for mobile performance
- No memory leaks from DOM element creation

## Customization

Each animation function accepts an `AnimationConfig` object, making it easy to customize:

```tsx
interface AnimationConfig {
  pokemon: Pokemon;           // Pokemon data for type colors and effects
  clickEvent: React.MouseEvent; // Click event for position calculation
  targetElement: HTMLElement;   // The card element to animate
  gridContainer?: HTMLElement;  // Container for echo effects (optional)
}
```

You can create custom animations by following the same pattern and adding them to the `ANIMATIONS` registry.

## File Structure

```
lib/
├── animations/
│   ├── index.ts                  # Main export file with animation registry
│   ├── types.ts                  # TypeScript interfaces
│   ├── useCardAnimation.ts       # React hook for easy integration
│   ├── README.md                # Usage documentation
│   ├── rippleWave.ts            # Ripple wave effect
│   ├── particleBurst.ts         # Particle burst effect
│   ├── cardFlip.ts              # Card flip effect
│   ├── pokeballPop.ts           # Pokeball pop effect
│   ├── electricSpark.ts         # Electric spark effect
│   ├── scaleGlow.ts             # Scale glow effect
│   ├── bounceTilt.ts            # Bounce tilt effect
│   ├── cardEcho.ts              # Card echo effect
│   ├── cardEchoBorder.ts        # Card echo border effect
│   └── combinationEffects.ts    # Complex combination effects
└── data/
    ├── index.ts                  # Data exports
    └── typeEffects.ts            # Pokemon type particle effects data
```

## Adding New Combination Effects

To add new combination effects to `combinationEffects.ts`:

1. Create a new function following the `AnimationConfig` interface
2. Add comprehensive comments describing the effect
3. Export the function and add it to the `ANIMATIONS` registry in `index.ts`
4. Update the `AnimationType` union type
5. Add documentation to this README

Example:
```tsx
export function createMyCustomCombo(config: AnimationConfig) {
  // Your combination logic here
  // Combine multiple basic effects or create entirely new ones
}
```