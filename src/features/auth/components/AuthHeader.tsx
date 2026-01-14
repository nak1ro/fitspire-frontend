/**
 * Auth Feature - AuthHeader Component
 * Logo and title for auth screens
 */

import React from 'react';
import { View } from 'react-native';
import { Text, Avatar } from '@/common/ui';
import { useTheme } from '@/common/hooks';

interface AuthHeaderProps {
    title: string;
    subtitle?: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
    const theme = useTheme();

    return (
        <View style={{ alignItems: 'center', marginBottom: theme.spacing[8] }}>
            {/* Logo using Avatar component */}
            <Avatar
                size="2xl"
                initials="F"
                style={{ marginBottom: theme.spacing[4] }}
            />

            <Text variant="title" weight="bold" style={{ marginBottom: theme.spacing[2] }}>
                {title}
            </Text>

            {subtitle && (
                <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
                    {subtitle}
                </Text>
            )}
        </View>
    );
}
