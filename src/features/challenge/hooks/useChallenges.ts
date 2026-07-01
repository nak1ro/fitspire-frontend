'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { notificationQueryKeys } from '@/features/notification/hooks/queryKeys';
import { socialQueryKeys } from '@/features/social/hooks/queryKeys';
import type { PageRequest } from '@/shared/types';
import {
    acceptChallengeInvitation,
    cancelChallenge,
    cancelChallengeInvitation,
    createChallenge,
    getAvailableChallenges,
    getChallenge,
    getChallengeLeaderboard,
    getChallengeResults,
    getDiscoverChallenges,
    getIncomingChallengeInvitations,
    getMyChallenges,
    inviteChallengeUser,
    joinChallenge,
    leaveChallenge,
    rejectChallengeInvitation,
    removeChallengeParticipant,
    updateActiveChallengeCopy,
    updateChallenge,
} from '../api/client';
import type {
    ChallengeListFilter,
    CreateChallengeRequest,
    InviteChallengeUserRequest,
    UpdateActiveChallengeCopyRequest,
    UpdateChallengeRequest,
} from '../types';
import { challengeQueryKeys } from './queryKeys';

function useChallengeInvalidation() {
    const queryClient = useQueryClient();

    return async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: challengeQueryKeys.all }),
            queryClient.invalidateQueries({ queryKey: socialQueryKeys.all }),
            queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all }),
        ]);
    };
}

export function useDiscoverChallenges(pagination?: Partial<PageRequest>) {
    const { accessToken } = useAuthSession();
    return useQuery({
        queryKey: challengeQueryKeys.discover(pagination),
        queryFn: () => getDiscoverChallenges(requireAccessToken(accessToken), pagination),
        enabled: Boolean(accessToken),
    });
}

export function useAvailableChallenges(pagination?: Partial<PageRequest>) {
    const { accessToken } = useAuthSession();
    return useQuery({
        queryKey: challengeQueryKeys.available(pagination),
        queryFn: () => getAvailableChallenges(requireAccessToken(accessToken), pagination),
        enabled: Boolean(accessToken),
    });
}

export function useMyChallenges(filter?: ChallengeListFilter) {
    const { accessToken } = useAuthSession();
    return useQuery({
        queryKey: challengeQueryKeys.mine(filter),
        queryFn: () => getMyChallenges(requireAccessToken(accessToken), filter),
        enabled: Boolean(accessToken),
    });
}

export function useIncomingChallengeInvitations(pagination?: Partial<PageRequest>) {
    const { accessToken } = useAuthSession();
    return useQuery({
        queryKey: challengeQueryKeys.incomingInvitations(pagination),
        queryFn: () => getIncomingChallengeInvitations(requireAccessToken(accessToken), pagination),
        enabled: Boolean(accessToken),
    });
}

export function useChallenge(challengeId: string | null) {
    const { accessToken } = useAuthSession();
    return useQuery({
        queryKey: challengeQueryKeys.detail(challengeId ?? ''),
        queryFn: () => getChallenge(requireAccessToken(accessToken), challengeId ?? ''),
        enabled: Boolean(accessToken && challengeId),
    });
}

export function useChallengeLeaderboard(challengeId: string | null, pagination?: Partial<PageRequest>) {
    const { accessToken } = useAuthSession();
    return useQuery({
        queryKey: challengeQueryKeys.leaderboard(challengeId ?? '', pagination),
        queryFn: () => getChallengeLeaderboard(requireAccessToken(accessToken), challengeId ?? '', pagination),
        enabled: Boolean(accessToken && challengeId),
    });
}

export function useChallengeResults(challengeId: string | null, pagination?: Partial<PageRequest>) {
    const { accessToken } = useAuthSession();
    return useQuery({
        queryKey: challengeQueryKeys.results(challengeId ?? '', pagination),
        queryFn: () => getChallengeResults(requireAccessToken(accessToken), challengeId ?? '', pagination),
        enabled: Boolean(accessToken && challengeId),
    });
}

export function useCreateChallenge() {
    const { accessToken } = useAuthSession();
    const invalidate = useChallengeInvalidation();
    return useMutation({ mutationFn: (data: CreateChallengeRequest) => createChallenge(requireAccessToken(accessToken), data), onSuccess: invalidate });
}

export function useUpdateChallenge() {
    const { accessToken } = useAuthSession();
    const invalidate = useChallengeInvalidation();
    return useMutation({ mutationFn: ({ challengeId, data }: { challengeId: string; data: UpdateChallengeRequest }) => updateChallenge(requireAccessToken(accessToken), challengeId, data), onSuccess: invalidate });
}

export function useUpdateActiveChallengeCopy() {
    const { accessToken } = useAuthSession();
    const invalidate = useChallengeInvalidation();
    return useMutation({ mutationFn: ({ challengeId, data }: { challengeId: string; data: UpdateActiveChallengeCopyRequest }) => updateActiveChallengeCopy(requireAccessToken(accessToken), challengeId, data), onSuccess: invalidate });
}

export function useJoinChallenge() {
    const { accessToken } = useAuthSession(); const invalidate = useChallengeInvalidation();
    return useMutation({ mutationFn: (challengeId: string) => joinChallenge(requireAccessToken(accessToken), challengeId), onSuccess: invalidate });
}

export function useLeaveChallenge() {
    const { accessToken } = useAuthSession(); const invalidate = useChallengeInvalidation();
    return useMutation({ mutationFn: (challengeId: string) => leaveChallenge(requireAccessToken(accessToken), challengeId), onSuccess: invalidate });
}

export function useRemoveChallengeParticipant() {
    const { accessToken } = useAuthSession(); const invalidate = useChallengeInvalidation();
    return useMutation({ mutationFn: ({ challengeId, userId }: { challengeId: string; userId: string }) => removeChallengeParticipant(requireAccessToken(accessToken), challengeId, userId), onSuccess: invalidate });
}

export function useCancelChallenge() {
    const { accessToken } = useAuthSession(); const invalidate = useChallengeInvalidation();
    return useMutation({ mutationFn: (challengeId: string) => cancelChallenge(requireAccessToken(accessToken), challengeId), onSuccess: invalidate });
}

export function useInviteChallengeUser() {
    const { accessToken } = useAuthSession(); const invalidate = useChallengeInvalidation();
    return useMutation({ mutationFn: ({ challengeId, data }: { challengeId: string; data: InviteChallengeUserRequest }) => inviteChallengeUser(requireAccessToken(accessToken), challengeId, data), onSuccess: invalidate });
}

export function useCancelChallengeInvitation() {
    const { accessToken } = useAuthSession(); const invalidate = useChallengeInvalidation();
    return useMutation({ mutationFn: (invitationId: string) => cancelChallengeInvitation(requireAccessToken(accessToken), invitationId), onSuccess: invalidate });
}

export function useAcceptChallengeInvitation() {
    const { accessToken } = useAuthSession(); const invalidate = useChallengeInvalidation();
    return useMutation({ mutationFn: (invitationId: string) => acceptChallengeInvitation(requireAccessToken(accessToken), invitationId), onSuccess: invalidate });
}

export function useRejectChallengeInvitation() {
    const { accessToken } = useAuthSession(); const invalidate = useChallengeInvalidation();
    return useMutation({ mutationFn: (invitationId: string) => rejectChallengeInvitation(requireAccessToken(accessToken), invitationId), onSuccess: invalidate });
}
