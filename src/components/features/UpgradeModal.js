import React from 'react';
import { GOLD } from '../../data/constants';

const UpgradeModal = ({ isOpen, onClose, onUnlock, onRestore, onReset }) => {
  if (!isOpen) return null;

  const premiumFeatures = [
    { icon: '🍸', title: 'All 149 Cocktails', desc: 'Unlock the complete recipe collection' },
    { icon: '📊', title: 'Pro Tools', desc: 'Analytics, shift mode & training' },
    { icon: '📤', title: 'Excel Import/Export', desc: 'Manage recipes in spreadsheets' },
    { icon: '🎲', title: 'Unlimited Random', desc: 'No daily limits on suggestions' },
    { icon: '🚫', title: 'No Advertisements', desc: 'Clean, distraction-free experience' },
    { icon: '⭐', title: 'Priority Support', desc: 'Get help when you need it' },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)',
          border: `2px solid ${GOLD}40`
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${GOLD}15 0%, transparent 100%)`,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div className="text-4xl mb-2">👑</div>
          <h2
            className="text-2xl font-light mb-1"
            style={{ color: GOLD, fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Go Premium
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Unlock the full bartender experience
          </p>
        </div>

        {/* Features */}
        <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
          {premiumFeatures.map((feature, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            >
              <span className="text-xl">{feature.icon}</span>
              <div>
                <p className="text-sm font-medium text-white">{feature.title}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="p-4 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="text-center">
            <span className="text-3xl font-light" style={{ color: GOLD }}>€3.99</span>
            <span className="text-sm ml-2" style={{ color: 'rgba(255,255,255,0.4)' }}>one-time</span>
          </div>

          <button
            onClick={onUnlock}
            className="w-full py-3 rounded-xl font-medium text-black transition-all hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #B8960C 100%)` }}
          >
            ✨ Unlock Premium (Test)
          </button>

          <div className="flex gap-2">
            <button
              onClick={onRestore}
              className="flex-1 py-2 rounded-lg text-xs"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              Restore Purchase
            </button>
            <button
              onClick={onReset}
              className="flex-1 py-2 rounded-lg text-xs"
              style={{
                backgroundColor: 'rgba(255,100,100,0.1)',
                color: 'rgba(255,100,100,0.6)',
                border: '1px solid rgba(255,100,100,0.2)'
              }}
            >
              Reset (Test)
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 text-sm"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Maybe later
          </button>
        </div>

        {/* Test Mode Badge */}
        <div
          className="absolute top-2 right-2 px-2 py-1 rounded text-xs"
          style={{ backgroundColor: 'rgba(255,100,100,0.2)', color: '#ff6b6b' }}
        >
          TEST MODE
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
