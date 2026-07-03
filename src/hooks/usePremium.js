import { useState, useEffect } from 'react';
import { FREE_RANDOM_USES } from '../data/constants';

export const usePremium = () => {
  const [isPremium, setIsPremium] = useState(() => {
    try { return localStorage.getItem('isPremium') === 'true'; } catch { return false; }
  });

  const [randomUsesRemaining, setRandomUsesRemaining] = useState(() => {
    try {
      const saved = localStorage.getItem('randomUsesRemaining');
      return saved ? parseInt(saved, 10) : FREE_RANDOM_USES;
    } catch { return FREE_RANDOM_USES; }
  });

  useEffect(() => {
    localStorage.setItem('isPremium', isPremium.toString());
  }, [isPremium]);

  useEffect(() => {
    localStorage.setItem('randomUsesRemaining', randomUsesRemaining.toString());
  }, [randomUsesRemaining]);

  const unlock = () => setIsPremium(true);

  const restore = () => {
    const saved = localStorage.getItem('isPremium');
    if (saved === 'true') setIsPremium(true);
    return saved === 'true';
  };

  const useRandom = () => setRandomUsesRemaining(prev => Math.max(0, prev - 1));

  return { isPremium, randomUsesRemaining, unlock, restore, useRandom };
};
