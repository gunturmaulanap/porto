import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'portfolio-theme';
const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
};

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem(THEME_KEY);
    if (stored && Object.values(THEMES).includes(stored)) {
      return stored;
    }
    
    // Default to dark theme as specified
    return THEMES.DARK;
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
  }, []);

  const setDarkTheme = useCallback(() => setTheme(THEMES.DARK), []);
  const setLightTheme = useCallback(() => setTheme(THEMES.LIGHT), []);

  return {
    theme,
    isDark: theme === THEMES.DARK,
    isLight: theme === THEMES.LIGHT,
    toggleTheme,
    setDarkTheme,
    setLightTheme,
    THEMES
  };
};