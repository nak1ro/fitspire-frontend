'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignUpData, signUpSchema } from '../schemas/sign-up.schema';
import { useEmailSignUp } from '../hooks/useEmailSignUp';
import { Button, Input, Alert, Divider, OAuthButton } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { STRONG_PASSWORD_HINT } from '@/shared/lib/strongPassword';

// ─── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: 1 | 2 }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            {/* Step 1 circle */}
            <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-200"
                style={{
                    background: step >= 1 ? 'linear-gradient(135deg, #059669, #34D399)' : undefined,
                    backgroundColor: step >= 1 ? undefined : 'var(--color-surface-200)',
                    color: step >= 1 ? '#fff' : 'var(--color-surface-500)',
                    boxShadow: step >= 1 ? 'var(--shadow-chip)' : undefined,
                }}
            >
                {step > 1 ? '✓' : '1'}
            </div>

            {/* Connector line */}
            <div className="flex-1 h-px bg-surface-200 overflow-hidden rounded-full">
                <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                        width: step > 1 ? '100%' : '0%',
                        background: 'linear-gradient(to right, #059669, #34D399)',
                    }}
                />
            </div>

            {/* Step 2 circle */}
            <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-200"
                style={{
                    background: step >= 2 ? 'linear-gradient(135deg, #059669, #34D399)' : undefined,
                    backgroundColor: step >= 2 ? undefined : 'var(--color-surface-200)',
                    color: step >= 2 ? '#fff' : 'var(--color-surface-500)',
                    boxShadow: step >= 2 ? 'var(--shadow-chip)' : undefined,
                }}
            >
                2
            </div>
        </div>
    );
}

// ─── Form ─────────────────────────────────────────────────────────────────────

export function SignUpForm() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [isSigningIn, setIsSigningIn] = useState(false);

    const { register, handleSubmit, trigger, formState: { errors } } = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
        mode: 'onTouched',
    });

    const { mutateAsync, isPending, error } = useEmailSignUp();

    const handleContinue = async () => {
        const valid = await trigger(['displayName', 'userName']);
        if (valid) setStep(2);
    };

    const onSubmit = async (data: SignUpData) => {
        try {
            await mutateAsync({
                ...data,
                displayName: data.displayName?.trim() || null,
            });

            setIsSigningIn(true);
            const result = await signIn('credentials', {
                login: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.ok) {
                router.push('/feed');
                router.refresh();
            } else {
                setIsSigningIn(false);
                router.push('/auth?mode=login&registered=true');
            }
        } catch {
            setIsSigningIn(false);
            // error captured in mutation state
        }
    };

    return (
        <div className="space-y-5">

            <StepIndicator step={step} />

            {step === 1 && (
                <div className="space-y-4">
                    <div className="space-y-1 mb-4">
                        <h2 className="text-base font-semibold text-foreground">Create your identity</h2>
                        <p className="text-xs text-surface-500">Pick a username — this is how the community will know you.</p>
                    </div>

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

                    <Button type="button" fullWidth onClick={handleContinue}>
                        Continue
                    </Button>

                    <Divider label="or" />

                    <OAuthButton provider="google" mode="signup" />

                    <p className="text-xs text-surface-500 text-center">
                        Already have an account?{' '}
                        <Link
                            href="/auth?mode=login"
                            className="font-semibold text-primary-500 hover:opacity-70 transition-opacity"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            )}

            {step === 2 && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1 mb-4">
                        <h2 className="text-base font-semibold text-foreground">Secure your account</h2>
                        <p className="text-xs text-surface-500">Your email and a strong password — almost there.</p>
                    </div>

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
                        hint={STRONG_PASSWORD_HINT}
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

                    <Button type="submit" loading={isPending || isSigningIn} fullWidth>
                        Create account
                    </Button>

                    <p className="text-center">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-xs text-surface-500 hover:text-foreground transition-colors"
                        >
                            ← Back
                        </button>
                    </p>
                </form>
            )}
        </div>
    );
}
