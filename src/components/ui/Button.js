import React from 'react';
import { GOLD } from '../../data/constants';

const Button = ({ children, variant = 'default', size = 'md', className = '', style, ...props }) => {
  const variants = {
    default: { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' },
    gold: { background: `linear-gradient(135deg, ${GOLD} 0%, #B8960C 100%)`, color: '#000', border: 'none' },
    danger: { backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#EF4444' },
    success: { backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10B981' }
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  return (
    <button
      className={`rounded-lg font-medium transition-all hover:scale-105 active:scale-95 ${sizes[size]} ${className}`}
      style={{ ...variants[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
