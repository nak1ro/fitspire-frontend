'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SignInData, signInSchema } from '../schemas/sign-in.schema';
import { Button, Input, Alert, Divider } from '@/shared/ui';
import { Typography } from '@/shared/ui/Typography';
import { SocialButtons } from '../components/SocialButtons';

export function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/feed';
    const registered = searchParams.get('registered') === 'true';
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<SignInData>({
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
                setError('Invalid email, username or password.');
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            {registered && (
                <Alert variant="info">
                    Account created — sign in to get started.
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Email or username"
                    type="text"
                    placeholder="your@email.com"
                    autoComplete="username"
                    error={errors.login?.message}
                    {...register('login')}
                />

                <div className="space-y-1.5">
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        error={errors.password?.message}
                        {...register('password')}
                    />
                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-xs font-medium text-primary-500 hover:opacity-70 transition-opacity"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                {error && <Alert variant="error">{error}</Alert>}

                <Button type="submit" loading={loading} fullWidth>
                    Sign in
                </Button>
            </form>

            <Divider label="or" />

            <SocialButtons callbackUrl={callbackUrl} />

            <Typography variant="body-sm" color="muted" className="text-center">
                Don&apos;t have an account?{' '}
                <Link
                    href="/sign-up"
                    className="font-semibold text-primary-500 hover:opacity-70 transition-opacity"
                >
                    Sign up
                </Link>
            </Typography>
        </div>
    );
}
