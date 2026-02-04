import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { GOLD } from '../../data/constants';
import { formatCurrency } from '../../utils/formatting';
import { Card, SectionHeader } from '../ui';

const ShiftMode = ({ cocktails, ingredients, onMakeDrink, sales, favorites }) => {
  const [queue, setQueue] = useState([]);
  const availableCocktails = cocktails.filter(c => c.canMake);
  const favoriteCocktails = availableCocktails.filter(c => favorites.includes(c.name));

  const addToQueue = (cocktail) => {
    setQueue(prev => [...prev, { ...cocktail, queueId: Date.now() }]);
  };

  const removeFromQueue = (queueId) => {
    setQueue(prev => prev.filter(c => c.queueId !== queueId));
  };

  const completeOrder = (queueId) => {
    const item = queue.find(c => c.queueId === queueId);
    if (item) {
      onMakeDrink(item, 1);
      removeFromQueue(queueId);
    }
  };

  const todaySales = sales.filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString());
  const todayRevenue = todaySales.reduce((sum, s) => sum + (s.sellPrice || 12) * s.quantity, 0);
  const todayCount = todaySales.reduce((sum, s) => sum + s.quantity, 0);

  return (
    <div className="space-y-4 pb-28">
      {/* Shift Stats */}
      <div className="grid grid-cols-3 gap-2 px-4 pt-4">
        <Card className="p-3 text-center">
          <p className="text-2xl font-light" style={{ color: '#10B981' }}>{todayCount}</p>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Drinks</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-light" style={{ color: GOLD }}>{formatCurrency(todayRevenue)}</p>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Revenue</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-light" style={{ color: '#8B5CF6' }}>{queue.length}</p>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Queue</p>
        </Card>
      </div>

      {/* Queue */}
      {queue.length > 0 && (
        <div className="px-4">
          <SectionHeader>Current Queue</SectionHeader>
          <div className="space-y-2">
            {queue.map((item, idx) => (
              <div key={item.queueId} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">{idx + 1}</span>
                  <span className="text-white font-medium">{item.name}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => completeOrder(item.queueId)} className="px-4 py-2 rounded-lg font-medium" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #B8960C 100%)`, color: '#000' }}>
                    <Check className="w-5 h-5" />
                  </button>
                  <button onClick={() => removeFromQueue(item.queueId)} className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30">
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorites Quick Access */}
      {favoriteCocktails.length > 0 && (
        <div className="px-4">
          <SectionHeader>Favorites</SectionHeader>
          <div className="grid grid-cols-2 gap-2">
            {favoriteCocktails.map(c => (
              <button
                key={c.name}
                onClick={() => addToQueue(c)}
                className="p-4 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}
              >
                <p className="text-white font-medium truncate">{c.name}</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.type}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All Available */}
      <div className="px-4">
        <SectionHeader>Quick Add</SectionHeader>
        <div className="grid grid-cols-2 gap-2">
          {availableCocktails.slice(0, 12).map(c => (
            <button
              key={c.name}
              onClick={() => addToQueue(c)}
              className="p-4 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] bg-white/5 border border-white/10"
            >
              <p className="text-white font-medium truncate">{c.name}</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{formatCurrency(c.sellPrice || 12)}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShiftMode;
