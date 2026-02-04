import React from 'react';
import { GOLD } from '../../data/constants';

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all"
    style={{
      backgroundColor: active ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.05)',
      border: `1px solid ${active ? 'rgba(212, 175, 55, 0.4)' : 'rgba(255,255,255,0.1)'}`,
      color: active ? GOLD : 'rgba(255,255,255,0.6)'
    }}
  >
    {children}
  </button>
);

export default TabButton;
