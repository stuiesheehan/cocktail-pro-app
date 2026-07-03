import { useEffect } from 'react';

export const load = (key, def) => {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : def;
  } catch (e) {
    return def;
  }
};

export const usePersist = (key, value) => {
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
};
