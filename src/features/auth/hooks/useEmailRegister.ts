/**
 * Auth Hook - Email/Password Registration
 * Handles registration flow
 */

import { Alert } from 'react-native';
import { useRegister as useRegisterMutation } from '../api/mutations';
import { useAuthStore } from './useAuthStore';
import { RegisterFormData } from '../utils/validation';

export function useEmailRegister() {
    const { setAuth } = useAuthStore();
    const mutation = useRegisterMutation();

    const register = async (data: RegisterFormData) => {
        try {
            const response = await mutation.mutateAsync({
                email: data.email,
                userName: data.userName,
                password: data.password,
            });
            setAuth(response.token, response.user);
            return { success: true };
        } catch (error: any) {
            Alert.alert(
                'Registration Failed',
                error?.response?.data?.message || 'Please try again.'
            );
            return { success: false };
        }
    };

    return {
        register,
        isLoading: mutation.isPending,
    };
}
