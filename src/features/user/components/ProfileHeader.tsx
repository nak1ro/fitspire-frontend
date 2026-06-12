import type React from 'react';
import { Pencil, Dumbbell, Flame, Trophy } from 'lucide-react';
import type { UserProfile } from '../types';

interface Props {
    profile: UserProfile;
    totalWorkouts: number;
    streak: number;
    totalPRs: number;
    onEdit: () => void;
}

function getInitials(displayName: string, userName: string): string {
    const name = displayName || userName;
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
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

export function ProfileHeader({ profile, totalWorkouts, streak, totalPRs, onEdit }: Props) {
    const initials = getInitials(profile.displayName, profile.userName);

    return (
        <div className="pb-5 mb-1">
            {/* Top row: avatar + edit button */}
            <div className="flex items-start justify-between mb-4">
                {/* Avatar */}
                <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold shrink-0"
                    style={{ backgroundColor: 'rgba(5,150,105,0.12)', color: '#059669' }}
                    aria-hidden="true"
                >
                    {initials}
                </div>

                {/* Edit button */}
                <button
                    onClick={onEdit}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-surface-200 bg-surface text-surface-600 hover:bg-background hover:text-foreground transition-all"
                >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Edit profile
                </button>
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
