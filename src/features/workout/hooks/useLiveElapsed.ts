'use client';

import { useEffect, useState } from 'react';
import type { WorkoutSession } from '../types';

function computeElapsedSeconds(session: WorkoutSession): number {
    if (!session.startedAt) return 0;
    const startedMs = new Date(session.startedAt).getTime();
    const referenceMs = session.status === 'Paused' && session.pausedAt
        ? new Date(session.pausedAt).getTime()
        : Date.now();
    const rawSeconds = Math.max(0, (referenceMs - startedMs) / 1000);
    return Math.max(0, rawSeconds - session.accumulatedPausedSeconds);
}

function formatElapsed(totalSeconds: number): string {
    const seconds = Math.floor(totalSeconds);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function useLiveElapsed(session: WorkoutSession | null | undefined) {
    const [elapsedSeconds, setElapsedSeconds] = useState(() => (session ? computeElapsedSeconds(session) : 0));

    useEffect(() => {
        if (!session) return;

        setElapsedSeconds(computeElapsedSeconds(session));

        if (session.status !== 'InProgress') return;

        const interval = setInterval(() => {
            setElapsedSeconds(computeElapsedSeconds(session));
        }, 1000);
        return () => clearInterval(interval);
    }, [session]);

    return {
        elapsedSeconds,
        elapsedMinutes: elapsedSeconds / 60,
        formatted: formatElapsed(elapsedSeconds),
    };
}
