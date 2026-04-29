import Link from 'next/link';
import { Button } from '@/shared/ui';

export function HeroSection() {
    return (
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Label */}
                <div className="flex justify-center">
                    <span className="inline-flex items-center rounded-full border border-surface-200 bg-surface px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-surface-500">
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
                    Log every workout, challenge your friends, and track progress on the platform built for fitness communities.
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
