import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../api/client';
import { ResetPasswordRequest } from '../types';

export function useResetPassword(onSuccess?: () => void) {
    return useMutation({
        mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
        onSuccess,
    });
}
