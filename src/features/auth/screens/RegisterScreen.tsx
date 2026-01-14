/**
 * Auth Feature - RegisterScreen
 * Registration form with email, username, password
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
import { registerSchema, RegisterFormData } from '../utils/validation';
import { useEmailRegister, useGoogleAuth, useMicrosoftAuth } from '../hooks';

type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
};

export function RegisterScreen() {
    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    // Auth hooks - all logic is encapsulated here
    const { register, isLoading: isEmailLoading } = useEmailRegister();
    const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();
    const { signInWithMicrosoft } = useMicrosoftAuth();

    const isLoading = isEmailLoading || isGoogleLoading;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
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
                            editable={!isLoading}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="userName"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            label="Username"
                            placeholder="Choose a username"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.userName?.message}
                            autoCapitalize="none"
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
                            placeholder="Create a password"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.password?.message}
                            secureTextEntry
                            editable={!isLoading}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={errors.confirmPassword?.message}
                            secureTextEntry
                            editable={!isLoading}
                        />
                    )}
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
