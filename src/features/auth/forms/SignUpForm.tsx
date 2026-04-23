'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignUpData, signUpSchema } from '../schemas/sign-up.schema';
import { useEmailSignUp } from '../hooks/useEmailSignUp';
import { Button, Input, Alert, Divider } from '@/shared/ui';
import { Typography } from '@/shared/ui/Typography';
import { SocialButtons } from '../components/SocialButtons';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';

export function SignUpForm() {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
    });

    const { mutateAsync, isPending, error } = useEmailSignUp();

    const onSubmit = async (data: SignUpData) => {
        try {
            await mutateAsync({
                ...data,
                displayName: data.displayName?.trim() || null,
            });

            // Auto-login immediately after successful registration
            const result = await signIn('credentials', {
                login: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.ok) {
                router.push('/feed');
            } else {
                // Registration succeeded but session creation failed — fall back to sign-in
                router.push('/sign-in?registered=true');
            }
        } catch {
            // error is captured in mutation state, displayed via Alert below
        }
    };

    return (
        <div className="space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Display name"
                    type="text"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    hint="How your name appears in the feed (optional)"
                    error={errors.displayName?.message}
                    {...register('displayName')}
                />

                <Input
                    label="Username"
                    type="text"
                    placeholder="janedoe"
                    autoComplete="username"
                    error={errors.userName?.message}
                    {...register('userName')}
                />

                <Input
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    error={errors.password?.message}
                    {...register('password')}
                />

                <Input
                    label="Confirm password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                />

                {error && (
                    <Alert variant="error">
                        {getErrorMessage(error, 'Registration failed. Please try again.')}
                    </Alert>
                )}

                <Button type="submit" loading={isPending} fullWidth>
                    Create account
                </Button>
            </form>

            <Divider label="or" />

            <SocialButtons />

            <Typography variant="body-sm" color="muted" className="text-center">
                Already have an account?{' '}
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
