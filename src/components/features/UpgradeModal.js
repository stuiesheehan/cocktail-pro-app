import React, { useState } from 'react';
import { GOLD } from '../../data/constants';

const UpgradeModal = ({ isOpen, onClose, onUnlock, onRestore, isPremium, venueName, onVenueNameChange }) => {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(venueName || '');

  if (!isOpen) return null;

  const handleNameSave = () => {
    if (nameInput.trim()) onVenueNameChange(nameInput.trim());
    setEditingName(false);
  };

  const premiumFeatures = [
    { icon: '🍸', title: 'All 149 Cocktails', desc: 'Unlock the complete recipe collection' },
    { icon: '📊', title: 'Pro Tools', desc: 'Analytics, shift mode & more' },
    { icon: '📤', title: 'Excel Import', desc: 'Manage recipes in spreadsheets' },
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
          border: `2px solid ${GOLD}40`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${GOLD}15 0%, transparent 100%)`,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div className="text-4xl mb-2">{isPremium ? '👑' : '✨'}</div>
          <h2 className="text-2xl font-light mb-1" style={{ color: GOLD, fontFamily: "'Playfair Display', Georgia, serif" }}>
            {isPremium ? 'Premium Active' : 'Go Premium'}
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {isPremium ? 'Manage your bar settings' : 'Unlock the full bartender experience'}
          </p>
        </div>

        {/* Venue Name Setting (always visible) */}
        <div className="px-4 pt-4">
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Venue Name</p>
          {editingName ? (
            <div className="flex gap-2">
              <input
                autoFocus
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNameSave()}
                className="flex-1 px-3 py-2 rounded-lg text-sm text-white bg-white/10 border border-white/20 outline-none focus:border-yellow-500/60"
                maxLength={40}
              />
              <button
                onClick={handleNameSave}
                className="px-3 py-2 rounded-lg text-sm font-medium text-black"
                style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #B8960C 100%)` }}
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setNameInput(venueName || ''); setEditingName(true); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <span className="text-white">{venueName || 'My Cocktail Bar'}</span>
              <span style={{ color: GOLD, fontSize: '0.7rem' }}>Edit</span>
            </button>
          )}
        </div>

        {isPremium ? (
          /* Settings view for premium users */
          <div className="p-4 space-y-3">
            <div className="p-3 rounded-xl flex items-center gap-3" style={{ backgroundColor: 'rgba(212,175,55,0.05)', border: `1px solid ${GOLD}20` }}>
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-sm font-medium text-white">All features unlocked</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Thank you for supporting the app</p>
              </div>
            </div>
          </div>
        ) : (
          /* Upgrade view for free users */
          <>
            <div className="px-4 pt-3 pb-2 space-y-2 max-h-44 overflow-y-auto">
              {premiumFeatures.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <span className="text-lg">{feature.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{feature.title}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="text-center">
                <span className="text-3xl font-light" style={{ color: GOLD }}>€3.99</span>
                <span className="text-sm ml-2" style={{ color: 'rgba(255,255,255,0.4)' }}>one-time purchase</span>
              </div>

              <button
                onClick={onUnlock}
                className="w-full py-3 rounded-xl font-medium text-black transition-all hover:scale-[1.02]"
                style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #B8960C 100%)` }}
              >
                ✨ Unlock Premium — €3.99
              </button>

              <button
                onClick={onRestore}
                className="w-full py-2 rounded-lg text-xs"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                Restore Purchase
              </button>
            </div>
          </>
        )}

        <div className="px-4 pb-4">
          <button onClick={onClose} className="w-full py-2 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
