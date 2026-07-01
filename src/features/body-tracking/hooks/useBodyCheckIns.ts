'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { createBodyCheckIn, deleteBodyCheckIn, getBodyCheckIn, getBodyCheckIns, getBodyCheckInSummary, getLatestBodyCheckIn, updateBodyCheckIn } from '../api/client';
import type { BodyCheckInHistoryFilter, CreateBodyCheckInRequest, DateRangeFilter, UpdateBodyCheckInRequest } from '../types';
import { bodyCheckInQueryKeys } from './queryKeys';
function useInvalidation() { const queryClient = useQueryClient(); return () => queryClient.invalidateQueries({ queryKey: bodyCheckInQueryKeys.all }); }
export function useBodyCheckIns(filter?: BodyCheckInHistoryFilter) { const { accessToken } = useAuthSession(); return useQuery({ queryKey: bodyCheckInQueryKeys.history(filter), queryFn: () => getBodyCheckIns(requireAccessToken(accessToken), filter), enabled: Boolean(accessToken) }); }
export function useLatestBodyCheckIn() { const { accessToken } = useAuthSession(); return useQuery({ queryKey: bodyCheckInQueryKeys.latest(), queryFn: () => getLatestBodyCheckIn(requireAccessToken(accessToken)), enabled: Boolean(accessToken) }); }
export function useBodyCheckInSummary(filter?: DateRangeFilter) { const { accessToken } = useAuthSession(); return useQuery({ queryKey: bodyCheckInQueryKeys.summary(filter), queryFn: () => getBodyCheckInSummary(requireAccessToken(accessToken), filter), enabled: Boolean(accessToken) }); }
export function useBodyCheckIn(id: string | null) { const { accessToken } = useAuthSession(); return useQuery({ queryKey: bodyCheckInQueryKeys.detail(id ?? ''), queryFn: () => getBodyCheckIn(requireAccessToken(accessToken), id ?? ''), enabled: Boolean(accessToken && id) }); }
export function useCreateBodyCheckIn() { const { accessToken } = useAuthSession(); const invalidate = useInvalidation(); return useMutation({ mutationFn: (data: CreateBodyCheckInRequest) => createBodyCheckIn(requireAccessToken(accessToken), data), onSuccess: invalidate }); }
export function useUpdateBodyCheckIn() { const { accessToken } = useAuthSession(); const invalidate = useInvalidation(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateBodyCheckInRequest }) => updateBodyCheckIn(requireAccessToken(accessToken), id, data), onSuccess: invalidate }); }
export function useDeleteBodyCheckIn() { const { accessToken } = useAuthSession(); const invalidate = useInvalidation(); return useMutation({ mutationFn: (id: string) => deleteBodyCheckIn(requireAccessToken(accessToken), id), onSuccess: invalidate }); }
