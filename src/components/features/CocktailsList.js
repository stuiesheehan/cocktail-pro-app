import React, { useState } from 'react';
import { Search, Star } from 'lucide-react';
import { GOLD, FLAVOR_PROFILES, TAGS } from '../../data/constants';
import { getCocktailImage } from '../../utils/images';
import { TabButton } from '../ui';

const CocktailsList = ({ cocktails, filteredCocktails, searchTerm, setSearchTerm, filterType, setFilterType, showAvailableOnly, setShowAvailableOnly, onSelectCocktail, favorites, flavorFilter, setFlavorFilter, isPremium, onShowUpgrade, freeLimit }) => {
  const [showCustomOnly, setShowCustomOnly] = useState(false);
  const types = [...new Set(cocktails.map(c => c.type))];

  // Apply custom filter then free-tier limit
  const customFiltered = showCustomOnly ? filteredCocktails.filter(c => c.isCustom) : filteredCocktails;
  const displayedCocktails = isPremium ? customFiltered : customFiltered.slice(0, freeLimit);
  const hasCustom = cocktails.some(c => c.isCustom);
  const hasMoreLocked = !isPremium && customFiltered.length > freeLimit;
  const lockedCount = customFiltered.length - freeLimit;

  return (
    <div className="space-y-4 pb-28">
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-light tracking-wide" style={{ color: GOLD, fontFamily: "'Playfair Display', Georgia, serif" }}>Recipes</h2>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {isPremium ? `${filteredCocktails.length} cocktails` : `${displayedCocktails.length} of ${filteredCocktails.length} cocktails`}
            </p>
          </div>
          {!isPremium && (
            <button
              onClick={onShowUpgrade}
              className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
              style={{ backgroundColor: `${GOLD}20`, border: `1px solid ${GOLD}40`, color: GOLD }}
            >
              👑 Unlock All
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
          <input
            type="text"
            placeholder="Search cocktails or ingredients..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2 px-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {hasCustom && (
            <TabButton active={showCustomOnly} onClick={() => setShowCustomOnly(!showCustomOnly)}>
              {showCustomOnly ? '✓ ' : ''}My Bar
            </TabButton>
          )}
          <TabButton active={showAvailableOnly} onClick={() => setShowAvailableOnly(!showAvailableOnly)}>
            {showAvailableOnly ? '✓ ' : ''}Available
          </TabButton>
          {types.map(type => (
            <TabButton key={type} active={filterType === type} onClick={() => setFilterType(filterType === type ? 'all' : type)}>{type}</TabButton>
          ))}
        </div>

        {/* Flavor Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {FLAVOR_PROFILES.map(f => (
            <button
              key={f.id}
              onClick={() => setFlavorFilter(flavorFilter === f.id ? null : f.id)}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                backgroundColor: flavorFilter === f.id ? `${f.color}20` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${flavorFilter === f.id ? `${f.color}60` : 'rgba(255,255,255,0.1)'}`,
                color: flavorFilter === f.id ? f.color : 'rgba(255,255,255,0.6)'
              }}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {displayedCocktails.map(c => (
          <div key={c.name} onClick={() => onSelectCocktail(c)} className="relative rounded-2xl overflow-hidden cursor-pointer group" style={{ aspectRatio: '3/4' }}>
            <img src={getCocktailImage(c.name, c.glass, c.image)} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }} />

            <div className="absolute top-3 right-3 flex gap-1">
              {favorites.includes(c.name) && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
              <span className={`w-3 h-3 rounded-full ${c.canMake ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ boxShadow: c.canMake ? '0 0 10px rgba(16, 185, 129, 0.5)' : '0 0 10px rgba(239, 68, 68, 0.5)' }} />
            </div>

            {/* Tags */}
            {c.tags?.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {c.tags.slice(0, 2).map(tagId => {
                  const tag = TAGS.find(t => t.id === tagId);
                  return tag && <span key={tagId} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: tag.color }}>{tag.icon}</span>;
                })}
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-base font-light mb-1" style={{ color: '#fff', fontFamily: "'Playfair Display', Georgia, serif" }}>{c.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.type}</span>
                {!c.canMake && (
                  <>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                    <span className="text-xs text-red-400">{c.missingCount} missing</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Prompt for Free Users */}
      {hasMoreLocked && (
        <div className="mx-4 p-6 rounded-2xl text-center" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', border: `1px solid ${GOLD}30` }}>
          <span className="text-3xl mb-3 block">🔒</span>
          <p className="text-lg font-light text-white mb-1">+{lockedCount} More Recipes</p>
          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Unlock all {filteredCocktails.length} cocktails with Premium</p>
          <button
            onClick={onShowUpgrade}
            className="px-6 py-3 rounded-xl font-medium text-black"
            style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #B8960C 100%)` }}
          >
            👑 Unlock Premium
          </button>
        </div>
      )}

      {filteredCocktails.length === 0 && (
        <div className="text-center py-16 px-4">
          <p className="text-lg" style={{ color: 'rgba(255,255,255,0.4)' }}>No cocktails found</p>
        </div>
      )}
    </div>
  );
};

export default CocktailsList;
