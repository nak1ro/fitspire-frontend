/**
 * Flow Design System - Button Component
 * Themed button with variants and gradient support
 */

import React from 'react';
import {
    Pressable,
    ActivityIndicator,
    ViewStyle,
    StyleSheet,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Text } from './Text';
import LinearGradient from 'react-native-linear-gradient';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
    title: string;
    onPress?: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
}: ButtonProps) {
    const theme = useTheme();

    const sizeStyles = {
        sm: {
            paddingVertical: theme.spacing[2],
            paddingHorizontal: theme.spacing[3],
            minHeight: 36,
        },
        md: {
            paddingVertical: theme.spacing[3],
            paddingHorizontal: theme.spacing[4],
            minHeight: 44,
        },
        lg: {
            paddingVertical: theme.spacing[4],
            paddingHorizontal: theme.spacing[6],
            minHeight: 52,
        },
    };

    const textVariant = size === 'sm' ? 'label' : 'body';

    const baseStyle: ViewStyle = {
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        ...(fullWidth && { width: '100%' }),
        ...sizeStyles[size],
    };

    const variantStyles: Record<ButtonVariant, ViewStyle> = {
        primary: {
            backgroundColor: theme.colors.primary[500],
        },
        secondary: {
            backgroundColor: theme.colors.surfaceGlass,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        ghost: {
            backgroundColor: 'transparent',
        },
        danger: {
            backgroundColor: theme.colors.error,
        },
    };

    const textColors: Record<ButtonVariant, 'inverse' | 'primary' | 'accent'> = {
        primary: 'inverse',
        secondary: 'primary',
        ghost: 'accent',
        danger: 'inverse',
    };

    const isDisabled = disabled || loading;

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => [
                baseStyle,
                variantStyles[variant],
                isDisabled && styles.disabled,
                pressed && styles.pressed,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'ghost' ? theme.colors.primary[500] : theme.colors.text.inverse}
                    size="small"
                />
            ) : (
                <Text
                    variant={textVariant}
                    weight="bold"
                    color={textColors[variant]}
                >
                    {title}
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    disabled: {
        opacity: 0.5,
    },
    pressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
});
