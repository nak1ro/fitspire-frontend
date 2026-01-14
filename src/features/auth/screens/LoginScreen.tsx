/**
 * Auth Feature - LoginScreen
 * Login form with email/password and social auth
 */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, Text } from '@/common/ui';
import { useTheme } from '@/common/hooks';
import { AuthStackParamList } from '@/common/types';
import { AuthLayout, AuthDivider, SocialLoginButtons, AuthFooter, FormInput } from '../components';
import { loginSchema, LoginFormData } from '../utils/validation';
import { useEmailLogin, useGoogleAuth, useMicrosoftAuth } from '../hooks';

export function LoginScreen() {
    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    // Auth hooks - all logic is encapsulated here
    const { login, isLoading: isEmailLoading } = useEmailLogin();
    const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();
    const { signInWithMicrosoft } = useMicrosoftAuth();

    const isLoading = isEmailLoading || isGoogleLoading;

    const { control, handleSubmit } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            login: '',
            password: '',
        },
    });

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to continue your fitness journey"
        >
            <View style={{ gap: theme.spacing[4] }}>
                <FormInput
                    control={control}
                    name="login"
                    label="Email or Username"
                    placeholder="Enter your email or username"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                />

                <FormInput
                    control={control}
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    secureTextEntry
                    editable={!isLoading}
                />

                <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={{ alignSelf: 'flex-end', marginTop: -theme.spacing[2] }}
                    activeOpacity={0.7}
                >
                    <Text variant="caption" style={{ color: theme.colors.primary[500] }}>
                        Forgot Password?
                    </Text>
                </TouchableOpacity>

                <Button
                    title="Sign In"
                    variant="primary"
                    onPress={handleSubmit(login)}
                    loading={isEmailLoading}
                    disabled={isLoading}
                    fullWidth
                />
            </View>

            <AuthDivider />

            <SocialLoginButtons
                onGooglePress={signInWithGoogle}
                onMicrosoftPress={signInWithMicrosoft}
                isGoogleLoading={isGoogleLoading}
                disabled={isLoading}
            />

            <AuthFooter
                text="Don't have an account?"
                linkText="Sign Up"
                onLinkPress={() => navigation.navigate('Register')}
            />
        </AuthLayout>
    );
}

export default LoginScreen;
