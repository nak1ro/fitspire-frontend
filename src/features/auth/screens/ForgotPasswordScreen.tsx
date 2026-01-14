/**
 * Auth Feature - ForgotPasswordScreen
 * Password reset request form
 */

import React from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '@/common/ui';
import { useTheme } from '@/common/hooks';
import { AuthStackParamList } from '@/common/types';
import { AuthLayout, AuthFooter, FormInput } from '../components';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../utils/validation';
import { useForgotPasswordFlow } from '../hooks';

export function ForgotPasswordScreen() {
    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    // Auth hook - all logic is encapsulated here
    const { requestPasswordReset, isLoading, emailSent, sentEmail } = useForgotPasswordFlow();

    const { control, handleSubmit } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    // Success state
    if (emailSent) {
        return (
            <AuthLayout
                state="success"
                successTitle="Check Your Email"
                successMessage={`We sent a password reset link to ${sentEmail}`}
                successButtonTitle="Back to Sign In"
                onSuccessPress={() => navigation.navigate('Login')}
            />
        );
    }

    // Form state
    return (
        <AuthLayout
            title="Forgot Password?"
            subtitle="Enter your email and we'll send you a reset link"
        >
            <View style={{ gap: theme.spacing[4] }}>
                <FormInput
                    control={control}
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                />

                <Button
                    title="Send Reset Link"
                    variant="primary"
                    onPress={handleSubmit(requestPasswordReset)}
                    loading={isLoading}
                    fullWidth
                />
            </View>

            <AuthFooter
                text="Remember your password?"
                linkText="Sign In"
                onLinkPress={() => navigation.navigate('Login')}
            />
        </AuthLayout>
    );
}

export default ForgotPasswordScreen;
