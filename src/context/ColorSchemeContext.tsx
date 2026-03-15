'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { colorSchemes, type ColorScheme } from '@/lib/color-schemes';

interface ColorSchemeContextValue {
  scheme: ColorScheme;
  setSchemeId: (id: string) => void;
}

const ColorSchemeContext = createContext<ColorSchemeContextValue>({
  scheme: colorSchemes[0],
  setSchemeId: () => {},
});

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const [scheme, setScheme] = useState<ColorScheme>(colorSchemes[0]);

  useEffect(() => {
    const saved = localStorage.getItem('cv-color-scheme');
    if (saved) {
      const found = colorSchemes.find((s) => s.id === saved);
      if (found) setScheme(found);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', scheme.primary);
    root.style.setProperty('--color-primary-dark', scheme.primaryDark);
    root.style.setProperty('--color-primary-light', scheme.primaryLight);
    root.style.setProperty('--color-accent', scheme.accent);
    root.style.setProperty('--color-gradient-from', scheme.gradientFrom);
    root.style.setProperty('--color-gradient-to', scheme.gradientTo);
  }, [scheme]);

  const setSchemeId = (id: string) => {
    const found = colorSchemes.find((s) => s.id === id);
    if (found) {
      setScheme(found);
      localStorage.setItem('cv-color-scheme', id);
    }
  };

  return (
    <ColorSchemeContext.Provider value={{ scheme, setSchemeId }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function useColorScheme() {
  return useContext(ColorSchemeContext);
}
