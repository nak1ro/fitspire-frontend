'use client';

import { useEffect, useRef, useState } from 'react';
import type { DiscoverableSocialUser } from '../types';

export interface RetainedFollow {
    person: DiscoverableSocialUser;
    index: number;
    resultKey: string;
    isFollowing: boolean;
    isLeaving: boolean;
}

const FOLLOW_ACKNOWLEDGEMENT_MS = 3000;
const FOLLOW_EXIT_MS = 300;

export function useRetainedFollows() {
    const [retainedById, setRetainedById] = useState<Record<string, RetainedFollow>>({});
    const timers = useRef<Record<string, number[]>>({});

    useEffect(() => () => {
        Object.values(timers.current).flat().forEach((timer) => window.clearTimeout(timer));
    }, []);

    const retain = (person: DiscoverableSocialUser, index: number, resultKey: string) => {
        timers.current[person.id]?.forEach((timer) => window.clearTimeout(timer));
        setRetainedById((current) => ({
            ...current,
            [person.id]: { person, index, resultKey, isFollowing: true, isLeaving: false },
        }));

        const exitTimer = window.setTimeout(() => {
            setRetainedById((current) => current[person.id]
                ? { ...current, [person.id]: { ...current[person.id], isLeaving: true } }
                : current);
        }, FOLLOW_ACKNOWLEDGEMENT_MS - FOLLOW_EXIT_MS);
        const removeTimer = window.setTimeout(() => {
            setRetainedById((current) => {
                const next = { ...current };
                delete next[person.id];
                return next;
            });
            delete timers.current[person.id];
        }, FOLLOW_ACKNOWLEDGEMENT_MS);
        timers.current[person.id] = [exitTimer, removeTimer];
    };

    const revert = (userId: string) => {
        timers.current[userId]?.forEach((timer) => window.clearTimeout(timer));
        delete timers.current[userId];
        setRetainedById((current) => {
            if (!current[userId]) return current;
            return {
                ...current,
                [userId]: { ...current[userId], isFollowing: false, isLeaving: false },
            };
        });
    };

    return { retained: Object.values(retainedById), retain, revert };
}
