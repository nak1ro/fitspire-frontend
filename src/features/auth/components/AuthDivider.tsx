/**
 * Auth Feature - AuthDivider Component
 * "or continue with" divider
 */

import React from 'react';
import { View } from 'react-native';
import { Text } from '@/common/ui';
import { useTheme } from '@/common/hooks';

interface AuthDividerProps {
    text?: string;
}

export function AuthDivider({ text = 'or continue with' }: AuthDividerProps) {
    const theme = useTheme();

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: theme.spacing[6],
            }}
        >
            <View
                style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: theme.colors.border,
                }}
            />
            <Text
                variant="caption"
                color="secondary"
                style={{ marginHorizontal: theme.spacing[4] }}
            >
                {text}
            </Text>
            <View
                style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: theme.colors.border,
                }}
            />
        </View>
    );
}
