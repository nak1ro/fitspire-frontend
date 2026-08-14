'use client';

import { useMutation } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { abortMediaUpload } from '../api/client';

export function useAbortMediaUpload() {
    const { accessToken } = useAuthSession();

    return useMutation({
        mutationFn: (mediaAssetId: string) => abortMediaUpload(requireAccessToken(accessToken), mediaAssetId),
    });
}
