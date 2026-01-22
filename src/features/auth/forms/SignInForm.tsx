'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SignInData, signInSchema } from '../schemas/sign-in.schema';
import { Button, Input } from '@/shared/ui';
import { Typography } from '@/shared/ui/Typography';
import { SocialButtons } from '../components/SocialButtons';
import Link from 'next/link';

export function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/feed';
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInData>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInData) => {
        setLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                login: data.login,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid login or password');
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (e) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                    label="Email or Username"
                    type="text"
                    placeholder="your@email.com"
                    error={errors.login?.message}
                    {...register('login')}
                />

                <div className="space-y-2">
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register('password')}
                    />
                    <div className="flex justify-end">
                        <Link href="/forgot-password">
                            <Typography variant="caption" weight="medium" className="text-primary-600 hover:text-primary-500 transition-colors">
                                Forgot password?
                            </Typography>
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="p-3 text-sm text-error bg-error/10 border border-error/20 rounded-lg">
                        {error}
                    </div>
                )}

                <Button type="submit" variant="gradient" loading={loading} fullWidth>
                    Sign In
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-surface-200 dark:border-surface-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-surface-800 px-2 text-surface-400">
                        Or continue with
                    </span>
                </div>
            </div>

            <SocialButtons />

            <div className="text-center">
                <Typography variant="body-sm" color="muted">
                    Don&apos;t have an account?{' '}
                    <Link href="/sign-up">
                        <Typography as="span" variant="body-sm" weight="semibold" className="text-primary-600 hover:text-primary-500 transition-colors cursor-pointer">
                            Sign up
                        </Typography>
                    </Link>
                </Typography>
            </div>
        </div>
    );
}
