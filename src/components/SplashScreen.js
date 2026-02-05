import React from 'react';

const SplashScreen = () => (
  <div
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
    style={{ backgroundColor: '#121212' }}
  >
    <style>{`
      @keyframes breathe {
        0%, 100% { transform: scale(1.0); opacity: 0.7; }
        50% { transform: scale(1.05); opacity: 1.0; }
      }
    `}</style>

    {/* Gold diamond cocktail logo */}
    <div
      style={{
        animation: 'breathe 3s ease-in-out infinite',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        {/* Diamond shape */}
        <path
          d="M40 4 L72 40 L40 76 L8 40 Z"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
        />
        <path
          d="M40 12 L64 40 L40 68 L16 40 Z"
          fill="rgba(212, 175, 55, 0.08)"
          stroke="#D4AF37"
          strokeWidth="1"
        />
        {/* Cocktail glass inside diamond */}
        <path
          d="M30 30 L40 48 L50 30 Z"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <line x1="40" y1="48" x2="40" y2="56" stroke="#D4AF37" strokeWidth="1.5" />
        <line x1="34" y1="56" x2="46" y2="56" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <h1
        style={{
          color: '#D4AF37',
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '24px',
          fontWeight: 300,
          letterSpacing: '4px',
          textTransform: 'uppercase',
        }}
      >
        Cocktail Bar
      </h1>
    </div>

    {/* Footer */}
    <p
      style={{
        position: 'absolute',
        bottom: '48px',
        color: 'rgba(212, 175, 55, 0.5)',
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '11px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
      }}
    >
      Dublin Est. 2026
    </p>
  </div>
);

export default SplashScreen;
