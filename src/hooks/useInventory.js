import { useState, useMemo } from 'react';
import { load, usePersist } from './usePersistence';
import { defaultIngredients } from '../data/ingredients';

const normalise = str => str.toLowerCase().replace(/[^a-z0-9]/g, '');

export const ingredientMatches = (stockName, recipeName) => {
  const s = normalise(stockName);
  const r = normalise(recipeName);
  return s === r || s.includes(r) || r.includes(s);
};

export const useInventory = () => {
  const [ingredients, setIngredients] = useState(() => load('ingredients_pro', defaultIngredients));

  usePersist('ingredients_pro', ingredients);

  const inStockNames = useMemo(() => ingredients.filter(i => i.inStock).map(i => i.name), [ingredients]);

  const canMakeWith = (recipeIngredients) => {
    const missing = recipeIngredients.filter(
      ri => !inStockNames.some(si => ingredientMatches(si, ri))
    );
    return { canMake: missing.length === 0, missingCount: missing.length };
  };

  const toggleIngredientStock = (name) => {
    setIngredients(prev => prev.map(i => i.name === name ? { ...i, inStock: !i.inStock } : i));
  };

  const lowStockItems = useMemo(() => ingredients.filter(i => !i.inStock).map(i => i.name), [ingredients]);

  return { ingredients, setIngredients, toggleIngredientStock, lowStockItems, canMakeWith, inStockNames };
};
