import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Theme, ThemeMode, REAL_WORLD_THEME, UPSIDE_DOWN_THEME } from '@/types/hawkins';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  isUpsideDown: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>('realWorld');

  const theme = mode === 'realWorld' ? REAL_WORLD_THEME : UPSIDE_DOWN_THEME;
  const isUpsideDown = mode === 'upsideDown';

  const toggleTheme = useCallback(() => {
    setMode((current) => (current === 'realWorld' ? 'upsideDown' : 'realWorld'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, isUpsideDown }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
