import { useState } from 'react';

// Purpose: Persist and restore state so users can leave a page and come back
// without losing their work (e.g., code in the IDE).

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });
  const setValue = (value) => {
    try {
      const v = value instanceof Function ? value(storedValue) : value;
      setStoredValue(v);
      window.localStorage.setItem(key, JSON.stringify(v));
    } catch (err) { console.warn('[useLocalStorage]', err); }
  };
  return [storedValue, setValue];
};

export default useLocalStorage;
