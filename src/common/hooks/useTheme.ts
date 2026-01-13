/**
 * Flow Design System - useTheme Hook
 * 
 * Combines Zustand theme store preference with Flow design tokens.
 * Falls back to OS preference when user preference is 'system'.
 */

import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/store';
import { lightTheme, darkTheme } from '../theme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radius } from '../theme/radius';
import { shadows } from '../theme/shadows';
import { animations } from '../theme/animations';
import { iconSizes } from '../theme/icons';

export type ThemeMode = 'light' | 'dark' | 'system';

export type FlowTheme = {
    scheme: 'light' | 'dark';
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    colors: typeof lightTheme.colors;
    glass: typeof lightTheme.glass;
    spacing: typeof spacing;
    typography: typeof typography;
    radius: typeof radius;
    shadows: typeof shadows;
    animations: typeof animations;
    icon: typeof iconSizes;
};

export function useTheme(): FlowTheme {
    const osScheme = useColorScheme();
    const { themeMode, setThemeMode } = useThemeStore();

    // Resolve theme: user preference or OS fallback
    const resolvedScheme: 'light' | 'dark' =
        themeMode === 'system'
            ? (osScheme ?? 'light')
            : themeMode;

    const theme = resolvedScheme === 'dark' ? darkTheme : lightTheme;

    return {
        scheme: resolvedScheme,
        themeMode,
        setThemeMode,
        colors: theme.colors,
        glass: theme.glass,
        spacing,
        typography,
        radius,
        shadows,
        animations,
        icon: iconSizes,
    };
}
