/**
 * Flow Design System - Avatar Component
 * User avatar with size variants and fallback
 */

import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Text } from './Text';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps {
    source?: string | null;
    name?: string;
    size?: AvatarSize;
    style?: ViewStyle;
}

export function Avatar({
    source,
    name = '',
    size = 'md',
    style,
}: AvatarProps) {
    const theme = useTheme();

    const sizeValues: Record<AvatarSize, number> = {
        xs: 24,
        sm: 32,
        md: 48,
        lg: 64,
        xl: 96,
        '2xl': 128,
    };

    const fontSizes: Record<AvatarSize, 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'> = {
        xs: 'xs',
        sm: 'xs',
        md: 'sm',
        lg: 'base',
        xl: 'xl',
        '2xl': '2xl',
    };

    const dimension = sizeValues[size];

    const getInitials = (fullName: string): string => {
        const parts = fullName.trim().split(' ');
        if (parts.length === 0) return '?';
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const containerStyle: ViewStyle = {
        width: dimension,
        height: dimension,
        borderRadius: dimension / 2,
        borderWidth: 1,
        borderColor: theme.glass.light.border,
        overflow: 'hidden',
    };

    if (source) {
        return (
            <View style={[containerStyle, style]}>
                <Image
                    source={{ uri: source }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
        );
    }

    return (
        <View
            style={[
                containerStyle,
                {
                    backgroundColor: theme.colors.primary[500],
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                style,
            ]}
        >
            <Text
                variant={fontSizes[size] as any}
                weight="semibold"
                color="inverse"
            >
                {getInitials(name)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%',
    },
});
