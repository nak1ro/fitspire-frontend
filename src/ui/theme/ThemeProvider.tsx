// src/ui/theme/ThemeProvider.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from './theme';
import type { AppTheme, Scheme } from './theme';
import { getPreferences, updatePreferences } from '../../features/profile/userApi';

const STORAGE_KEY = '@app_theme_scheme';

type ThemeContextValue = {
  scheme: Scheme;
  theme: AppTheme;
  setScheme: (s: Scheme, opts?: { persist?: boolean; syncRemote?: boolean }) => void;
  toggleScheme: (opts?: { persist?: boolean; syncRemote?: boolean }) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function schemeToTheme(s: Scheme): AppTheme {
  return s === 'dark' ? darkTheme : lightTheme;
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const sys = Appearance.getColorScheme() as ColorSchemeName;
  const systemInitial: Scheme = sys === 'dark' ? 'dark' : 'light';
  const [scheme, setSchemeState] = useState<Scheme>(systemInitial);
  const [bootstrapped, setBootstrapped] = useState(false);
  const schemeRef = useRef(scheme);
  schemeRef.current = scheme;

  const setScheme = useCallback((s: Scheme, opts?: { persist?: boolean; syncRemote?: boolean }) => {
    setSchemeState(s);
    if (opts?.persist !== false) {
      AsyncStorage.setItem(STORAGE_KEY, s).catch(() => {});
    }
    if (opts?.syncRemote) {
      updatePreferences({
        isDarkModeEnabled: s === 'dark',
      } as any).catch(() => {});
    }
  }, []);

  const toggleScheme = useCallback((opts?: { persist?: boolean; syncRemote?: boolean }) => {
    setScheme(schemeRef.current === 'dark' ? 'light' : 'dark', opts);
  }, [setScheme]);

  // Follow system only if user didn’t explicitly choose.
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      AsyncStorage.getItem(STORAGE_KEY).then(saved => {
        if (!saved) {
          setScheme(colorScheme === 'dark' ? 'dark' : 'light', { persist: false, syncRemote: false });
        }
      }).catch(() => {});
    });
    return () => sub.remove();
  }, [setScheme]);

  // Bootstrap: AsyncStorage → backend → system
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
          if (!cancelled) setScheme(saved as Scheme, { persist: false, syncRemote: false });
        } else {
          try {
            const prefs = await getPreferences();
            const fromRemote: Scheme = prefs?.isDarkModeEnabled ? 'dark' : 'light';
            if (!cancelled) setScheme(fromRemote, { persist: true, syncRemote: false });
          } catch {
            // fall back to system
          }
        }
      } finally {
        if (!cancelled) setBootstrapped(true);
      }
    })();
    return () => { cancelled = true; };
  }, [setScheme]);

  const theme = useMemo(() => schemeToTheme(scheme), [scheme]);

  if (!bootstrapped) return null;

  return (
    <ThemeContext.Provider value={{ scheme, theme, setScheme, toggleScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <AppThemeProvider>');
  return ctx;
}
