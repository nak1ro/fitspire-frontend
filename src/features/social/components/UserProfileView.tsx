'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Lock, MessageSquare } from 'lucide-react';
import { EmptyState } from '@/shared/ui';
import { useSocialProfile } from '../hooks/useSocialReads';
import { useUserPosts } from '../hooks/useSocialFeed';
import { FeedCard } from './FeedCard';
import { UserProfileHeader } from './UserProfileHeader';
import { ProfileGoalsTab } from './ProfileGoalsTab';
import { ProfileBadgesTab } from './ProfileBadgesTab';
import { ProfileChallengesTab } from './ProfileChallengesTab';

type Tab = 'posts' | 'goals' | 'badges' | 'challenges';

const TABS: { id: Tab; label: string }[] = [
    { id: 'posts',      label: 'Posts' },
    { id: 'goals',      label: 'Goals' },
    { id: 'badges',     label: 'Badges' },
    { id: 'challenges', label: 'Challenges' },
];

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
    return (
        <div className="flex border-b border-surface-200 mb-4">
            {TABS.map((tab) => {
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
        </div>
    );
}

function PostsTab({ userId }: { userId: string }) {
    const { data: posts, isLoading } = useUserPosts(userId, { pageSize: 20 });

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl bg-surface-100 animate-pulse" />)}
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return <EmptyState icon={MessageSquare} title="No posts yet" description="This account hasn't shared anything yet." />;
    }

    return (
        <div className="space-y-3">
            {posts.map((item) => <FeedCard key={item.id} item={item} />)}
        </div>
    );
}

export function UserProfileView({ userId }: { userId: string }) {
    const [activeTab, setActiveTab] = useState<Tab>('posts');
    const router = useRouter();
    const { data: profile, isLoading, isError } = useSocialProfile(userId);

    useEffect(() => {
        if (profile?.relationship === 'self') {
            router.replace('/profile');
        }
    }, [profile, router]);

    if (isLoading || profile?.relationship === 'self') {
        return <ProfileSkeleton />;
    }

    if (isError || !profile) {
        return <EmptyState icon={AlertCircle} title="Couldn't load this profile" description="It may not exist, or something went wrong." />;
    }

    const canViewProtected = !profile.isPrivate || profile.relationship === 'following';

    return (
        <>
            <UserProfileHeader profile={profile} />

            {!canViewProtected ? (
                <EmptyState
                    icon={Lock}
                    title="This account is private"
                    description={
                        profile.relationship === 'outgoing-request-pending'
                            ? 'Your follow request is pending approval.'
                            : 'Follow this account to see their posts, goals, and badges.'
                    }
                />
            ) : (
                <>
                    <TabBar active={activeTab} onChange={setActiveTab} />
                    {activeTab === 'posts' && <PostsTab userId={profile.id} />}
                    {activeTab === 'goals' && <ProfileGoalsTab userId={profile.id} />}
                    {activeTab === 'badges' && <ProfileBadgesTab userId={profile.id} />}
                    {activeTab === 'challenges' && <ProfileChallengesTab userId={profile.id} />}
                </>
            )}
        </>
    );
}
