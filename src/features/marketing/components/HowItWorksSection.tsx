import { UserPlus, Dumbbell, Trophy, type LucideIcon } from 'lucide-react';
import { FadeIn } from '@/shared/ui/FadeIn';
import { EyebrowBadge, IconChip } from '@/shared/ui';

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
        <section className="relative bg-surface py-24 px-6 border-t border-surface-200 overflow-hidden">

            {/* Ambient orbs */}
            <div
                aria-hidden="true"
                className="absolute pointer-events-none rounded-full"
                style={{ width: 420, height: 420, top: -80, left: '12%', background: 'rgba(5,150,105,0.06)', filter: 'blur(80px)' }}
            />
            <div
                aria-hidden="true"
                className="absolute pointer-events-none rounded-full"
                style={{ width: 360, height: 360, bottom: -60, right: '12%', background: 'rgba(5,150,105,0.05)', filter: 'blur(80px)' }}
            />

            <div className="relative mx-auto max-w-5xl space-y-16">

                <FadeIn className="text-center">
                    <EyebrowBadge className="mb-3">How it works</EyebrowBadge>
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                        Up and running in minutes
                    </h2>
                </FadeIn>

                <FadeIn>
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5">

                        {/* Dashed connector — runs between the step number rows on desktop */}
                        <div
                            aria-hidden="true"
                            className="hidden md:block absolute z-0 h-[2px]"
                            style={{
                                top: '47px',
                                left: 'calc(33.33% + 10px)',
                                right: 'calc(33.33% + 10px)',
                                backgroundImage: 'repeating-linear-gradient(to right, rgba(5,150,105,0.30) 0px, rgba(5,150,105,0.30) 8px, transparent 8px, transparent 16px)',
                            }}
                        />

                        {steps.map((step, i) => (
                            <div key={step.number} className="relative z-10">
                                <div className="h-full rounded-2xl border border-surface-200 bg-background overflow-hidden hover-card"
                                    style={{ boxShadow: 'var(--shadow-card)' }}
                                >
                                    {/* Amber top accent */}
                                    <div
                                        className="h-[3px]"
                                        style={{ background: 'linear-gradient(to right, #059669, #34D399, transparent)' }}
                                    />

                                    <div className="p-6 space-y-5">
                                        {/* Step number + icon row */}
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="text-[2.75rem] font-black leading-none tabular-nums"
                                                style={{ color: 'rgba(5,150,105,0.30)' }}
                                            >
                                                {step.number}
                                            </span>
                                            <IconChip icon={step.Icon} size="lg" />
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                                            <p className="text-sm text-surface-600 leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </FadeIn>

            </div>
        </section>
    );
}
