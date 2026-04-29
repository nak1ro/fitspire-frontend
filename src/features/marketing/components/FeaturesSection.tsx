import { Users, Dumbbell, Trophy, TrendingUp, type LucideIcon } from 'lucide-react';
import { FadeIn } from '@/shared/ui/FadeIn';

interface Feature {
    Icon: LucideIcon;
    title: string;
    description: string;
    wide?: boolean;
}

const features: Feature[] = [
    {
        Icon: Users,
        title: 'Social Feed',
        description:
            'See every PR, milestone, and sweat session from your community. ' +
            'Cheer them on, leave a comment, or let the numbers speak for themselves.',
        wide: true,
    },
    {
        Icon: Dumbbell,
        title: 'Workout Logging',
        description: 'Log sets, reps, and weights in seconds. Your full history, always one tap away.',
    },
    {
        Icon: Trophy,
        title: 'Challenges',
        description: 'Create a challenge, set the goal, invite your friends — and see who rises to it.',
    },
    {
        Icon: TrendingUp,
        title: 'Progress Tracking',
        description:
            'Watch your numbers climb over weeks and months. ' +
            'Every session adds another point to your story.',
        wide: true,
    },
];

export function FeaturesSection() {
    return (
        <section className="bg-surface py-24 px-6">
            <div className="mx-auto max-w-6xl space-y-14">

                {/* Header */}
                <FadeIn className="text-center">
                    <p className="text-xs font-semibold tracking-widest uppercase text-primary-500 mb-3">
                        Everything you need
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                        Built for the way you train
                    </h2>
                </FadeIn>

                {/* Bento grid */}
                <FadeIn from="bottom">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {features.map((feature, i) => (
                            <div
                                key={feature.title}
                                className={feature.wide ? 'sm:col-span-2' : undefined}
                            >
                                <FeatureCard feature={feature} />
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}

function FeatureCard({ feature }: { feature: Feature }) {
    const { Icon, title, description } = feature;
    return (
        <div className="h-full rounded-2xl border border-surface-200 bg-background p-6 lg:p-8 space-y-4">
            <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ backgroundColor: 'rgba(194,109,56,0.08)' }}
            >
                <Icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
            </div>
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-surface-600 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}
