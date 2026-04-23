import { Suspense } from 'react';
import { Metadata } from 'next';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { SignInForm } from '@/features/auth/forms/SignInForm';

export const metadata: Metadata = {
    title: 'Sign In | Fitspire',
    description: 'Sign in to your Fitspire account',
};

export default function SignInPage() {
    return (
        <AuthLayout
            eyebrow="Welcome back"
            title="Sign in"
            subtitle="Good to have you back."
        >
            <Suspense fallback={<div className="h-64" />}>
                <SignInForm />
            </Suspense>
        </AuthLayout>
    );
}
