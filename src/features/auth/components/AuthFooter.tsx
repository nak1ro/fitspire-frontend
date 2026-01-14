/**
 * Auth Feature - AuthFooter Component
 * Links for navigation between auth screens
 */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/common/ui';
import { useTheme } from '@/common/hooks';

interface AuthFooterProps {
    text: string;
    linkText: string;
    onLinkPress: () => void;
}

export function AuthFooter({ text, linkText, onLinkPress }: AuthFooterProps) {
    const theme = useTheme();

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: theme.spacing[6],
            }}
        >
            <Text variant="body" color="secondary">
                {text}{' '}
            </Text>
            <TouchableOpacity onPress={onLinkPress} activeOpacity={0.7}>
                <Text
                    variant="body"
                    weight="semibold"
                    style={{ color: theme.colors.primary[500] }}
                >
                    {linkText}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
