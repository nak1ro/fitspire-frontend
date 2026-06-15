import { Suspense } from 'react';
import { Metadata } from 'next';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { AuthCardHeader } from '@/features/auth/components/AuthCardHeader';
import { ResetPasswordForm } from '@/features/auth/forms/ResetPasswordForm';

export const metadata: Metadata = {
    title: 'Reset Password | Fitspire',
    description: 'Create a new Fitspire password',
};

export default function ResetPasswordPage() {
    return (
        <AuthShell>
            <div className="p-6">
                <AuthCardHeader
                    eyebrow="Account recovery"
                    title="Create a new password"
                    subtitle="Choose a new password to restore access to your account."
                />
                <Suspense fallback={<div className="h-64" />}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </AuthShell>
    );
}
