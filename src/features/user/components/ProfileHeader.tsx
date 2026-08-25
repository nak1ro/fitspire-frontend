import type React from 'react';
import { Pencil, Dumbbell, Flame, Trophy, UserCheck } from 'lucide-react';
import { Avatar, Badge } from '@/shared/ui';
import { type FeaturedBadgeItem } from '@/features/badge/components/FeaturedBadgesStrip';
import { type FeaturedPersonalRecordItem } from '@/features/workout/components/FeaturedPersonalRecordCard';
import { FitnessProfileChips } from './FitnessProfileChips';
import { ProfileHighlights } from './ProfileHighlights';
import type { UserProfile } from '../types';

interface Props {
    profile: UserProfile;
    totalWorkouts: number;
    streak: number;
    totalPRs: number;
    followersCount?: number;
    followingCount?: number;
    incomingRequestCount?: number;
    featuredBadges?: FeaturedBadgeItem[];
    featuredPersonalRecord?: FeaturedPersonalRecordItem | null;
    onEdit: () => void;
    onShowFollowers?: () => void;
    onShowFollowing?: () => void;
    onShowRequests?: () => void;
}

interface StatPillProps {
    value: number;
    label: string;
    Icon: React.ElementType;
    iconColor: string;
    iconBg: string;
}

function StatPill({ value, label, Icon, iconColor, iconBg }: StatPillProps) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: iconColor }} aria-hidden="true" />
                </div>
                <span className="text-xl font-extrabold text-foreground leading-none tabular-nums">{value}</span>
            </div>
            <span className="text-[11px] font-medium text-surface-500">{label}</span>
        </div>
    );
}

function SocialCountButton({ value, label, onClick }: { value: number; label: string; onClick?: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-surface-100 transition-colors"
        >
            <span className="text-lg font-extrabold text-foreground tabular-nums leading-none">{value}</span>
            <span className="text-[11px] font-medium text-surface-500">{label}</span>
        </button>
    );
}

export function ProfileHeader({
    profile, totalWorkouts, streak, totalPRs,
    followersCount, followingCount, incomingRequestCount, featuredBadges, featuredPersonalRecord,
    onEdit, onShowFollowers, onShowFollowing, onShowRequests,
}: Props) {
    return (
        <div className="pb-5 mb-1">
            {/* Stats row: Workouts / Day streak / Records — its own row, full width */}
            <div className="flex items-center justify-around py-3.5 px-4 mb-5 rounded-2xl border border-surface-200 bg-surface">
                <StatPill value={totalWorkouts} label="Workouts" Icon={Dumbbell} iconColor="#2563EB" iconBg="rgba(37,99,235,0.10)" />
                <div className="w-px h-8 bg-surface-200" />
                <StatPill value={streak} label="Day streak" Icon={Flame} iconColor="#EA580C" iconBg="rgba(234,88,12,0.10)" />
                <div className="w-px h-8 bg-surface-200" />
                <StatPill value={totalPRs} label="Records" Icon={Trophy} iconColor="#7C3AED" iconBg="rgba(124,58,237,0.10)" />
            </div>

            {/* Avatar row: avatar on left, follower/following + edit-profile on right */}
            <div className="flex items-center justify-between gap-4 mb-4">
                <Avatar
                    displayName={profile.displayName}
                    userName={profile.userName}
                    avatarUrl={profile.profilePictureUrl}
                    size="xl"
                />
                <div className="flex items-center gap-1 flex-wrap justify-end">
                    {Boolean(incomingRequestCount) && onShowRequests && (
                        <button
                            onClick={onShowRequests}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-surface-200 bg-surface text-surface-600 hover:bg-background hover:text-foreground transition-all"
                        >
                            <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                            Requests
                            <Badge variant="primary" size="sm">{incomingRequestCount}</Badge>
                        </button>
                    )}
                    <SocialCountButton value={followersCount ?? 0} label="followers" onClick={onShowFollowers} />
                    <SocialCountButton value={followingCount ?? 0} label="following" onClick={onShowFollowing} />
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-surface-200 bg-surface text-surface-600 hover:bg-background hover:text-foreground transition-all"
                    >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        Edit profile
                    </button>
                </div>
            </div>

            {/* Name + username + bio — same column as the avatar above */}
            <div className="mb-2">
                <h1 className="text-xl font-extrabold text-foreground leading-tight">{profile.displayName}</h1>
                <p className="text-sm text-surface-500 mt-0.5">@{profile.userName}</p>
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
            <ProfileHighlights badges={featuredBadges ?? []} record={featuredPersonalRecord} />
        </div>
    );
}
