// src/ui/theme/ThemeProvider.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppTheme, ThemeScheme, lightTheme, darkTheme, buildTokens, Tokens } from "./theme";

type SchemePref = ThemeScheme | "system";

type Ctx = {
  // For ProfileScreen
  theme: AppTheme;
  setScheme: (scheme: SchemePref, opts?: { persist?: boolean }) => void;

  // Extra (optional)
  schemePref: SchemePref;
  resolvedScheme: ThemeScheme;

  // For cards/components
  tokens: Tokens;

  // ✅ Added so WorkoutCard compiles
  mode: ThemeScheme; // alias of resolvedScheme
  radii: { sm: number; md: number; lg: number; pill: number };
  spacing: (n: number) => number;
};

const STORAGE_KEY = "@app:schemePref";
const ThemeCtx = createContext<Ctx | null>(null);

function makeTheme(scheme: ThemeScheme): AppTheme {
  return scheme === "dark" ? darkTheme : lightTheme;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode; initial?: SchemePref }> = ({
                                                                                               children,
                                                                                               initial = "system",
                                                                                             }) => {
  const [schemePref, setSchemePref] = useState<SchemePref>(initial);
  const [systemScheme, setSystemScheme] = useState<ThemeScheme>(
    ((Appearance.getColorScheme() as ColorSchemeName) ?? "light") as ThemeScheme
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setSchemePref(stored as SchemePref);
      }
    });
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(((colorScheme ?? "light") as ThemeScheme));
    });
    return () => sub.remove();
  }, []);

  const resolvedScheme: ThemeScheme = schemePref === "system" ? systemScheme : schemePref;
  const theme = useMemo(() => makeTheme(resolvedScheme), [resolvedScheme]);
  const tokens = useMemo(() => buildTokens(theme), [theme]);

  const setScheme = useCallback((scheme: SchemePref, opts?: { persist?: boolean }) => {
    setSchemePref(scheme);
    if (opts?.persist) AsyncStorage.setItem(STORAGE_KEY, scheme);
  }, []);

  // ✅ design-system-ish primitives
  const radii = useMemo(() => ({ sm: 8, md: 10, lg: 14, pill: 999 }), []);
  const spacing = useCallback((n: number) => 4 * n, []);

  const value = useMemo<Ctx>(
    () => ({
      theme,
      tokens,
      setScheme,
      schemePref,
      resolvedScheme,
      mode: resolvedScheme, // alias
      radii,
      spacing,
    }),
    [theme, tokens, setScheme, schemePref, resolvedScheme, radii, spacing]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
};

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
