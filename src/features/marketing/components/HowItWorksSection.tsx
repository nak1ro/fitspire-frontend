import { UserPlus, Dumbbell, Trophy, type LucideIcon } from 'lucide-react';
import { FadeIn } from '@/shared/ui/FadeIn';

interface Step {
    number: string;
    Icon: LucideIcon;
    title: string;
    description: string;
}

const steps: Step[] = [
    {
        number: '01',
        Icon: UserPlus,
        title: 'Create your account',
        description: "Sign up in seconds. Pick a username, set your goals, and you're in.",
    },
    {
        number: '02',
        Icon: Dumbbell,
        title: 'Log your first workout',
        description: 'Record exercises, sets, and reps. Your full history builds automatically from day one.',
    },
    {
        number: '03',
        Icon: Trophy,
        title: 'Challenge someone',
        description: 'Find a friend, set a goal together, and find out who rises to it.',
    },
];

export function HowItWorksSection() {
    return (
        <section className="relative bg-surface py-24 px-6 overflow-hidden">

            {/* Ambient orbs */}
            <div
                aria-hidden="true"
                className="absolute pointer-events-none rounded-full"
                style={{ width: 420, height: 420, top: -80, left: '12%', background: 'rgba(194,109,56,0.06)', filter: 'blur(80px)' }}
            />
            <div
                aria-hidden="true"
                className="absolute pointer-events-none rounded-full"
                style={{ width: 360, height: 360, bottom: -60, right: '12%', background: 'rgba(194,109,56,0.05)', filter: 'blur(80px)' }}
            />

            <div className="relative mx-auto max-w-5xl space-y-16">

                <FadeIn className="text-center">
                    <p className="text-xs font-semibold tracking-widest uppercase text-primary-500 mb-3">
                        How it works
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                        Up and running in minutes
                    </h2>
                </FadeIn>

                <div className="space-y-6 md:space-y-10">
                    {steps.map((step, i) => {
                        const isRight = i % 2 === 1;
                        return (
                            <FadeIn key={step.number} delay={i * 140}>
                                <div className={`relative md:max-w-lg ${isRight ? 'md:ml-auto' : 'md:mr-auto'}`}>

                                    {/* Ghost step number — peeks out behind the card on the outer side */}
                                    <div
                                        aria-hidden="true"
                                        className="hidden md:block absolute leading-none font-black select-none pointer-events-none"
                                        style={{
                                            fontSize: '9rem',
                                            color: 'rgba(194,109,56,0.11)',
                                            zIndex: 0,
                                            top: '-1.75rem',
                                            ...(isRight ? { left: '-1.75rem' } : { right: '-1.75rem' }),
                                        }}
                                    >
                                        {step.number}
                                    </div>

                                    {/* Card */}
                                    <div
                                        className="relative rounded-2xl border border-surface-200 bg-background p-6 lg:p-8"
                                        style={{ boxShadow: '0 4px 24px rgba(28,21,16,0.06)', zIndex: 1 }}
                                    >
                                        {/* Amber top accent */}
                                        <div
                                            className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl"
                                            style={{ background: 'linear-gradient(to right, #C26D38, #EDAC76, transparent)' }}
                                        />

                                        <div className="flex items-start gap-4">
                                            <div
                                                className="inline-flex items-center justify-center w-12 h-12 rounded-2xl shrink-0"
                                                style={{ backgroundColor: 'rgba(194,109,56,0.08)' }}
                                            >
                                                <step.Icon className="h-6 w-6 text-primary-500" aria-hidden="true" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-primary-500 tabular-nums">
                                                        {step.number}
                                                    </span>
                                                    <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                                                </div>
                                                <p className="text-sm text-surface-600 leading-relaxed">{step.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </FadeIn>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
