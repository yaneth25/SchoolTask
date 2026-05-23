import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getBorders, getThemeColors } from '../constants/theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const colors = useMemo(() => getThemeColors(isDarkMode), [isDarkMode]);
  const borders = useMemo(() => getBorders(colors), [colors]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const setDarkMode = useCallback((value) => {
    setIsDarkMode(Boolean(value));
  }, []);

  const value = useMemo(
    () => ({
      isDarkMode,
      colors,
      borders,
      toggleDarkMode,
      setDarkMode,
    }),
    [isDarkMode, colors, borders, toggleDarkMode, setDarkMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    const colors = getThemeColors(false);
    return {
      isDarkMode: false,
      colors,
      borders: getBorders(colors),
      toggleDarkMode: () => {},
      setDarkMode: () => {},
    };
  }
  return ctx;
}
