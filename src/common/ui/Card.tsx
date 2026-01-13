/**
 * Flow Design System - Card Component
 * Themed card with optional glassmorphism
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

type CardVariant = 'solid' | 'glass';

export interface CardProps {
    variant?: CardVariant;
    children: React.ReactNode;
    style?: ViewStyle;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
    variant = 'solid',
    children,
    style,
    padding = 'md',
}: CardProps) {
    const theme = useTheme();

    const paddingValues = {
        none: 0,
        sm: theme.spacing[3],
        md: theme.spacing[5],
        lg: theme.spacing[6],
    };

    const baseStyle: ViewStyle = {
        borderRadius: theme.radius.lg,
        padding: paddingValues[padding],
        ...theme.shadows.md,
    };

    const variantStyles: Record<CardVariant, ViewStyle> = {
        solid: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        glass: {
            backgroundColor: theme.glass.light.background,
            borderWidth: 1,
            borderColor: theme.glass.light.border,
        },
    };

    return (
        <View style={[baseStyle, variantStyles[variant], style]}>
            {children}
        </View>
    );
}
