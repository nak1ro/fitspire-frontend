'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/shared/ui';

export function SocialButtons() {
    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/feed' });
    };

    return (
        <div className="flex flex-col gap-3">
            <Button
                variant="secondary"
                onClick={handleGoogleSignIn}
                fullWidth
                className="gap-2"
                type="button"
            >
                {/* Simple G icon since Lucide doesn't have Google brand icon yet */}
                <span className="font-bold text-blue-500">G</span>
                Continue with Google
            </Button>
        </div>
    );
}
