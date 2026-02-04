# 🍸 Premium Cocktail App - State Schema Architecture

## Overview
This document defines the state architecture for the "Supercharged" Premium Edition (€3.99).

---

## 1. 🧪 AI-Powered Spec Creator State Schema

```javascript
// Recipe Creation Wizard State
const [specCreator, setSpecCreator] = useState({
  // Current Step (0-5)
  step: 0,
  
  // Base Spirit Selection
  baseSpirit: {
    type: null,        // 'vodka' | 'gin' | 'rum' | 'tequila' | 'whiskey' | 'brandy' | null
    specific: null,    // 'Bourbon Whiskey' | 'London Dry Gin' | etc
    amount: 60,        // ml - default 60ml (2oz)
    abv: 40,           // ABV of selected spirit
    unitCost: 0,       // Cost per 30ml pour
  },
  
  // Modifiers (Liqueurs/Amari/Vermouths)
  modifiers: [
    // { name: 'Triple Sec', amount: 30, abv: 40, unitCost: 0.80, category: 'liqueur' }
  ],
  
  // Citrus/Acids
  acids: [
    // { name: 'Lime Juice', amount: 22.5, fresh: true }
  ],
  
  // Sweeteners
  sweeteners: [
    // { name: 'Simple Syrup', amount: 15, type: '1:1' }
  ],
  
  // Bitters/Accents
  accents: [
    // { name: 'Angostura Bitters', dashes: 2, type: 'aromatic' }
  ],
  
  // Technique Selection
  technique: null,     // 'shake' | 'stir' | 'build' | 'muddle' | 'blend' | 'swizzle'
  dilution: 0,         // Calculated based on technique
  shakeDuration: 12,   // seconds (for shake technique)
  
  // Glassware
  glass: null,         // 'coupe' | 'rocks' | 'highball' | 'martini' | 'nick_nora' | etc
  ice: null,           // 'cubed' | 'crushed' | 'large_cube' | 'none' | 'pebble'
  
  // Garnish
  garnishes: [],       // ['lime_wheel', 'mint_sprig', 'orange_twist']
  
  // Real-time Calculations
  calculations: {
    totalVolume: 0,        // ml before dilution
    finalVolume: 0,        // ml after dilution
    abv: 0,                // Final ABV %
    costPerDrink: 0,       // € cost
    suggestedPrice: 0,     // € (3.5x cost)
    balanceScore: 0,       // 0-100 (sour/sweet/spirit balance)
    flavorProfile: [],     // ['boozy', 'sour', 'herbal']
  },
  
  // Generated Names
  generatedNames: {
    geographic: '',        // "The Brooklyn Twist"
    speakeasy: '',         // "The Midnight & Velvet"
    ingredientFocus: '',   // "The Lavender Reviver No. 2"
  },
  
  // Final Recipe
  finalRecipe: null,    // Complete recipe object ready for saving
});

// Naming Engine Data
const NAMING_ENGINE = {
  geographic: {
    cities: ['Manhattan', 'Brooklyn', 'Havana', 'Singapore', 'Negroni', 'Paris', 'Tokyo', 'Barcelona', 'Venice', 'Monaco'],
    suffixes: ['Sour', 'Fizz', 'Flip', 'Cocktail', 'Mule', 'Spritz', 'Cooler', 'Smash'],
    formats: [
      '{city} {suffix}',
      'The {city}',
      '{city}ite',
      'Downtown {city}',
    ]
  },
  speakeasy: {
    adjectives: ['Midnight', 'Velvet', 'Golden', 'Silver', 'Smoky', 'Dark', 'Bitter', 'Lost'],
    nouns: ['Rose', 'Throne', 'Hour', 'Garden', 'Moon', 'Revolver', 'Echo', 'Flame'],
    formats: [
      'The {adjective} {noun}',
      '{adjective} & {noun}',
      'The {noun}\'s {adjective}',
    ]
  },
  ingredientFocus: {
    templates: [
      'The {ingredient} Reviver',
      '{ingredient} Royale',
      '{base} & {modifier}',
      '{technique}d {ingredient}',
    ]
  }
};
```

---

## 2. 🎮 Virtual Bar Animation Controller Schema

```javascript
// Mixology Challenge - Animation State
const [virtualBar, setVirtualBar] = useState({
  // Game Mode
  mode: 'menu',  // 'menu' | 'practice' | 'challenge' | 'speed' | 'results'
  difficulty: 'medium',  // 'easy' | 'medium' | 'hard' | 'expert'
  
  // Current Challenge
  challenge: {
    targetCocktail: null,  // The cocktail to recreate
    timeLimit: 45,         // seconds (varies by difficulty)
    timeRemaining: 45,
    round: 1,
    maxRounds: 5,
    isPaused: false,
  },
  
  // Virtual Workspace
  workspace: {
    // Active containers
    shaker: {
      active: false,
      contents: [],        // [{ ingredientId, amount, color }]
      hasIce: false,
      isLidOn: false,
      position: { x: 50, y: 80 },  // % position
    },
    mixingGlass: {
      active: false,
      contents: [],
      hasIce: false,
      barSpoon: false,
      position: { x: 50, y: 80 },
    },
    servingGlass: {
      type: null,          // 'coupe' | 'rocks' | 'highball' etc
      contents: [],
      garnishes: [],
      hasIce: false,
      position: { x: 75, y: 85 },
    },
  },
  
  // Animation States
  animations: {
    // Pour animation
    pouring: {
      active: false,
      sourceBottle: null,
      targetContainer: null,  // 'shaker' | 'mixingGlass' | 'servingGlass'
      progress: 0,            // 0-100
      liquidColor: null,
      duration: 800,          // ms
    },
    
    // Shake animation
    shaking: {
      active: false,
      intensity: 0,           // 0-100
      duration: 0,            // current ms
      targetDuration: 12000,  // target ms (12 seconds)
      perfectZone: { start: 10000, end: 14000 },  // ±2s window
      rhythm: [],             // Accelerometer/tap rhythm tracking
    },
    
    // Stir animation
    stirring: {
      active: false,
      rotations: 0,
      targetRotations: 30,    // Typically 30-40 for a manhattan
      speed: 'medium',        // 'slow' | 'medium' | 'fast'
    },
    
    // Muddle animation
    muddling: {
      active: false,
      presses: 0,
      targetPresses: 8,
    },
    
    // Strain animation
    straining: {
      active: false,
      progress: 0,
      useHawthorn: true,
      useFineStrainer: false,
    },
    
    // Ice drop animation
    iceDropping: {
      active: false,
      cubes: [],  // [{ id, x, y, rotation, landed }]
    },
    
    // Garnish placement
    garnishing: {
      active: false,
      selectedGarnish: null,
      position: { x: 0, y: 0 },
    },
  },
  
  // Speed Rail - Draggable bottles
  speedRail: [
    // { id: 'vodka', name: 'Vodka', color: '#f5f5f5', position: 0 }
  ],
  
  // Scoring
  scoring: {
    ingredients: {
      correct: 0,
      wrong: 0,
      missed: 0,
      accuracy: 0,        // %
    },
    technique: {
      correct: false,
      timing: 0,          // How close to perfect (0-100)
    },
    dilution: {
      achieved: 0,        // ml
      target: 0,          // ml  
      accuracy: 0,        // %
    },
    glass: { correct: false },
    garnish: { correct: false },
    totalScore: 0,        // 0-100
    xpEarned: 0,
    streak: 0,
    multiplier: 1.0,
  },
  
  // Visual Effects
  effects: {
    confetti: false,
    liquidSplash: null,   // { x, y, color }
    glowEffect: null,     // Which element is glowing
    errorShake: false,    // Shake animation for wrong action
    perfectFlash: false,  // Flash for perfect timing
  },
  
  // Tutorial/Hints
  hints: {
    enabled: true,
    currentHint: null,
    showBottleLabels: true,
  },
});

// Rhythm Detection for Shake Mechanic
const [shakeDetector, setShakeDetector] = useState({
  enabled: false,
  lastShakeTime: 0,
  shakeCount: 0,
  averageInterval: 0,
  isRhythmic: false,  // True if consistent shake pattern
  accelerometerData: [],
});
```

---

## 3. 📦 Smart Inventory Schema (Enhanced)

```javascript
// Enhanced Ingredient Schema
const enhancedIngredient = {
  id: 'uuid',
  name: 'Cointreau',
  category: 'Liqueurs',
  subcategory: 'Orange Liqueurs',
  
  // Stock Management
  inStock: true,
  currentStock: 750,      // ml remaining
  bottleSize: 750,        // ml per bottle
  minStock: 150,          // Par level - alert threshold (ml)
  maxStock: 1500,         // Max storage (ml)
  reorderPoint: 200,      // When to reorder (ml)
  
  // Costing
  unitCost: 28.00,        // € per bottle
  costPer30ml: 1.12,      // € per pour (calculated)
  lastPurchaseDate: null,
  supplier: null,
  
  // Substitutions (Smart Engine)
  substitutes: [
    {
      ingredientId: 'triple_sec',
      name: 'Triple Sec',
      similarityScore: 85,      // 0-100
      flavorDifference: 'Slightly sweeter, less complex orange character',
      ratioAdjustment: 1.0,     // Use same amount
      costDifference: -0.50,    // € cheaper per pour
    },
    {
      ingredientId: 'grand_marnier',
      name: 'Grand Marnier',
      similarityScore: 90,
      flavorDifference: 'Richer, cognac base adds depth',
      ratioAdjustment: 0.85,    // Use slightly less
      costDifference: +0.30,
    },
  ],
  
  // Metadata
  abv: 40,
  origin: 'France',
  isHouseMade: false,
  tags: ['citrus', 'orange', 'essential'],
  
  // Expiry (for perishables)
  perishable: false,
  expiryDays: null,
  openedDate: null,
  expiryDate: null,
};

// Substitution Engine State
const [substitutionEngine, setSubstitutionEngine] = useState({
  missingIngredient: null,
  suggestions: [],
  selectedSubstitute: null,
  showComparison: false,
});
```

---

## 4. 🎉 Party Mode Schema

```javascript
// Party Mode State
const [partyMode, setPartyMode] = useState({
  isActive: false,
  sessionId: null,        // Unique session identifier
  sessionName: 'Saturday Night',
  startTime: null,
  
  // Guest Menu
  guestMenu: {
    enabled: true,
    cocktails: [],        // Filtered to only what can be made
    showPrices: false,
    showIngredients: true,
    customMessage: 'Welcome! Browse and order below.',
    theme: 'dark',        // 'dark' | 'light' | 'gold'
    logoUrl: null,
  },
  
  // QR Code
  qrCode: {
    url: null,            // Generated URL for guest access
    expiresAt: null,      // Auto-expire after party
  },
  
  // Order Queue
  orderQueue: [
    // {
    //   id: 'order_123',
    //   cocktailName: 'Margarita',
    //   guestName: 'Table 4',
    //   notes: 'Extra lime please',
    //   timestamp: Date.now(),
    //   status: 'pending',  // 'pending' | 'making' | 'ready' | 'delivered'
    //   estimatedTime: 180,  // seconds
    // }
  ],
  
  // Stats
  stats: {
    totalOrders: 0,
    completedOrders: 0,
    averageWaitTime: 0,
    popularDrinks: {},    // { 'Margarita': 5, 'Old Fashioned': 3 }
  },
  
  // Settings
  settings: {
    maxQueueSize: 20,
    autoAcceptOrders: true,
    soundNotifications: true,
    showQueueToGuests: true,
  },
});

// Guest View State (Separate simplified state)
const [guestView, setGuestView] = useState({
  sessionId: null,
  isConnected: false,
  menu: [],
  selectedCocktail: null,
  orderStatus: null,      // Current order status
  queuePosition: null,
});
```

---

## 5. 🧴 Prep Lab Schema

```javascript
// Prep Lab State
const [prepLab, setPrepLab] = useState({
  houseMadeIngredients: [
    {
      id: 'simple_syrup_batch_1',
      name: 'Simple Syrup (1:1)',
      type: 'syrup',          // 'syrup' | 'juice' | 'infusion' | 'cordial' | 'shrub'
      recipe: {
        ingredients: ['Sugar', 'Water'],
        ratio: '1:1',
        method: 'Heat until dissolved',
        yield: '1000ml',
      },
      
      // Batch Info
      batchNumber: 1,
      batchSize: 1000,        // ml
      currentStock: 750,      // ml remaining
      
      // Dates
      createdDate: '2024-01-15T10:00:00Z',
      expiryDate: '2024-02-15T10:00:00Z',   // 30 days for syrup
      daysUntilExpiry: 15,
      
      // Status
      status: 'good',         // 'good' | 'expiring_soon' | 'expired' | 'low'
      alertThreshold: 7,      // Days before expiry to warn
      
      // Cost
      costPerBatch: 2.50,
      costPer30ml: 0.075,
      
      // Notes
      notes: 'Made with demerara sugar',
      storageLocation: 'Fridge',
    },
  ],
  
  // Expiry Alerts
  expiryAlerts: [
    // { ingredientId, name, daysUntilExpiry, expiryDate }
  ],
  
  // Low Stock Alerts  
  lowStockAlerts: [
    // { ingredientId, name, currentStock, minStock }
  ],
  
  // Recipe Templates
  recipeTemplates: [
    {
      name: 'Simple Syrup (1:1)',
      type: 'syrup',
      shelfLife: 30,          // days
      storageTemp: 'refrigerated',
      defaultBatchSize: 1000,
      ingredients: [
        { name: 'Sugar', amount: 500, unit: 'g' },
        { name: 'Water', amount: 500, unit: 'ml' },
      ],
      method: [
        'Combine sugar and water in saucepan',
        'Heat over medium, stirring until dissolved',
        'Do not boil',
        'Cool completely before bottling',
      ],
    },
    {
      name: 'Fresh Lime Juice',
      type: 'juice',
      shelfLife: 1,           // days (strict!)
      storageTemp: 'refrigerated',
      defaultBatchSize: 500,
      notes: 'Best within 4 hours. Pasteurize for 7-day shelf life.',
    },
    // ... more templates
  ],
  
  // Prep Schedule
  schedule: [
    // { ingredientId, scheduledDate, quantity, assignedTo }
  ],
});

// Shelf Life Reference
const SHELF_LIFE_DAYS = {
  'Fresh Lime Juice': 1,
  'Fresh Lemon Juice': 1,
  'Fresh Grapefruit Juice': 2,
  'Fresh Orange Juice': 3,
  'Simple Syrup (1:1)': 30,
  'Rich Syrup (2:1)': 60,
  'Honey Syrup': 30,
  'Agave Syrup': 90,
  'Grenadine': 30,
  'Orgeat': 14,
  'Falernum': 60,
  'Oleo Saccharum': 7,
  'Herb Infusion': 7,
  'Spirit Infusion': 90,
};
```

---

## 6. 🔧 Global App State (Updated)

```javascript
// Main App Component State
function App() {
  // ========== EXISTING STATE ==========
  const [view, setView] = useState('dashboard');
  const [cocktails, setCocktails] = useState(INITIAL_COCKTAILS);
  const [ingredients, setIngredients] = useState(INITIAL_INGREDIENTS);
  const [sales, setSales] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentlyMade, setRecentlyMade] = useState([]);
  const [speedRail, setSpeedRail] = useState([]);
  const [timers, setTimers] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  
  // ========== NEW PREMIUM STATE ==========
  
  // Spec Creator
  const [specCreator, setSpecCreator] = useState(INITIAL_SPEC_CREATOR);
  const [showSpecCreator, setShowSpecCreator] = useState(false);
  
  // Virtual Bar / Mixology Challenge
  const [virtualBar, setVirtualBar] = useState(INITIAL_VIRTUAL_BAR);
  
  // Party Mode
  const [partyMode, setPartyMode] = useState(INITIAL_PARTY_MODE);
  
  // Prep Lab
  const [prepLab, setPrepLab] = useState(INITIAL_PREP_LAB);
  
  // User Progress / Gamification
  const [userProgress, setUserProgress] = useState({
    level: 1,
    totalXP: 0,
    xpToNextLevel: 500,
    achievements: [],
    streakDays: 0,
    lastActiveDate: null,
    personalBests: {
      mixologyScore: 0,
      speedChallenge: 0,
      perfectStreak: 0,
    },
    statistics: {
      totalDrinksMade: 0,
      totalChallengesCompleted: 0,
      favoriteSpirit: null,
      mostMadeCocktail: null,
    },
  });
  
  // ========== API-READY STRUCTURE ==========
  // All state can be serialized and synced to:
  // - Firebase Realtime Database
  // - Supabase PostgreSQL
  // - Local IndexedDB for offline
  
  const syncState = async () => {
    // Future: Sync to cloud
    const stateSnapshot = {
      cocktails,
      ingredients,
      sales,
      favorites,
      speedRail,
      prepLab,
      userProgress,
      lastSync: new Date().toISOString(),
    };
    
    // localStorage for now
    localStorage.setItem('app_state_v2', JSON.stringify(stateSnapshot));
    
    // Future: Firebase/Supabase
    // await supabase.from('user_data').upsert(stateSnapshot);
  };
}
```

---

## 7. 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INPUT                            │
│  (Taps, Drags, Shakes, QR Scans)                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    ACTION DISPATCHER                         │
│  handlePourIngredient() | handleShake() | handleOrder()     │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │  LOCAL   │ │ REALTIME │ │ ANIMATION│
    │  STATE   │ │  CALCS   │ │ TRIGGERS │
    │ (React)  │ │ (useMemo)│ │ (RAF)    │
    └────┬─────┘ └────┬─────┘ └────┬─────┘
         │            │            │
         ▼            ▼            ▼
    ┌──────────────────────────────────────┐
    │          RENDER LAYER                 │
    │  • SVG Glass Animation               │
    │  • Liquid Physics                    │
    │  • Score Display                     │
    │  • Confetti Effects                  │
    └──────────────────────────────────────┘
                      │
                      ▼
    ┌──────────────────────────────────────┐
    │        PERSISTENCE LAYER             │
    │  localStorage → IndexedDB → Cloud    │
    └──────────────────────────────────────┘
```

---

## Next Steps

1. **Implement Spec Creator UI** with step-by-step wizard
2. **Build Naming Algorithm** with weighted randomization
3. **Create Virtual Bar Canvas** with draggable bottles
4. **Add Physics-based Animations** for liquid/ice
5. **Build Party Mode QR Generator** with guest view
6. **Implement Prep Lab** with expiry tracking

Ready to implement? Start with which feature?
