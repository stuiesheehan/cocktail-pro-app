import React from 'react';
import { AlertTriangle, Shuffle, Star } from 'lucide-react';
import { GOLD } from '../../data/constants';
import { getCocktailImage } from '../../utils/images';
import { formatCurrency } from '../../utils/formatting';
import { Card, SectionHeader, StatCard } from '../ui';
import AdBanner from './AdBanner';
import TimerWidget from './TimerWidget';

const Dashboard = ({
  stats, cocktails, ingredients, randomCocktail, onRefreshRandom,
  onSelectCocktail, recentlyMade, lowStockItems, favorites, timers, setTimers, sales,
  isPremium, onShowUpgrade, randomUsesRemaining, onUseRandom
}) => {
  const availableCocktails = cocktails.filter(c => c.canMake);
  const favoriteCocktails = cocktails.filter(c => favorites.includes(c.name));

  const todaySales = sales.filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString());
  const todayRevenue = todaySales.reduce((sum, s) => sum + (s.sellPrice || 12) * s.quantity, 0);

  const inventoryValue = ingredients.reduce((sum, i) => sum + (i.inStock ? (i.unitCost || 15) : 0), 0);

  // Handle random cocktail refresh with usage limit for free users
  const handleRandomRefresh = () => {
    if (isPremium) {
      onRefreshRandom();
    } else if (randomUsesRemaining > 0) {
      onRefreshRandom();
      onUseRandom();
    } else {
      onShowUpgrade();
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Hero */}
      <div className="relative h-56 overflow-hidden rounded-b-3xl mx-2">
        <img src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80" alt="Bar" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.8) 50%, rgba(10,10,10,0.4) 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-3xl font-light tracking-widest mb-2" style={{ color: GOLD, fontFamily: "'Playfair Display', Georgia, serif" }}>THE BAR</h1>
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.6)' }}>Professional Cocktail Management</p>
          {isPremium && (
            <span className="mt-2 px-3 py-1 rounded-full text-xs" style={{ backgroundColor: `${GOLD}20`, border: `1px solid ${GOLD}40`, color: GOLD }}>
              👑 Premium
            </span>
          )}
        </div>
      </div>

      {/* Ad Banner for Free Users */}
      {!isPremium && <AdBanner onUpgrade={onShowUpgrade} />}

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2 px-3">
        <StatCard label="Recipes" value={stats.total} color={GOLD} />
        <StatCard label="Ready" value={stats.available} color="#10B981" />
        <StatCard label="Today" value={formatCurrency(todayRevenue)} color="#8B5CF6" />
        <StatCard label="Stock" value={formatCurrency(inventoryValue)} color="#06B6D4" />
      </div>

      {/* Timers */}
      <div className="px-3">
        <TimerWidget timers={timers} setTimers={setTimers} />
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="mx-3 p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-400">Low Stock Alert</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{lowStockItems.slice(0, 3).join(', ')}{lowStockItems.length > 3 ? ` +${lowStockItems.length - 3} more` : ''}</p>
          </div>
        </div>
      )}

      {/* Random Cocktail - More Prominent */}
      <div className="px-3">
        <SectionHeader action={
          <div className="flex items-center gap-2">
            {!isPremium && (
              <span className="text-xs" style={{ color: randomUsesRemaining > 0 ? 'rgba(255,255,255,0.4)' : '#EF4444' }}>
                {randomUsesRemaining > 0 ? `${randomUsesRemaining} left` : 'Limit reached'}
              </span>
            )}
            <button
              onClick={handleRandomRefresh}
              className="p-2 rounded-lg transition-all hover:scale-110"
              style={{
                backgroundColor: !isPremium && randomUsesRemaining === 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(212, 175, 55, 0.1)',
                opacity: !isPremium && randomUsesRemaining === 0 ? 0.5 : 1
              }}
            >
              <Shuffle className="w-4 h-4" style={{ color: !isPremium && randomUsesRemaining === 0 ? '#EF4444' : GOLD }} />
            </button>
          </div>
        }>
          Random Pick
        </SectionHeader>

        {randomCocktail ? (
          <div onClick={() => onSelectCocktail(randomCocktail)} className="relative h-48 rounded-2xl overflow-hidden cursor-pointer group">
            <img src={getCocktailImage(randomCocktail.name, randomCocktail.glass, randomCocktail.image)} alt={randomCocktail.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-2xl font-light" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#fff' }}>{randomCocktail.name}</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{randomCocktail.type} • {randomCocktail.glass}</p>
            </div>
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10B981' }}>
              Ready to make
            </div>
          </div>
        ) : (
          <Card className="h-48 flex items-center justify-center" style={{ border: '1px dashed rgba(255,255,255,0.2)' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Stock up to get suggestions</p>
          </Card>
        )}
      </div>

      {/* Favorites */}
      {favoriteCocktails.length > 0 && (
        <div className="px-3">
          <SectionHeader>Favorites</SectionHeader>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3">
            {favoriteCocktails.map(c => (
              <div key={c.name} onClick={() => onSelectCocktail(c)} className="flex-shrink-0 w-36 cursor-pointer group">
                <div className="relative h-44 rounded-xl overflow-hidden mb-2">
                  <img src={getCocktailImage(c.name, c.glass, c.image)} alt={c.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
                  <Star className="absolute top-2 right-2 w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {!c.canMake && <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-red-500" />}
                </div>
                <p className="text-sm font-light truncate text-white">{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Now */}
      <div className="px-3">
        <SectionHeader action={<span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{availableCocktails.length} drinks</span>}>Available Now</SectionHeader>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3">
          {availableCocktails.slice(0, 8).map(c => (
            <div key={c.name} onClick={() => onSelectCocktail(c)} className="flex-shrink-0 w-32 cursor-pointer group">
              <div className="relative h-40 rounded-xl overflow-hidden mb-2">
                <img src={getCocktailImage(c.name, c.glass, c.image)} alt={c.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
              </div>
              <p className="text-sm font-light truncate text-white">{c.name}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{c.type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Made */}
      {recentlyMade.length > 0 && (
        <div className="px-3">
          <SectionHeader>Recently Made</SectionHeader>
          <div className="space-y-2">
            {recentlyMade.slice(0, 3).map((item, idx) => {
              const cocktail = cocktails.find(c => c.name === item.name);
              return (
                <div key={idx} onClick={() => cocktail && onSelectCocktail(cocktail)} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] cursor-pointer hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={getCocktailImage(item.name, cocktail?.glass, cocktail?.image)} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-white">{item.name}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.time} • {item.quantity || 1}x</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
