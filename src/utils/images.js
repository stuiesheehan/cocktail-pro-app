import { GLASS_IMAGES, COCKTAIL_IMAGES } from '../data/images';

export const getCocktailImage = (name, glass, customImage) => {
  // Priority: 1. Custom image set by user, 2. Curated cocktail image, 3. Glass-based image, 4. Default
  if (customImage) return customImage;
  if (COCKTAIL_IMAGES[name]) return COCKTAIL_IMAGES[name];
  if (!glass) return GLASS_IMAGES['default'];
  const key = Object.keys(GLASS_IMAGES).find(k => glass.toLowerCase().includes(k.toLowerCase()));
  return GLASS_IMAGES[key] || GLASS_IMAGES['default'];
};
