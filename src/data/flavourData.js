// Flavour Radar axes
export const FLAVOUR_AXES = ['Sweet', 'Sour', 'Bitter', 'Strength', 'Botanical'];

// Ingredients that contribute to the Bitter axis (lowercase partial match)
export const BITTER_INGREDIENTS = [
  'angostura', 'peychaud', 'orange bitters', 'chocolate bitters',
  'campari', 'aperol', 'fernet', 'averna', 'absinthe',
];

// Ingredients that contribute to the Botanical axis (lowercase partial match)
export const BOTANICAL_INGREDIENTS = [
  'gin',
  'chartreuse', 'green chartreuse', 'yellow chartreuse',
  'elderflower', 'st. germain',
  'benedictine',
  'vermouth', 'dry vermouth', 'sweet vermouth',
  'absinthe',
  'basil', 'mint', 'rosemary', 'thyme',
];

// Extended ABV lookup (lowercase partial match on ingredient name)
export const EXTENDED_ABV_MAP = {
  'vodka': 40, 'gin': 40, 'rum': 40, 'tequila': 40, 'whiskey': 40,
  'whisky': 40, 'bourbon': 40, 'cognac': 40, 'brandy': 40, 'mezcal': 40,
  'pisco': 40, 'cachaça': 40,
  'vermouth': 18, 'campari': 25, 'aperol': 11, 'cointreau': 40,
  'triple sec': 30, 'kahlua': 20, 'amaretto': 28,
  'chartreuse': 55, 'benedictine': 40, 'drambuie': 40,
  'absinthe': 68, 'fernet': 39, 'averna': 29, 'maraschino': 32,
  'elderflower': 20, 'st. germain': 20, 'malibu': 21,
  'apricot': 24, 'banana liqueur': 20, 'blue curacao': 25,
  'creme de': 20, 'melon liqueur': 20, 'peach schnapps': 20,
  'grand marnier': 40,
  'champagne': 12, 'prosecco': 11, 'sherry': 17,
  'bitters': 45,
};

// Classic cocktail definitions for matching.
// core: required ingredients (pipe-separated alternatives). Matched via lowercase substring.
export const CLASSIC_COCKTAILS = [
  { name: 'Gimlet', core: ['gin', 'lime', 'simple syrup'] },
  { name: 'Manhattan', core: ['bourbon|rye|whiskey', 'sweet vermouth', 'angostura'] },
  { name: 'Negroni', core: ['gin', 'campari', 'sweet vermouth'] },
  { name: 'Daiquiri', core: ['white rum', 'lime', 'simple syrup'] },
  { name: 'Margarita', core: ['tequila', 'cointreau|triple sec', 'lime'] },
  { name: 'Whiskey Sour', core: ['bourbon|rye|whiskey', 'lemon', 'simple syrup'] },
  { name: 'White Russian', core: ['vodka', 'kahlua', 'cream'] },
  { name: 'Sidecar', core: ['cognac', 'cointreau|triple sec', 'lemon'] },
  { name: 'Tom Collins', core: ['gin', 'lemon', 'simple syrup', 'club soda'] },
  { name: 'Old Fashioned', core: ['bourbon|rye|whiskey', 'simple syrup|sugar cube|demerara', 'angostura'] },
  { name: 'Mojito', core: ['white rum', 'lime', 'simple syrup', 'mint'] },
  { name: 'Boulevardier', core: ['bourbon', 'campari', 'sweet vermouth'] },
  { name: "Bee's Knees", core: ['gin', 'lemon', 'honey syrup'] },
  { name: 'Gold Rush', core: ['bourbon', 'lemon', 'honey syrup'] },
  { name: 'Paloma', core: ['tequila', 'grapefruit', 'lime'] },
  { name: 'Espresso Martini', core: ['vodka', 'kahlua'] },
  { name: 'Cosmopolitan', core: ['vodka', 'cointreau|triple sec', 'cranberry', 'lime'] },
  { name: 'Mint Julep', core: ['bourbon', 'mint', 'simple syrup'] },
  { name: 'French 75', core: ['gin', 'lemon', 'simple syrup', 'champagne|prosecco'] },
  { name: "Dark 'n' Stormy", core: ['dark rum|aged rum', 'ginger beer', 'lime'] },
  { name: 'Moscow Mule', core: ['vodka', 'ginger beer', 'lime'] },
  { name: 'Rob Roy', core: ['scotch', 'sweet vermouth', 'angostura'] },
  { name: 'Hanky Panky', core: ['gin', 'sweet vermouth', 'fernet'] },
  { name: 'Penicillin', core: ['scotch', 'lemon', 'honey syrup', 'ginger'] },
  { name: 'Jungle Bird', core: ['dark rum|aged rum', 'campari', 'pineapple'] },
  { name: 'Amaretto Sour', core: ['amaretto', 'lemon', 'simple syrup'] },
  { name: 'Mai Tai', core: ['dark rum|aged rum', 'cointreau|triple sec', 'lime', 'simple syrup'] },
  { name: 'Aperol Spritz', core: ['aperol', 'prosecco', 'club soda'] },
];

// Bartender comment rules. First match wins (evaluated top to bottom).
// Each test receives a scores object: { Sweet, Sour, Bitter, Strength, Botanical }
export const BARTENDER_COMMENTS = [
  { test: (s) => s.Strength > 7 && s.Bitter > 5, comment: "Spirit-forward & bitter -- a bartender's handshake" },
  { test: (s) => s.Sweet > 6 && s.Sour > 6 && s.Strength < 5, comment: "Well-balanced sour with a refreshing finish" },
  { test: (s) => s.Sweet > 7 && s.Botanical > 5, comment: "Sweet & floral with herbal complexity" },
  { test: (s) => s.Sour > 7 && s.Strength > 5, comment: "Tart and punchy -- serve ice-cold" },
  { test: (s) => s.Bitter > 7, comment: "Boldly bitter -- an acquired taste" },
  { test: (s) => s.Botanical > 7, comment: "Aromatic & garden-fresh" },
  { test: (s) => s.Strength > 8, comment: "Dangerously smooth for its strength" },
  { test: (s) => s.Sweet > 7 && s.Sour < 3, comment: "Sweet sipper -- add citrus for balance" },
  { test: (s) => s.Sour > 5 && s.Sweet > 5, comment: "Classic sour balance -- well done" },
  { test: (s) => s.Strength > 5 && s.Botanical > 3, comment: "Complex & contemplative" },
  { test: (s) => s.Strength > 3, comment: "A unique creation -- keep experimenting" },
  { test: () => true, comment: "Add ingredients to see the flavour profile" },
];

// Hand-tuned flavour profiles for well-known cocktails (scores 0-10)
export const CLASSIC_FLAVOUR_PROFILES = {
  'Margarita':          { Sweet: 4, Sour: 7, Bitter: 1, Strength: 6, Botanical: 1 },
  'Negroni':            { Sweet: 3, Sour: 1, Bitter: 8, Strength: 7, Botanical: 6 },
  'Old Fashioned':      { Sweet: 4, Sour: 0, Bitter: 6, Strength: 9, Botanical: 1 },
  'Mojito':             { Sweet: 5, Sour: 6, Bitter: 0, Strength: 4, Botanical: 6 },
  'Daiquiri':           { Sweet: 5, Sour: 7, Bitter: 0, Strength: 6, Botanical: 0 },
  'Manhattan':          { Sweet: 4, Sour: 0, Bitter: 5, Strength: 9, Botanical: 4 },
  'Whiskey Sour':       { Sweet: 5, Sour: 7, Bitter: 1, Strength: 6, Botanical: 0 },
  'Gimlet':             { Sweet: 4, Sour: 7, Bitter: 0, Strength: 6, Botanical: 3 },
  'Moscow Mule':        { Sweet: 3, Sour: 5, Bitter: 0, Strength: 4, Botanical: 1 },
  'Gin & Tonic':        { Sweet: 2, Sour: 3, Bitter: 4, Strength: 4, Botanical: 6 },
  'Cosmopolitan':       { Sweet: 4, Sour: 5, Bitter: 0, Strength: 5, Botanical: 0 },
  'Espresso Martini':   { Sweet: 5, Sour: 1, Bitter: 3, Strength: 7, Botanical: 0 },
  'White Russian':      { Sweet: 6, Sour: 0, Bitter: 1, Strength: 6, Botanical: 0 },
  'Boulevardier':       { Sweet: 3, Sour: 0, Bitter: 7, Strength: 8, Botanical: 4 },
  'Sidecar':            { Sweet: 4, Sour: 6, Bitter: 0, Strength: 7, Botanical: 0 },
  'Tom Collins':        { Sweet: 4, Sour: 6, Bitter: 0, Strength: 3, Botanical: 3 },
  'French 75':          { Sweet: 4, Sour: 5, Bitter: 0, Strength: 4, Botanical: 3 },
  'Paloma':             { Sweet: 3, Sour: 6, Bitter: 1, Strength: 4, Botanical: 0 },
  'Mint Julep':         { Sweet: 5, Sour: 0, Bitter: 0, Strength: 7, Botanical: 5 },
  "Dark 'n' Stormy":    { Sweet: 3, Sour: 4, Bitter: 0, Strength: 4, Botanical: 1 },
  'Aperol Spritz':      { Sweet: 5, Sour: 2, Bitter: 5, Strength: 2, Botanical: 3 },
  'Mai Tai':            { Sweet: 5, Sour: 5, Bitter: 0, Strength: 5, Botanical: 0 },
  'Jungle Bird':        { Sweet: 4, Sour: 4, Bitter: 5, Strength: 5, Botanical: 0 },
  "Bee's Knees":        { Sweet: 6, Sour: 5, Bitter: 0, Strength: 6, Botanical: 3 },
  'Gold Rush':          { Sweet: 6, Sour: 5, Bitter: 0, Strength: 6, Botanical: 0 },
  'Penicillin':         { Sweet: 4, Sour: 6, Bitter: 0, Strength: 6, Botanical: 2 },
  'Rob Roy':            { Sweet: 3, Sour: 0, Bitter: 5, Strength: 8, Botanical: 4 },
  'Hanky Panky':        { Sweet: 3, Sour: 0, Bitter: 6, Strength: 8, Botanical: 5 },
  'Amaretto Sour':      { Sweet: 6, Sour: 6, Bitter: 0, Strength: 4, Botanical: 0 },
  'Pina Colada':        { Sweet: 8, Sour: 1, Bitter: 0, Strength: 4, Botanical: 0 },
  'Martini':            { Sweet: 1, Sour: 0, Bitter: 1, Strength: 9, Botanical: 5 },
  'Dirty Martini':      { Sweet: 1, Sour: 1, Bitter: 1, Strength: 9, Botanical: 3 },
  'Vesper':             { Sweet: 1, Sour: 1, Bitter: 1, Strength: 9, Botanical: 4 },
  'Negroni Sbagliato':  { Sweet: 4, Sour: 1, Bitter: 7, Strength: 4, Botanical: 5 },
  'Vieux Carré':        { Sweet: 3, Sour: 0, Bitter: 5, Strength: 9, Botanical: 5 },
  'Martinez':           { Sweet: 4, Sour: 0, Bitter: 4, Strength: 8, Botanical: 5 },
  'Sazerac':            { Sweet: 3, Sour: 0, Bitter: 5, Strength: 9, Botanical: 3 },
  'Last Word':          { Sweet: 4, Sour: 5, Bitter: 1, Strength: 7, Botanical: 8 },
  'Paper Plane':        { Sweet: 3, Sour: 4, Bitter: 5, Strength: 6, Botanical: 2 },
  'Irish Coffee':       { Sweet: 5, Sour: 0, Bitter: 3, Strength: 5, Botanical: 0 },
};

// Citrus keywords for sour estimation
const SOUR_KEYWORDS = ['lime', 'lemon', 'grapefruit', 'yuzu', 'citrus', 'orange juice'];

// Sweetener keywords for sweet estimation
const SWEET_KEYWORDS = [
  'syrup', 'sugar', 'honey', 'agave', 'grenadine', 'liqueur',
  'kahlua', 'amaretto', 'cointreau', 'triple sec', 'maraschino',
  'creme de', 'cream', 'orgeat', 'falernum',
];

// Estimate a flavour profile from cocktail data when no hand-tuned profile exists
export const estimateFlavourProfile = (cocktail) => {
  const ings = (cocktail.ingredients || []).map(i => i.toLowerCase());
  const instructions = (cocktail.instructions || '').toLowerCase();

  // Sour: check ingredients for citrus keywords
  let sourScore = 0;
  ings.forEach(ing => {
    if (SOUR_KEYWORDS.some(kw => ing.includes(kw))) sourScore += 3;
  });
  // Boost if instructions mention citrus ml amounts
  const citrusPattern = /(\d+)ml\s+(?:lime|lemon|grapefruit|yuzu|citrus)/gi;
  let citrusMatch;
  while ((citrusMatch = citrusPattern.exec(instructions)) !== null) {
    sourScore += Math.min(3, parseFloat(citrusMatch[1]) / 15);
  }
  sourScore = Math.min(10, Math.round(sourScore));

  // Sweet: check ingredients for sweetener keywords
  let sweetScore = 0;
  ings.forEach(ing => {
    if (SWEET_KEYWORDS.some(kw => ing.includes(kw))) sweetScore += 2.5;
  });
  const sweetPattern = /(\d+)ml\s+(?:simple syrup|honey|agave|grenadine|orgeat)/gi;
  let sweetMatch;
  while ((sweetMatch = sweetPattern.exec(instructions)) !== null) {
    sweetScore += Math.min(3, parseFloat(sweetMatch[1]) / 15);
  }
  sweetScore = Math.min(10, Math.round(sweetScore));

  // Bitter: check against BITTER_INGREDIENTS list
  let bitterScore = 0;
  ings.forEach(ing => {
    if (BITTER_INGREDIENTS.some(b => ing.includes(b))) bitterScore += 4;
  });
  bitterScore = Math.min(10, Math.round(bitterScore));

  // Strength: use cocktail.abv field
  const abv = cocktail.abv || 0;
  const strengthScore = Math.min(10, Math.round((abv / 30) * 10));

  // Botanical: check against BOTANICAL_INGREDIENTS list
  let botanicalScore = 0;
  ings.forEach(ing => {
    if (BOTANICAL_INGREDIENTS.some(b => ing.includes(b))) {
      botanicalScore += ing.includes('gin') ? 4 : 2.5;
    }
  });
  botanicalScore = Math.min(10, Math.round(botanicalScore));

  return { Sweet: sweetScore, Sour: sourScore, Bitter: bitterScore, Strength: strengthScore, Botanical: botanicalScore };
};
