import React from 'react';
import {
  Wine, Droplets, Leaf, Cherry, FlaskConical, Sparkles,
  TrendingUp, Snowflake, Flame, Award
} from 'lucide-react';

export const GOLD = '#D4AF37';
export const DARK_BG = '#0a0a0a';

export const TECHNIQUE_ICONS = {
  'Shake': '🍸', 'Stir': '🥄', 'Build': '🧊', 'Muddle': '🌿', 'Layer': '📊', 'Blend': '🌀'
};

export const FLAVOR_PROFILES = [
  { id: 'sweet', label: 'Sweet', icon: '🍯', color: '#F59E0B' },
  { id: 'sour', label: 'Sour', icon: '🍋', color: '#84CC16' },
  { id: 'bitter', label: 'Bitter', icon: '🫒', color: '#78716C' },
  { id: 'boozy', label: 'Boozy', icon: '🔥', color: '#EF4444' },
  { id: 'refreshing', label: 'Refreshing', icon: '❄️', color: '#06B6D4' },
  { id: 'herbal', label: 'Herbal', icon: '🌿', color: '#22C55E' },
  { id: 'fruity', label: 'Fruity', icon: '🍓', color: '#EC4899' },
  { id: 'creamy', label: 'Creamy', icon: '🥛', color: '#F5F5F4' }
];

export const DIETARY_FLAGS = [
  { id: 'vegan', label: 'Vegan', icon: '🌱', color: '#22C55E' },
  { id: 'contains_egg', label: 'Contains Egg', icon: '🥚', color: '#FCD34D' },
  { id: 'contains_dairy', label: 'Contains Dairy', icon: '🥛', color: '#F5F5F4' },
  { id: 'gluten_free', label: 'Gluten Free', icon: '🌾', color: '#D97706' },
  { id: 'contains_nuts', label: 'Contains Nuts', icon: '🥜', color: '#92400E' }
];

export const TAGS = [
  { id: 'signature', label: 'Signature', icon: <Award className="w-3 h-3" />, color: '#D4AF37' },
  { id: 'seasonal', label: 'Seasonal', icon: <Snowflake className="w-3 h-3" />, color: '#06B6D4' },
  { id: 'new', label: 'New', icon: <Flame className="w-3 h-3" />, color: '#EF4444' },
  { id: 'popular', label: 'Popular', icon: <TrendingUp className="w-3 h-3" />, color: '#8B5CF6' }
];

export const CATEGORY_CONFIG = {
  'Base Spirits': { icon: Wine, color: 'from-amber-600 to-amber-800' },
  'Liqueurs': { icon: FlaskConical, color: 'from-purple-600 to-purple-800' },
  'Bitters': { icon: Droplets, color: 'from-red-700 to-red-900' },
  'Syrups & Sweeteners': { icon: Sparkles, color: 'from-yellow-600 to-yellow-800' },
  'Fresh Citrus': { icon: () => <span className="text-lg">🍋</span>, color: 'from-lime-600 to-lime-800' },
  'Fresh Herbs': { icon: Leaf, color: 'from-emerald-600 to-emerald-800' },
  'Mixers & Sodas': { icon: () => <span className="text-lg">🫧</span>, color: 'from-cyan-600 to-cyan-800' },
  'Garnishes': { icon: Cherry, color: 'from-pink-600 to-pink-800' },
  'Wine & Champagne': { icon: () => <span className="text-lg">🍷</span>, color: 'from-rose-600 to-rose-800' },
  'Other': { icon: FlaskConical, color: 'from-gray-600 to-gray-800' }
};

export const FREE_COCKTAIL_LIMIT = 15;
export const FREE_RANDOM_USES = 5;
