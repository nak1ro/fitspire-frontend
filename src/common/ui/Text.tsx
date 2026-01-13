/**
 * Flow Design System - Text Component
 * Themed text with variant support
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

type TextVariant = 'body' | 'caption' | 'label' | 'heading' | 'title' | 'hero';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextColor = 'primary' | 'secondary' | 'inverse' | 'accent' | 'error' | 'success';

export interface TextProps extends RNTextProps {
    variant?: TextVariant;
    weight?: TextWeight;
    color?: TextColor;
    children: React.ReactNode;
}

export function Text({
    variant = 'body',
    weight = 'normal',
    color = 'primary',
    style,
    children,
    ...props
}: TextProps) {
    const theme = useTheme();

    const variantStyles = {
        caption: { fontSize: theme.typography.fontSize.xs },
        label: { fontSize: theme.typography.fontSize.sm },
        body: { fontSize: theme.typography.fontSize.base },
        heading: { fontSize: theme.typography.fontSize.xl },
        title: { fontSize: theme.typography.fontSize['2xl'] },
        hero: { fontSize: theme.typography.fontSize['4xl'] },
    };

    const weightStyles = {
        normal: { fontWeight: theme.typography.fontWeight.normal },
        medium: { fontWeight: theme.typography.fontWeight.medium },
        semibold: { fontWeight: theme.typography.fontWeight.semibold },
        bold: { fontWeight: theme.typography.fontWeight.bold },
    };

    const colorStyles = {
        primary: { color: theme.colors.text.primary },
        secondary: { color: theme.colors.text.secondary },
        inverse: { color: theme.colors.text.inverse },
        accent: { color: theme.colors.primary[500] },
        error: { color: theme.colors.error },
        success: { color: theme.colors.success },
    };

    return (
        <RNText
            style={[
                variantStyles[variant],
                weightStyles[weight],
                colorStyles[color],
                style,
            ]}
            {...props}
        >
            {children}
        </RNText>
    );
}
