import { useState, useEffect, useMemo, useCallback } from 'react';
import { load, usePersist } from './usePersistence';
import { defaultCocktails } from '../data/cocktails';
import { formatTime } from '../utils/formatting';
import { ingredientMatches } from './useInventory';
import { FREE_COCKTAIL_LIMIT } from '../data/constants';

export const useCocktails = ({ inStockNames, isPremium }) => {
  const [cocktails, setCocktails] = useState(() => load('cocktails_pro', defaultCocktails));
  const [sales, setSales] = useState(() => load('sales_pro', []));
  const [favorites, setFavorites] = useState(() => load('favorites_pro', []));
  const [recentlyMade, setRecentlyMade] = useState(() => load('recentlyMade_pro', []));

  usePersist('cocktails_pro', cocktails);
  usePersist('sales_pro', sales);
  usePersist('favorites_pro', favorites);
  usePersist('recentlyMade_pro', recentlyMade);

  // Recalculate canMake whenever stock changes
  useEffect(() => {
    setCocktails(prev => prev.map(c => {
      const missing = c.ingredients.filter(ri => !inStockNames.some(si => ingredientMatches(si, ri)));
      return { ...c, canMake: missing.length === 0, missingCount: missing.length };
    }));
  }, [inStockNames]);

  const visibleCocktails = useMemo(() => {
    if (isPremium) return cocktails;
    const custom = cocktails.filter(c => c.isCustom);
    const classics = cocktails.filter(c => !c.isCustom).slice(0, FREE_COCKTAIL_LIMIT);
    return [...custom, ...classics];
  }, [cocktails, isPremium]);

  const getRandomCocktail = useCallback(() => {
    const available = visibleCocktails.filter(c => c.canMake);
    return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null;
  }, [visibleCocktails]);

  const toggleFavorite = (name) => {
    setFavorites(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const makeDrink = (cocktail, quantity = 1, setSaveStatus) => {
    const sale = {
      name: cocktail.name,
      quantity,
      timestamp: new Date().toISOString(),
      sellPrice: cocktail.sellPrice || 12,
      costPerDrink: cocktail.costPerDrink || 2.5,
    };
    setSales(prev => [sale, ...prev]);
    setRecentlyMade(prev => [
      { name: cocktail.name, time: formatTime(new Date()), quantity },
      ...prev.filter(r => r.name !== cocktail.name).slice(0, 9),
    ]);
    if (setSaveStatus) {
      setSaveStatus(`Made ${quantity}x ${cocktail.name}`);
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const addCustomCocktail = (newRecipe, inStockNames) => {
    const missing = newRecipe.ingredients.filter(ri => !inStockNames.some(si => ingredientMatches(si, ri)));
    setCocktails(prev => [
      { ...newRecipe, canMake: missing.length === 0, missingCount: missing.length },
      ...prev,
    ]);
  };

  const updateCocktail = (updated) => {
    setCocktails(prev => prev.map(c => c.name === updated.name ? updated : c));
  };

  const replaceCocktails = (newCocktails) => setCocktails(newCocktails);

  const stats = useMemo(() => ({
    total: visibleCocktails.length,
    available: visibleCocktails.filter(c => c.canMake).length,
    cocktailsByType: visibleCocktails.reduce((acc, c) => { acc[c.type] = (acc[c.type] || 0) + 1; return acc; }, {}),
  }), [visibleCocktails]);

  return {
    cocktails,
    visibleCocktails,
    sales,
    setSales,
    favorites,
    recentlyMade,
    stats,
    getRandomCocktail,
    toggleFavorite,
    makeDrink,
    addCustomCocktail,
    updateCocktail,
    replaceCocktails,
  };
};
