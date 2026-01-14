/**
 * Auth Feature - SocialLoginButtons Component
 * Google and Microsoft OAuth buttons - uses Button from common/ui
 */

import React from 'react';
import { View } from 'react-native';
import { Button } from '@/common/ui';
import { useTheme } from '@/common/hooks';

interface SocialLoginButtonsProps {
    onGooglePress: () => void;
    onMicrosoftPress?: () => void;
    isGoogleLoading?: boolean;
    isMicrosoftLoading?: boolean;
    disabled?: boolean;
}

export function SocialLoginButtons({
    onGooglePress,
    onMicrosoftPress,
    isGoogleLoading,
    isMicrosoftLoading,
    disabled,
}: SocialLoginButtonsProps) {
    const theme = useTheme();

    return (
        <View style={{ gap: theme.spacing[3] }}>
            {/* Google Button */}
            <Button
                title="Continue with Google"
                variant="secondary"
                onPress={onGooglePress}
                loading={isGoogleLoading}
                disabled={disabled}
                fullWidth
            />

            {/* Microsoft Button (placeholder) */}
            {onMicrosoftPress && (
                <Button
                    title="Continue with Microsoft (Coming Soon)"
                    variant="ghost"
                    onPress={onMicrosoftPress}
                    loading={isMicrosoftLoading}
                    disabled={true}
                    fullWidth
                />
            )}
        </View>
    );
}
