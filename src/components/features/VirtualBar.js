import React from 'react';
import { ChevronLeft, X, ChevronRight } from 'lucide-react';
import { GOLD } from '../../data/constants';
import { SectionHeader } from '../ui';

const VirtualBar = ({ ingredients, speedRail, setSpeedRail }) => {
  const spirits = ingredients.filter(i => i.category === 'Base Spirits' && i.inStock);

  const addToRail = (name) => {
    if (!speedRail.includes(name) && speedRail.length < 8) {
      setSpeedRail([...speedRail, name]);
    }
  };

  const removeFromRail = (name) => {
    setSpeedRail(speedRail.filter(n => n !== name));
  };

  const moveInRail = (index, direction) => {
    const newRail = [...speedRail];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < speedRail.length) {
      [newRail[index], newRail[newIndex]] = [newRail[newIndex], newRail[index]];
      setSpeedRail(newRail);
    }
  };

  return (
    <div className="space-y-4 pb-28">
      <div className="px-4 pt-4">
        <h2 className="text-2xl font-light tracking-wide" style={{ color: GOLD, fontFamily: "'Playfair Display', Georgia, serif" }}>Speed Rail</h2>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Organise your well spirits (left to right)</p>
      </div>

      {/* Current Rail */}
      <div className="px-4">
        <SectionHeader>Your Rail ({speedRail.length}/8)</SectionHeader>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {speedRail.map((name, idx) => (
            <div key={name} className="flex-shrink-0 w-24 p-3 rounded-xl text-center" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
              <p className="text-xs font-bold mb-1" style={{ color: GOLD }}>{idx + 1}</p>
              <p className="text-xs text-white truncate">{name.split(' ')[0]}</p>
              <div className="flex justify-center gap-1 mt-2">
                <button onClick={() => moveInRail(idx, -1)} className="p-1 rounded bg-white/10 hover:bg-white/20" disabled={idx === 0}>
                  <ChevronLeft className="w-3 h-3 text-white" />
                </button>
                <button onClick={() => removeFromRail(name)} className="p-1 rounded bg-red-500/20 hover:bg-red-500/30">
                  <X className="w-3 h-3 text-red-400" />
                </button>
                <button onClick={() => moveInRail(idx, 1)} className="p-1 rounded bg-white/10 hover:bg-white/20" disabled={idx === speedRail.length - 1}>
                  <ChevronRight className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          ))}
          {speedRail.length === 0 && (
            <div className="flex-1 py-8 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Add spirits from below
            </div>
          )}
        </div>
      </div>

      {/* Available Spirits */}
      <div className="px-4">
        <SectionHeader>Available Spirits</SectionHeader>
        <div className="grid grid-cols-2 gap-2">
          {spirits.filter(s => !speedRail.includes(s.name)).map(spirit => (
            <button
              key={spirit.name}
              onClick={() => addToRail(spirit.name)}
              className="p-3 rounded-xl text-left bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <p className="text-sm text-white truncate">{spirit.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualBar;
