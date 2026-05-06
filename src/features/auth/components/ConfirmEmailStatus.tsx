'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Alert } from '@/shared/ui';
import { Typography } from '@/shared/ui/Typography';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useConfirmEmail } from '../hooks/useConfirmEmail';

export function ConfirmEmailStatus() {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');
    const [confirmed, setConfirmed] = useState(false);
    const hasRequiredParams = Boolean(userId && token);

    const { mutate, isPending, error } = useConfirmEmail(() => {
        setConfirmed(true);
    });

    useEffect(() => {
        if (hasRequiredParams) {
            mutate({ userId: userId!, token: token! });
        }
    }, [hasRequiredParams, mutate, token, userId]);

    if (!hasRequiredParams) {
        return (
            <div className="space-y-5">
                <Alert variant="error" title="Invalid confirmation link">
                    This email confirmation link is missing required information.
                </Alert>

                <Link href="/sign-in">
                    <Button variant="ghost" fullWidth>
                        Back to sign in
                    </Button>
                </Link>
            </div>
        );
    }

    if (confirmed) {
        return (
            <div className="space-y-6 text-center py-2">
                <Alert variant="success" title="Email confirmed">
                    Your account is ready. You can now sign in.
                </Alert>

                <Link href="/sign-in">
                    <Button fullWidth>
                        Continue to sign in
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-5 text-center">
            {isPending && (
                <Typography variant="body-sm" color="muted">
                    Confirming your email address...
                </Typography>
            )}

            {error && (
                <Alert variant="error" title="Confirmation failed">
                    {getErrorMessage(error, 'This confirmation link is invalid or expired.')}
                </Alert>
            )}

            {error && (
                <Link href="/sign-in">
                    <Button variant="ghost" fullWidth>
                        Back to sign in
                    </Button>
                </Link>
            )}
        </div>
    );
}
