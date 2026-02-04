import React, { useState } from 'react';
import { QrCode, X } from 'lucide-react';
import { GOLD } from '../../data/constants';
import { formatCurrency } from '../../utils/formatting';
import { SectionHeader, Button, Card } from '../ui';

const MenuBuilder = ({ cocktails, favorites }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [menuTitle, setMenuTitle] = useState('Cocktail Menu');

  const availableCocktails = cocktails.filter(c => c.canMake);

  const addToMenu = (cocktail) => {
    if (!menuItems.find(m => m.name === cocktail.name)) {
      setMenuItems([...menuItems, cocktail]);
    }
  };

  const removeFromMenu = (name) => {
    setMenuItems(menuItems.filter(m => m.name !== name));
  };

  const generateMenuHTML = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${menuTitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, serif; background: #0a0a0a; color: #fff; padding: 20px; }
    h1 { color: #D4AF37; text-align: center; font-weight: 300; letter-spacing: 4px; margin-bottom: 30px; }
    .cocktail { border-bottom: 1px solid rgba(255,255,255,0.1); padding: 20px 0; }
    .cocktail h2 { color: #fff; font-weight: 300; margin-bottom: 5px; }
    .cocktail .type { color: rgba(255,255,255,0.5); font-size: 14px; }
    .cocktail .price { color: #D4AF37; font-size: 18px; float: right; }
    .cocktail .desc { color: rgba(255,255,255,0.6); font-size: 14px; margin-top: 10px; }
  </style>
</head>
<body>
  <h1>${menuTitle.toUpperCase()}</h1>
  ${menuItems.map(c => `
  <div class="cocktail">
    <span class="price">${formatCurrency(c.sellPrice || 12)}</span>
    <h2>${c.name}</h2>
    <p class="type">${c.type} • ${c.glass}</p>
    <p class="desc">${c.ingredients.join(', ')}</p>
  </div>
  `).join('')}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4 pb-28">
      <div className="px-4 pt-4">
        <h2 className="text-2xl font-light tracking-wide" style={{ color: GOLD, fontFamily: "'Playfair Display', Georgia, serif" }}>Menu Builder</h2>
      </div>

      {/* Menu Title */}
      <div className="px-4">
        <input
          value={menuTitle}
          onChange={e => setMenuTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-lg bg-white/5 border border-white/10 text-white outline-none text-center"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        />
      </div>

      {/* Current Menu */}
      <div className="px-4">
        <SectionHeader>
          Menu Items ({menuItems.length})
          {menuItems.length > 0 && (
            <Button variant="gold" size="sm" onClick={generateMenuHTML}>
              <QrCode className="w-4 h-4 mr-1" /> Preview
            </Button>
          )}
        </SectionHeader>

        {menuItems.length > 0 ? (
          <div className="space-y-2">
            {menuItems.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: GOLD }}>{idx + 1}</span>
                  <div>
                    <p className="text-white">{item.name}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.type}</p>
                  </div>
                </div>
                <button onClick={() => removeFromMenu(item.name)} className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30">
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Add cocktails from below
          </Card>
        )}
      </div>

      {/* Available Cocktails */}
      <div className="px-4">
        <SectionHeader>Available Cocktails</SectionHeader>
        <div className="grid grid-cols-2 gap-2">
          {availableCocktails.filter(c => !menuItems.find(m => m.name === c.name)).map(c => (
            <button
              key={c.name}
              onClick={() => addToMenu(c)}
              className="p-3 rounded-xl text-left bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <p className="text-sm text-white truncate">{c.name}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{c.type}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuBuilder;
