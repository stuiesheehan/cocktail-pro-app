import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Upload, ChevronLeft,
  FlaskConical, Droplets, Users, Zap, ShoppingCart, BarChart3, QrCode,
  GraduationCap, Package
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { GOLD, DARK_BG, FREE_COCKTAIL_LIMIT } from './data/constants';
import { formatTime } from './utils/formatting';
import { defaultCocktails } from './data/cocktails';
import { defaultIngredients } from './data/ingredients';
import Dashboard from './components/features/Dashboard';
import TrainingMode from './components/features/TrainingMode';
import UpgradeModal from './components/features/UpgradeModal';
import CocktailModal from './components/features/CocktailModal';
import ShiftMode from './components/features/ShiftMode';
import Analytics from './components/features/Analytics';
import ShoppingList from './components/features/ShoppingList';
import VirtualBar from './components/features/VirtualBar';
import RecipeCreator from './components/features/RecipeCreator';
import PartyMode from './components/features/PartyMode';
import PrepLab from './components/features/PrepLab';
import MenuBuilder from './components/features/MenuBuilder';
import CocktailsList from './components/features/CocktailsList';
import IngredientsList from './components/features/IngredientsList';

const CocktailManager = () => {
  // Default data imported from ./data/cocktails and ./data/ingredients



  const load = (key, def) => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch (e) { return def; } };

  const [cocktails, setCocktails] = useState(() => load('cocktails_pro', defaultCocktails));
  const [ingredients, setIngredients] = useState(() => load('ingredients_pro', defaultIngredients));
  const [sales, setSales] = useState(() => load('sales_pro', []));
  const [favorites, setFavorites] = useState(() => load('favorites_pro', []));
  const [recentlyMade, setRecentlyMade] = useState(() => load('recentlyMade_pro', []));
  const [speedRail, setSpeedRail] = useState(() => load('speedRail_pro', []));
  const [timers, setTimers] = useState([]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [flavorFilter, setFlavorFilter] = useState(null);
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  // ============================================
  // PREMIUM STATE (TEST MODE ONLY)
  // ============================================
  const [isPremium, setIsPremium] = useState(() => {
    try {
      const saved = localStorage.getItem('isPremium_test');
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [randomUsesRemaining, setRandomUsesRemaining] = useState(() => {
    try {
      const saved = localStorage.getItem('randomUsesRemaining');
      return saved ? parseInt(saved, 10) : 5;
    } catch (e) {
      return 5;
    }
  });

  // Save premium state to localStorage
  useEffect(() => {
    localStorage.setItem('isPremium_test', isPremium.toString());
  }, [isPremium]);

  // Save random uses to localStorage
  useEffect(() => {
    localStorage.setItem('randomUsesRemaining', randomUsesRemaining.toString());
  }, [randomUsesRemaining]);

  // Premium unlock function (simulated purchase)
  const handleUnlockPremium = () => {
    setIsPremium(true);
    setShowUpgradeModal(false);
    setSaveStatus('🎉 Premium Unlocked!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  // Restore premium (for testing/future App Store compliance)
  const handleRestorePremium = () => {
    const saved = localStorage.getItem('isPremium_test');
    if (saved === 'true') {
      setIsPremium(true);
      setSaveStatus('✓ Premium Restored');
    } else {
      setSaveStatus('No premium purchase found');
    }
    setTimeout(() => setSaveStatus(''), 3000);
  };

  // Reset premium (for testing only)
  const handleResetPremium = () => {
    setIsPremium(false);
    setRandomUsesRemaining(5);
    localStorage.removeItem('isPremium_test');
    localStorage.removeItem('randomUsesRemaining');
    setSaveStatus('Premium reset for testing');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  // FREE TIER LIMITS imported from ./data/constants

  // Save to localStorage
  useEffect(() => { localStorage.setItem('cocktails_pro', JSON.stringify(cocktails)); }, [cocktails]);
  useEffect(() => { localStorage.setItem('ingredients_pro', JSON.stringify(ingredients)); }, [ingredients]);
  useEffect(() => { localStorage.setItem('sales_pro', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('favorites_pro', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('recentlyMade_pro', JSON.stringify(recentlyMade)); }, [recentlyMade]);
  useEffect(() => { localStorage.setItem('speedRail_pro', JSON.stringify(speedRail)); }, [speedRail]);

  // Update canMake status
  useEffect(() => {
    const inStock = new Set(ingredients.filter(i => i.inStock).map(i => i.name));
    setCocktails(prev => prev.map(c => {
      const missing = c.ingredients.filter(i => !inStock.has(i));
      return { ...c, canMake: missing.length === 0, missingCount: missing.length };
    }));
  }, [ingredients]);

  const filteredCocktails = useMemo(() => {
    return cocktails.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.ingredients.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || c.type === filterType;
      const matchesAvailable = !showAvailableOnly || c.canMake;
      const matchesFlavor = !flavorFilter || c.flavors?.includes(flavorFilter);
      return matchesSearch && matchesType && matchesAvailable && matchesFlavor;
    });
  }, [cocktails, searchTerm, filterType, showAvailableOnly, flavorFilter]);

  const stats = useMemo(() => ({
    total: cocktails.length,
    available: cocktails.filter(c => c.canMake).length,
    inStockCount: ingredients.filter(i => i.inStock).length,
    cocktailsByType: cocktails.reduce((acc, c) => { acc[c.type] = (acc[c.type] || 0) + 1; return acc; }, {})
  }), [cocktails, ingredients]);

  const lowStockItems = useMemo(() => ingredients.filter(i => !i.inStock).map(i => i.name), [ingredients]);

  const getRandomCocktail = useCallback(() => {
    const available = cocktails.filter(c => c.canMake);
    return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null;
  }, [cocktails]);

  const [randomCocktail, setRandomCocktail] = useState(null);
  useEffect(() => { setRandomCocktail(getRandomCocktail()); }, [cocktails, getRandomCocktail]);

  const toggleIngredientStock = (name) => {
    setIngredients(prev => prev.map(i => i.name === name ? { ...i, inStock: !i.inStock } : i));
  };

  const toggleFavorite = (name) => {
    setFavorites(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const handleMakeDrink = (cocktail, quantity = 1) => {
    const sale = { name: cocktail.name, quantity, timestamp: new Date().toISOString(), sellPrice: cocktail.sellPrice || 12, costPerDrink: cocktail.costPerDrink || 2.5 };
    setSales(prev => [sale, ...prev]);
    setRecentlyMade(prev => [{ name: cocktail.name, time: formatTime(new Date()), quantity }, ...prev.filter(r => r.name !== cocktail.name).slice(0, 9)]);
    setSelectedCocktail(null);
    setSaveStatus(`Made ${quantity}x ${cocktail.name}`);
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const updateCocktail = (updated) => {
    setCocktails(prev => prev.map(c => c.name === updated.name ? updated : c));
  };

  // Add custom cocktail from Spec Creator
  const handleAddCustomCocktail = (newRecipe) => {
    // Check if recipe name already exists
    const exists = cocktails.find(c => c.name.toLowerCase() === newRecipe.name.toLowerCase());
    if (exists) {
      setSaveStatus('⚠️ Recipe name already exists');
      setTimeout(() => setSaveStatus(''), 2000);
      return;
    }
    
    // Add the new cocktail with calculated canMake
    const inStock = new Set(ingredients.filter(i => i.inStock).map(i => i.name));
    const missing = newRecipe.ingredients.filter(i => !inStock.has(i));
    const cocktailWithStatus = {
      ...newRecipe,
      canMake: missing.length === 0,
      missingCount: missing.length,
    };
    
    setCocktails(prev => [cocktailWithStatus, ...prev]);
    setActiveSubTab(null);
    setSaveStatus(`✨ Created "${newRecipe.name}"`);
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleExcelImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        const imported = rows.map(r => ({
          name: r.Cocktail || r.Name || '',
          ingredients: (r.Ingredients || '').split(', ').map(i => i.trim()).filter(Boolean),
          instructions: r.Instructions || '',
          type: r.Type || r.Cocktail_Type || 'Classic',
          technique: r.Technique || 'Shake',
          prepTime: r.PrepTime || '3 min',
          glass: r.Glass || 'Coupe Glass',
          abv: parseInt(r.ABV) || 15,
          sellPrice: parseFloat(r.Price) || 12,
          costPerDrink: parseFloat(r.Cost) || 2.5,
          flavors: (r.Flavors || '').split(',').map(f => f.trim().toLowerCase()).filter(Boolean),
          dietary: [],
          tags: [],
          canMake: false,
          missingCount: 0
        }));
        setCocktails(imported);
        
        const allIngs = new Set();
        imported.forEach(c => c.ingredients.forEach(i => allIngs.add(i)));
        const newIngs = Array.from(allIngs).map(name => ({ category: 'Other', name, inStock: false, unitCost: 10 }));
        setIngredients(newIngs);
        setSaveStatus(`Imported ${imported.length} cocktails`);
        setTimeout(() => setSaveStatus(''), 3000);
      } catch (err) {
        console.error(err);
        alert('Error importing file');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const renderSubTab = () => {
    switch (activeSubTab) {
      case 'shift': return <ShiftMode cocktails={cocktails} ingredients={ingredients} onMakeDrink={handleMakeDrink} sales={sales} favorites={favorites} />;
      case 'analytics': return <Analytics sales={sales} cocktails={cocktails} />;
      case 'shopping': return <ShoppingList ingredients={ingredients} setIngredients={setIngredients} />;
      case 'speedrail': return <VirtualBar ingredients={ingredients} speedRail={speedRail} setSpeedRail={setSpeedRail} />;
      case 'training': return <TrainingMode cocktails={cocktails} />;
      case 'menu': return <MenuBuilder cocktails={cocktails} favorites={favorites} />;
      case 'creator': return <RecipeCreator ingredients={ingredients} onSave={handleAddCustomCocktail} onClose={() => setActiveSubTab(null)} />;
      case 'party': return <PartyMode cocktails={cocktails} isPremium={isPremium} onShowUpgrade={() => setShowUpgradeModal(true)} />;
      case 'preplab': return <PrepLab isPremium={isPremium} onShowUpgrade={() => setShowUpgradeModal(true)} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: DARK_BG }}>
      {/* Noise texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* Toast */}
      {saveStatus && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full z-[70] text-sm font-medium" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)', border: '1px solid rgba(212, 175, 55, 0.4)', color: GOLD, backdropFilter: 'blur(10px)' }}>
          {saveStatus}
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        onUnlock={handleUnlockPremium}
        onRestore={handleRestorePremium}
        onReset={handleResetPremium}
      />

      <main className="max-w-md mx-auto relative z-10">
        {activeSubTab ? (
          <div>
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <button onClick={() => setActiveSubTab(null)} className="p-2 rounded-lg bg-white/10"><ChevronLeft className="w-5 h-5 text-white" /></button>
              <h2 className="text-lg font-light text-white capitalize">{activeSubTab}</h2>
            </div>
            {renderSubTab()}
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard stats={stats} cocktails={cocktails} filteredCocktails={filteredCocktails} ingredients={ingredients} randomCocktail={randomCocktail} onRefreshRandom={() => setRandomCocktail(getRandomCocktail())} onSelectCocktail={setSelectedCocktail} recentlyMade={recentlyMade} lowStockItems={lowStockItems} favorites={favorites} timers={timers} setTimers={setTimers} sales={sales} isPremium={isPremium} onShowUpgrade={() => setShowUpgradeModal(true)} randomUsesRemaining={randomUsesRemaining} onUseRandom={() => setRandomUsesRemaining(prev => Math.max(0, prev - 1))} />}
            {activeTab === 'cocktails' && <CocktailsList cocktails={cocktails} filteredCocktails={filteredCocktails} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterType={filterType} setFilterType={setFilterType} showAvailableOnly={showAvailableOnly} setShowAvailableOnly={setShowAvailableOnly} onSelectCocktail={setSelectedCocktail} favorites={favorites} flavorFilter={flavorFilter} setFlavorFilter={setFlavorFilter} isPremium={isPremium} onShowUpgrade={() => setShowUpgradeModal(true)} freeLimit={FREE_COCKTAIL_LIMIT} />}
            {activeTab === 'ingredients' && <IngredientsList ingredients={ingredients} toggleIngredientStock={toggleIngredientStock} setIngredients={setIngredients} />}
            {activeTab === 'tools' && (
              <div className="space-y-4 pb-28 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-light tracking-wide" style={{ color: GOLD, fontFamily: "'Playfair Display', Georgia, serif" }}>Pro Tools</h2>
                  {!isPremium && (
                    <button 
                      onClick={() => setShowUpgradeModal(true)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
                      style={{ backgroundColor: `${GOLD}20`, border: `1px solid ${GOLD}40`, color: GOLD }}
                    >
                      👑 Unlock All
                    </button>
                  )}
                </div>
                
                {!isPremium && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', border: `1px solid ${GOLD}20` }}>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      🔒 Pro Tools require Premium. Unlock to access professional bartender features.
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'training', icon: GraduationCap, label: 'Training', desc: 'Learn & challenge', free: true, featured: true },
                    { id: 'creator', icon: FlaskConical, label: 'Recipe Creator', desc: 'AI naming engine', free: false, featured: true },
                    { id: 'party', icon: Users, label: 'Party Mode', desc: 'Guest orders via QR', free: false },
                    { id: 'preplab', icon: Droplets, label: 'Prep Lab', desc: 'Track house-made', free: false },
                    { id: 'shift', icon: Zap, label: 'Shift Mode', desc: 'Quick service mode', free: false },
                    { id: 'analytics', icon: BarChart3, label: 'Analytics', desc: 'Sales & insights', free: false },
                    { id: 'shopping', icon: ShoppingCart, label: 'Shopping List', desc: 'Par levels & orders', free: true },
                    { id: 'speedrail', icon: Package, label: 'Speed Rail', desc: 'Organize your well', free: false },
                    { id: 'menu', icon: QrCode, label: 'Menu Builder', desc: 'Create digital menus', free: false },
                  ].map(tool => {
                    const isLocked = !isPremium && !tool.free;
                    const isFeatured = tool.featured && !isLocked;
                    return (
                      <button 
                        key={tool.id} 
                        onClick={() => isLocked ? setShowUpgradeModal(true) : setActiveSubTab(tool.id)} 
                        className="p-4 rounded-xl text-left transition-all hover:scale-[1.02] relative"
                        style={{ 
                          backgroundColor: isFeatured ? `${GOLD}10` : 'rgba(255,255,255,0.03)', 
                          border: isFeatured ? `1px solid ${GOLD}40` : '1px solid rgba(255,255,255,0.08)',
                          opacity: isLocked ? 0.6 : 1
                        }}
                      >
                        {isFeatured && (
                          <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${GOLD}30`, color: GOLD }}>
                            ✨ NEW
                          </span>
                        )}
                        <tool.icon className="w-6 h-6 mb-2" style={{ color: isLocked ? 'rgba(255,255,255,0.3)' : GOLD }} />
                        <p className="text-white font-medium flex items-center gap-2">
                          {tool.label}
                          {isLocked && <span className="text-xs">🔒</span>}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{tool.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Cocktail Modal */}
      {selectedCocktail && <CocktailModal cocktail={selectedCocktail} onClose={() => setSelectedCocktail(null)} ingredients={ingredients} onMakeDrink={handleMakeDrink} onToggleFavorite={toggleFavorite} favorites={favorites} onUpdateCocktail={updateCocktail} />}

      {/* Import FAB - Premium Only */}
      {isPremium ? (
        <label className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full cursor-pointer flex items-center justify-center transition-all hover:scale-110 active:scale-95" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #B8960C 100%)`, boxShadow: '0 8px 32px rgba(212, 175, 55, 0.4)' }}>
          <Upload className="w-6 h-6 text-black" />
          <input type="file" accept=".xlsx,.xls" onChange={handleExcelImport} className="hidden" />
        </label>
      ) : (
        <button 
          onClick={() => setShowUpgradeModal(true)}
          className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95" 
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <div className="relative">
            <Upload className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.4)' }} />
            <span className="absolute -top-1 -right-1 text-xs">🔒</span>
          </div>
        </button>
      )}

      {/* Bottom Nav */}
      {!activeSubTab && (
        <nav className="fixed bottom-0 left-0 right-0 z-50" style={{ backgroundColor: 'rgba(10, 10, 10, 0.95)', borderTop: `1px solid rgba(212, 175, 55, 0.2)`, backdropFilter: 'blur(20px)' }}>
          <div className="max-w-md mx-auto flex justify-around items-center h-16">
            {[
              { id: 'dashboard', icon: '◆', label: 'Home' },
              { id: 'cocktails', icon: '◇', label: 'Recipes' },
              { id: 'ingredients', icon: '○', label: 'Stock' },
              { id: 'tools', icon: '◈', label: 'Tools' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex flex-col items-center gap-1 px-4 py-2">
                <span className="text-lg transition-all" style={{ color: activeTab === tab.id ? GOLD : 'rgba(255,255,255,0.4)', transform: activeTab === tab.id ? 'scale(1.2)' : 'scale(1)' }}>{tab.icon}</span>
                <span className="text-xs tracking-wider" style={{ color: activeTab === tab.id ? GOLD : 'rgba(255,255,255,0.4)' }}>{tab.label}</span>
              </button>
            ))}
            {/* Premium/Settings Button */}
            <button 
              onClick={() => setShowUpgradeModal(true)} 
              className="flex flex-col items-center gap-1 px-4 py-2"
            >
              <span className="text-lg transition-all" style={{ color: isPremium ? GOLD : 'rgba(255,255,255,0.4)' }}>
                {isPremium ? '👑' : '⚙️'}
              </span>
              <span className="text-xs tracking-wider" style={{ color: isPremium ? GOLD : 'rgba(255,255,255,0.4)' }}>
                {isPremium ? 'Pro' : 'Upgrade'}
              </span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default CocktailManager;