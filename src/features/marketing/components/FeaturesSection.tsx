import { Users, Dumbbell, Trophy, TrendingUp, type LucideIcon } from 'lucide-react';
import { FadeIn } from '@/shared/ui/FadeIn';
import React from 'react';

// ─── Per-card color palette ────────────────────────────────────────────────────

const COLORS = {
    feed: {
        iconBg: 'rgba(194,109,56,0.08)',
        iconFg: '#C26D38',
        bar: 'linear-gradient(to right, #C26D38, #EDAC76, transparent)',
    },
    workout: {
        iconBg: 'rgba(74,124,95,0.08)',
        iconFg: '#4A7C5F',
        bar: 'linear-gradient(to right, #4A7C5F, #7AB895, transparent)',
    },
    challenges: {
        iconBg: 'rgba(184,134,11,0.08)',
        iconFg: '#B8860B',
        bar: 'linear-gradient(to right, #B8860B, #D4A843, transparent)',
    },
    progress: {
        iconBg: 'rgba(58,122,138,0.08)',
        iconFg: '#3A7A8A',
        bar: 'linear-gradient(to right, #3A7A8A, #6AAABB, transparent)',
    },
} as const;

type ColorKey = keyof typeof COLORS;

// ─── Mockup visuals ────────────────────────────────────────────────────────────

function FeedMockup() {
    const posts = [
        { initials: 'JM', name: 'Jake M.', workout: 'Leg Day · 1h 20m', likes: 24, pr: true },
        { initials: 'SR', name: 'Sara R.', workout: 'Pull Session · 45m', likes: 11, pr: false },
    ];
    return (
        <div className="space-y-2 mt-4">
            {posts.map(post => (
                <div key={post.name} className="flex items-center gap-2.5 rounded-xl border border-surface-100 bg-surface px-3 py-2.5">
                    <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: 'rgba(194,109,56,0.10)', color: '#C26D38' }}
                    >
                        {post.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground leading-none">{post.name}</p>
                        <p className="text-[10px] text-surface-400 mt-0.5 truncate">{post.workout}</p>
                    </div>
                    {post.pr && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary-50 text-primary-600 border border-primary-200 uppercase tracking-wide shrink-0">
                            PR
                        </span>
                    )}
                    <span className="text-[10px] text-surface-400 shrink-0">❤️ {post.likes}</span>
                </div>
            ))}
        </div>
    );
}

function WorkoutMockup() {
    const exercises = [
        { name: 'Squat', sets: '4×5', weight: '120 kg', pr: true },
        { name: 'RDL', sets: '3×8', weight: '90 kg', pr: false },
        { name: 'Leg Press', sets: '3×12', weight: '180 kg', pr: false },
    ];
    return (
        <div className="space-y-1.5 mt-4">
            {exercises.map(ex => (
                <div key={ex.name} className="flex items-center gap-2 rounded-lg border border-surface-100 bg-surface px-3 py-2">
                    <span className="flex-1 text-xs font-medium text-foreground min-w-0 flex items-center gap-1">
                        {ex.pr && <span aria-hidden="true" className="shrink-0">🔥</span>}
                        {ex.name}
                    </span>
                    <span className="text-[10px] text-surface-400 shrink-0">{ex.sets}</span>
                    <span className="text-[10px] font-semibold text-foreground shrink-0">{ex.weight}</span>
                </div>
            ))}
        </div>
    );
}

function ChallengeMockup() {
    return (
        <div className="mt-4 rounded-xl border border-surface-100 bg-surface p-3 space-y-3">
            <div className="flex items-start gap-2">
                <p className="flex-1 text-xs font-bold text-foreground leading-snug">
                    30-Day Push-Up Challenge
                </p>
                <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 border"
                    style={{ background: 'rgba(184,134,11,0.08)', color: '#B8860B', borderColor: 'rgba(184,134,11,0.25)' }}
                >
                    Active
                </span>
            </div>
            <div className="flex -space-x-1.5">
                {['YO', 'MK', 'JR'].map(init => (
                    <div
                        key={init}
                        className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold"
                        style={{ backgroundColor: 'rgba(184,134,11,0.10)', color: '#B8860B' }}
                    >
                        {init}
                    </div>
                ))}
                <div className="w-6 h-6 rounded-full border-2 border-background bg-surface-200 flex items-center justify-center text-[9px] font-medium text-surface-500">
                    +8
                </div>
            </div>
            <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-surface-500">
                    <span>Your progress</span>
                    <span className="font-semibold text-foreground">Day 18 / 30</span>
                </div>
                <div className="h-2 rounded-full bg-background overflow-hidden">
                    <div
                        className="h-full rounded-full"
                        style={{ width: '60%', background: 'linear-gradient(to right, #B8860B, #D4A843)' }}
                    />
                </div>
            </div>
        </div>
    );
}

function ProgressMockup() {
    const data = [70, 75, 72, 80, 82, 85, 88, 92];
    const labels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
    const max = Math.max(...data);
    const min = Math.min(...data);
    const W = 240, H = 56, PAD = 6;
    const points = data.map((v, i): [number, number] => [
        (i / (data.length - 1)) * W,
        H - PAD - ((v - min) / (max - min)) * (H - PAD * 2),
    ]);
    const polylineStr = points.map(([x, y]) => `${x},${y}`).join(' ');
    const areaStr = `0,${H} ${polylineStr} ${W},${H}`;
    const [lastX, lastY] = points[points.length - 1];

    return (
        <div className="mt-4 space-y-2">
            <div className="flex items-baseline justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-surface-500">Bench 1RM</p>
                <p className="text-sm font-bold text-foreground">
                    92 kg{' '}
                    <span className="text-xs font-medium" style={{ color: '#3A7A8A' }}>↑ +22 kg</span>
                </p>
            </div>
            <div className="rounded-xl bg-surface p-3 overflow-hidden">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: H }}>
                    <defs>
                        <linearGradient id="fitspire-progress-fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(58,122,138,0.22)" />
                            <stop offset="100%" stopColor="rgba(58,122,138,0)" />
                        </linearGradient>
                    </defs>
                    <polygon points={areaStr} fill="url(#fitspire-progress-fill)" />
                    <polyline
                        points={polylineStr}
                        fill="none"
                        stroke="#3A7A8A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <circle cx={lastX} cy={lastY} r="3.5" fill="#3A7A8A" />
                </svg>
            </div>
            <div className="flex justify-between px-0.5">
                {labels.map(l => (
                    <span key={l} className="text-[9px] text-surface-400">{l}</span>
                ))}
            </div>
        </div>
    );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface FeatureCardProps {
    Icon: LucideIcon;
    title: string;
    description: string;
    visual: React.ReactNode;
    colorKey: ColorKey;
}

function FeatureCard({ Icon, title, description, visual, colorKey }: FeatureCardProps) {
    const color = COLORS[colorKey];
    return (
        <div className="h-full flex flex-col rounded-2xl border border-surface-200 bg-background overflow-hidden">
            <div className="h-[3px] shrink-0" style={{ background: color.bar }} />
            <div className="flex-1 flex flex-col p-5 lg:p-6">
                <div className="flex items-start gap-3">
                    <div
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                        style={{ backgroundColor: color.iconBg }}
                    >
                        <Icon className="h-5 w-5" style={{ color: color.iconFg }} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-base font-semibold text-foreground leading-snug">{title}</h3>
                        <p className="text-xs text-surface-600 leading-relaxed mt-1">{description}</p>
                    </div>
                </div>
                <div className="mt-auto">
                    {visual}
                </div>
            </div>
        </div>
    );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function FeaturesSection() {
    return (
        <section className="bg-surface py-24 px-6 border-t border-surface-200">
            <div className="mx-auto max-w-6xl space-y-14">

                <FadeIn className="text-center">
                    <p className="text-xs font-semibold tracking-widest uppercase text-primary-500 mb-3">
                        Everything you need
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                        Built for the way you train
                    </h2>
                </FadeIn>

                <FadeIn>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        <div className="sm:col-span-2">
                            <FeatureCard
                                Icon={Users}
                                title="Social Feed"
                                description="See every PR, milestone, and session from your community. Cheer them on or let your numbers do the talking."
                                visual={<FeedMockup />}
                                colorKey="feed"
                            />
                        </div>

                        <div>
                            <FeatureCard
                                Icon={Dumbbell}
                                title="Workout Logging"
                                description="Log sets, reps, and weights in seconds. Your full history, always one tap away."
                                visual={<WorkoutMockup />}
                                colorKey="workout"
                            />
                        </div>

                        <div>
                            <FeatureCard
                                Icon={Trophy}
                                title="Challenges"
                                description="Create a challenge, set the goal, invite friends — and see who rises to it."
                                visual={<ChallengeMockup />}
                                colorKey="challenges"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <FeatureCard
                                Icon={TrendingUp}
                                title="Progress Tracking"
                                description="Watch your numbers climb over weeks and months. Every session adds another point to your story."
                                visual={<ProgressMockup />}
                                colorKey="progress"
                            />
                        </div>

                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
