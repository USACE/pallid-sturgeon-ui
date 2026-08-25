import { useEffect, useState } from 'react';

export const isPwaMode = () => {
  return window.matchMedia('(display-mode: standalone)').matches;
};

export const usePwaMode = () => {
  const [pwaMode, setPwaMode] = useState(isPwaMode());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');

    const handleChange = () => {
      setPwaMode(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  return pwaMode;
};
