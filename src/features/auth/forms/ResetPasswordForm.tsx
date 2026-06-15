'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Input, Alert } from '@/shared/ui';
import { Typography } from '@/shared/ui/Typography';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { ResetPasswordData, resetPasswordSchema } from '../schemas/reset-password.schema';
import { useResetPassword } from '../hooks/useResetPassword';

export function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    const [isReset, setIsReset] = useState(false);
    const hasRequiredParams = Boolean(email && token);

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const { mutate, isPending, error } = useResetPassword(() => {
        setIsReset(true);
    });

    if (!hasRequiredParams) {
        return (
            <div className="space-y-5">
                <Alert variant="error" title="Invalid reset link">
                    This password reset link is missing required information.
                </Alert>

                <Link href="/auth?mode=forgot-password">
                    <Button variant="ghost" fullWidth>
                        Request a new link
                    </Button>
                </Link>
            </div>
        );
    }

    if (isReset) {
        return (
            <div className="space-y-6 text-center py-2">
                <Alert variant="success" title="Password updated">
                    You can now sign in with your new password.
                </Alert>

                <Link href="/auth?mode=login">
                    <Button fullWidth>
                        Continue to sign in
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <form
                onSubmit={handleSubmit((data) => {
                    mutate({
                        email: email!,
                        token: token!,
                        newPassword: data.newPassword,
                    });
                })}
                className="space-y-4"
            >
                <Input
                    label="New password"
                    type="password"
                    placeholder="********"
                    autoComplete="new-password"
                    error={errors.newPassword?.message}
                    {...register('newPassword')}
                />

                <Input
                    label="Confirm new password"
                    type="password"
                    placeholder="********"
                    autoComplete="new-password"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                />

                {error && (
                    <Alert variant="error">
                        {getErrorMessage(error, 'Password reset failed. Please request a new link.')}
                    </Alert>
                )}

                <Button type="submit" loading={isPending} fullWidth>
                    Update password
                </Button>
            </form>

            <Typography variant="body-sm" color="muted" className="text-center">
                Need another link?{' '}
                <Link
                    href="/auth?mode=forgot-password"
                    className="font-semibold text-primary-500 hover:opacity-70 transition-opacity"
                >
                    Request again
                </Link>
            </Typography>
        </div>
    );
}
