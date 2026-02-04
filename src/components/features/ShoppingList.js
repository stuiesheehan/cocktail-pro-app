import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { GOLD } from '../../data/constants';
import { Card, Button, SectionHeader, Badge } from '../ui';

const ShoppingList = ({ ingredients, setIngredients }) => {
  const [showParLevels, setShowParLevels] = useState(false);

  const outOfStock = ingredients.filter(i => !i.inStock);
  const lowStock = ingredients.filter(i => i.parLevel && i.currentStock < i.parLevel);

  const updateParLevel = (name, parLevel) => {
    setIngredients(prev => prev.map(i => i.name === name ? { ...i, parLevel } : i));
  };

  const generateOrder = () => {
    const orderItems = ingredients.filter(i => !i.inStock || (i.parLevel && (i.currentStock || 0) < i.parLevel));
    const orderText = orderItems.map(i => `- ${i.name}${i.parLevel ? ` (need ${i.parLevel - (i.currentStock || 0)})` : ''}`).join('\n');
    navigator.clipboard?.writeText(orderText);
    alert('Order copied to clipboard!');
  };

  return (
    <div className="space-y-4 pb-28">
      <div className="px-4 pt-4 flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-wide" style={{ color: GOLD, fontFamily: "'Playfair Display', Georgia, serif" }}>Shopping List</h2>
        <Button variant="gold" size="sm" onClick={generateOrder}>
          <Copy className="w-4 h-4 mr-1" /> Copy Order
        </Button>
      </div>

      {/* Out of Stock */}
      <div className="px-4">
        <SectionHeader>Out of Stock ({outOfStock.length})</SectionHeader>
        <Card className="divide-y divide-white/10">
          {outOfStock.length > 0 ? outOfStock.map(item => (
            <div key={item.name} className="flex items-center justify-between p-4">
              <div>
                <p className="text-white">{item.name}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.category}</p>
              </div>
              <Badge color="#EF4444">Needed</Badge>
            </div>
          )) : (
            <div className="p-8 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>All stocked! 🎉</div>
          )}
        </Card>
      </div>

      {/* Par Levels */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-widest" style={{ color: GOLD }}>Par Levels</span>
          <Button size="sm" onClick={() => setShowParLevels(!showParLevels)}>
            {showParLevels ? 'Hide' : 'Configure'}
          </Button>
        </div>

        {showParLevels && (
          <Card className="p-4 space-y-3">
            {ingredients.slice(0, 10).map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="text-sm text-white truncate flex-1 mr-2">{item.name}</span>
                <input
                  type="number"
                  value={item.parLevel || ''}
                  onChange={e => updateParLevel(item.name, parseInt(e.target.value) || 0)}
                  placeholder="Par"
                  className="w-16 px-2 py-1 rounded-lg text-sm bg-white/5 border border-white/10 text-white text-center outline-none"
                />
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
