'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WeeklyCoachView } from '@/features/ai-coaching/components/WeeklyCoachView';
import { DailyGuidanceCard } from '@/features/ai-coaching/components/DailyGuidanceCard';
import { CoachThreadList } from '@/features/ai-coaching/components/CoachThreadList';

type Tab = 'today' | 'chat' | 'reports';

const TABS: { key: Tab; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'chat', label: 'Chat' },
    { key: 'reports', label: 'Reports' },
];

function isTab(value: string | null): value is Tab {
    return value === 'today' || value === 'chat' || value === 'reports';
}

function CoachPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab');
    const [tab, setTab] = useState<Tab>(isTab(initialTab) ? initialTab : 'today');

    const changeTab = (next: Tab) => {
        setTab(next);
        router.replace(next === 'today' ? '/coach' : `/coach?tab=${next}`);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="flex border-b border-surface-200 mb-5">
                {TABS.map(t => (
                    <button
                        key={t.key}
                        onClick={() => changeTab(t.key)}
                        className={`px-1 mr-6 py-3 text-sm font-bold transition-colors relative ${tab === t.key ? 'text-primary-500' : 'text-surface-500'}`}
                    >
                        {t.label}
                        {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-primary" />}
                    </button>
                ))}
            </div>

            {tab === 'today' && <DailyGuidanceCard />}
            {tab === 'chat' && <CoachThreadList />}
            {tab === 'reports' && <WeeklyCoachView />}
        </div>
    );
}

export default function CoachPage() {
    return (
        <Suspense>
            <CoachPageContent />
        </Suspense>
    );
}
