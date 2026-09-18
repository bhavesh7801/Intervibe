import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import faviconManager from '../utils/faviconManager.js';

const FaviconContext = createContext({
  status: 'idle',
  badge: null,
  setStatus: () => {},
  setBadge: () => {},
  setEmoji: () => {},
  triggerFlash: () => {},
  setAudioLevel: () => {}
});

export const FaviconProvider = ({ children }) => {
  const [status, setStatusState] = useState('idle');
  const [badge, setBadgeState] = useState(null);

  const setStatus = useCallback((newStatus) => {
    setStatusState(newStatus);
    if (faviconManager) {
      faviconManager.setStatus(newStatus);
    }
  }, []);

  const setBadge = useCallback((count) => {
    setBadgeState(count);
    if (faviconManager) {
      faviconManager.setBadge(count);
    }
  }, []);

  const setEmoji = useCallback((emojiChar) => {
    if (faviconManager) {
      faviconManager.setEmoji(emojiChar);
    }
  }, []);

  const triggerFlash = useCallback((flashStatus, duration = 3000) => {
    if (faviconManager) {
      faviconManager.flash(flashStatus, duration);
    }
  }, []);

  const setAudioLevel = useCallback((level) => {
    if (faviconManager) {
      faviconManager.setAudioLevel(level);
    }
  }, []);

  useEffect(() => {
    if (faviconManager) {
      faviconManager.init();
    }
  }, []);

  return (
    <FaviconContext.Provider
      value={{
        status,
        badge,
        setStatus,
        setBadge,
        setEmoji,
        triggerFlash,
        setAudioLevel
      }}
    >
      {children}
    </FaviconContext.Provider>
  );
};

export const useFavicon = () => useContext(FaviconContext);
export default FaviconContext;
