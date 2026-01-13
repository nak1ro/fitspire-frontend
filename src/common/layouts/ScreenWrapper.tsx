/**
 * Flow Design System - ScreenWrapper Layout
 * Gradient background with safe area support
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import LinearGradient from 'react-native-linear-gradient';

export interface ScreenWrapperProps {
    children: React.ReactNode;
    gradient?: boolean;
    style?: ViewStyle;
}

export function ScreenWrapper({
    children,
    gradient = true,
    style,
}: ScreenWrapperProps) {
    const theme = useTheme();

    const gradientColors = [
        theme.colors.primary[700],
        theme.colors.primary[500],
    ];

    const content = (
        <SafeAreaView style={[styles.container, style]}>
            {children}
        </SafeAreaView>
    );

    if (gradient) {
        return (
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {content}
            </LinearGradient>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
});
