'use client';

import { useEffect, useRef, useState } from 'react';

interface FeedRailCollapseState {
    sectionCollapsed: boolean;
    aiCollapsed: boolean;
    streakCollapsed: boolean;
    collapsedGoalIds: Record<string, boolean>;
}

const STORAGE_KEY = 'fitspire.feed-rail-collapse';

const initialState: FeedRailCollapseState = {
    sectionCollapsed: false,
    aiCollapsed: false,
    streakCollapsed: false,
    collapsedGoalIds: {},
};

export function useFeedRailCollapse() {
    const [state, setState] = useState<FeedRailCollapseState>(initialState);
    const hasLoaded = useRef(false);

    useEffect(() => {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        window.requestAnimationFrame(() => {
            if (stored) {
                try {
                    setState({ ...initialState, ...JSON.parse(stored) });
                } catch {
                    window.localStorage.removeItem(STORAGE_KEY);
                }
            }
            hasLoaded.current = true;
        });
    }, []);

    useEffect(() => {
        if (!hasLoaded.current) return;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const toggleSection = () => setState((current) => ({ ...current, sectionCollapsed: !current.sectionCollapsed }));
    const toggleAi = () => setState((current) => ({ ...current, aiCollapsed: !current.aiCollapsed }));
    const toggleStreak = () => setState((current) => ({ ...current, streakCollapsed: !current.streakCollapsed }));
    const toggleGoal = (goalId: string) => setState((current) => ({
        ...current,
        collapsedGoalIds: {
            ...current.collapsedGoalIds,
            [goalId]: !current.collapsedGoalIds[goalId],
        },
    }));

    return { ...state, toggleSection, toggleAi, toggleStreak, toggleGoal };
}
