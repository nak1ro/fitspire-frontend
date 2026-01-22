import { Suspense } from 'react';
import { SignInForm } from '@/features/auth/forms/SignInForm';
import { Metadata } from 'next';
import { AuthLayout } from '@/features/auth/components/AuthLayout';

export const metadata: Metadata = {
    title: 'Sign In | Fitspire',
    description: 'Sign in to your account',
};

export default function SignInPage() {
    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Enter your email to sign in to your account"
        >
            <Suspense fallback={<div className="h-[400px] flex items-center justify-center">Loading...</div>}>
                <SignInForm />
            </Suspense>
        </AuthLayout>
    );
}
