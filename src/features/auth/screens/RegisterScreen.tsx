/**
 * Auth Feature - RegisterScreen
 * Registration form with email, username, password
 */

import React from 'react';
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
import { registerSchema, RegisterFormData } from '../utils/validation';
import { useRegister, useGoogleLogin } from '../api/mutations';
import { useAuthStore } from '../hooks';

type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
};

export function RegisterScreen() {
    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const { setAuth } = useAuthStore();

    const registerMutation = useRegister();
    const googleMutation = useGoogleLogin();

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

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await registerMutation.mutateAsync({
                email: data.email,
                userName: data.userName,
                password: data.password,
            });
            setAuth(response.token, response.user);
        } catch (error: any) {
            Alert.alert(
                'Registration Failed',
                error?.response?.data?.message || 'Please try again.'
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

    const isLoading = registerMutation.isPending || googleMutation.isPending;

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
                        title="Create Account"
                        subtitle="Start your fitness journey today"
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
                                onPress={handleSubmit(onSubmit)}
                                loading={registerMutation.isPending}
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
                        text="Already have an account?"
                        linkText="Sign In"
                        onLinkPress={() => navigation.navigate('Login')}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

export default RegisterScreen;
