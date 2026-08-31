'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Avatar } from '@/shared/ui';
import { ProfileHighlights } from '@/features/user/components/ProfileHighlights';
import { FitnessProfileChips } from '@/features/user/components/FitnessProfileChips';
import { usePublicFeaturedBadges, usePublicFeaturedPersonalRecord } from '../hooks/useSocialReads';
import { FollowButton } from './FollowButton';
import { FollowListModal } from './FollowListModal';
import { ReportTrigger } from '@/features/moderation/components/ReportTrigger';
import type { SocialProfileResponse } from '../types';

interface Props {
    profile: SocialProfileResponse;
}

export function UserProfileHeader({ profile }: Props) {
    const [listMode, setListMode] = useState<'followers' | 'following' | null>(null);
    // Kept separate from listMode so the follow-list panel keeps showing the
    // right tab while it plays its close animation.
    const [lastListMode, setLastListMode] = useState<'followers' | 'following'>('followers');
    const { data: featuredBadges } = usePublicFeaturedBadges(profile.id);
    const { data: featuredRecord } = usePublicFeaturedPersonalRecord(profile.id);
    const canReport = profile.relationship !== 'self';

    return (
        <div className="pb-5 mb-1">
            {/* Avatar row: avatar on left, follower/following + follow/report on right */}
            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="relative">
                    <Avatar
                        displayName={profile.displayName}
                        userName={profile.userName}
                        avatarUrl={profile.profilePictureUrl}
                        size="xl"
                    />
                    {canReport && profile.profilePicture && (
                        <div className="absolute -right-1 -top-1 rounded-lg bg-surface shadow-sm">
                            <ReportTrigger target={{ targetType: 'Media', targetId: profile.profilePicture.id, label: 'profile image' }} compact />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1 flex-wrap justify-end">
                    <button
                        type="button"
                        onClick={() => { setListMode('followers'); setLastListMode('followers'); }}
                        className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-surface-100 transition-colors"
                    >
                        <span className="text-lg font-extrabold text-foreground tabular-nums leading-none">{profile.followersCount}</span>
                        <span className="text-[11px] font-medium text-surface-500">followers</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => { setListMode('following'); setLastListMode('following'); }}
                        className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-surface-100 transition-colors"
                    >
                        <span className="text-lg font-extrabold text-foreground tabular-nums leading-none">{profile.followingCount}</span>
                        <span className="text-[11px] font-medium text-surface-500">following</span>
                    </button>
                    <FollowButton userId={profile.id} relationship={profile.relationship} isPrivate={profile.isPrivate} />
                </div>
            </div>

            {/* Name + username */}
            <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h1 className="text-xl font-extrabold text-foreground leading-tight truncate">{profile.displayName}</h1>
                        {profile.isPrivate && <Lock className="h-4 w-4 text-surface-400 shrink-0" aria-hidden="true" />}
                    </div>
                    <p className="text-sm text-surface-500 mt-0.5">@{profile.userName}</p>
                </div>
                {canReport && (
                    <div className="shrink-0 pt-1">
                        <ReportTrigger target={{ targetType: 'Profile', targetId: profile.id, label: 'profile' }} />
                    </div>
                )}
            </div>

            {profile.bio && (
                <p className="text-sm text-surface-600 leading-relaxed mb-4">{profile.bio}</p>
            )}

            {(profile.favoriteSport || profile.fitnessLevel) && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <FitnessProfileChips sport={profile.favoriteSport} level={profile.fitnessLevel} />
                </div>
            )}

            {/* Highlights: featured badges + pinned personal record, consolidated */}
            <ProfileHighlights
                badges={(featuredBadges ?? []).map(badge => ({ id: badge.badgeId, name: badge.name, tier: badge.tier, iconUrl: badge.iconUrl }))}
                record={featuredRecord}
            />

            <FollowListModal userId={profile.id} mode={lastListMode} open={listMode !== null} onClose={() => setListMode(null)} />
        </div>
    );
}
