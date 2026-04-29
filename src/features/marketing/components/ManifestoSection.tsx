import { FadeIn } from '@/shared/ui/FadeIn';

export function ManifestoSection() {
    return (
        <section className="relative py-28 px-6 bg-background overflow-hidden">

            {/* Oversized decorative quote mark */}
            <div
                aria-hidden="true"
                className="absolute -top-4 left-1/2 -translate-x-1/2 text-[22rem] font-bold leading-none select-none pointer-events-none"
                style={{ color: 'rgba(194,109,56,0.05)', fontFamily: 'Georgia, serif' }}
            >
                &ldquo;
            </div>

            <FadeIn className="relative mx-auto max-w-4xl text-center space-y-7">
                <p className="text-xs font-semibold tracking-widest uppercase text-primary-500">
                    Our belief
                </p>
                <p className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.12] text-foreground">
                    The gym is personal.
                    <br />
                    <span className="text-primary-500">
                        Your journey doesn&apos;t have to be.
                    </span>
                </p>
                <p className="text-lg text-surface-600 max-w-xl mx-auto leading-relaxed">
                    Fitness is better when it&apos;s shared. Fitspire gives your
                    workouts an audience — and gives you theirs.
                </p>
            </FadeIn>
        </section>
    );
}
