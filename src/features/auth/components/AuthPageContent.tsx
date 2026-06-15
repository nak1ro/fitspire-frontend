'use client';

import { AuthShell } from './AuthShell';
import { AuthCard } from './AuthCard';
import { useAuthMode } from '../hooks/useAuthMode';

export function AuthPageContent() {
    const mode = useAuthMode();
    return (
        <AuthShell maxWidth={460}>
            <AuthCard mode={mode} />
        </AuthShell>
    );
}
