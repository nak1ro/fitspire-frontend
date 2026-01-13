/**
 * Flow Design System - Icon Size Tokens
 */

export const iconSizes = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
} as const;

export type IconSize = keyof typeof iconSizes;
