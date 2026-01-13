/**
 * Flow Design System - Input Component
 * Themed text input with label and error support
 */

import React, { useState } from 'react';
import {
    View,
    TextInput,
    TextInputProps,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Text } from './Text';

export interface InputProps extends Omit<TextInputProps, 'style'> {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
}

export function Input({
    label,
    error,
    containerStyle,
    ...props
}: InputProps) {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const inputStyle = {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: error
            ? theme.colors.error
            : isFocused
                ? theme.colors.primary[500]
                : theme.colors.border,
        borderRadius: theme.radius.md,
        paddingVertical: theme.spacing[3],
        paddingHorizontal: theme.spacing[4],
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.text.primary,
        minHeight: 48,
    };

    return (
        <View style={containerStyle}>
            {label && (
                <Text
                    variant="label"
                    weight="medium"
                    color="secondary"
                    style={{ marginBottom: theme.spacing[2] }}
                >
                    {label}
                </Text>
            )}
            <TextInput
                style={inputStyle}
                placeholderTextColor={theme.colors.text.secondary}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
            {error && (
                <Text
                    variant="caption"
                    color="error"
                    style={{ marginTop: theme.spacing[1] }}
                >
                    {error}
                </Text>
            )}
        </View>
    );
}
