'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { loadState, saveState } from '@/shared/storage';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  palette: string;
  toggleTheme: () => void;
  setPalette: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [palette, setPaletteState] = useState('tech');

  useEffect(() => {
    const state = loadState();
    setTheme(state.theme);
    setPaletteState(state.palette);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveState({ theme });
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.palette = palette;
    saveState({ palette });
  }, [palette]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const setPalette = (id: string) => setPaletteState(id);

  return (
    <ThemeContext.Provider value={{ theme, palette, toggleTheme, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
