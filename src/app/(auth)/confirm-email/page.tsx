import { Suspense } from 'react';
import { Metadata } from 'next';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { ConfirmEmailStatus } from '@/features/auth/components/ConfirmEmailStatus';

export const metadata: Metadata = {
    title: 'Confirm Email | Fitspire',
    description: 'Confirm your Fitspire account email',
};

export default function ConfirmEmailPage() {
    return (
        <AuthLayout
            eyebrow="Account verification"
            title="Confirm email"
            subtitle="We are checking your confirmation link."
        >
            <Suspense fallback={<div className="h-32" />}>
                <ConfirmEmailStatus />
            </Suspense>
        </AuthLayout>
    );
}
