'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { socialQueryKeys } from '@/features/social/hooks/queryKeys';
import {
    getAdminAccess,
    getAdminModerationReport,
    getAdminModerationReports,
    getAdminModerationSummary,
    resolveModerationReport,
    restoreModerationTarget,
    unsuspendModerationUser,
} from '../api/client';
import type { AdminModerationReportFilter, ResolveModerationReportRequest } from '../types';
import { moderationQueryKeys } from './queryKeys';

function useAdminModerationInvalidation() {
    const queryClient = useQueryClient();

    return async (reportId: string, refreshSocial: boolean) => {
        const invalidations = [
            queryClient.invalidateQueries({ queryKey: moderationQueryKeys.admin() }),
            queryClient.invalidateQueries({ queryKey: moderationQueryKeys.adminReport(reportId) }),
        ];

        if (refreshSocial) {
            invalidations.push(queryClient.invalidateQueries({ queryKey: socialQueryKeys.all }));
        }

        await Promise.all(invalidations);
    };
}

export function useAdminAccess() {
    const { accessToken, isAdmin } = useAuthSession();

    return useQuery({
        queryKey: moderationQueryKeys.adminAccess(),
        queryFn: () => getAdminAccess(requireAccessToken(accessToken)),
        enabled: Boolean(accessToken && isAdmin),
    });
}

export function useAdminModerationSummary() {
    const { accessToken, isAdmin } = useAuthSession();

    return useQuery({
        queryKey: moderationQueryKeys.adminSummary(),
        queryFn: () => getAdminModerationSummary(requireAccessToken(accessToken)),
        enabled: Boolean(accessToken && isAdmin),
    });
}

export function useAdminModerationReports(filter?: AdminModerationReportFilter) {
    const { accessToken, isAdmin } = useAuthSession();

    return useQuery({
        queryKey: moderationQueryKeys.adminReports(filter),
        queryFn: () => getAdminModerationReports(requireAccessToken(accessToken), filter),
        enabled: Boolean(accessToken && isAdmin),
    });
}

export function useAdminModerationReport(reportId: string | null) {
    const { accessToken, isAdmin } = useAuthSession();

    return useQuery({
        queryKey: moderationQueryKeys.adminReport(reportId ?? ''),
        queryFn: () => getAdminModerationReport(requireAccessToken(accessToken), reportId ?? ''),
        enabled: Boolean(accessToken && isAdmin && reportId),
    });
}

export function useResolveModerationReport() {
    const { accessToken } = useAuthSession();
    const invalidate = useAdminModerationInvalidation();

    return useMutation({
        mutationFn: ({ reportId, data }: { reportId: string; data: ResolveModerationReportRequest }) =>
            resolveModerationReport(requireAccessToken(accessToken), reportId, data),
        onSuccess: async (_, variables) =>
            invalidate(variables.reportId, variables.data.action !== 'SuspendUser'),
    });
}

export function useRestoreModerationTarget() {
    const { accessToken } = useAuthSession();
    const invalidate = useAdminModerationInvalidation();

    return useMutation({
        mutationFn: (reportId: string) => restoreModerationTarget(requireAccessToken(accessToken), reportId),
        onSuccess: async (_, reportId) => invalidate(reportId, true),
    });
}

export function useUnsuspendModerationUser() {
    const { accessToken } = useAuthSession();
    const invalidate = useAdminModerationInvalidation();

    return useMutation({
        mutationFn: (reportId: string) => unsuspendModerationUser(requireAccessToken(accessToken), reportId),
        onSuccess: async (_, reportId) => invalidate(reportId, false),
    });
}
