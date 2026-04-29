import { FadeIn } from '@/shared/ui/FadeIn';

export function ManifestoSection() {
    return (
        <section className="py-28 px-6 bg-background">
            <FadeIn className="mx-auto max-w-4xl text-center space-y-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-primary-500">
                    Our belief
                </p>
                <p className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.12] text-foreground">
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
