import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { GOLD, CATEGORY_CONFIG } from '../../data/constants';
import { formatCurrency } from '../../utils/formatting';
import { TabButton, Toggle } from '../ui';

const CATEGORY_PILLS = [
  { key: 'all', label: 'All' },
  { key: 'spirits', label: 'Spirits', cats: ['Base Spirits'] },
  { key: 'liqueurs', label: 'Liqueurs', cats: ['Liqueurs', 'Bitters', 'Wine & Champagne'] },
  { key: 'mixers', label: 'Mixers', cats: ['Mixers & Sodas', 'Syrups & Sweeteners'] },
  { key: 'garnishes', label: 'Garnishes', cats: ['Garnishes', 'Fresh Herbs'] },
];

const glassStyle = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.08)',
};

const IngredientsList = ({ ingredients, toggleIngredientStock, setIngredients }) => {
  const [filterStock, setFilterStock] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['Base Spirits']));
  const [editingCost, setEditingCost] = useState(null);

  const categories = [...new Set(ingredients.map(i => i.category))];

  const activePill = CATEGORY_PILLS.find(p => p.key === categoryFilter);
  const filtered = ingredients.filter(i => {
    const matchesStock = filterStock === 'all' || (filterStock === 'inStock' ? i.inStock : !i.inStock);
    const matchesSearch = !searchTerm || i.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || (activePill?.cats || []).includes(i.category);
    return matchesStock && matchesSearch && matchesCategory;
  });

  const inStockCount = ingredients.filter(i => i.inStock).length;
  const totalValue = ingredients.reduce((sum, i) => sum + (i.inStock ? (i.unitCost || 15) : 0), 0);

  const toggleCategory = (cat) => {
    const newSet = new Set(expandedCategories);
    newSet.has(cat) ? newSet.delete(cat) : newSet.add(cat);
    setExpandedCategories(newSet);
  };

  const updateCost = (name, cost) => {
    setIngredients(prev => prev.map(i => i.name === name ? { ...i, unitCost: parseFloat(cost) || 0 } : i));
    setEditingCost(null);
  };

  return (
    <div className="space-y-4 pb-28">
      <div className="px-4 pt-4">
        <h2 className="text-2xl font-light tracking-wide" style={{ color: GOLD, fontFamily: "'Playfair Display', Georgia, serif" }}>Bar Stock</h2>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{inStockCount} of {ingredients.length} items • {formatCurrency(totalValue)} value</p>
      </div>

      {/* Progress */}
      <div className="px-4">
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(inStockCount / ingredients.length) * 100}%`, background: `linear-gradient(90deg, ${GOLD}, #10B981)` }} />
        </div>
      </div>

      {/* Search */}
      <div className="px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 px-4 overflow-x-auto pb-1">
        {CATEGORY_PILLS.map(f => (
          <button
            key={f.key}
            onClick={() => setCategoryFilter(categoryFilter === f.key ? 'all' : f.key)}
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95"
            style={{
              backgroundColor: categoryFilter === f.key ? `${GOLD}20` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${categoryFilter === f.key ? `${GOLD}60` : 'rgba(255,255,255,0.1)'}`,
              color: categoryFilter === f.key ? GOLD : 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stock Filters */}
      <div className="flex gap-2 px-4">
        {[{ key: 'all', label: 'All' }, { key: 'inStock', label: 'In Stock' }, { key: 'outOfStock', label: 'Missing' }].map(f => (
          <TabButton key={f.key} active={filterStock === f.key} onClick={() => setFilterStock(f.key)}>{f.label}</TabButton>
        ))}
      </div>

      {/* Categories */}
      <div className="space-y-2 px-4">
        {categories.map(cat => {
          const catItems = filtered.filter(i => i.category === cat);
          if (catItems.length === 0) return null;
          const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Other'];
          const IconComp = config.icon;
          const isExpanded = expandedCategories.has(cat);
          const catInStock = catItems.filter(i => i.inStock).length;

          return (
            <div key={cat} className="rounded-xl overflow-hidden" style={glassStyle}>
              <button onClick={() => toggleCategory(cat)} className="w-full p-4 flex items-center justify-between transition-all active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                    {typeof IconComp === 'function' ? <IconComp /> : <IconComp className="w-5 h-5 text-white" />}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-white">{cat}</h3>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{catInStock}/{catItems.length} stocked</p>
                  </div>
                </div>
                {isExpanded ? <ChevronDown className="w-5 h-5 text-white/40" /> : <ChevronRight className="w-5 h-5 text-white/40" />}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {catItems.map(item => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-3 rounded-lg transition-all active:scale-[0.98]"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div className="flex-1 min-w-0 mr-3">
                        <span className="text-white/80 text-sm block truncate">{item.name}</span>
                        {editingCost === item.name ? (
                          <input
                            type="number"
                            defaultValue={item.unitCost || ''}
                            onBlur={e => updateCost(item.name, e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && updateCost(item.name, e.target.value)}
                            className="mt-1 w-20 px-2 py-1 rounded text-xs bg-white/10 border border-white/20 text-white outline-none"
                            style={{ fontSize: '16px' }}
                            placeholder="Cost"
                            autoFocus
                          />
                        ) : (
                          <button onClick={() => setEditingCost(item.name)} className="text-xs mt-0.5 active:scale-95 transition-transform" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            {item.unitCost ? formatCurrency(item.unitCost) : 'Set cost'}
                          </button>
                        )}
                      </div>
                      <Toggle value={item.inStock} onChange={() => toggleIngredientStock(item.name)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 px-4">
          <p className="text-lg" style={{ color: 'rgba(255,255,255,0.4)' }}>No ingredients found</p>
        </div>
      )}
    </div>
  );
};

export default IngredientsList;
