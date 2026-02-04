import React from 'react';

const Badge = ({ color, children }) => (
  <span
    className="px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1"
    style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40`, color }}
  >
    {children}
  </span>
);

export default Badge;
