import { useMutation } from '@tanstack/react-query';
import { useAuthSession } from './useAuthSession';
import { requireAccessToken } from '../lib/requireAccessToken';
import { changePassword } from '../api/client';
import { ChangePasswordRequest } from '../types';

export function useChangePassword() {
    const { accessToken } = useAuthSession();

    return useMutation({
        mutationFn: (data: ChangePasswordRequest) => changePassword(requireAccessToken(accessToken), data),
    });
}
