import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { GOLD, CATEGORY_CONFIG } from '../../data/constants';
import { formatCurrency } from '../../utils/formatting';
import { Card, TabButton, Toggle } from '../ui';

const IngredientsList = ({ ingredients, toggleIngredientStock, setIngredients }) => {
  const [filterStock, setFilterStock] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['Base Spirits']));
  const [editingCost, setEditingCost] = useState(null);

  const categories = [...new Set(ingredients.map(i => i.category))];
  const filtered = ingredients.filter(i => filterStock === 'all' || (filterStock === 'inStock' ? i.inStock : !i.inStock));
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

      {/* Filters */}
      <div className="flex gap-2 px-4">
        {[{ key: 'all', label: 'All' }, { key: 'inStock', label: 'In Stock', color: '#10B981' }, { key: 'outOfStock', label: 'Missing', color: '#EF4444' }].map(f => (
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
            <Card key={cat}>
              <button onClick={() => toggleCategory(cat)} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
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
                    <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03]">
                      <div className="flex-1 min-w-0 mr-3">
                        <span className="text-white/80 text-sm block truncate">{item.name}</span>
                        {editingCost === item.name ? (
                          <input
                            type="number"
                            defaultValue={item.unitCost || ''}
                            onBlur={e => updateCost(item.name, e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && updateCost(item.name, e.target.value)}
                            className="mt-1 w-20 px-2 py-1 rounded text-xs bg-white/10 border border-white/20 text-white outline-none"
                            placeholder="Cost"
                            autoFocus
                          />
                        ) : (
                          <button onClick={() => setEditingCost(item.name)} className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            {item.unitCost ? formatCurrency(item.unitCost) : 'Set cost'}
                          </button>
                        )}
                      </div>
                      <Toggle value={item.inStock} onChange={() => toggleIngredientStock(item.name)} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default IngredientsList;
