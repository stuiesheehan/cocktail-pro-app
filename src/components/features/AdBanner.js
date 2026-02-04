import React from 'react';
import { GOLD } from '../../data/constants';

const AdBanner = ({ onUpgrade }) => (
  <div
    className="mx-4 my-3 p-4 rounded-xl text-center"
    style={{
      backgroundColor: 'rgba(255,255,255,0.03)',
      border: '1px dashed rgba(255,255,255,0.2)'
    }}
  >
    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
      Advertisement
    </p>
    <div
      className="py-6 rounded-lg mb-2"
      style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
    >
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
        🍸 Ad Placeholder 🍸
      </p>
      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
        (Test mode - No real ads)
      </p>
    </div>
    <button
      onClick={onUpgrade}
      className="text-xs underline"
      style={{ color: GOLD }}
    >
      Remove ads with Premium
    </button>
  </div>
);

export default AdBanner;
