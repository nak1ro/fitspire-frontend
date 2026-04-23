'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { ForgotPasswordData, forgotPasswordSchema } from '../schemas/forgot-password.schema';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { Button, Input, Alert } from '@/shared/ui';
import { Typography } from '@/shared/ui/Typography';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';

export function ForgotPasswordForm() {
    const [sentTo, setSentTo] = useState<string | null>(null);

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const { mutate, isPending, error } = useForgotPassword(() => {
        setSentTo(getValues('email'));
    });

    // In-place success swap
    if (sentTo) {
        return (
            <div className="space-y-6 text-center py-2">
                <div
                    className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(194,109,56,0.08)' }}
                >
                    <Mail className="h-5 w-5 text-primary-500" aria-hidden="true" />
                </div>

                <div className="space-y-1.5">
                    <Typography variant="h4">Check your inbox</Typography>
                    <Typography variant="body-sm" color="muted">
                        We sent a reset link to{' '}
                        <span className="font-medium text-foreground">{sentTo}</span>.
                        {' '}It expires in 15 minutes.
                    </Typography>
                </div>

                <Link href="/sign-in">
                    <Button variant="ghost" fullWidth>
                        Back to sign in
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register('email')}
                />

                {error && (
                    <Alert variant="error">
                        {getErrorMessage(error, 'Something went wrong. Please try again.')}
                    </Alert>
                )}

                <Button type="submit" loading={isPending} fullWidth>
                    Send reset link
                </Button>
            </form>

            <Typography variant="body-sm" color="muted" className="text-center">
                Remember your password?{' '}
                <Link
                    href="/sign-in"
                    className="font-semibold text-primary-500 hover:opacity-70 transition-opacity"
                >
                    Sign in
                </Link>
            </Typography>
        </div>
    );
}
