/**
 * Flow Design System - Color Tokens
 * Supports light and dark themes
 */

export const colors = {
    // Primary gradient range (purple)
    primary: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7c3aed',
        800: '#6b21a8',
        900: '#581c87',
    },

    // Accent gradient range (cyan)
    accent: {
        50: '#ecfeff',
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#22d3ee',
        500: '#06b6d4',
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63',
    },

    // Semantic
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
} as const;

export const lightTheme = {
    scheme: 'light' as const,
    colors: {
        background: '#f8fafc',
        surface: '#ffffff',
        surfaceGlass: 'rgba(255, 255, 255, 0.7)',
        text: {
            primary: '#0f172a',
            secondary: '#64748b',
            inverse: '#ffffff',
        },
        border: 'rgba(0, 0, 0, 0.08)',
        ...colors,
    },
    glass: {
        light: {
            background: 'rgba(255, 255, 255, 0.15)',
            blur: 12,
            border: 'rgba(255, 255, 255, 0.2)',
        },
        medium: {
            background: 'rgba(255, 255, 255, 0.25)',
            blur: 16,
            border: 'rgba(255, 255, 255, 0.3)',
        },
        heavy: {
            background: 'rgba(255, 255, 255, 0.4)',
            blur: 24,
            border: 'rgba(255, 255, 255, 0.4)',
        },
    },
};

export const darkTheme = {
    scheme: 'dark' as const,
    colors: {
        background: '#0f0f1a',
        surface: '#1a1a2e',
        surfaceGlass: 'rgba(30, 30, 50, 0.7)',
        text: {
            primary: '#f8fafc',
            secondary: '#94a3b8',
            inverse: '#0f172a',
        },
        border: 'rgba(255, 255, 255, 0.08)',
        ...colors,
    },
    glass: {
        light: {
            background: 'rgba(0, 0, 0, 0.2)',
            blur: 12,
            border: 'rgba(255, 255, 255, 0.1)',
        },
        medium: {
            background: 'rgba(0, 0, 0, 0.3)',
            blur: 16,
            border: 'rgba(255, 255, 255, 0.15)',
        },
        heavy: {
            background: 'rgba(0, 0, 0, 0.4)',
            blur: 24,
            border: 'rgba(255, 255, 255, 0.2)',
        },
    },
};

export type Theme = typeof lightTheme;
export type ThemeScheme = 'light' | 'dark';
