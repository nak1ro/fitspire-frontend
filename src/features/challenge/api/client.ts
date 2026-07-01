import type { PageRequest, PageResponse } from '@/shared/types';
import { http } from '@/shared/lib/http';
import { CHALLENGE_ROUTES } from './routes';
import type {
    ChallengeDetail,
    ChallengeInvitation,
    ChallengeLeaderboardEntry,
    ChallengeListFilter,
    ChallengeResponse,
    CreateChallengeRequest,
    InviteChallengeUserRequest,
    UpdateActiveChallengeCopyRequest,
    UpdateChallengeRequest,
} from '../types';

function paginationQuery(pagination?: Partial<PageRequest>) {
    return { page: pagination?.page, pageSize: pagination?.pageSize };
}

export const createChallenge = (accessToken: string, data: CreateChallengeRequest) =>
    http<string>(CHALLENGE_ROUTES.base, { method: 'POST', accessToken, json: data });

export const updateChallenge = (accessToken: string, challengeId: string, data: UpdateChallengeRequest) =>
    http<void>(CHALLENGE_ROUTES.challenge(challengeId), { method: 'PATCH', accessToken, json: data });

export const updateActiveChallengeCopy = (
    accessToken: string,
    challengeId: string,
    data: UpdateActiveChallengeCopyRequest
) => http<void>(CHALLENGE_ROUTES.copy(challengeId), { method: 'PATCH', accessToken, json: data });

export const getDiscoverChallenges = (accessToken: string, pagination?: Partial<PageRequest>) =>
    http<PageResponse<ChallengeResponse>>(CHALLENGE_ROUTES.discover, {
        accessToken,
        query: paginationQuery(pagination),
    });

export const getAvailableChallenges = (accessToken: string, pagination?: Partial<PageRequest>) =>
    http<PageResponse<ChallengeResponse>>(CHALLENGE_ROUTES.available, {
        accessToken,
        query: paginationQuery(pagination),
    });

export const getMyChallenges = (accessToken: string, filter?: ChallengeListFilter) =>
    http<PageResponse<ChallengeResponse>>(CHALLENGE_ROUTES.mine, {
        accessToken,
        query: filter
            ? {
                  role: filter.role,
                  status: filter.status,
                  metricCode: filter.metricCode,
                  ...paginationQuery(filter),
              }
            : undefined,
    });

export const getIncomingChallengeInvitations = (accessToken: string, pagination?: Partial<PageRequest>) =>
    http<PageResponse<ChallengeInvitation>>(CHALLENGE_ROUTES.incomingInvitations, {
        accessToken,
        query: paginationQuery(pagination),
    });

export const getChallenge = (accessToken: string, challengeId: string) =>
    http<ChallengeDetail>(CHALLENGE_ROUTES.challenge(challengeId), { accessToken });

export const joinChallenge = (accessToken: string, challengeId: string) =>
    http<void>(CHALLENGE_ROUTES.join(challengeId), { method: 'POST', accessToken });

export const leaveChallenge = (accessToken: string, challengeId: string) =>
    http<void>(CHALLENGE_ROUTES.leave(challengeId), { method: 'DELETE', accessToken });

export const removeChallengeParticipant = (accessToken: string, challengeId: string, userId: string) =>
    http<void>(CHALLENGE_ROUTES.participant(challengeId, userId), { method: 'DELETE', accessToken });

export const cancelChallenge = (accessToken: string, challengeId: string) =>
    http<void>(CHALLENGE_ROUTES.cancel(challengeId), { method: 'POST', accessToken });

export const inviteChallengeUser = (
    accessToken: string,
    challengeId: string,
    data: InviteChallengeUserRequest
) => http<void>(CHALLENGE_ROUTES.invitations(challengeId), { method: 'POST', accessToken, json: data });

export const cancelChallengeInvitation = (accessToken: string, invitationId: string) =>
    http<void>(CHALLENGE_ROUTES.invitation(invitationId), { method: 'DELETE', accessToken });

export const acceptChallengeInvitation = (accessToken: string, invitationId: string) =>
    http<void>(CHALLENGE_ROUTES.acceptInvitation(invitationId), { method: 'POST', accessToken });

export const rejectChallengeInvitation = (accessToken: string, invitationId: string) =>
    http<void>(CHALLENGE_ROUTES.rejectInvitation(invitationId), { method: 'POST', accessToken });

export const getChallengeLeaderboard = (accessToken: string, challengeId: string, pagination?: Partial<PageRequest>) =>
    http<PageResponse<ChallengeLeaderboardEntry>>(CHALLENGE_ROUTES.leaderboard(challengeId), {
        accessToken,
        query: paginationQuery(pagination),
    });

export const getChallengeResults = (accessToken: string, challengeId: string, pagination?: Partial<PageRequest>) =>
    http<PageResponse<ChallengeLeaderboardEntry>>(CHALLENGE_ROUTES.results(challengeId), {
        accessToken,
        query: paginationQuery(pagination),
    });
