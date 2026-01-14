/**
 * Auth Feature - VerifyEmailScreen
 * Email verification result screen
 */

import React, { useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthLayout } from '../components';
import { useVerifyEmail } from '../api/mutations';

type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    VerifyEmail: { token: string };
};

export function VerifyEmailScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const route = useRoute<RouteProp<AuthStackParamList, 'VerifyEmail'>>();
    const token = route.params?.token;

    const verifyMutation = useVerifyEmail();

    useEffect(() => {
        if (token) {
            verifyMutation.mutate({ token });
        }
    }, [token]);

    // Determine state
    const getState = () => {
        if (!token) return 'error';
        if (verifyMutation.isPending) return 'loading';
        if (verifyMutation.isSuccess) return 'success';
        if (verifyMutation.isError) return 'error';
        return 'loading';
    };

    const state = getState();

    return (
        <AuthLayout
            state={state}
            enableKeyboardAvoid={false}
            enableScroll={false}
            // Loading
            loadingMessage="Verifying your email..."
            // Success
            successTitle="Email Verified!"
            successMessage="Your email has been successfully verified. You can now sign in to your account."
            successButtonTitle="Sign In"
            onSuccessPress={() => navigation.navigate('Login')}
            // Error
            errorTitle={!token ? 'Invalid Link' : 'Verification Failed'}
            errorMessage={
                !token
                    ? 'No verification token was provided.'
                    : 'The verification link is invalid or has expired. Please request a new verification email from your account settings.'
            }
            errorButtonTitle="Back to Sign In"
            onErrorPress={() => navigation.navigate('Login')}
        />
    );
}

export default VerifyEmailScreen;
