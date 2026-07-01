'use client';

import { useMutation } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { uploadMedia } from '../lib/uploadMedia';
import { UploadMediaInput } from '../types';

export function useUploadMedia() {
    const { accessToken } = useAuthSession();

    return useMutation({
        mutationFn: (input: UploadMediaInput) => uploadMedia(requireAccessToken(accessToken), input),
    });
}
