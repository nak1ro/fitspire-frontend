/**
 * Auth Feature - LoginScreen
 * Login form with email/password and social auth
 */

import React from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Input, Button } from '@/common/ui';
import { useTheme } from '@/common/hooks';
import { AuthLayout, AuthDivider, SocialLoginButtons, AuthFooter } from '../components';
import { loginSchema, LoginFormData } from '../utils/validation';
import { useEmailLogin, useGoogleAuth, useMicrosoftAuth } from '../hooks';

type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
};

export function LoginScreen() {
    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    // Auth hooks - all logic is encapsulated here
    const { login, isLoading: isEmailLoading } = useEmailLogin();
    const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();
    const { signInWithMicrosoft } = useMicrosoftAuth();

    const isLoading = isEmailLoading || isGoogleLoading;

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

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to continue your fitness journey"
        >
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
