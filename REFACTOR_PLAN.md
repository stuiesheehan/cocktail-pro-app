# Cocktail Manager - Modularization Refactor Plan

## Current State

**App.js**: 3,960 lines containing 20+ components, 9 useEffects, 5 useMemos, 50+ cocktail recipes, 60+ ingredients, 15+ CSS keyframe animations, and all business logic in a single file.

---

## Target Directory Structure

```
src/
├── App.js                          # Entry point - state, routing, layout only
├── index.js                        # Existing (unchanged)
│
├── components/
│   ├── ui/
│   │   ├── Card.js                 # Card container (lines 144-155)
│   │   ├── Button.js               # Button with variants (lines 157-178)
│   │   ├── SectionHeader.js        # Section title + action (lines 180-185)
│   │   ├── TabButton.js            # Tab toggle (lines 187-199)
│   │   ├── Toggle.js               # Binary switch (lines 201-215)
│   │   ├── Badge.js                # Inline badge (lines 217-224)
│   │   ├── Modal.js                # Generic modal shell (lines 400-418)
│   │   ├── StatCard.js             # Stat display (lines 388-395)
│   │   ├── GlasswareSVG.js         # SVG cocktail glass with animations (lines 1558-1684)
│   │   └── index.js                # Barrel export
│   │
│   └── features/
│       ├── CocktailModal.js        # Cocktail detail/batch modal (lines 423-674)
│       ├── TimerWidget.js          # Countdown timers (lines 679-771)
│       ├── ShiftMode.js            # Live shift queue (lines 776-882)
│       ├── Analytics.js            # Sales analytics dashboard (lines 887-990)
│       ├── ShoppingList.js         # Par levels & order generator (lines 995-1067)
│       ├── SpeedRail.js            # Speed rail builder (lines 1072-1147)
│       ├── TrainingMode.js         # Learn/Quiz/Mix/Speed modes (lines 1152-2177)
│       ├── SpecCreator.js          # Recipe creation wizard (lines 2182-2489)
│       ├── PartyMode.js            # Party session & order queue (lines 2494-2619)
│       ├── PrepLab.js              # Batch prep & expiry tracking (lines 2624-2764)
│       ├── MenuBuilder.js          # Menu generator with HTML export (lines 2769-2891)
│       ├── Dashboard.js            # Main dashboard view (lines 2896-3069)
│       ├── CocktailsList.js        # Cocktail browsing & filtering (lines 3074-3210)
│       ├── IngredientsList.js      # Ingredient management (lines 3215-3399)
│       ├── AdBanner.js             # Ad placeholder (lines 229-259)
│       ├── UpgradeModal.js         # Premium purchase modal (lines 264-386)
│       └── index.js                # Barrel export
│
├── hooks/
│   ├── useInventory.js             # toggleIngredientStock, canMake recalculation,
│   │                               # lowStockItems, par level logic
│   ├── useCocktails.js             # cocktail CRUD, filtering, favorites,
│   │                               # random cocktail, make drink / sales
│   ├── useTimers.js                # Timer add/toggle/reset/delete/tick logic
│   ├── usePersistence.js           # All localStorage read/write effects
│   └── usePremium.js               # Premium state, unlock, restore, reset,
│                                   # free-tier limits
│
├── data/
│   ├── cocktails.js                # INITIAL_COCKTAILS array (50+ recipes)
│   ├── ingredients.js              # INITIAL_INGREDIENTS array (60+ items)
│   ├── namingEngine.js             # Geographic cities/suffixes, speakeasy
│   │                               # adjectives/nouns, ingredient templates
│   ├── images.js                   # GLASS_IMAGES, COCKTAIL_IMAGES maps
│   ├── constants.js                # GOLD, DARK_BG, TECHNIQUE_ICONS,
│   │                               # FLAVOR_PROFILES, DIETARY_FLAGS, TAGS,
│   │                               # CATEGORY_CONFIG, FREE_COCKTAIL_LIMIT,
│   │                               # FREE_RANDOM_USES
│   └── shelfLife.js                # SHELF_LIFE_DAYS reference table
│
├── utils/
│   ├── calculations.js             # ABV calculation, dilution by technique,
│   │                               # totalVolume, finalVolume, balanceScore,
│   │                               # flavorProfile derivation
│   ├── pricing.js                  # costPerDrink, suggestedPrice (3.5x),
│   │                               # margin %, revenue calculations
│   ├── formatting.js               # formatCurrency, formatTime, formatDate
│   └── images.js                   # getCocktailImage() helper
│
└── styles/
    └── animations.js               # All CSS keyframe strings (pour, splash,
                                    # shake, stir, liquidWave, iceDrop,
                                    # confetti, pulse, glow, bubbles, etc.)
```

---

## Extraction Plan - Phased Execution

### Phase 1: Foundation (No behavior change)
Extract modules with zero dependencies on React state.

| File | What moves | Risk |
|------|-----------|------|
| `data/constants.js` | GOLD, DARK_BG, TECHNIQUE_ICONS, FLAVOR_PROFILES, DIETARY_FLAGS, TAGS, CATEGORY_CONFIG, FREE_COCKTAIL_LIMIT, FREE_RANDOM_USES | None - pure data |
| `data/images.js` | GLASS_IMAGES, COCKTAIL_IMAGES | None - pure data |
| `data/cocktails.js` | INITIAL_COCKTAILS array | None - pure data |
| `data/ingredients.js` | INITIAL_INGREDIENTS array | None - pure data |
| `data/namingEngine.js` | NAMING_ENGINE cities/suffixes/adjectives/nouns | None - pure data |
| `data/shelfLife.js` | SHELF_LIFE_DAYS | None - pure data |
| `utils/formatting.js` | formatCurrency, formatTime, formatDate | None - pure functions |
| `utils/images.js` | getCocktailImage | Depends on data/images.js |
| `utils/calculations.js` | ABV math, dilution factors, balance scoring | Pure math functions |
| `utils/pricing.js` | Cost/margin/suggested price logic | Pure math functions |
| `styles/animations.js` | All keyframe CSS strings | None - pure strings |

**Verification**: `npm start` — app renders identically.

### Phase 2: UI Components
Extract presentational components. They receive all data via props.

| File | Component | Props needed |
|------|-----------|-------------|
| `components/ui/Card.js` | Card | children, className, style |
| `components/ui/Button.js` | Button | children, variant, size, className, ...rest |
| `components/ui/SectionHeader.js` | SectionHeader | children, action |
| `components/ui/TabButton.js` | TabButton | active, children, onClick |
| `components/ui/Toggle.js` | Toggle | value, onChange, label |
| `components/ui/Badge.js` | Badge | children, color |
| `components/ui/Modal.js` | Modal | title, onClose, size, children |
| `components/ui/StatCard.js` | StatCard | icon, value, label, subtitle |
| `components/ui/GlasswareSVG.js` | CocktailGlass | glass, liquidLevel, glassColor, isPouring, isShaking, isStirring, iceCubes, showSplash, lastAddedIngredient |
| `components/ui/index.js` | Barrel exports | — |

**Import pattern**: All UI components import GOLD, DARK_BG from `data/constants`.

**Verification**: `npm start` — all UI renders identically, gold/dark styling intact.

### Phase 3: Feature Components (self-contained first)
Extract features that receive props from App but manage their own local state.

**Batch 3a — Low coupling** (receive props, manage own UI state):

| File | Key props from App |
|------|-------------------|
| `features/AdBanner.js` | isPremium, onUpgrade |
| `features/UpgradeModal.js` | show, onClose, onUnlock, onRestore, onReset, isPremium |
| `features/TimerWidget.js` | timers, setTimers |
| `features/Analytics.js` | sales, cocktails |
| `features/ShoppingList.js` | ingredients, setIngredients |
| `features/SpeedRail.js` | speedRail, setSpeedRail, ingredients |
| `features/MenuBuilder.js` | cocktails, ingredients |
| `features/StatCard.js` | (already done in Phase 2) |

**Batch 3b — Medium coupling** (need multiple App-level callbacks):

| File | Key props from App |
|------|-------------------|
| `features/Dashboard.js` | stats, cocktails, ingredients, randomCocktail, recentlyMade, lowStockItems, favorites, timers, sales, isPremium, onMakeDrink, onUpgrade, getRandomCocktail, setTimers |
| `features/CocktailsList.js` | cocktails, ingredients, favorites, isPremium, onSelect, onToggleFavorite |
| `features/IngredientsList.js` | ingredients, setIngredients, onToggleStock |
| `features/ShiftMode.js` | cocktails, ingredients, favorites, sales, onMakeDrink |
| `features/CocktailModal.js` | cocktail, cocktails, ingredients, onClose, onMakeDrink, onUpdateCocktail, onToggleFavorite, favorites |

**Batch 3c — Complex features** (heavy internal state + animations):

| File | Key props from App |
|------|-------------------|
| `features/TrainingMode.js` | cocktails, ingredients, isPremium (largest component ~1025 lines, self-contained animation state) |
| `features/SpecCreator.js` | ingredients, onAddCocktail, isPremium (wizard state + naming engine + calculations) |
| `features/PartyMode.js` | cocktails, ingredients, isPremium |
| `features/PrepLab.js` | isPremium |

**Verification after each batch**: `npm start` — full interaction test.

### Phase 4: Custom Hooks
Extract stateful logic from App into reusable hooks.

| Hook | Extracts from App | Returns |
|------|------------------|---------|
| `usePersistence.js` | 9 useEffect hooks for localStorage | Auto-syncs state to localStorage |
| `useInventory.js` | toggleIngredientStock, canMake recalc, lowStockItems memo | { ingredients, setIngredients, toggleStock, lowStockItems } |
| `useCocktails.js` | cocktail filtering, favorites, randomCocktail, makeDrink, sales state, updateCocktail, addCustomCocktail, Excel import | { cocktails, filteredCocktails, favorites, sales, recentlyMade, ...handlers } |
| `useTimers.js` | Timer CRUD and tick effect | { timers, addTimer, toggleTimer, resetTimer, deleteTimer } |
| `usePremium.js` | isPremium, randomUsesRemaining, unlock/restore/reset | { isPremium, randomUsesRemaining, unlock, restore, reset } |

**App.js after Phase 4** will look approximately like:

```jsx
function App() {
  const premium = usePremium();
  const inventory = useInventory();
  const cocktails = useCocktails(inventory.ingredients);
  const timers = useTimers();

  usePersistence({ ...inventory, ...cocktails, ...timers, ...premium });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // ~100 lines of routing/layout JSX
}
```

**Verification**: `npm start` + full interaction test.

---

## Critical Constraints

### Styling Preservation
- `GOLD` (#D4AF37) and `DARK_BG` (#0a0a0a) are imported from `data/constants.js` by every component that references them.
- Inline styles using these constants remain unchanged — only the import path changes.
- Tailwind classes are unaffected (they don't reference JS constants).

### State Flow
- App.js remains the single source of truth for all cross-cutting state (cocktails, ingredients, sales, favorites, premium).
- Feature components receive state and callbacks via props — no context or state management library introduced.
- Local UI state (search terms, expanded sections, modal visibility) stays inside each feature component.
- Custom hooks encapsulate related state + effects but are called from App.js.

### Import Strategy
- Barrel exports (`index.js`) in `components/ui/` and `components/features/` for clean imports.
- Each module explicitly imports only what it needs from `data/` and `utils/`.
- No circular dependencies — dependency flow is: `data/ → utils/ → hooks/ → components/ → App.js`.

### What Does NOT Change
- `index.js` (React entry point) — unchanged.
- `tailwind.config.js`, `postcss.config.js` — unchanged.
- `public/` — unchanged.
- No new npm dependencies.
- No React Context, Redux, or other state management added.
- No TypeScript conversion.

---

## File Count Summary

| Directory | Files | Purpose |
|-----------|-------|---------|
| `src/data/` | 6 | Static data & constants |
| `src/utils/` | 4 | Pure functions |
| `src/styles/` | 1 | Animation keyframes |
| `src/components/ui/` | 10 (inc. index) | Reusable presentational |
| `src/components/features/` | 17 (inc. index) | Feature screens |
| `src/hooks/` | 5 | Stateful logic |
| `src/App.js` | 1 | Entry point (~100-150 lines) |
| **Total new files** | **44** | |

---

## Risk Mitigation

1. **Each phase ends with a build check** (`npm start` or `npm run build`).
2. **Phases are atomic** — if a phase breaks, only that phase's changes need reverting.
3. **No logic changes** — this is a pure structural refactor. All business logic, calculations, and UI behavior remain identical.
4. **Phase 1 is the safest starting point** — extracting pure data/utils has zero risk of breaking state flow.
