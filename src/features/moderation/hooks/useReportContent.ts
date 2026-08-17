'use client';

import { useMutation } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { createModerationReport } from '../api/client';
import type { CreateModerationReportRequest } from '../types';

export function useReportContent() {
    const { accessToken } = useAuthSession();

    return useMutation({
        mutationFn: (data: CreateModerationReportRequest) =>
            createModerationReport(requireAccessToken(accessToken), data),
    });
}
