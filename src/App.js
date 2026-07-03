import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Upload, ChevronLeft,
  FlaskConical, Droplets, Users, Zap, ShoppingCart, BarChart3, QrCode,
  GraduationCap, Package
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { GOLD, DARK_BG, FREE_COCKTAIL_LIMIT } from './data/constants';
import { usePremium } from './hooks/usePremium';
import { useInventory } from './hooks/useInventory';
import { useCocktails } from './hooks/useCocktails';
import { load, usePersist } from './hooks/usePersistence';
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
import SplashScreen from './components/SplashScreen';

const CocktailManager = () => {
  const { isPremium, randomUsesRemaining, unlock, restore, useRandom } = usePremium();
  const { ingredients, setIngredients, toggleIngredientStock, lowStockItems, inStockNames } = useInventory();
  const {
    cocktails, visibleCocktails, sales, favorites, recentlyMade, stats,
    getRandomCocktail, toggleFavorite, makeDrink, addCustomCocktail, updateCocktail, replaceCocktails,
  } = useCocktails({ inStockNames, isPremium });

  const navigate = useNavigate();
  const location = useLocation();

  // Route format: /#/tab  or  /#/tab/subtab
  const pathParts = location.pathname.replace(/^\//, '').split('/');
  const activeTab = pathParts[0] || 'dashboard';
  const activeSubTab = pathParts[1] || null;

  const setActiveTab = (tab) => navigate(`/${tab}`);
  const setActiveSubTab = (sub) => sub ? navigate(`/${activeTab}/${sub}`) : navigate(`/${activeTab}`);

  const [speedRail, setSpeedRail] = useState(() => load('speedRail_pro', []));
  const [venueName, setVenueName] = useState(() => load('venueName_pro', "My Cocktail Bar"));
  const [timers, setTimers] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [flavourFilter, setFlavourFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  usePersist('speedRail_pro', speedRail);
  usePersist('venueName_pro', venueName);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
      setTimeout(() => setShowSplash(false), 600);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const [randomCocktail, setRandomCocktail] = useState(null);
  useEffect(() => { setRandomCocktail(getRandomCocktail()); }, [visibleCocktails, getRandomCocktail]);

  const handleUnlockPremium = () => {
    unlock();
    setShowUpgradeModal(false);
    setSaveStatus('Premium Unlocked!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleRestorePremium = () => {
    const found = restore();
    setSaveStatus(found ? 'Premium Restored' : 'No premium purchase found');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleMakeDrink = (cocktail, quantity = 1) => {
    makeDrink(cocktail, quantity, setSaveStatus);
    setSelectedCocktail(null);
  };

  const handleAddCustomCocktail = (newRecipe) => {
    const exists = cocktails.find(c => c.name.toLowerCase() === newRecipe.name.toLowerCase());
    if (exists) {
      setSaveStatus('Recipe name already exists');
      setTimeout(() => setSaveStatus(''), 2000);
      return;
    }
    addCustomCocktail(newRecipe, inStockNames);
    setActiveSubTab(null);
    setSaveStatus(`Created "${newRecipe.name}"`);
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
          flavours: (r.Flavors || '').split(',').map(f => f.trim().toLowerCase()).filter(Boolean),
          dietary: [],
          tags: [],
          canMake: false,
          missingCount: 0,
        }));
        replaceCocktails(imported);
        const allIngs = new Set();
        imported.forEach(c => c.ingredients.forEach(i => allIngs.add(i)));
        setIngredients(Array.from(allIngs).map(name => ({ category: 'Other', name, inStock: false, unitCost: 10 })));
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

  const fullStats = useMemo(() => ({
    ...stats,
    inStockCount: ingredients.filter(i => i.inStock).length,
  }), [stats, ingredients]);

  // Search covers name, ingredients, tags, and instructions
  const filteredCocktails = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return visibleCocktails.filter(c => {
      const matchesSearch = !q
        || c.name.toLowerCase().includes(q)
        || c.ingredients.some(i => i.toLowerCase().includes(q))
        || c.tags?.some(t => t.toLowerCase().includes(q))
        || c.instructions?.toLowerCase().includes(q);
      const matchesType = filterType === 'all' || c.type === filterType;
      const matchesAvailable = !showAvailableOnly || c.canMake;
      const matchesFlavour = !flavourFilter || c.flavours?.includes(flavourFilter);
      let matchesCategory = true;
      if (categoryFilter === 'classics') matchesCategory = !c.isCustom;
      else if (categoryFilter === 'creations') matchesCategory = !!c.isCustom;
      else if (categoryFilter === 'sours') matchesCategory = (c.type || '').includes('Sour') || c.drinkCategory === 'Sours';
      else if (categoryFilter === 'stirred') matchesCategory = (c.type || '').includes('Spirit-Forward') || c.drinkCategory === 'Stirred & Boozy';
      else if (categoryFilter === 'long') matchesCategory = (c.type || '').includes('Highball') || c.drinkCategory === 'Long Drinks';
      return matchesSearch && matchesType && matchesAvailable && matchesFlavour && matchesCategory;
    });
  }, [visibleCocktails, searchTerm, filterType, showAvailableOnly, flavourFilter, categoryFilter]);

  const renderSubTab = () => {
    switch (activeSubTab) {
      case 'shift': return <ShiftMode cocktails={visibleCocktails} ingredients={ingredients} onMakeDrink={handleMakeDrink} sales={sales} favorites={favorites} />;
      case 'analytics': return <Analytics sales={sales} cocktails={visibleCocktails} />;
      case 'shopping': return <ShoppingList ingredients={ingredients} setIngredients={setIngredients} />;
      case 'speedrail': return <VirtualBar ingredients={ingredients} speedRail={speedRail} setSpeedRail={setSpeedRail} />;
      case 'training': return <TrainingMode cocktails={visibleCocktails} />;
      case 'menu': return <MenuBuilder cocktails={visibleCocktails} favorites={favorites} />;
      case 'creator': return <RecipeCreator ingredients={ingredients} onSave={handleAddCustomCocktail} onClose={() => setActiveSubTab(null)} isPremium={isPremium} />;
      case 'party': return <PartyMode cocktails={visibleCocktails} isPremium={isPremium} onShowUpgrade={() => setShowUpgradeModal(true)} />;
      case 'preplab': return <PrepLab isPremium={isPremium} onShowUpgrade={() => setShowUpgradeModal(true)} />;
      default: return null;
    }
  };

  return (
    <>
      {showSplash && (
        <div style={{ opacity: appReady ? 0 : 1, transition: 'opacity 0.6s ease-out', pointerEvents: appReady ? 'none' : 'auto' }}>
          <SplashScreen />
        </div>
      )}
      <div className="min-h-screen" style={{ backgroundColor: DARK_BG, opacity: appReady ? 1 : 0, transition: 'opacity 0.6s ease-in' }}>
        <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

        {saveStatus && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full z-[70] text-sm font-medium" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)', border: '1px solid rgba(212, 175, 55, 0.4)', color: GOLD, backdropFilter: 'blur(10px)' }}>
            {saveStatus}
          </div>
        )}

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUnlock={handleUnlockPremium}
          onRestore={handleRestorePremium}
          isPremium={isPremium}
          venueName={venueName}
          onVenueNameChange={setVenueName}
        />

        <main className="max-w-md mx-auto relative z-10">
          {activeSubTab ? (
            <div>
              <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <button onClick={() => setActiveSubTab(null)} className="p-2 rounded-lg bg-white/10"><ChevronLeft className="w-5 h-5 text-white" /></button>
                <h2 className="text-lg font-light text-white capitalize">{activeSubTab === 'creator' ? 'Recipe Creator' : activeSubTab === 'preplab' ? 'Prep Lab' : activeSubTab === 'speedrail' ? 'Speed Rail' : activeSubTab}</h2>
              </div>
              {renderSubTab()}
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  stats={fullStats} cocktails={visibleCocktails} filteredCocktails={filteredCocktails}
                  ingredients={ingredients} randomCocktail={randomCocktail}
                  onRefreshRandom={() => setRandomCocktail(getRandomCocktail())}
                  onSelectCocktail={setSelectedCocktail} recentlyMade={recentlyMade}
                  lowStockItems={lowStockItems} favorites={favorites} timers={timers} setTimers={setTimers}
                  sales={sales} isPremium={isPremium} onShowUpgrade={() => setShowUpgradeModal(true)}
                  randomUsesRemaining={randomUsesRemaining} onUseRandom={useRandom}
                  venueName={venueName}
                />
              )}
              {activeTab === 'cocktails' && (
                <CocktailsList
                  cocktails={visibleCocktails} filteredCocktails={filteredCocktails}
                  searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                  filterType={filterType} setFilterType={setFilterType}
                  showAvailableOnly={showAvailableOnly} setShowAvailableOnly={setShowAvailableOnly}
                  onSelectCocktail={setSelectedCocktail} favorites={favorites}
                  flavourFilter={flavourFilter} setFlavourFilter={setFlavourFilter}
                  isPremium={isPremium} onShowUpgrade={() => setShowUpgradeModal(true)}
                  freeLimit={FREE_COCKTAIL_LIMIT} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
                />
              )}
              {activeTab === 'ingredients' && (
                <IngredientsList ingredients={ingredients} toggleIngredientStock={toggleIngredientStock} setIngredients={setIngredients} />
              )}
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
                      { id: 'speedrail', icon: Package, label: 'Speed Rail', desc: 'Organise your well', free: false },
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
                            opacity: isLocked ? 0.6 : 1,
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

        {selectedCocktail && (
          <CocktailModal
            cocktail={selectedCocktail} onClose={() => setSelectedCocktail(null)}
            ingredients={ingredients} onMakeDrink={handleMakeDrink}
            onToggleFavorite={toggleFavorite} favorites={favorites}
            onUpdateCocktail={updateCocktail} isPremium={isPremium} venueName={venueName}
          />
        )}

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
              <button onClick={() => setShowUpgradeModal(true)} className="flex flex-col items-center gap-1 px-4 py-2">
                <span className="text-lg transition-all" style={{ color: isPremium ? GOLD : 'rgba(255,255,255,0.4)' }}>
                  {isPremium ? '👑' : '⚙️'}
                </span>
                <span className="text-xs tracking-wider" style={{ color: isPremium ? GOLD : 'rgba(255,255,255,0.4)' }}>
                  {isPremium ? 'Pro' : 'Settings'}
                </span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </>
  );
};

export default CocktailManager;
