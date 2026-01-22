import { useMutation } from '@tanstack/react-query';
import { signUp } from '../api/client';
import { SignUpRequest } from '../types';

export function useEmailSignUp(onSuccess?: () => void) {
    return useMutation({
        mutationFn: (data: SignUpRequest) => signUp(data),
        onSuccess,
    });
}
