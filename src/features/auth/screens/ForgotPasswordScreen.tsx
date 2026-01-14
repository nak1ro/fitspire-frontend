/**
 * Auth Feature - ForgotPasswordScreen
 * Password reset request form
 */

import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Input, Button } from '@/common/ui';
import { useTheme } from '@/common/hooks';
import { AuthLayout, AuthFooter } from '../components';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../utils/validation';
import { useForgotPassword } from '../api/mutations';

type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
};

export function ForgotPasswordScreen() {
    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [emailSent, setEmailSent] = useState(false);
    const [sentEmail, setSentEmail] = useState('');

    const forgotPasswordMutation = useForgotPassword();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            await forgotPasswordMutation.mutateAsync(data);
            setSentEmail(data.email);
            setEmailSent(true);
        } catch (error: any) {
            Alert.alert(
                'Request Failed',
                error?.response?.data?.message || 'Please try again.'
            );
        }
    };

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
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.email?.message}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            editable={!forgotPasswordMutation.isPending}
                        />
                    )}
                />

                <Button
                    title="Send Reset Link"
                    variant="primary"
                    onPress={handleSubmit(onSubmit)}
                    loading={forgotPasswordMutation.isPending}
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
