import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../api/client';
import { ForgotPasswordRequest } from '../types';

export function useForgotPassword(onSuccess?: () => void) {
    return useMutation({
        mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
        onSuccess,
    });
}
