'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SignUpData, signUpSchema } from '../schemas/sign-up.schema';
import { useEmailSignUp } from '../hooks/useEmailSignUp';
import { Button, Input } from '@/shared/ui';
import { Typography } from '@/shared/ui/Typography';
import { SocialButtons } from '../components/SocialButtons';
import Link from 'next/link';

export function SignUpForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
    });

    const { mutate, isPending, error } = useEmailSignUp(() => {
        // On success, redirect to login or auto-login
        router.push('/sign-in?registered=true');
    });

    return (
        <div className="flex flex-col gap-6 w-full">
            <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
                <Input
                    label="Username"
                    type="text"
                    placeholder="johndoe"
                    error={errors.userName?.message}
                    {...register('userName')}
                />

                <Input
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register('password')}
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                />

                {error && (
                    <div className="p-3 text-sm text-error bg-error/10 border border-error/20 rounded-lg">
                        {(error as any)?.message || 'Registration failed'}
                    </div>
                )}

                <Button type="submit" variant="gradient" loading={isPending} fullWidth>
                    Create Account
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
                    Already have an account?{' '}
                    <Link href="/sign-in">
                        <Typography as="span" variant="body-sm" weight="semibold" className="text-primary-600 hover:text-primary-500 transition-colors cursor-pointer">
                            Sign in
                        </Typography>
                    </Link>
                </Typography>
            </div>
        </div>
    );
}
