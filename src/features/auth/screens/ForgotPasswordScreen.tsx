/**
 * Auth Feature - ForgotPasswordScreen
 * Password reset request form
 */

import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Input, Button, Text, GlassContainer } from '@/common/ui';
import { ScreenWrapper } from '@/common/layouts';
import { useTheme } from '@/common/hooks';
import { AuthHeader, AuthFooter } from '../components';
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

    const forgotPasswordMutation = useForgotPassword();

    const {
        control,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            await forgotPasswordMutation.mutateAsync(data);
            setEmailSent(true);
        } catch (error: any) {
            Alert.alert(
                'Request Failed',
                error?.response?.data?.message || 'Please try again.'
            );
        }
    };

    if (emailSent) {
        return (
            <ScreenWrapper gradient>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        padding: theme.spacing[6],
                    }}
                >
                    <AuthHeader
                        title="Check Your Email"
                        subtitle={`We sent a password reset link to ${getValues('email')}`}
                    />

                    <GlassContainer intensity="medium" style={{ padding: theme.spacing[6] }}>
                        <Text variant="body" color="secondary" style={{ textAlign: 'center', marginBottom: theme.spacing[4] }}>
                            Didn't receive the email? Check your spam folder or try again.
                        </Text>

                        <Button
                            title="Back to Sign In"
                            variant="primary"
                            onPress={() => navigation.navigate('Login')}
                            fullWidth
                        />
                    </GlassContainer>
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper gradient>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        padding: theme.spacing[6],
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <AuthHeader
                        title="Forgot Password?"
                        subtitle="Enter your email and we'll send you a reset link"
                    />

                    <GlassContainer intensity="medium" style={{ padding: theme.spacing[6] }}>
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
                    </GlassContainer>

                    <AuthFooter
                        text="Remember your password?"
                        linkText="Sign In"
                        onLinkPress={() => navigation.navigate('Login')}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

export default ForgotPasswordScreen;
