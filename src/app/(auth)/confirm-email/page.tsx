import { Suspense } from 'react';
import { Metadata } from 'next';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { AuthCardHeader } from '@/features/auth/components/AuthCardHeader';
import { ConfirmEmailStatus } from '@/features/auth/components/ConfirmEmailStatus';

export const metadata: Metadata = {
    title: 'Confirm Email | Fitspire',
    description: 'Confirm your Fitspire account email',
};

export default function ConfirmEmailPage() {
    return (
        <AuthShell>
            <div className="p-6">
                <AuthCardHeader
                    eyebrow="Account verification"
                    title="Confirm email"
                    subtitle="We are checking your confirmation link."
                />
                <Suspense fallback={<div className="h-32" />}>
                    <ConfirmEmailStatus />
                </Suspense>
            </div>
        </AuthShell>
    );
}
