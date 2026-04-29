import Link from 'next/link';
import { Button } from '@/shared/ui';
import { FadeIn } from '@/shared/ui/FadeIn';
import { Check } from 'lucide-react';

const WAVEFORM_HEIGHTS = [30, 46, 60, 72, 80, 74, 64, 50, 38, 28, 34, 48, 62, 70, 74, 66, 52, 40, 32, 44];
const trustItems = ['No credit card required', 'Free forever', 'Community included'];

function WaveformDecoration({ mirrored }: { mirrored?: boolean }) {
    return (
        <div
            aria-hidden="true"
            className="absolute hidden 2xl:flex items-end gap-[3px] h-20 pointer-events-none"
            style={{
                top: '50%',
                transform: `translateY(-50%)${mirrored ? ' scaleX(-1)' : ''}`,
                ...(mirrored ? { right: '4rem' } : { left: '4rem' }),
            }}
        >
            {WAVEFORM_HEIGHTS.map((h, i) => (
                <div
                    key={i}
                    className="w-1.5 rounded-full animate-pulse"
                    style={{
                        height: `${h}%`,
                        background: `rgba(194,109,56,${0.05 + (h / 100) * 0.13})`,
                        animationDelay: `${i * 80}ms`,
                        animationDuration: `${1100 + i * 60}ms`,
                    }}
                />
            ))}
        </div>
    );
}

export function CtaSection() {
    return (
        <section className="relative py-32 px-6 overflow-hidden bg-background border-t border-surface-200">

            {/* CSS line grid */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(28,21,16,0.03) 1px, transparent 1px), ' +
                        'linear-gradient(to right, rgba(28,21,16,0.03) 1px, transparent 1px)',
                    backgroundSize: '72px 72px',
                }}
            />

            {/* Centered blur orb */}
            <div
                aria-hidden="true"
                className="absolute pointer-events-none rounded-full"
                style={{
                    width: 720,
                    height: 420,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(194,109,56,0.08)',
                    filter: 'blur(80px)',
                }}
            />

            {/* Waveform decorations */}
            <WaveformDecoration />
            <WaveformDecoration mirrored />

            <FadeIn className="relative mx-auto max-w-2xl text-center space-y-8">

                <p className="text-xs font-semibold tracking-widest uppercase text-primary-500">
                    Ready when you are
                </p>

                <h2 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
                    Your first PR
                    <br />
                    <span className="text-primary-500">is waiting.</span>
                </h2>

                <p className="text-lg text-surface-600 leading-relaxed max-w-lg mx-auto">
                    Join Fitspire today. Log your workouts, challenge friends,
                    and track the progress that makes every session worth it.
                </p>

                <div className="flex justify-center">
                    <Link href="/sign-up">
                        <Button size="lg">Get started free</Button>
                    </Link>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                    {trustItems.map(item => (
                        <div key={item} className="flex items-center gap-1.5 text-sm text-surface-500">
                            <Check className="h-3.5 w-3.5 text-primary-500 shrink-0" aria-hidden="true" />
                            {item}
                        </div>
                    ))}
                </div>

            </FadeIn>
        </section>
    );
}
