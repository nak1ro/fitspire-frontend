/**
 * Flow Design System - Border Radius Tokens
 */

export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    full: 9999,
} as const;

export type RadiusKey = keyof typeof radius;
