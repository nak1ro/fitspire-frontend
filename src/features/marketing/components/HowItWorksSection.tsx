import { FadeIn } from '@/shared/ui/FadeIn';

const steps = [
    {
        number: '01',
        title: 'Create your account',
        description: 'Sign up in seconds. Pick a username, set your goals, and you\'re in.',
    },
    {
        number: '02',
        title: 'Log your first workout',
        description: 'Record exercises, sets, and reps. Your history builds automatically from day one.',
    },
    {
        number: '03',
        title: 'Challenge someone',
        description: 'Find friends, set a goal together, and find out who rises to it.',
    },
];

export function HowItWorksSection() {
    return (
        <section className="bg-surface py-24 px-6">
            <div className="mx-auto max-w-6xl space-y-16">

                {/* Header */}
                <FadeIn className="text-center">
                    <p className="text-xs font-semibold tracking-widest uppercase text-primary-500 mb-3">
                        How it works
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                        Up and running in minutes
                    </h2>
                </FadeIn>

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
                    {steps.map((step, i) => (
                        <FadeIn key={step.number} delay={i * 120}>
                            <div className="space-y-4">
                                <span
                                    aria-hidden="true"
                                    className="block text-7xl lg:text-8xl font-extrabold tracking-tighter leading-none select-none text-primary-500"
                                    style={{ opacity: 0.18 }}
                                >
                                    {step.number}
                                </span>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-surface-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
