/**
 * Auth Hook - Google OAuth
 * Handles Google sign-in flow
 */

import { Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useGoogleLogin as useGoogleLoginMutation } from '../api/mutations';
import { useAuthStore } from './useAuthStore';

export function useGoogleAuth() {
    const { setAuth } = useAuthStore();
    const mutation = useGoogleLoginMutation();

    const signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const idToken = (userInfo as any)?.idToken;

            if (!idToken) {
                throw new Error('Google ID token is missing');
            }

            const response = await mutation.mutateAsync(idToken);
            setAuth(response.token, response.user);
            return { success: true };
        } catch (error: any) {
            if (error?.code !== 'SIGN_IN_CANCELLED') {
                Alert.alert('Google Sign-In Failed', error?.message || 'Please try again.');
            }
            return { success: false, cancelled: error?.code === 'SIGN_IN_CANCELLED' };
        }
    };

    return {
        signInWithGoogle,
        isLoading: mutation.isPending,
    };
}
