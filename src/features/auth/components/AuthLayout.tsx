/**
 * Auth Feature - AuthLayout Component
 * Consistent layout wrapper for all auth screens with state handling
 */

import React, { ReactNode } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { ScreenWrapper } from '@/common/layouts';
import { Text, Button, GlassContainer } from '@/common/ui';
import { useTheme } from '@/common/hooks';
import { AuthHeader } from './AuthHeader';

type LayoutState = 'form' | 'loading' | 'success' | 'error';

interface AuthLayoutProps {
    children?: ReactNode;
    state?: LayoutState;

    // Loading state
    loadingMessage?: string;

    // Success state
    successTitle?: string;
    successMessage?: string;
    successButtonTitle?: string;
    onSuccessPress?: () => void;

    // Error state
    errorTitle?: string;
    errorMessage?: string;
    errorButtonTitle?: string;
    onErrorPress?: () => void;

    // Form header (shown in form state)
    title?: string;
    subtitle?: string;

    // Keyboard handling
    enableKeyboardAvoid?: boolean;
    enableScroll?: boolean;
}

export function AuthLayout({
    children,
    state = 'form',
    loadingMessage = 'Loading...',
    successTitle = 'Success',
    successMessage,
    successButtonTitle = 'Continue',
    onSuccessPress,
    errorTitle = 'Error',
    errorMessage,
    errorButtonTitle = 'Try Again',
    onErrorPress,
    title,
    subtitle,
    enableKeyboardAvoid = true,
    enableScroll = true,
}: AuthLayoutProps) {
    const theme = useTheme();

    const containerStyle = {
        flexGrow: 1,
        justifyContent: 'center' as const,
        padding: theme.spacing[6],
    };

    const renderContent = () => {
        switch (state) {
            case 'loading':
                return (
                    <GlassContainer intensity="medium" style={{ padding: theme.spacing[8], alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
                        <Text variant="body" color="secondary" style={{ marginTop: theme.spacing[4] }}>
                            {loadingMessage}
                        </Text>
                    </GlassContainer>
                );

            case 'success':
                return (
                    <>
                        <AuthHeader title={successTitle} subtitle={successMessage} />
                        <GlassContainer intensity="medium" style={{ padding: theme.spacing[6] }}>
                            {onSuccessPress && (
                                <Button
                                    title={successButtonTitle}
                                    variant="primary"
                                    onPress={onSuccessPress}
                                    fullWidth
                                />
                            )}
                        </GlassContainer>
                    </>
                );

            case 'error':
                return (
                    <>
                        <AuthHeader title={errorTitle} subtitle={errorMessage} />
                        <GlassContainer intensity="medium" style={{ padding: theme.spacing[6] }}>
                            {onErrorPress && (
                                <Button
                                    title={errorButtonTitle}
                                    variant="primary"
                                    onPress={onErrorPress}
                                    fullWidth
                                />
                            )}
                        </GlassContainer>
                    </>
                );

            case 'form':
            default:
                return (
                    <>
                        {(title || subtitle) && <AuthHeader title={title ?? ''} subtitle={subtitle} />}
                        <GlassContainer intensity="medium" style={{ padding: theme.spacing[6] }}>
                            {children}
                        </GlassContainer>
                    </>
                );
        }
    };

    const content = (
        <View style={containerStyle}>
            {renderContent()}
        </View>
    );

    return (
        <ScreenWrapper gradient>
            {enableKeyboardAvoid ? (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    {enableScroll ? (
                        <ScrollView
                            contentContainerStyle={containerStyle}
                            keyboardShouldPersistTaps="handled"
                        >
                            {renderContent()}
                        </ScrollView>
                    ) : (
                        content
                    )}
                </KeyboardAvoidingView>
            ) : enableScroll ? (
                <ScrollView
                    contentContainerStyle={containerStyle}
                    keyboardShouldPersistTaps="handled"
                >
                    {renderContent()}
                </ScrollView>
            ) : (
                content
            )}
        </ScreenWrapper>
    );
}
