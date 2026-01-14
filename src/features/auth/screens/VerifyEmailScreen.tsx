/**
 * Auth Feature - VerifyEmailScreen
 * Email verification result screen
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, Text, GlassContainer } from '@/common/ui';
import { ScreenWrapper } from '@/common/layouts';
import { useTheme } from '@/common/hooks';
import { AuthHeader } from '../components';
import { useVerifyEmail } from '../api/mutations';

type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    VerifyEmail: { token: string };
};

export function VerifyEmailScreen() {
    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const route = useRoute<RouteProp<AuthStackParamList, 'VerifyEmail'>>();
    const token = route.params?.token;

    const verifyMutation = useVerifyEmail();

    useEffect(() => {
        if (token) {
            verifyMutation.mutate({ token });
        }
    }, [token]);

    const renderContent = () => {
        if (verifyMutation.isPending) {
            return (
                <GlassContainer intensity="medium" style={{ padding: theme.spacing[8], alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={theme.colors.primary[500]} />
                    <Text variant="body" color="secondary" style={{ marginTop: theme.spacing[4] }}>
                        Verifying your email...
                    </Text>
                </GlassContainer>
            );
        }

        if (verifyMutation.isError) {
            return (
                <>
                    <AuthHeader
                        title="Verification Failed"
                        subtitle="The verification link is invalid or has expired"
                    />
                    <GlassContainer intensity="medium" style={{ padding: theme.spacing[6] }}>
                        <Text variant="body" color="secondary" style={{ textAlign: 'center', marginBottom: theme.spacing[4] }}>
                            Please request a new verification email from your account settings.
                        </Text>
                        <Button
                            title="Back to Sign In"
                            variant="primary"
                            onPress={() => navigation.navigate('Login')}
                            fullWidth
                        />
                    </GlassContainer>
                </>
            );
        }

        if (verifyMutation.isSuccess) {
            return (
                <>
                    <AuthHeader
                        title="Email Verified!"
                        subtitle="Your email has been successfully verified"
                    />
                    <GlassContainer intensity="medium" style={{ padding: theme.spacing[6] }}>
                        <Text variant="body" color="secondary" style={{ textAlign: 'center', marginBottom: theme.spacing[4] }}>
                            You can now sign in to your account.
                        </Text>
                        <Button
                            title="Sign In"
                            variant="primary"
                            onPress={() => navigation.navigate('Login')}
                            fullWidth
                        />
                    </GlassContainer>
                </>
            );
        }

        // No token provided
        return (
            <>
                <AuthHeader
                    title="Invalid Link"
                    subtitle="No verification token was provided"
                />
                <GlassContainer intensity="medium" style={{ padding: theme.spacing[6] }}>
                    <Button
                        title="Back to Sign In"
                        variant="primary"
                        onPress={() => navigation.navigate('Login')}
                        fullWidth
                    />
                </GlassContainer>
            </>
        );
    };

    return (
        <ScreenWrapper gradient>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    padding: theme.spacing[6],
                }}
            >
                {renderContent()}
            </View>
        </ScreenWrapper>
    );
}

export default VerifyEmailScreen;
