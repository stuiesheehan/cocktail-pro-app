import React from 'react';

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className="w-12 h-7 rounded-full relative transition-all"
    style={{
      backgroundColor: value ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.1)',
      border: `1px solid ${value ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255,255,255,0.2)'}`
    }}
  >
    <span
      className="absolute top-1 w-5 h-5 rounded-full transition-all duration-200"
      style={{ backgroundColor: value ? '#10B981' : 'rgba(255,255,255,0.4)', left: value ? '24px' : '4px' }}
    />
  </button>
);

export default Toggle;
