/**
 * Auth Hook - Microsoft OAuth (Placeholder)
 * Will handle Microsoft sign-in when implemented
 */

import { Alert } from 'react-native';

export function useMicrosoftAuth() {
    const signInWithMicrosoft = () => {
        Alert.alert('Coming Soon', 'Microsoft login will be available soon.');
        return { success: false, notImplemented: true };
    };

    return {
        signInWithMicrosoft,
        isLoading: false,
    };
}
