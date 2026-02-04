import React from 'react';
import { GOLD } from '../../data/constants';

const SectionHeader = ({ children, action }) => (
  <div className="flex items-center justify-between mb-3">
    <h2 className="text-xs uppercase tracking-widest" style={{ color: GOLD }}>{children}</h2>
    {action}
  </div>
);

export default SectionHeader;
