/**
 * Auth Hook - Email/Password Login
 * Handles email login flow
 */

import { Alert } from 'react-native';
import { useLogin as useLoginMutation } from '../api/mutations';
import { useAuthStore } from './useAuthStore';
import { LoginFormData } from '../utils/validation';

export function useEmailLogin() {
    const { setAuth } = useAuthStore();
    const mutation = useLoginMutation();

    const login = async (data: LoginFormData) => {
        try {
            const response = await mutation.mutateAsync(data);
            setAuth(response.token, response.user);
            return { success: true };
        } catch (error: any) {
            Alert.alert(
                'Login Failed',
                error?.response?.data?.message || 'Please check your credentials and try again.'
            );
            return { success: false };
        }
    };

    return {
        login,
        isLoading: mutation.isPending,
    };
}
