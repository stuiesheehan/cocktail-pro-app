export const DILUTION_FACTORS = {
  'Shake': 0.25,
  'Stir': 0.20,
  'Build': 0.10,
  'Muddle': 0.15,
  'Blend': 0.30,
  'Layer': 0.05
};

export const getIngredientABV = (name) => {
  const abvMap = {
    'vodka': 40, 'gin': 40, 'rum': 40, 'tequila': 40, 'whiskey': 40,
    'bourbon': 40, 'cognac': 40, 'brandy': 40, 'mezcal': 40,
    'vermouth': 18, 'campari': 25, 'aperol': 11, 'cointreau': 40,
    'triple sec': 30, 'kahlua': 20, 'baileys': 17, 'amaretto': 28,
    'chartreuse': 55, 'benedictine': 40, 'drambuie': 40,
  };
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(abvMap)) {
    if (lower.includes(key)) return val;
  }
  return 0;
};
