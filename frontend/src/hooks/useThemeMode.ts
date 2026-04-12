import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'theme-mode-v1';

const readThemeMode = (): ThemeMode => {
  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  return storedTheme === 'dark' ? 'dark' : 'light';
};

export function useThemeMode() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(readThemeMode);

  useEffect(() => {
    const isDark = themeMode === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    window.localStorage.setItem(STORAGE_KEY, themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { themeMode, toggleTheme };
}
