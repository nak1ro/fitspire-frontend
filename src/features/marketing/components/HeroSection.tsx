import Link from 'next/link';
import { Button } from '@/shared/ui';

export function HeroSection() {
    return (
        <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden">

            {/* Atmospheric warm glow */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(194,109,56,0.09) 0%, transparent 70%)',
                }}
            />

            <div className="relative max-w-2xl mx-auto space-y-8">

                {/* Pill label */}
                <div className="flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-primary-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden="true" />
                        Social fitness platform
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.1] text-foreground">
                    Your fitness,{' '}
                    <span className="text-primary-500">together.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-surface-600 leading-relaxed max-w-md mx-auto">
                    Log every workout, challenge your friends, and track progress
                    on the platform built for fitness communities.
                </p>

                {/* CTAs */}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                    <Link href="/sign-up">
                        <Button size="lg">Get started free</Button>
                    </Link>
                    <Link href="/sign-in">
                        <Button variant="ghost" size="lg">Sign in</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
