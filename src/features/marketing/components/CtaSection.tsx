import Link from 'next/link';
import { Button } from '@/shared/ui';
import { FadeIn } from '@/shared/ui/FadeIn';

export function CtaSection() {
    return (
        <section className="py-28 px-6 bg-background">
            <FadeIn className="mx-auto max-w-2xl text-center space-y-8">
                <div className="space-y-4">
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
                        Ready to start your journey?
                    </h2>
                    <p className="text-lg text-surface-600 leading-relaxed">
                        Join Fitspire today. It&apos;s free, and your first PR is waiting.
                    </p>
                </div>
                <Link href="/sign-up">
                    <Button size="lg">Get started free</Button>
                </Link>
            </FadeIn>
        </section>
    );
}
