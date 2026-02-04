import React, { useState, useMemo, useRef } from 'react';
import { X, Camera, Search, ChevronDown } from 'lucide-react';
import { GOLD, DARK_BG, TECHNIQUE_ICONS } from '../../data/constants';
import {
  FLAVOR_AXES, BITTER_INGREDIENTS, BOTANICAL_INGREDIENTS,
  EXTENDED_ABV_MAP, CLASSIC_COCKTAILS, BARTENDER_COMMENTS,
} from '../../data/flavorData';
import { NAMING_DATA } from '../../data/namingEngine';
import { Button } from '../ui';

// ── FlavorRadar SVG ──────────────────────────────────────────────
export const FlavorRadarSVG = ({ scores, size = 100 }) => {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const n = FLAVOR_AXES.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const axisPoints = FLAVOR_AXES.map((_, i) => {
    const angle = startAngle + i * angleStep;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });

  const dataPoints = FLAVOR_AXES.map((axis, i) => {
    const value = (scores[axis] || 0) / 10;
    const angle = startAngle + i * angleStep;
    return { x: cx + radius * value * Math.cos(angle), y: cy + radius * value * Math.sin(angle) };
  });
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  const rings = [0.33, 0.66, 1.0];

  return (
    <svg width={size} height={size} viewBox={`${-16} ${-16} ${size + 32} ${size + 32}`}>
      {rings.map((r, ri) => {
        const ringPoints = FLAVOR_AXES.map((_, i) => {
          const angle = startAngle + i * angleStep;
          return `${cx + radius * r * Math.cos(angle)},${cy + radius * r * Math.sin(angle)}`;
        }).join(' ');
        return <polygon key={ri} points={ringPoints} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />;
      })}
      {axisPoints.map((pt, i) => (
        <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      ))}
      <path d={dataPath} fill="rgba(212, 175, 55, 0.3)" stroke={GOLD} strokeWidth="1.5" />
      {dataPoints.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill={GOLD} />
      ))}
      {FLAVOR_AXES.map((axis, i) => {
        const angle = startAngle + i * angleStep;
        const labelRadius = radius + 14;
        const lx = cx + labelRadius * Math.cos(angle);
        const ly = cy + labelRadius * Math.sin(angle);
        return (
          <text key={i} x={lx} y={ly} fill="rgba(255,255,255,0.6)" fontSize="7" textAnchor="middle" dominantBaseline="central">
            {axis}
          </text>
        );
      })}
    </svg>
  );
};

// ── RecipeCreator ────────────────────────────────────────────────
const RecipeCreator = ({ ingredients, onSave, onClose }) => {
  const [step, setStep] = useState(0);
  const [photoData, setPhotoData] = useState(null);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [modifierFilter, setModifierFilter] = useState('all');
  const [showSelections, setShowSelections] = useState(false);
  const fileInputRef = useRef(null);

  const searchFilter = (item) => !ingredientSearch || item.name.toLowerCase().includes(ingredientSearch.toLowerCase());

  const SearchBar = () => (
    <div className="relative mb-4">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
      <input
        type="text"
        placeholder="Search ingredients..."
        value={ingredientSearch}
        onChange={e => setIngredientSearch(e.target.value)}
        className="w-full pl-11 pr-4 py-3 rounded-xl outline-none"
        style={{
          fontSize: '16px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: `1px solid ${GOLD}40`,
          color: '#fff',
        }}
      />
    </div>
  );

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxWidth = 600;
          const scale = Math.min(1, maxWidth / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setPhotoData(compressed);
  };

  const [recipe, setRecipe] = useState({
    baseSpirits: [],
    modifiers: [],
    acids: [],
    sweeteners: [],
    mixers: [],
    garnishes: [],
    extras: [],
    technique: 'Shake',
    glass: 'Coupe Glass 🍸',
    name: '',
  });

  // ── Dynamic ingredient sourcing from inventory ─────────────
  const spiritOptions = useMemo(() => {
    return ingredients.filter(i => i.category === 'Base Spirits');
  }, [ingredients]);

  const modifierOptions = useMemo(() => {
    return ingredients.filter(i =>
      i.category === 'Liqueurs' || i.category === 'Bitters' || i.category === 'Wine & Champagne'
    );
  }, [ingredients]);

  const acidOptions = useMemo(() => {
    return ingredients.filter(i => i.category === 'Fresh Citrus');
  }, [ingredients]);

  const sweetenerOptions = useMemo(() => {
    return ingredients.filter(i => i.category === 'Syrups & Sweeteners');
  }, [ingredients]);

  const mixerOptions = useMemo(() => {
    return ingredients.filter(i => i.category === 'Mixers & Sodas');
  }, [ingredients]);

  const garnishOptions = useMemo(() => {
    return ingredients.filter(i =>
      i.category === 'Garnishes' || i.category === 'Fresh Herbs'
    );
  }, [ingredients]);

  // ── ABV lookup ─────────────────────────────────────────────
  const getIngredientABV = (name) => {
    const lower = name.toLowerCase();
    for (const [key, val] of Object.entries(EXTENDED_ABV_MAP)) {
      if (lower.includes(key)) return val;
    }
    return 0;
  };

  // ── Real-time calculations ─────────────────────────────────
  const calculations = useMemo(() => {
    let totalAlcohol = 0;
    let totalVolume = 0;
    let totalCost = 0;

    recipe.baseSpirits.forEach(bs => {
      const spirit = spiritOptions.find(s => s.name === bs.name);
      const abv = getIngredientABV(bs.name);
      totalAlcohol += (bs.amount * abv) / 100;
      totalVolume += bs.amount;
      totalCost += (spirit?.unitCost || 22) * (bs.amount / 750);
    });

    recipe.modifiers.forEach(mod => {
      const abv = getIngredientABV(mod.name);
      totalAlcohol += (mod.amount * abv) / 100;
      totalVolume += mod.amount;
      const ing = ingredients.find(i => i.name === mod.name);
      totalCost += (ing?.unitCost || 18) * (mod.amount / 750);
    });

    recipe.acids.forEach(acid => {
      totalVolume += acid.amount;
      const ing = ingredients.find(i => i.name === acid.name);
      totalCost += (ing?.unitCost || 4) * (acid.amount / 750);
    });

    recipe.sweeteners.forEach(sweet => {
      totalVolume += sweet.amount;
      const ing = ingredients.find(i => i.name === sweet.name);
      totalCost += (ing?.unitCost || 6) * (sweet.amount / 750);
    });

    recipe.mixers.forEach(mixer => {
      totalVolume += mixer.amount;
      const ing = ingredients.find(i => i.name === mixer.name);
      totalCost += (ing?.unitCost || 4) * (mixer.amount / 750);
    });

    const dilutionFactors = { 'Shake': 0.25, 'Stir': 0.20, 'Build': 0.10, 'Muddle': 0.15, 'Blend': 0.30, 'Layer': 0.05 };
    const dilution = totalVolume * (dilutionFactors[recipe.technique] || 0.2);
    const finalVolume = totalVolume + dilution;
    const finalABV = totalVolume > 0 ? (totalAlcohol / finalVolume) * 100 : 0;

    return {
      totalVolume: Math.round(totalVolume),
      finalVolume: Math.round(finalVolume),
      abv: Math.round(finalABV * 10) / 10,
      costPerDrink: Math.round(totalCost * 100) / 100,
      suggestedPrice: Math.round(totalCost * 3.5 * 100) / 100,
    };
  }, [recipe, spiritOptions, ingredients]);

  // ── Flavor Radar scores (5-axis, 0-10) ────────────────────
  const flavorRadar = useMemo(() => {
    const sweetMl = recipe.sweeteners.reduce((sum, s) => sum + s.amount, 0);
    const sweetScore = Math.min(10, (sweetMl / 20) * 10);

    const acidMl = recipe.acids.reduce((sum, a) => sum + a.amount, 0);
    const sourScore = Math.min(10, (acidMl / 30) * 10);

    let bitterScore = 0;
    const allIngredientNames = [
      ...recipe.baseSpirits.map(s => s.name),
      ...recipe.modifiers.map(m => m.name),
    ].filter(Boolean).map(n => n.toLowerCase());

    allIngredientNames.forEach(name => {
      if (BITTER_INGREDIENTS.some(b => name.includes(b))) {
        const mod = recipe.modifiers.find(m => m.name.toLowerCase() === name);
        if (mod) {
          bitterScore += Math.min(5, (mod.amount / 22.5) * 5);
        } else {
          bitterScore += 3;
        }
      }
    });
    bitterScore = Math.min(10, bitterScore);

    const strengthScore = Math.min(10, (calculations.abv / 30) * 10);

    let botanicalScore = 0;
    const allNamesIncludingBase = [
      ...recipe.baseSpirits.map(s => s.name),
      ...recipe.modifiers.map(m => m.name),
    ].filter(Boolean).map(n => n.toLowerCase());

    allNamesIncludingBase.forEach(name => {
      if (BOTANICAL_INGREDIENTS.some(b => name.includes(b))) {
        const mod = recipe.modifiers.find(m => m.name.toLowerCase() === name);
        if (mod) {
          botanicalScore += Math.min(4, (mod.amount / 22.5) * 4);
        } else if (name.includes('gin')) {
          botanicalScore += 4;
        } else {
          botanicalScore += 2.5;
        }
      }
    });
    botanicalScore = Math.min(10, botanicalScore);

    return {
      Sweet: Math.round(sweetScore * 10) / 10,
      Sour: Math.round(sourScore * 10) / 10,
      Bitter: Math.round(bitterScore * 10) / 10,
      Strength: Math.round(strengthScore * 10) / 10,
      Botanical: Math.round(botanicalScore * 10) / 10,
    };
  }, [recipe, calculations.abv]);

  // ── Bartender comment (first matching rule) ────────────────
  const bartenderComment = useMemo(() => {
    const match = BARTENDER_COMMENTS.find(r => r.test(flavorRadar));
    return match ? match.comment : '';
  }, [flavorRadar]);

  // ── Smart suggestions (balance tips + classic matching) ────
  const smartSuggestions = useMemo(() => {
    const suggestions = [];

    const hasBaseSpirit = recipe.baseSpirits.length > 0;
    const hasAcid = recipe.acids.length > 0;
    const hasSweetener = recipe.sweeteners.length > 0;

    if (hasBaseSpirit && hasAcid && !hasSweetener) {
      suggestions.push({ type: 'balance', text: 'Try adding 15ml Simple Syrup or Agave to balance the acid' });
    }
    if (hasBaseSpirit && hasSweetener && !hasAcid) {
      suggestions.push({ type: 'balance', text: 'Consider adding citrus juice for brightness and balance' });
    }

    const currentNames = [
      ...recipe.baseSpirits.map(s => s.name),
      ...recipe.modifiers.map(m => m.name),
      ...recipe.acids.map(a => a.name),
      ...recipe.sweeteners.map(s => s.name),
      ...recipe.mixers.map(m => m.name),
      ...recipe.garnishes,
      ...recipe.extras,
    ].filter(Boolean).map(n => n.toLowerCase());

    if (currentNames.length >= 2) {
      const matches = CLASSIC_COCKTAILS
        .map(classic => {
          const coreMatches = classic.core.filter(coreItem => {
            const alternatives = coreItem.split('|');
            return alternatives.some(alt => currentNames.some(cn => cn.includes(alt)));
          });
          const matchRatio = coreMatches.length / classic.core.length;
          return { ...classic, matchRatio, coreMatches: coreMatches.length };
        })
        .filter(m => m.matchRatio >= 0.66)
        .sort((a, b) => b.matchRatio - a.matchRatio);

      if (matches.length > 0) {
        const best = matches[0];
        if (best.matchRatio === 1) {
          suggestions.push({ type: 'classic', text: `This looks like a ${best.name}!` });
        } else {
          const missing = best.core.filter(coreItem => {
            const alternatives = coreItem.split('|');
            return !alternatives.some(alt => currentNames.some(cn => cn.includes(alt)));
          });
          const missingLabel = missing.map(m => m.split('|')[0]).join(' + ');
          suggestions.push({ type: 'classic', text: `Add ${missingLabel} to make a ${best.name}` });
        }
      }
    }

    return suggestions;
  }, [recipe]);

  // ── Name generator ─────────────────────────────────────────
  const generatedNames = useMemo(() => {
    const { geographic, speakeasy } = NAMING_DATA;
    const city = geographic.cities[Math.floor(Math.random() * geographic.cities.length)];
    const suffix = geographic.suffixes[Math.floor(Math.random() * geographic.suffixes.length)];
    const geoName = [`The ${city}`, `${city} ${suffix}`, `Downtown ${city}`][Math.floor(Math.random() * 3)];
    const adj = speakeasy.adjectives[Math.floor(Math.random() * speakeasy.adjectives.length)];
    const noun = speakeasy.nouns[Math.floor(Math.random() * speakeasy.nouns.length)];
    const speakName = [`The ${adj} ${noun}`, `${adj} & ${noun}`][Math.floor(Math.random() * 2)];
    let ingredientName = 'The House Special';
    if (recipe.baseSpirits.length > 0) {
      const spiritShort = recipe.baseSpirits[0].name.split(' ')[0];
      ingredientName = recipe.modifiers.length > 0
        ? `${spiritShort} & ${recipe.modifiers[0].name.split(' ')[0]}`
        : `The ${spiritShort} Perfect`;
    }
    return { geographic: geoName, speakeasy: speakName, ingredientFocus: ingredientName };
  }, [recipe.baseSpirits, recipe.modifiers]);

  // ── Selection summary for progress bar ──────────────────────
  const summaryItems = useMemo(() => {
    const items = [];
    if (recipe.baseSpirits.length > 0)
      items.push({ label: 'Base', value: recipe.baseSpirits.map(s => `${s.name} ${s.amount}ml`).join(', ') });
    if (recipe.modifiers.length > 0)
      items.push({ label: 'Modifiers', value: recipe.modifiers.map(m => `${m.name} ${m.amount}ml`).join(', ') });
    if (recipe.acids.length > 0)
      items.push({ label: 'Citrus', value: recipe.acids.map(a => `${a.name} ${a.amount}ml`).join(', ') });
    if (recipe.sweeteners.length > 0)
      items.push({ label: 'Sweet', value: recipe.sweeteners.map(s => `${s.name} ${s.amount}ml`).join(', ') });
    if (recipe.mixers.length > 0)
      items.push({ label: 'Mixers', value: recipe.mixers.map(m => `${m.name} ${m.amount}ml`).join(', ') });
    if (recipe.garnishes.length > 0)
      items.push({ label: 'Garnish', value: recipe.garnishes.join(', ') });
    return items;
  }, [recipe]);

  // ── Add / remove helpers ───────────────────────────────────
  const toggleSpirit = (name) => {
    setRecipe(prev => ({
      ...prev,
      baseSpirits: prev.baseSpirits.find(s => s.name === name)
        ? prev.baseSpirits.filter(s => s.name !== name)
        : [...prev.baseSpirits, { name, amount: 30 }],
    }));
  };

  const addModifier = (name) => {
    if (!recipe.modifiers.find(m => m.name === name)) {
      setRecipe(prev => ({ ...prev, modifiers: [...prev.modifiers, { name, amount: 30 }] }));
    }
  };

  const addAcid = (name) => {
    if (!recipe.acids.find(a => a.name === name)) {
      setRecipe(prev => ({ ...prev, acids: [...prev.acids, { name, amount: 30 }] }));
    }
  };

  const addSweetener = (name) => {
    if (!recipe.sweeteners.find(s => s.name === name)) {
      setRecipe(prev => ({ ...prev, sweeteners: [...prev.sweeteners, { name, amount: 30 }] }));
    }
  };

  const addMixer = (name) => {
    if (!recipe.mixers.find(m => m.name === name)) {
      setRecipe(prev => ({ ...prev, mixers: [...prev.mixers, { name, amount: 30 }] }));
    }
  };

  const toggleGarnish = (name) => {
    setRecipe(prev => ({
      ...prev,
      garnishes: prev.garnishes.includes(name) ? prev.garnishes.filter(n => n !== name) : [...prev.garnishes, name],
    }));
  };

  const toggleExtra = (name) => {
    setRecipe(prev => ({
      ...prev,
      extras: prev.extras.includes(name) ? prev.extras.filter(n => n !== name) : [...prev.extras, name],
    }));
  };

  const techniques = ['Shake', 'Stir', 'Build', 'Muddle', 'Blend', 'Layer'];
  const glasses = ['Coupe Glass 🍸', 'Old Fashioned Glass 🥃', 'Highball Glass 🥤', 'Martini Glass 🍸', 'Nick & Nora Glass 🍸', 'Collins Glass 🥤'];

  // ── Save handler ───────────────────────────────────────────
  const handleSave = () => {
    const allIngredientsList = [
      ...recipe.baseSpirits.map(s => s.name),
      ...recipe.modifiers.map(m => m.name),
      ...recipe.acids.map(a => a.name),
      ...recipe.sweeteners.map(s => s.name),
      ...recipe.mixers.map(m => m.name),
    ].filter(Boolean);

    const specParts = [];
    recipe.baseSpirits.forEach(bs => specParts.push(`${bs.amount}ml ${bs.name}`));
    recipe.modifiers.forEach(m => specParts.push(`${m.amount}ml ${m.name}`));
    recipe.acids.forEach(a => specParts.push(`${a.amount}ml ${a.name}`));
    recipe.sweeteners.forEach(s => specParts.push(`${s.amount}ml ${s.name}`));
    recipe.mixers.forEach(m => specParts.push(`${m.amount}ml ${m.name}`));

    const flavorProfile = [];
    if (calculations.abv > 25) flavorProfile.push('boozy');
    if (recipe.acids.length > 0) flavorProfile.push('sour');
    if (recipe.sweeteners.length > 0) flavorProfile.push('sweet');
    if (flavorRadar.Bitter > 3) flavorProfile.push('bitter');
    if (flavorRadar.Botanical > 3) flavorProfile.push('herbal');

    const ingredientDetails = [
      ...recipe.baseSpirits.map(bs => ({ name: bs.name, amount: bs.amount, unit: 'ml' })),
      ...recipe.modifiers.map(m => ({ name: m.name, amount: m.amount, unit: 'ml' })),
      ...recipe.acids.map(a => ({ name: a.name, amount: a.amount, unit: 'ml' })),
      ...recipe.sweeteners.map(s => ({ name: s.name, amount: s.amount, unit: 'ml' })),
      ...recipe.mixers.map(m => ({ name: m.name, amount: m.amount, unit: 'ml' })),
    ];

    const finalRecipe = {
      name: recipe.name || generatedNames.speakeasy,
      ingredients: allIngredientsList,
      ingredientDetails,
      instructions: `${specParts.join(', ')}. ${recipe.technique} with ice, strain into ${recipe.glass}.${recipe.garnishes.length ? ` Garnish: ${recipe.garnishes.join(', ')}.` : ''}${recipe.extras.length ? ` Extras: ${recipe.extras.join(', ')}.` : ''}`,
      type: 'Custom Creation 🎨',
      technique: recipe.technique,
      prepTime: '3 min',
      glass: recipe.glass,
      abv: calculations.abv,
      costPerDrink: calculations.costPerDrink,
      sellPrice: calculations.suggestedPrice,
      flavors: flavorProfile,
      dietary: ['vegan', 'gluten_free'],
      tags: ['signature'],
      isCustom: true,
      radarScores: { ...flavorRadar },
      ...(photoData ? { image: photoData } : {}),
    };
    onSave(finalRecipe);
  };

  const steps = [
    { title: 'Spirits', icon: '🥃' },
    { title: 'Modifiers', icon: '🍾' },
    { title: 'Balance', icon: '⚖️' },
    { title: 'Garnish', icon: '🌿' },
    { title: 'Technique', icon: '🍸' },
    { title: 'Finish', icon: '✨' },
  ];

  // ── Helper: render selected items with quick-select amount buttons ──
  const POUR_PRESETS = [15, 22.5, 30, 45, 60];

  const renderSelectedList = (items, listKey) => (
    items.length > 0 && (
      <div className="space-y-2 mb-4">
        {items.map(item => (
          <div key={item.name} className="p-3 rounded-xl" style={{ backgroundColor: `${GOLD}20` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-medium">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: GOLD }}>{item.amount}ml</span>
                <button onClick={() => setRecipe(prev => ({ ...prev, [listKey]: prev[listKey].filter(m => m.name !== item.name) }))}>
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </div>
            </div>
            <div className="flex gap-1.5">
              {POUR_PRESETS.map(amt => (
                <button
                  key={amt}
                  onClick={() => setRecipe(prev => ({
                    ...prev,
                    [listKey]: prev[listKey].map(m => m.name === item.name ? { ...m, amount: amt } : m),
                  }))}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
                  style={{
                    backgroundColor: item.amount === amt ? GOLD : 'rgba(255,255,255,0.08)',
                    color: item.amount === amt ? '#000' : 'rgba(255,255,255,0.6)',
                    border: `1px solid ${item.amount === amt ? GOLD : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: DARK_BG }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <button onClick={onClose} className="p-2"><X className="w-6 h-6 text-white/60" /></button>
        <h2 className="text-lg font-light" style={{ color: GOLD }}>Recipe Creator</h2>
        <div className="w-10" />
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium" style={{ color: GOLD }}>
            Step {step + 1}: {steps[step].title}
          </span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {step + 1} / {steps.length}
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(step / (steps.length - 1)) * 100}%`, backgroundColor: GOLD }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between px-4 py-2">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center" onClick={() => i <= step && setStep(i)} style={{ cursor: i <= step ? 'pointer' : 'default' }}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-base mb-1"
              style={{
                backgroundColor: i === step ? GOLD : i < step ? `${GOLD}50` : 'rgba(255,255,255,0.1)',
                color: i <= step ? '#000' : 'rgba(255,255,255,0.4)',
              }}
            >
              {s.icon}
            </div>
            <span className="text-[10px]" style={{ color: i === step ? GOLD : 'rgba(255,255,255,0.4)' }}>{s.title}</span>
          </div>
        ))}
      </div>

      {/* Selection Summary (tap to expand and edit amounts) */}
      {summaryItems.length > 0 && (
        <div className="px-4 pb-2">
          <button
            onClick={() => setShowSelections(!showSelections)}
            className="w-full rounded-lg transition-all active:scale-[0.99]"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center py-2 px-3">
              <div className="flex gap-3 flex-1 overflow-x-auto">
                {summaryItems.map((item, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-white/20">|</span>}
                    <span className="flex items-center gap-1 text-xs whitespace-nowrap">
                      <span className="font-medium" style={{ color: GOLD }}>{item.label}:</span>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item.value}</span>
                    </span>
                  </React.Fragment>
                ))}
              </div>
              <ChevronDown className={`w-4 h-4 flex-shrink-0 ml-2 text-white/40 transition-transform duration-200 ${showSelections ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Expanded: editable amounts for all selections */}
          {showSelections && (
            <div
              className="mt-2 p-3 rounded-lg space-y-3"
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {recipe.baseSpirits.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: GOLD }}>Base Spirits</p>
                  {renderSelectedList(recipe.baseSpirits, 'baseSpirits')}
                </div>
              )}
              {recipe.modifiers.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: GOLD }}>Modifiers</p>
                  {renderSelectedList(recipe.modifiers, 'modifiers')}
                </div>
              )}
              {recipe.acids.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: GOLD }}>Citrus</p>
                  {renderSelectedList(recipe.acids, 'acids')}
                </div>
              )}
              {recipe.sweeteners.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: GOLD }}>Sweeteners</p>
                  {renderSelectedList(recipe.sweeteners, 'sweeteners')}
                </div>
              )}
              {recipe.mixers.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: GOLD }}>Mixers</p>
                  {renderSelectedList(recipe.mixers, 'mixers')}
                </div>
              )}
              {recipe.garnishes.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: GOLD }}>Garnishes</p>
                  <div className="flex flex-wrap gap-2">
                    {recipe.garnishes.map(g => (
                      <span
                        key={g}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                        style={{ backgroundColor: `${GOLD}20`, border: `1px solid ${GOLD}40`, color: 'rgba(255,255,255,0.8)' }}
                      >
                        {g}
                        <button onClick={() => setRecipe(prev => ({ ...prev, garnishes: prev.garnishes.filter(n => n !== g) }))}>
                          <X className="w-3 h-3 text-white/40" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-4">

        {/* ── Step 0: Base Spirit (category === 'Base Spirits') ── */}
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-light text-white mb-4">Choose Base Spirits</h3>
            {renderSelectedList(recipe.baseSpirits, 'baseSpirits')}
            <SearchBar />
            <div className="grid grid-cols-2 gap-3">
              {spiritOptions.filter(s => s.inStock && searchFilter(s)).map(spirit => {
                const isSelected = recipe.baseSpirits.some(s => s.name === spirit.name);
                return (
                  <button
                    key={spirit.name}
                    onClick={() => toggleSpirit(spirit.name)}
                    className="p-4 rounded-xl text-left transition-all active:scale-95"
                    style={{
                      backgroundColor: isSelected ? `${GOLD}30` : 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: `2px solid ${isSelected ? GOLD : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <span className="text-2xl block mb-2">🥃</span>
                    <span className="text-sm text-white font-medium">{spirit.name}</span>
                    <span className="text-xs block mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {getIngredientABV(spirit.name)}% ABV
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 1: Modifiers (Liqueurs + Bitters + Wine & Champagne) ── */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-light text-white mb-4">Add Modifiers</h3>
            {renderSelectedList(recipe.modifiers, 'modifiers')}
            <SearchBar />
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[{ key: 'all', label: 'All' }, { key: 'Liqueurs', label: 'Liqueurs' }, { key: 'Bitters', label: 'Bitters' }, { key: 'Wine & Champagne', label: 'Wine' }].map(f => (
                <button
                  key={f.key}
                  onClick={() => setModifierFilter(modifierFilter === f.key ? 'all' : f.key)}
                  className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95"
                  style={{
                    backgroundColor: modifierFilter === f.key ? `${GOLD}20` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${modifierFilter === f.key ? `${GOLD}60` : 'rgba(255,255,255,0.1)'}`,
                    color: modifierFilter === f.key ? GOLD : 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {modifierOptions
                .filter(l => l.inStock && !recipe.modifiers.find(m => m.name === l.name) && searchFilter(l) && (modifierFilter === 'all' || l.category === modifierFilter))
                .map(item => (
                  <button
                    key={item.name}
                    onClick={() => addModifier(item.name)}
                    className="p-3 rounded-xl text-left text-sm transition-all active:scale-95"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <span className="text-white">{item.name}</span>
                    <span className="text-xs block mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {item.category}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Balance (Fresh Citrus + Syrups & Sweeteners + Mixers) ── */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Acids */}
            <div>
              <h3 className="text-xl font-light text-white mb-2">🍋 Acids (Citrus)</h3>
              {renderSelectedList(recipe.acids, 'acids')}
              <div className="flex flex-wrap gap-2">
                {acidOptions
                  .filter(a => a.inStock && !recipe.acids.find(x => x.name === a.name))
                  .map(acid => (
                    <button
                      key={acid.name}
                      onClick={() => addAcid(acid.name)}
                      className="px-4 py-2 rounded-full text-sm transition-all active:scale-95"
                      style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', color: '#84CC16' }}
                    >
                      {acid.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Sweeteners */}
            <div>
              <h3 className="text-xl font-light text-white mb-2">🍯 Sweeteners</h3>
              {renderSelectedList(recipe.sweeteners, 'sweeteners')}
              <div className="flex flex-wrap gap-2">
                {sweetenerOptions
                  .filter(s => s.inStock && !recipe.sweeteners.find(x => x.name === s.name))
                  .map(sweet => (
                    <button
                      key={sweet.name}
                      onClick={() => addSweetener(sweet.name)}
                      className="px-4 py-2 rounded-full text-sm transition-all active:scale-95"
                      style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', color: '#F59E0B' }}
                    >
                      {sweet.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Mixers */}
            <div>
              <h3 className="text-xl font-light text-white mb-2">🫧 Mixers & Sodas</h3>
              {renderSelectedList(recipe.mixers, 'mixers')}
              <div className="flex flex-wrap gap-2">
                {mixerOptions
                  .filter(m => m.inStock && !recipe.mixers.find(x => x.name === m.name))
                  .map(mixer => (
                    <button
                      key={mixer.name}
                      onClick={() => addMixer(mixer.name)}
                      className="px-4 py-2 rounded-full text-sm transition-all active:scale-95"
                      style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', color: '#06B6D4' }}
                    >
                      {mixer.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Garnish (Garnishes + Fresh Herbs + Other) ── */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-light text-white mb-4">Garnish & Extras</h3>
            <div className="flex flex-wrap gap-2">
              {garnishOptions.filter(g => g.inStock).map(g => {
                const isGarnish = g.category === 'Garnishes' || g.category === 'Fresh Herbs';
                const selected = isGarnish ? recipe.garnishes.includes(g.name) : recipe.extras.includes(g.name);
                return (
                  <button
                    key={g.name}
                    onClick={() => isGarnish ? toggleGarnish(g.name) : toggleExtra(g.name)}
                    className="px-4 py-2 rounded-full flex items-center gap-2 transition-all active:scale-95"
                    style={{
                      backgroundColor: selected ? `${GOLD}30` : 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: `1px solid ${selected ? GOLD : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <span className="text-sm text-white">{g.name}</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{g.category}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 4: Technique & Glass (unchanged) ── */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-light text-white mb-4">Technique</h3>
              <div className="grid grid-cols-3 gap-3">
                {techniques.map(tech => (
                  <button
                    key={tech}
                    onClick={() => setRecipe(prev => ({ ...prev, technique: tech }))}
                    className="p-4 rounded-xl text-center transition-all active:scale-95"
                    style={{
                      backgroundColor: recipe.technique === tech ? `${GOLD}30` : 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: `2px solid ${recipe.technique === tech ? GOLD : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <span className="text-2xl block mb-2">{TECHNIQUE_ICONS[tech]}</span>
                    <span className="text-sm text-white">{tech}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-light text-white mb-4">Glassware</h3>
              <div className="grid grid-cols-2 gap-2">
                {glasses.map(glass => (
                  <button
                    key={glass}
                    onClick={() => setRecipe(prev => ({ ...prev, glass }))}
                    className="p-3 rounded-xl text-left transition-all active:scale-95"
                    style={{
                      backgroundColor: recipe.glass === glass ? `${GOLD}30` : 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: `1px solid ${recipe.glass === glass ? GOLD : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <span className="text-sm text-white">{glass}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 5: Name & Finish ── */}
        {step === 5 && (
          <div className="space-y-6">
            <h3 className="text-xl font-light text-white mb-4">Name Your Creation</h3>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Suggestions</p>
              {Object.entries(generatedNames).map(([type, name]) => (
                <button
                  key={type}
                  onClick={() => setRecipe(prev => ({ ...prev, name }))}
                  className="w-full p-4 rounded-xl text-left"
                  style={{
                    backgroundColor: recipe.name === name ? `${GOLD}30` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${recipe.name === name ? GOLD : 'transparent'}`,
                  }}
                >
                  <span className="text-lg font-light text-white">{name}</span>
                  <span className="text-xs block mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {type === 'geographic' ? '🌍 Geographic' : type === 'speakeasy' ? '🎭 Speakeasy' : '🧪 Ingredient'}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="text"
              value={recipe.name}
              onChange={(e) => setRecipe(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Or enter custom name..."
              className="w-full p-4 rounded-xl bg-white/5 text-white border border-white/10"
            />

            {/* Photo capture */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Cocktail Photo</p>
              {photoData ? (
                <div className="relative">
                  <img src={photoData} alt="Cocktail" className="w-full h-40 object-cover rounded-lg" />
                  <button
                    onClick={() => { setPhotoData(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-6 rounded-lg flex flex-col items-center gap-2"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)' }}
                >
                  <Camera className="w-6 h-6 text-white/40" />
                  <span className="text-sm text-white/40">Take or choose a photo</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
              />
            </div>

            {/* Final summary card */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: `${GOLD}10`, border: `1px solid ${GOLD}30` }}>
              <h4 className="text-lg font-light mb-4" style={{ color: GOLD }}>{recipe.name || 'Your Creation'}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-white/40">Volume:</span><span className="text-white ml-2">{calculations.finalVolume}ml</span></div>
                <div><span className="text-white/40">ABV:</span><span className="text-white ml-2">{calculations.abv}%</span></div>
                <div><span className="text-white/40">Cost:</span><span className="text-white ml-2">&euro;{calculations.costPerDrink}</span></div>
                <div><span className="text-white/40">Price:</span><span className="text-white ml-2" style={{ color: GOLD }}>&euro;{calculations.suggestedPrice}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom stats bar ─────────────────────────────────── */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.5)' }}>

        {/* Flavor Radar + Stats row */}
        <div className="flex items-center gap-3 mb-3">
          <FlavorRadarSVG scores={flavorRadar} size={90} />
          <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="text-center">
              <span className="text-xs text-white/40 block">Volume</span>
              <span className="text-sm font-bold text-white">{calculations.finalVolume}ml</span>
            </div>
            <div className="text-center">
              <span className="text-xs text-white/40 block">ABV</span>
              <span className="text-sm font-bold" style={{ color: calculations.abv > 25 ? '#EF4444' : GOLD }}>{calculations.abv}%</span>
            </div>
            <div className="text-center">
              <span className="text-xs text-white/40 block">Cost</span>
              <span className="text-sm font-bold text-white">&euro;{calculations.costPerDrink}</span>
            </div>
            <div className="text-center">
              <span className="text-xs text-white/40 block">Price</span>
              <span className="text-sm font-bold" style={{ color: GOLD }}>&euro;{calculations.suggestedPrice}</span>
            </div>
          </div>
        </div>

        {/* Bartender comment */}
        <div className="mb-2 px-3 py-2 rounded-lg text-xs italic" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}>
          {bartenderComment}
        </div>

        {/* Smart suggestions */}
        {smartSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {smartSuggestions.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: s.type === 'classic' ? 'rgba(212,175,55,0.15)' : 'rgba(59,130,246,0.15)',
                  color: s.type === 'classic' ? GOLD : '#60A5FA',
                  border: `1px solid ${s.type === 'classic' ? 'rgba(212,175,55,0.3)' : 'rgba(59,130,246,0.3)'}`,
                }}
              >
                {s.type === 'classic' ? '🍸 ' : '💡 '}{s.text}
              </span>
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {step > 0 && <Button variant="default" onClick={() => setStep(s => s - 1)} className="flex-1">Back</Button>}
          {step < 5
            ? <Button variant="gold" onClick={() => setStep(s => s + 1)} className="flex-1" disabled={step === 0 && recipe.baseSpirits.length === 0}>Next</Button>
            : <Button variant="gold" onClick={handleSave} className="flex-1" disabled={!recipe.name && !generatedNames.speakeasy}>Save to My Bar</Button>
          }
        </div>
      </div>
    </div>
  );
};

export default RecipeCreator;
