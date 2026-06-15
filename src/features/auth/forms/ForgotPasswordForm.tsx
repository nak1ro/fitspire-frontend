'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { ForgotPasswordData, forgotPasswordSchema } from '../schemas/forgot-password.schema';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { Button, Input, Alert, IconChip } from '@/shared/ui';
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
                <IconChip icon={Mail} size="lg" className="mx-auto" />

                <div className="space-y-1.5">
                    <Typography variant="h4">Check your inbox</Typography>
                    <Typography variant="body-sm" color="muted">
                        We sent a reset link to{' '}
                        <span className="font-medium text-foreground">{sentTo}</span>.
                        {' '}It expires in 15 minutes.
                    </Typography>
                </div>

                <Link href="/auth?mode=login">
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
        </div>
    );
}
