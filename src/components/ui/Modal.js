import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', full: 'max-w-full mx-4' };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }} onClick={onClose}>
      <div
        className={`relative w-full ${sizes[size]} rounded-2xl overflow-hidden flex flex-col`}
        style={{ maxHeight: '90vh', background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)', border: '1px solid rgba(212, 175, 55, 0.3)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-light" style={{ color: '#fff', fontFamily: "'Playfair Display', Georgia, serif" }}>{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.6)' }} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
