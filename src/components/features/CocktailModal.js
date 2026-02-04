import React, { useState } from 'react';
import { Edit3, Star, X, Clock, ChevronDown, ChevronRight, Minus, Plus, Share2 } from 'lucide-react';
import { GOLD, TAGS, TECHNIQUE_ICONS, FLAVOR_PROFILES, DIETARY_FLAGS } from '../../data/constants';
import { FLAVOR_AXES, EXTENDED_ABV_MAP } from '../../data/flavorData';
import { getCocktailImage } from '../../utils/images';
import { formatCurrency } from '../../utils/formatting';
import { Card, Badge, SectionHeader, Button } from '../ui';
import { FlavorRadarSVG } from './RecipeCreator';

// Parse "60ml tequila, 30ml triple sec, ..." from instructions text
const parseInstructionSpecs = (instructions) => {
  if (!instructions) return { totalVolume: 0, abv: 0 };
  const pattern = /(\d+(?:\.\d+)?)\s*ml\s+(.+?)(?:,|\.\s|$)/gi;
  let match;
  let totalVol = 0;
  let totalAlcohol = 0;

  while ((match = pattern.exec(instructions)) !== null) {
    const amount = parseFloat(match[1]);
    const name = match[2].trim().toLowerCase();
    if (isNaN(amount)) continue;
    totalVol += amount;

    for (const [key, abv] of Object.entries(EXTENDED_ABV_MAP)) {
      if (name.includes(key)) {
        totalAlcohol += (amount * abv) / 100;
        break;
      }
    }
  }

  const abv = totalVol > 0 ? (totalAlcohol / totalVol) * 100 : 0;
  return { totalVolume: Math.round(totalVol), abv: Math.round(abv * 10) / 10 };
};

const CocktailModal = ({ cocktail, onClose, ingredients, onMakeDrink, onToggleFavorite, favorites, onUpdateCocktail }) => {
  const [batchSize, setBatchSize] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingImage, setEditingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [sharing, setSharing] = useState(false);

  const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(10); };

  if (!cocktail) return null;

  const isFavorite = favorites.includes(cocktail.name);
  const ingredientStatus = cocktail.ingredients.map(name => ({
    name,
    inStock: ingredients.find(i => i.name === name)?.inStock || false
  }));

  const addNote = () => {
    if (!newNote.trim()) return;
    const notes = [...(cocktail.notes || []), { text: newNote, date: new Date().toISOString() }];
    onUpdateCocktail({ ...cocktail, notes });
    setNewNote('');
  };

  const saveImage = () => {
    if (imageUrl.trim()) {
      onUpdateCocktail({ ...cocktail, image: imageUrl.trim() });
    }
    setEditingImage(false);
    setImageUrl('');
  };

  const clearImage = () => {
    onUpdateCocktail({ ...cocktail, image: '' });
    setEditingImage(false);
    setImageUrl('');
  };

  const costPerDrink = cocktail.costPerDrink || 2.50;
  const sellPrice = cocktail.sellPrice || 12;
  const profit = sellPrice - costPerDrink;
  const margin = ((profit / sellPrice) * 100).toFixed(0);

  const generateRecipeCard = () => {
    return new Promise((resolve) => {
      const W = 1080, H = 1080;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');

      const drawCard = (img) => {
        // ── Background gradient ──
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, '#1a1a1a');
        bg.addColorStop(1, '#0a0a0a');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // ── Border + gold corner accents ──
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, W - 60, H - 60);
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 2.5;
        [[30, 30, 1, 1], [W - 30, 30, -1, 1], [30, H - 30, 1, -1], [W - 30, H - 30, -1, -1]].forEach(([x, y, dx, dy]) => {
          ctx.beginPath();
          ctx.moveTo(x + dx * 50, y);
          ctx.lineTo(x, y);
          ctx.lineTo(x, y + dy * 50);
          ctx.stroke();
        });

        // ── Circular photo (top-left) ──
        const photoR = 140, photoCx = 260, photoCy = 230;
        if (img) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(photoCx, photoCy, photoR, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          const aspect = img.width / img.height;
          let dw, dh, dx, dy;
          if (aspect > 1) { dh = photoR * 2; dw = dh * aspect; dx = photoCx - dw / 2; dy = photoCy - photoR; }
          else { dw = photoR * 2; dh = dw / aspect; dx = photoCx - photoR; dy = photoCy - dh / 2; }
          ctx.drawImage(img, dx, dy, dw, dh);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(photoCx, photoCy, photoR, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.03)';
          ctx.fill();
          ctx.font = '80px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'rgba(255,255,255,0.2)';
          ctx.fillText('\uD83C\uDF78', photoCx, photoCy);
        }
        ctx.beginPath();
        ctx.arc(photoCx, photoCy, photoR + 3, 0, Math.PI * 2);
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // ── Bottom-left: Name + Ingredients + Specs ──
        const leftX = 70;
        let curY = 430;

        // Recipe name (word-wrapped)
        ctx.font = '700 60px Georgia, serif';
        ctx.fillStyle = GOLD;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const nameWords = cocktail.name.split(' ');
        let nameLine = '';
        const nameLines = [];
        nameWords.forEach(word => {
          const test = nameLine ? nameLine + ' ' + word : word;
          if (ctx.measureText(test).width > 420) { nameLines.push(nameLine); nameLine = word; }
          else { nameLine = test; }
        });
        if (nameLine) nameLines.push(nameLine);
        nameLines.forEach(line => { ctx.fillText(line, leftX, curY); curY += 70; });

        // Type + glass
        curY += 4;
        ctx.font = '300 20px -apple-system, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.fillText(`${cocktail.type || ''} \u00B7 ${cocktail.glass || ''}`, leftX, curY);
        curY += 40;

        // Divider
        ctx.beginPath();
        ctx.moveTo(leftX, curY);
        ctx.lineTo(leftX + 400, curY);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
        curY += 25;

        // Ingredients header
        ctx.font = '600 16px -apple-system, system-ui, sans-serif';
        ctx.fillStyle = GOLD;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('INGREDIENTS', leftX, curY);
        curY += 32;

        // Ingredients list (structured details for custom, trimmed strings for originals)
        const ingList = cocktail.ingredientDetails
          || cocktail.ingredients.map(name => ({ name: (name || '').trim() }));
        const ingCount = ingList.length;
        const idealLineH = 52;
        const maxIngBottom = H - 120;
        const lineH = Math.min(idealLineH, Math.max(42, Math.floor((maxIngBottom - curY) / Math.max(1, ingCount))));
        const ingStartY = curY;
        ingList.forEach(ing => {
          const hasAmount = ing.amount != null && ing.amount !== '';
          const label = hasAmount ? `${ing.amount} ${ing.unit || 'ml'} ${ing.name}` : ing.name;
          ctx.font = '300 32px -apple-system, system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillStyle = GOLD;
          ctx.fillText('\u2022', leftX + 4, curY);
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.fillText(label, leftX + 30, curY);
          curY += lineH;
        });
        const ingEndY = curY;

        // Specs divider
        curY += 12;
        ctx.beginPath();
        ctx.moveTo(leftX, curY);
        ctx.lineTo(leftX + 400, curY);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
        curY += 28;

        // Total Volume + ABV specs (dynamic calculation)
        let totalVol, abvVal;
        if (cocktail.ingredientDetails) {
          totalVol = Math.round(cocktail.ingredientDetails.reduce((sum, ing) => sum + (ing.amount || 0), 0));
          abvVal = cocktail.abv || 0;
        } else {
          const parsed = parseInstructionSpecs(cocktail.instructions);
          totalVol = parsed.totalVolume;
          abvVal = parsed.abv;
        }

        ctx.font = '600 28px -apple-system, system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#fff';
        ctx.fillText(`${Math.round(totalVol)} ml`, leftX, curY);
        const volW = ctx.measureText(`${Math.round(totalVol)} ml`).width;
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillText(' \u00B7 ', leftX + volW, curY);
        ctx.fillStyle = GOLD;
        ctx.fillText(`${abvVal}% ABV`, leftX + volW + 25, curY);
        curY += 32;
        ctx.font = '300 12px -apple-system, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillText('Total Volume', leftX, curY);
        ctx.fillText('Strength', leftX + volW + 25, curY);

        // ── Right side: Flavor Radar (centered relative to left content) ──
        const hasRadar = cocktail.radarScores && Object.values(cocktail.radarScores).some(v => v > 0);
        const scores = hasRadar ? cocktail.radarScores : { Sweet: 5, Sour: 5, Bitter: 5, Strength: 5, Botanical: 5 };
        const axes = FLAVOR_AXES;
        const n = axes.length;
        const radarR = 200;
        const radarCx = 790;
        const leftContentMid = Math.round((ingStartY + ingEndY) / 2);
        const radarCy = Math.max(radarR + 80, Math.min(H - radarR - 80, leftContentMid));
        const angleStep = (2 * Math.PI) / n;
        const startAngle = -Math.PI / 2;

        // Radar title
        ctx.font = '600 14px -apple-system, system-ui, sans-serif';
        ctx.fillStyle = GOLD;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('FLAVOR RADAR', radarCx, radarCy - radarR - 50);

        // Rings
        [0.33, 0.66, 1.0].forEach(r => {
          ctx.beginPath();
          for (let i = 0; i < n; i++) {
            const a = startAngle + i * angleStep;
            const px = radarCx + radarR * r * Math.cos(a);
            const py = radarCy + radarR * r * Math.sin(a);
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = 'rgba(255,255,255,0.08)';
          ctx.lineWidth = 1;
          ctx.stroke();
        });

        // Axis lines
        for (let i = 0; i < n; i++) {
          const a = startAngle + i * angleStep;
          ctx.beginPath();
          ctx.moveTo(radarCx, radarCy);
          ctx.lineTo(radarCx + radarR * Math.cos(a), radarCy + radarR * Math.sin(a));
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Data polygon
        ctx.beginPath();
        axes.forEach((axis, i) => {
          const v = (scores[axis] || 0) / 10;
          const a = startAngle + i * angleStep;
          const px = radarCx + radarR * v * Math.cos(a);
          const py = radarCy + radarR * v * Math.sin(a);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.closePath();
        const rGrad = ctx.createRadialGradient(radarCx, radarCy, 0, radarCx, radarCy, radarR);
        rGrad.addColorStop(0, 'rgba(212, 175, 55, 0.35)');
        rGrad.addColorStop(1, 'rgba(212, 175, 55, 0.1)');
        ctx.fillStyle = rGrad;
        ctx.fill();
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Data dots
        axes.forEach((axis, i) => {
          const v = (scores[axis] || 0) / 10;
          const a = startAngle + i * angleStep;
          const px = radarCx + radarR * v * Math.cos(a);
          const py = radarCy + radarR * v * Math.sin(a);
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fillStyle = GOLD;
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });

        // Axis labels + score values
        axes.forEach((axis, i) => {
          const a = startAngle + i * angleStep;
          const lx = radarCx + (radarR + 35) * Math.cos(a);
          const ly = radarCy + (radarR + 35) * Math.sin(a);
          ctx.font = '500 18px -apple-system, system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.fillText(axis, lx, ly);
          ctx.font = '700 15px -apple-system, system-ui, sans-serif';
          ctx.fillStyle = GOLD;
          ctx.fillText(`${scores[axis] || 0}/10`, lx, ly + 22);
        });

        // ── Watermark (bottom-right) ──
        ctx.font = '300 14px -apple-system, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('Shared from Cocktail App', W - 50, H - 45);

        canvas.toBlob(resolve, 'image/png');
      };

      // Load cocktail image with CORS for canvas access
      const imgSrc = getCocktailImage(cocktail.name, cocktail.glass, cocktail.image);
      const img = new Image();
      if (!imgSrc.startsWith('data:')) img.crossOrigin = 'anonymous';
      const timeout = setTimeout(() => drawCard(null), 3000);
      img.onload = () => { clearTimeout(timeout); drawCard(img); };
      img.onerror = () => { clearTimeout(timeout); drawCard(null); };
      img.src = imgSrc;
    });
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const blob = await generateRecipeCard();
      const file = new File([blob], 'cocktail-card.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cocktail.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-card.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      // Share cancelled or failed
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }} onClick={onClose}>
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '90vh', background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)', border: `1px solid rgba(212, 175, 55, 0.3)` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-44 flex-shrink-0 overflow-hidden group">
          <img src={getCocktailImage(cocktail.name, cocktail.glass, cocktail.image)} alt={cocktail.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0d0d0d 0%, transparent 60%)' }} />

          {/* Image Edit Overlay */}
          {editingImage ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
              <p className="text-sm text-white/70 mb-2">Enter image URL</p>
              <input
                type="text"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-white/40 mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={() => { triggerHaptic(); saveImage(); }} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: GOLD, color: '#000' }}>
                  Save
                </button>
                {cocktail.image && (
                  <button onClick={() => { triggerHaptic(); clearImage(); }} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                    Clear
                  </button>
                )}
                <button onClick={() => { triggerHaptic(); setEditingImage(false); setImageUrl(''); }} className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-white/70">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { triggerHaptic(); setEditingImage(true); }}
              className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <Edit3 className="w-4 h-4 text-white/60" />
            </button>
          )}

          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => { triggerHaptic(); handleShare(); }} disabled={sharing} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', opacity: sharing ? 0.5 : 1 }}>
              <Share2 className={`w-5 h-5 text-white/60 ${sharing ? 'animate-pulse' : ''}`} />
            </button>
            <button onClick={() => { triggerHaptic(); onToggleFavorite(cocktail.name); }} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-white/60'}`} />
            </button>
            <button onClick={() => { triggerHaptic(); onClose(); }} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Tags */}
          <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
            {cocktail.tags?.map(tagId => {
              const tag = TAGS.find(t => t.id === tagId);
              return tag && <Badge key={tagId} color={tag.color}>{tag.icon} {tag.label}</Badge>;
            })}
            {cocktail.technique && <Badge color={GOLD}>{TECHNIQUE_ICONS[cocktail.technique]} {cocktail.technique}</Badge>}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-light" style={{ color: '#fff', fontFamily: "'Playfair Display', Georgia, serif" }}>{cocktail.name}</h2>
              {cocktail.abv && <Badge color="#EF4444">{cocktail.abv}% ABV</Badge>}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{cocktail.type}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{cocktail.glass}</span>
              {cocktail.prepTime && (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                  <span className="text-sm flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.5)' }}><Clock className="w-3 h-3" /> {cocktail.prepTime}</span>
                </>
              )}
            </div>
          </div>

          {/* Flavor Profile */}
          {cocktail.flavors?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {cocktail.flavors.map(flavorId => {
                const flavor = FLAVOR_PROFILES.find(f => f.id === flavorId);
                return flavor && <Badge key={flavorId} color={flavor.color}>{flavor.icon} {flavor.label}</Badge>;
              })}
            </div>
          )}

          {/* Flavor Radar (custom cocktails) */}
          {cocktail.radarScores && (
            <Card className="p-4">
              <SectionHeader>Flavor Radar</SectionHeader>
              <div className="flex justify-center">
                <FlavorRadarSVG scores={cocktail.radarScores} size={160} />
              </div>
            </Card>
          )}

          {/* Dietary Flags */}
          {cocktail.dietary?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {cocktail.dietary.map(flagId => {
                const flag = DIETARY_FLAGS.find(f => f.id === flagId);
                return flag && <Badge key={flagId} color={flag.color}>{flag.icon} {flag.label}</Badge>;
              })}
            </div>
          )}

          {/* Batch Calculator */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest" style={{ color: GOLD }}>Batch Size</span>
              <div className="flex items-center gap-3">
                <button onClick={() => { triggerHaptic(); setBatchSize(Math.max(1, batchSize - 1)); }} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20"><Minus className="w-4 h-4 text-white" /></button>
                <span className="text-xl font-light text-white w-8 text-center">{batchSize}x</span>
                <button onClick={() => { triggerHaptic(); setBatchSize(batchSize + 1); }} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20"><Plus className="w-4 h-4 text-white" /></button>
              </div>
            </div>
            <div className="flex gap-2">
              {[1, 2, 5, 10].map(n => (
                <button key={n} onClick={() => { triggerHaptic(); setBatchSize(n); }} className={`flex-1 py-2 rounded-lg text-sm ${batchSize === n ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50'}`}>{n}x</button>
              ))}
            </div>
          </Card>

          {/* Ingredients */}
          <div>
            <SectionHeader>Ingredients {batchSize > 1 && `(×${batchSize})`}</SectionHeader>
            <div className="space-y-2">
              {ingredientStatus.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.9)' }}>{item.name}</span>
                  <span className={`w-2 h-2 rounded-full ${item.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <SectionHeader>Method</SectionHeader>
            <p className="leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{cocktail.instructions}</p>
          </div>

          {/* Costing */}
          <Card className="p-4">
            <SectionHeader>Costing</SectionHeader>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-light" style={{ color: '#EF4444' }}>{formatCurrency(costPerDrink * batchSize)}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Cost</p>
              </div>
              <div>
                <p className="text-lg font-light" style={{ color: '#10B981' }}>{formatCurrency(sellPrice * batchSize)}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Revenue</p>
              </div>
              <div>
                <p className="text-lg font-light" style={{ color: GOLD }}>{margin}%</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Margin</p>
              </div>
            </div>
          </Card>

          {/* Staff Notes */}
          <Card className="p-4">
            <button onClick={() => { triggerHaptic(); setShowNotes(!showNotes); }} className="w-full flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest" style={{ color: GOLD }}>Staff Notes ({cocktail.notes?.length || 0})</span>
              {showNotes ? <ChevronDown className="w-4 h-4 text-white/40" /> : <ChevronRight className="w-4 h-4 text-white/40" />}
            </button>
            {showNotes && (
              <div className="mt-3 space-y-2">
                {cocktail.notes?.map((note, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white/5 text-sm">
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>{note.text}</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{new Date(note.date).toLocaleDateString()}</p>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white outline-none"
                  />
                  <Button variant="gold" size="sm" onClick={() => { triggerHaptic(); addNote(); }}>Add</Button>
                </div>
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="pt-2">
            {cocktail.canMake ? (
              <button
                onClick={() => { triggerHaptic(); onMakeDrink(cocktail, batchSize); }}
                className="w-full py-4 rounded-xl font-semibold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #B8960C 100%)`, color: '#000' }}
              >
                MAKE {batchSize > 1 ? `${batchSize} DRINKS` : 'THIS DRINK'}
              </button>
            ) : (
              <div className="text-center py-4 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <p className="text-red-400 font-medium">Missing {cocktail.missingCount} ingredient{cocktail.missingCount !== 1 ? 's' : ''}</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{ingredientStatus.filter(i => !i.inStock).map(i => i.name).join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CocktailModal;
