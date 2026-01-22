'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { ForgotPasswordData, forgotPasswordSchema } from '../schemas/forgot-password.schema';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { Button, Input } from '@/shared/ui';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function ForgotPasswordForm() {
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const { mutate, isPending, error } = useForgotPassword(() => {
        setSuccess(true);
    });

    if (success) {
        return (
            <div className="max-w-sm mx-auto text-center space-y-6">
                <div className="rounded-full bg-green-100 p-3 w-12 h-12 mx-auto flex items-center justify-center">
                    <span className="text-2xl">📧</span>
                </div>
                <div>
                    <h2 className="text-xl font-bold">Check your email</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        We've sent a password reset link to your email address.
                    </p>
                </div>
                <Link href="/sign-in">
                    <Button variant="secondary" fullWidth>
                        Back to Sign In
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Forgot Password?</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                        {(error as any)?.message || 'Something went wrong'}
                    </div>
                )}

                <Button type="submit" loading={isPending} fullWidth>
                    Send Reset Link
                </Button>
            </form>

            <Link
                href="/sign-in"
                className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
                <ArrowLeft size={16} />
                Back to Sign In
            </Link>
        </div>
    );
}
