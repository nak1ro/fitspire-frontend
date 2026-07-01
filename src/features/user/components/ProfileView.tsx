'use client';

import { useState, useMemo } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useWorkouts } from '@/features/workout/hooks/useWorkouts';
import { usePersonalRecords } from '@/features/workout/hooks/usePersonalRecords';
import { ProfileHeader } from './ProfileHeader';
import { EditProfileModal } from './EditProfileModal';
import { ProfilePostsTab } from './ProfilePostsTab';
import { ProfileWorkoutsTab } from './ProfileWorkoutsTab';
import { ProfileRecordsTab } from './ProfileRecordsTab';
import { getCurrentStreak } from '@/shared/lib/streak';

// ─── Tab bar ───────────────────────────────────────────────────────────────────

type Tab = 'posts' | 'workouts' | 'records';

const TABS: { id: Tab; label: string }[] = [
    { id: 'posts',    label: 'Posts' },
    { id: 'workouts', label: 'Workouts' },
    { id: 'records',  label: 'Records' },
];

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
    return (
        <div className="flex border-b border-surface-200 mb-4">
            {TABS.map(tab => {
                const isActive = tab.id === active;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`flex-1 py-3 text-sm font-bold transition-colors relative ${isActive ? 'text-primary-500' : 'text-surface-500'}`}
                    >
                        {tab.label}
                        {isActive && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-primary" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            <div className="flex gap-4 items-start">
                <div className="w-20 h-20 rounded-2xl bg-surface-200 shrink-0" />
                <div className="space-y-2 flex-1 pt-1">
                    <div className="h-5 w-36 bg-surface-200 rounded-full" />
                    <div className="h-3.5 w-24 bg-surface-200 rounded-full" />
                    <div className="h-3 w-48 bg-surface-200 rounded-full" />
                </div>
            </div>
            <div className="h-20 rounded-2xl bg-surface-200" />
        </div>
    );
}

// ─── View ──────────────────────────────────────────────────────────────────────

export function ProfileView() {
    const [activeTab, setActiveTab] = useState<Tab>('posts');
    const [editOpen, setEditOpen] = useState(false);

    const { data: profile, isLoading: profileLoading } = useUserProfile();
    const { data: workouts } = useWorkouts();
    const { data: personalRecords } = usePersonalRecords();

    const streak = useMemo(() => getCurrentStreak(workouts ?? []), [workouts]);

    if (profileLoading || !profile) {
        return <ProfileSkeleton />;
    }

    return (
        <>
            <ProfileHeader
                profile={profile}
                totalWorkouts={workouts?.length ?? 0}
                streak={streak}
                totalPRs={personalRecords?.length ?? 0}
                onEdit={() => setEditOpen(true)}
            />

            <TabBar active={activeTab} onChange={setActiveTab} />

            {activeTab === 'posts' && (
                <ProfilePostsTab userId={profile.id} />
            )}
            {activeTab === 'workouts' && (
                <ProfileWorkoutsTab workouts={workouts ?? []} />
            )}
            {activeTab === 'records' && (
                <ProfileRecordsTab records={personalRecords ?? []} />
            )}

            {editOpen && (
                <EditProfileModal
                    profile={profile}
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                />
            )}
        </>
    );
}
