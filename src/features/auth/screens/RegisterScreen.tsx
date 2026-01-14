/**
 * Auth Feature - RegisterScreen
 * Registration form with email, username, password
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
import { AuthLayout, AuthDivider, SocialLoginButtons, AuthFooter, FormInput } from '../components';
import { registerSchema, RegisterFormData } from '../utils/validation';
import { useEmailRegister, useGoogleAuth, useMicrosoftAuth } from '../hooks';

export function RegisterScreen() {
    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    // Auth hooks - all logic is encapsulated here
    const { register, isLoading: isEmailLoading } = useEmailRegister();
    const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();
    const { signInWithMicrosoft } = useMicrosoftAuth();

    const isLoading = isEmailLoading || isGoogleLoading;

    const { control, handleSubmit } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            userName: '',
            password: '',
            confirmPassword: '',
        },
    });

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Start your fitness journey today"
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

                <FormInput
                    control={control}
                    name="userName"
                    label="Username"
                    placeholder="Choose a username"
                    autoCapitalize="none"
                    editable={!isLoading}
                />

                <FormInput
                    control={control}
                    name="password"
                    label="Password"
                    placeholder="Create a password"
                    secureTextEntry
                    editable={!isLoading}
                />

                <FormInput
                    control={control}
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    secureTextEntry
                    editable={!isLoading}
                />

                <Button
                    title="Create Account"
                    variant="primary"
                    onPress={handleSubmit(register)}
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
                text="Already have an account?"
                linkText="Sign In"
                onLinkPress={() => navigation.navigate('Login')}
            />
        </AuthLayout>
    );
}

export default RegisterScreen;
