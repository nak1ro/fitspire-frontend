/**
 * Flow Design System - Animation Tokens
 */

export const animations = {
    duration: {
        fast: 150,
        normal: 250,
        slow: 400,
        slower: 600,
    },
    easing: {
        smooth: [0.4, 0, 0.2, 1] as const, // cubic-bezier
        bounce: [0.34, 1.56, 0.64, 1] as const,
    },
} as const;

export type DurationKey = keyof typeof animations.duration;
