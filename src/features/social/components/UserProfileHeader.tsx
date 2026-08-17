'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Avatar } from '@/shared/ui';
import { FeaturedBadgesStrip } from '@/features/badge/components/FeaturedBadgesStrip';
import { usePublicFeaturedBadges } from '../hooks/useSocialReads';
import { FollowButton } from './FollowButton';
import { FollowListModal } from './FollowListModal';
import { ReportTrigger } from '@/features/moderation/components/ReportTrigger';
import type { SocialProfileResponse } from '../types';

interface Props {
    profile: SocialProfileResponse;
}

export function UserProfileHeader({ profile }: Props) {
    const [listMode, setListMode] = useState<'followers' | 'following' | null>(null);
    const { data: featuredBadges } = usePublicFeaturedBadges(profile.id);
    const canReport = profile.relationship !== 'self';

    return (
        <div className="pb-5 mb-1">
            <div className="flex items-start justify-between mb-4">
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
                <FollowButton userId={profile.id} relationship={profile.relationship} isPrivate={profile.isPrivate} />
            </div>

            <div className="mb-2">
                <div className="flex items-center gap-1.5">
                    <h1 className="text-xl font-extrabold text-foreground leading-tight">{profile.displayName}</h1>
                    {profile.isPrivate && <Lock className="h-4 w-4 text-surface-400 shrink-0" aria-hidden="true" />}
                </div>
                <p className="text-sm text-surface-500 mt-0.5">@{profile.userName}</p>
            </div>

            {profile.bio && (
                <p className="text-sm text-surface-600 leading-relaxed mb-4">{profile.bio}</p>
            )}

            {featuredBadges && featuredBadges.length > 0 && (
                <FeaturedBadgesStrip
                    badges={featuredBadges.map(badge => ({ id: badge.badgeId, name: badge.name, tier: badge.tier, iconUrl: badge.iconUrl }))}
                />
            )}

            <div className="flex items-center gap-5">
                <button
                    type="button"
                    onClick={() => setListMode('followers')}
                    className="flex items-baseline gap-1.5 hover:opacity-70 transition-opacity"
                >
                    <span className="text-sm font-extrabold text-foreground tabular-nums">{profile.followersCount}</span>
                    <span className="text-xs text-surface-500">followers</span>
                </button>
                <button
                    type="button"
                    onClick={() => setListMode('following')}
                    className="flex items-baseline gap-1.5 hover:opacity-70 transition-opacity"
                >
                    <span className="text-sm font-extrabold text-foreground tabular-nums">{profile.followingCount}</span>
                    <span className="text-xs text-surface-500">following</span>
                </button>
                {canReport && <ReportTrigger target={{ targetType: 'Profile', targetId: profile.id, label: 'profile' }} />}
            </div>

            {listMode && (
                <FollowListModal userId={profile.id} mode={listMode} open onClose={() => setListMode(null)} />
            )}
        </div>
    );
}
