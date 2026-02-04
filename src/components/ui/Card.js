import React from 'react';

const Card = ({ children, className = '', style = {} }) => (
  <div
    className={`rounded-xl ${className}`}
    style={{
      backgroundColor: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      ...style
    }}
  >
    {children}
  </div>
);

export default Card;
