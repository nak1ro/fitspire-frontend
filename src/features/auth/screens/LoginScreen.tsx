/**
 * Auth Feature - LoginScreen
 * Login form with email/password and social auth
 */

import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { Input, Button, GlassContainer } from '@/common/ui';
import { ScreenWrapper } from '@/common/layouts';
import { useTheme } from '@/common/hooks';
import { AuthHeader, AuthDivider, SocialLoginButtons, AuthFooter } from '../components';
import { loginSchema, LoginFormData } from '../utils/validation';
import { useLogin, useGoogleLogin } from '../api/mutations';
import { useAuthStore } from '../hooks';

type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
};

export function LoginScreen() {
    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const { setAuth } = useAuthStore();

    const loginMutation = useLogin();
    const googleMutation = useGoogleLogin();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            login: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await loginMutation.mutateAsync(data);
            setAuth(response.token, response.user);
        } catch (error: any) {
            Alert.alert(
                'Login Failed',
                error?.response?.data?.message || 'Please check your credentials and try again.'
            );
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const idToken = (userInfo as any)?.idToken;

            if (!idToken) {
                throw new Error('Google ID token is missing');
            }

            const response = await googleMutation.mutateAsync(idToken);
            setAuth(response.token, response.user);
        } catch (error: any) {
            if (error?.code !== 'SIGN_IN_CANCELLED') {
                Alert.alert('Google Sign-In Failed', error?.message || 'Please try again.');
            }
        }
    };

    const handleMicrosoftLogin = () => {
        Alert.alert('Coming Soon', 'Microsoft login will be available soon.');
    };

    const isLoading = loginMutation.isPending || googleMutation.isPending;

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
                        title="Welcome Back"
                        subtitle="Sign in to continue your fitness journey"
                    />

                    <GlassContainer intensity="medium" style={{ padding: theme.spacing[6] }}>
                        <View style={{ gap: theme.spacing[4] }}>
                            <Controller
                                control={control}
                                name="login"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        label="Email or Username"
                                        placeholder="Enter your email or username"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        error={errors.login?.message}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        editable={!isLoading}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        label="Password"
                                        placeholder="Enter your password"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        error={errors.password?.message}
                                        secureTextEntry
                                        editable={!isLoading}
                                    />
                                )}
                            />

                            <Button
                                title="Sign In"
                                variant="primary"
                                onPress={handleSubmit(onSubmit)}
                                loading={loginMutation.isPending}
                                disabled={isLoading}
                                fullWidth
                            />
                        </View>

                        <AuthDivider />

                        <SocialLoginButtons
                            onGooglePress={handleGoogleLogin}
                            onMicrosoftPress={handleMicrosoftLogin}
                            isGoogleLoading={googleMutation.isPending}
                            disabled={isLoading}
                        />
                    </GlassContainer>

                    <AuthFooter
                        text="Don't have an account?"
                        linkText="Sign Up"
                        onLinkPress={() => navigation.navigate('Register')}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

export default LoginScreen;
