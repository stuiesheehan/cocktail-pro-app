// Flavor Radar axes
export const FLAVOR_AXES = ['Sweet', 'Sour', 'Bitter', 'Strength', 'Botanical'];

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
  { test: () => true, comment: "Add ingredients to see the flavor profile" },
];
