import { Suspense } from 'react';
import { Metadata } from 'next';
import { AuthPageContent } from '@/features/auth/components/AuthPageContent';

export const metadata: Metadata = {
    title: 'Sign In | Fitspire',
    description: 'Sign in or create your Fitspire account',
};

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <AuthPageContent />
        </Suspense>
    );
}
