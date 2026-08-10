import type React from 'react';
import Link from 'next/link';
import { Pencil, Dumbbell, Flame, Trophy, UserCheck, Sparkles } from 'lucide-react';
import { Avatar, Badge } from '@/shared/ui';
import { FeaturedBadgesStrip, type FeaturedBadgeItem } from '@/features/badge/components/FeaturedBadgesStrip';
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

export function ProfileHeader({
    profile, totalWorkouts, streak, totalPRs,
    followersCount, followingCount, incomingRequestCount, featuredBadges,
    onEdit, onShowFollowers, onShowFollowing, onShowRequests,
}: Props) {
    return (
        <div className="pb-5 mb-1">
            {/* Top row: avatar + edit button */}
            <div className="flex items-start justify-between mb-4">
                <Avatar
                    displayName={profile.displayName}
                    userName={profile.userName}
                    avatarUrl={profile.profilePictureUrl}
                    size="xl"
                />

                <div className="flex items-center gap-2">
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

                    <Link
                        href="/coach"
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-surface-200 bg-surface text-surface-600 hover:bg-background hover:text-foreground transition-all"
                    >
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        Coach
                    </Link>

                    {/* Edit button */}
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-surface-200 bg-surface text-surface-600 hover:bg-background hover:text-foreground transition-all"
                    >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        Edit profile
                    </button>
                </div>
            </div>

            {/* Name + username */}
            <div className="mb-2">
                <h1 className="text-xl font-extrabold text-foreground leading-tight">{profile.displayName}</h1>
                <p className="text-sm text-surface-500 mt-0.5">@{profile.userName}</p>
            </div>

            {/* Bio */}
            {profile.bio && (
                <p className="text-sm text-surface-600 leading-relaxed mb-4">{profile.bio}</p>
            )}

            {/* Featured badges */}
            {featuredBadges && featuredBadges.length > 0 && (
                <FeaturedBadgesStrip badges={featuredBadges} />
            )}

            {/* Followers / following */}
            {(followersCount !== undefined || followingCount !== undefined) && (
                <div className="flex items-center gap-5 mb-4">
                    <button
                        type="button"
                        onClick={onShowFollowers}
                        className="flex items-baseline gap-1.5 hover:opacity-70 transition-opacity"
                    >
                        <span className="text-sm font-extrabold text-foreground tabular-nums">{followersCount ?? 0}</span>
                        <span className="text-xs text-surface-500">followers</span>
                    </button>
                    <button
                        type="button"
                        onClick={onShowFollowing}
                        className="flex items-baseline gap-1.5 hover:opacity-70 transition-opacity"
                    >
                        <span className="text-sm font-extrabold text-foreground tabular-nums">{followingCount ?? 0}</span>
                        <span className="text-xs text-surface-500">following</span>
                    </button>
                </div>
            )}

            {/* Stats row */}
            <div
                className="flex items-center justify-around py-3.5 px-4 rounded-2xl border border-surface-200 bg-surface"
            >
                <StatPill value={totalWorkouts} label="Workouts" Icon={Dumbbell} iconColor="#2563EB" iconBg="rgba(37,99,235,0.10)" />
                <div className="w-px h-8 bg-surface-200" />
                <StatPill value={streak} label="Day streak" Icon={Flame} iconColor="#EA580C" iconBg="rgba(234,88,12,0.10)" />
                <div className="w-px h-8 bg-surface-200" />
                <StatPill value={totalPRs} label="Records" Icon={Trophy} iconColor="#7C3AED" iconBg="rgba(124,58,237,0.10)" />
            </div>
        </div>
    );
}
