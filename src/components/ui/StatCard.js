import React from 'react';
import { GOLD } from '../../data/constants';
import Card from './Card';

const StatCard = ({ label, value, color = GOLD, icon: Icon, subtitle }) => (
  <Card className="p-3 text-center min-w-0">
    {Icon && <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />}
    <p className="text-lg sm:text-xl md:text-2xl font-light truncate" style={{ color }}>{value}</p>
    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider mt-1 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
    {subtitle && <p className="text-xs mt-1 truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{subtitle}</p>}
  </Card>
);

export default StatCard;
