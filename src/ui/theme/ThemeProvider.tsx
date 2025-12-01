// src/ui/theme/ThemeProvider.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppTheme,
  ThemeScheme,
  lightTheme,
  darkTheme,
  buildTokens,
  Tokens,
} from './theme';

type SchemePref = ThemeScheme | 'system';

type Ctx = {
  // Main theme objects
  theme: AppTheme;
  tokens: Tokens;

  // Preference vs resolved scheme
  schemePref: SchemePref; // "light" | "dark" | "system"
  resolvedScheme: ThemeScheme; // actually active: "light" | "dark"
  mode: ThemeScheme; // alias of resolvedScheme (for components)

  // Controls
  setScheme: (scheme: SchemePref, opts?: { persist?: boolean }) => void;

  // Design primitives
  radii: { sm: number; md: number; lg: number; pill: number };
  spacing: (n: number) => number;
};

const STORAGE_KEY = '@app:schemePref';
const ThemeCtx = createContext<Ctx | null>(null);

function makeTheme(scheme: ThemeScheme): AppTheme {
  return scheme === 'dark' ? darkTheme : lightTheme;
}

type ThemeProviderProps = {
  children: React.ReactNode;
  initial?: SchemePref;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initial = 'system',
}) => {
  const [schemePref, setSchemePref] = useState<SchemePref>(initial);
  const [hydrated, setHydrated] = useState(false);

  // System color scheme ("light" | "dark" | null)
  const systemColorScheme = useColorScheme();
  const systemScheme = (systemColorScheme ?? 'light') as ThemeScheme;

  // Load persisted preference once
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setSchemePref(stored as SchemePref);
        }
      } catch (e) {
        console.warn('[ThemeProvider] Failed to load scheme preference', e);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const resolvedScheme: ThemeScheme =
    schemePref === 'system' ? systemScheme : schemePref;

  const theme = useMemo(() => makeTheme(resolvedScheme), [resolvedScheme]);
  const tokens = useMemo(() => buildTokens(theme), [theme]);

  const setScheme = useCallback(
    (scheme: SchemePref, opts?: { persist?: boolean }) => {
      setSchemePref(scheme);

      if (opts?.persist) {
        AsyncStorage.setItem(STORAGE_KEY, scheme).catch(e => {
          console.warn(
            '[ThemeProvider] Failed to persist scheme preference',
            e,
          );
        });
      }
    },
    [],
  );

  // Design-system-ish primitives
  const radii = useMemo(() => ({ sm: 8, md: 10, lg: 14, pill: 999 }), []);
  const spacing = useCallback((n: number) => 4 * n, []);

  const value = useMemo<Ctx>(
    () => ({
      theme,
      tokens,
      setScheme,
      schemePref,
      resolvedScheme,
      mode: resolvedScheme,
      radii,
      spacing,
    }),
    [theme, tokens, setScheme, schemePref, resolvedScheme, radii, spacing],
  );

  // Replace `null` with a splash screen if you have one.
  if (!hydrated) {
    return null;
  }

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
};

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
