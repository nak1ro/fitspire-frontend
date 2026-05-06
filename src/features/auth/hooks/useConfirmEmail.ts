import { useMutation } from '@tanstack/react-query';
import { verifyEmail } from '../api/client';
import { ConfirmEmailRequest } from '../types';

export function useConfirmEmail(onSuccess?: () => void) {
    return useMutation({
        mutationFn: (data: ConfirmEmailRequest) => verifyEmail(data),
        onSuccess,
    });
}
