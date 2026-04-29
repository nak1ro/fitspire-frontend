import { FadeIn } from '@/shared/ui/FadeIn';

export function ManifestoSection() {
    return (
        <section className="relative py-28 px-6 bg-background overflow-hidden">

            {/* Warm radial wash */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(194,109,56,0.07) 0%, transparent 70%)',
                }}
            />

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

            {/* Giant decorative opening quote — anchored to content left edge */}
            <div
                aria-hidden="true"
                className="absolute -top-8 select-none pointer-events-none font-bold"
                style={{
                    left: 'max(24px, calc(50% - 512px))',
                    fontSize: 'clamp(10rem, 20vw, 20rem)',
                    color: 'rgba(194,109,56,0.10)',
                    fontFamily: 'Georgia, serif',
                    lineHeight: 1,
                }}
            >
                &ldquo;
            </div>

            <FadeIn className="relative mx-auto max-w-4xl space-y-8">

                {/* Amber rule + eyebrow */}
                <div className="flex items-center gap-4">
                    <div className="h-px w-10 rounded-full bg-primary-400" aria-hidden="true" />
                    <p className="text-xs font-semibold tracking-widest uppercase text-primary-500">
                        Our belief
                    </p>
                </div>

                {/* Quote */}
                <p className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.12] text-foreground">
                    The gym is personal.
                    <br />
                    <span className="text-primary-500">
                        Your journey doesn&apos;t have to be.
                    </span>
                </p>

                {/* Supporting text */}
                <p className="text-lg text-surface-600 max-w-xl leading-relaxed">
                    Fitness is better when it&apos;s shared. Fitspire gives your
                    workouts an audience — and gives you theirs.
                </p>
            </FadeIn>
        </section>
    );
}
