import React from 'react';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useTheme } from './ThemeProvider';

type PaperThemeProviderProps = {
  children: React.ReactNode;
};

export function PaperThemeProvider({ children }: PaperThemeProviderProps) {
  const { resolvedScheme, theme: appTheme, tokens } = useTheme();
  const isDark = resolvedScheme === 'dark';

  const paperTheme = React.useMemo(() => {
    const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: tokens.primary,
        primaryContainer: appTheme.colors.accentSoft,
        secondary: appTheme.colors.accent,
        secondaryContainer: appTheme.colors.accentSoft,
        tertiary: tokens.primary,
        surface: appTheme.colors.cardBg,
        surfaceVariant: tokens.card,
        background: appTheme.colors.bg,
        error: tokens.textError,
        errorContainer: tokens.textError,
        onPrimary: tokens.onPrimary,
        onSecondary: tokens.onPrimary,
        onTertiary: tokens.onPrimary,
        onSurface: tokens.textStrong,
        onSurfaceVariant: tokens.textMuted,
        onBackground: tokens.textStrong,
        onError: tokens.onPrimary,
        outline: tokens.cardBorder,
        outlineVariant: tokens.divider,
        shadow: appTheme.colors.border,
        scrim: appTheme.colors.border,
        inverseSurface: tokens.textStrong,
        inverseOnSurface: tokens.card,
        inversePrimary: tokens.primary,
      },
    };
  }, [isDark, appTheme, tokens]);

  return <PaperProvider theme={paperTheme}>{children}</PaperProvider>;
}

