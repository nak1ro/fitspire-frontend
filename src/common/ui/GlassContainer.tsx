/**
 * Flow Design System - GlassContainer Component
 * Glassmorphism container with blur effect
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

type GlassIntensity = 'light' | 'medium' | 'heavy';

export interface GlassContainerProps {
    intensity?: GlassIntensity;
    children: React.ReactNode;
    style?: ViewStyle;
}

export function GlassContainer({
    intensity = 'light',
    children,
    style,
}: GlassContainerProps) {
    const theme = useTheme();

    const glassStyle = theme.glass[intensity];

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: glassStyle.background,
                    borderColor: glassStyle.border,
                    borderRadius: theme.radius.lg,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        overflow: 'hidden',
    },
});
