/**
 * Auth Feature - useForgotPassword Hook
 * Handles password reset request flow
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import { useForgotPassword as useForgotPasswordMutation } from '../api/mutations';
import { ForgotPasswordFormData } from '../utils/validation';

export function useForgotPasswordFlow() {
    const [emailSent, setEmailSent] = useState(false);
    const [sentEmail, setSentEmail] = useState('');
    const mutation = useForgotPasswordMutation();

    const requestPasswordReset = async (data: ForgotPasswordFormData) => {
        try {
            await mutation.mutateAsync(data);
            setSentEmail(data.email);
            setEmailSent(true);
            return { success: true };
        } catch (error: any) {
            Alert.alert(
                'Request Failed',
                error?.response?.data?.message || 'Please try again.'
            );
            return { success: false };
        }
    };

    return {
        requestPasswordReset,
        isLoading: mutation.isPending,
        emailSent,
        sentEmail,
    };
}
