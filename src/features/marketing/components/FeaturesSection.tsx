import { Sparkles, Users, Dumbbell, Apple, Trophy, Award, Flame, type LucideIcon } from 'lucide-react';
import { FadeIn } from '@/shared/ui/FadeIn';
import { IconChip, EyebrowBadge } from '@/shared/ui';
import React from 'react';

// ─── Per-card color palette — sourced from the same accents used inside the app ─
// (workouts blue / streak+goal orange / AI violet / nutrition terracotta / badge gold)

const COLORS = {
    coach: {
        iconBg: 'rgba(124,58,237,0.08)',
        iconFg: '#7C3AED',
        bar: 'linear-gradient(to right, #7C3AED, #A78BFA, transparent)',
    },
    feed: {
        iconBg: 'rgba(5,150,105,0.08)',
        iconFg: '#059669',
        bar: 'linear-gradient(to right, #059669, #34D399, transparent)',
    },
    workout: {
        iconBg: 'rgba(37,99,235,0.08)',
        iconFg: '#2563EB',
        bar: 'linear-gradient(to right, #2563EB, #60A5FA, transparent)',
    },
    nutrition: {
        iconBg: 'rgba(194,112,61,0.08)',
        iconFg: '#C2703D',
        bar: 'linear-gradient(to right, #C2703D, #E0A672, transparent)',
    },
    goals: {
        iconBg: 'rgba(234,88,12,0.08)',
        iconFg: '#EA580C',
        bar: 'linear-gradient(to right, #EA580C, #FB923C, transparent)',
    },
    badges: {
        iconBg: 'rgba(201,162,39,0.08)',
        iconFg: '#C9A227',
        bar: 'linear-gradient(to right, #C9A227, #E4C766, transparent)',
    },
} as const;

type ColorKey = keyof typeof COLORS;

// ─── Mockup visuals ────────────────────────────────────────────────────────────

function CoachMockup() {
    return (
        <div className="mt-4 rounded-xl border border-surface-100 bg-surface p-3 space-y-2.5">
            <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" style={{ color: '#7C3AED' }} aria-hidden="true" />
                <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: '#7C3AED' }}>
                    Today&apos;s guidance
                </span>
            </div>
            <p className="text-xs font-semibold text-foreground leading-snug">
                Recovery looks low — ease into today&apos;s session.
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-surface-100 bg-background px-2.5 py-2">
                <span className="text-[9px] font-medium text-surface-400 shrink-0">Next action</span>
                <span className="text-[10px] font-semibold text-foreground truncate">15-min mobility + protein-rich breakfast</span>
            </div>
        </div>
    );
}

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
                        style={{ backgroundColor: 'rgba(5,150,105,0.10)', color: '#059669' }}
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

function NutritionMockup() {
    const macros = [
        { label: 'Protein', value: '142g', pct: 78 },
        { label: 'Carbs', value: '210g', pct: 55 },
        { label: 'Fat', value: '58g', pct: 64 },
    ];
    return (
        <div className="mt-4 space-y-2.5">
            <div className="flex items-baseline justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-surface-500">Today</p>
                <p className="text-sm font-bold text-foreground">
                    1,840 <span className="text-xs font-medium text-surface-400">/ 2,200 kcal</span>
                </p>
            </div>
            <div className="space-y-1.5">
                {macros.map(macro => (
                    <div key={macro.label} className="flex items-center gap-2">
                        <span className="text-[10px] text-surface-500 w-11 shrink-0">{macro.label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-surface overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{ width: `${macro.pct}%`, background: 'linear-gradient(to right, #C2703D, #E0A672)' }}
                            />
                        </div>
                        <span className="text-[10px] font-semibold text-foreground w-9 text-right shrink-0">{macro.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function GoalsMockup() {
    return (
        <div className="mt-4 rounded-xl border border-surface-100 bg-surface p-3 space-y-3">
            <div className="flex items-start gap-2">
                <p className="flex-1 text-xs font-bold text-foreground leading-snug">
                    30-Day Push-Up Challenge
                </p>
                <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 border"
                    style={{ background: 'rgba(234,88,12,0.08)', color: '#EA580C', borderColor: 'rgba(234,88,12,0.25)' }}
                >
                    Active
                </span>
            </div>
            <div className="flex -space-x-1.5">
                {['YO', 'MK', 'JR'].map(init => (
                    <div
                        key={init}
                        className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold"
                        style={{ backgroundColor: 'rgba(234,88,12,0.10)', color: '#EA580C' }}
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
                        style={{ width: '60%', background: 'linear-gradient(to right, #EA580C, #FB923C)' }}
                    />
                </div>
            </div>
        </div>
    );
}

function BadgesMockup() {
    const badges = [
        { tier: 'Bronze', color: '#B87333', bg: 'rgba(184,115,51,0.10)' },
        { tier: 'Silver', color: '#8B95A1', bg: 'rgba(139,149,161,0.12)' },
        { tier: 'Gold', color: '#C9A227', bg: 'rgba(201,162,39,0.12)' },
    ];
    return (
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2">
                {badges.map(badge => (
                    <div
                        key={badge.tier}
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-chip"
                        style={{ backgroundColor: badge.bg }}
                    >
                        <Award className="h-5 w-5" style={{ color: badge.color }} aria-hidden="true" />
                    </div>
                ))}
            </div>
            <div className="flex-1 flex items-center gap-2 rounded-xl border border-surface-100 bg-surface px-3 py-2.5">
                <Flame className="h-4 w-4 shrink-0" style={{ color: '#EA580C' }} aria-hidden="true" />
                <span className="text-xs font-semibold text-foreground">12-day streak</span>
                <span className="ml-auto text-[10px] text-surface-400 shrink-0">Personal best</span>
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
        <div
            className="h-full flex flex-col rounded-2xl border border-surface-200 bg-background overflow-hidden hover-card"
            style={{ boxShadow: 'var(--shadow-card)' }}
        >
            <div className="h-[3px] shrink-0" style={{ background: color.bar }} />
            <div className="flex-1 flex flex-col p-5 lg:p-6">
                <div className="flex items-start gap-3">
                    <IconChip icon={Icon} bg={color.iconBg} color={color.iconFg} />
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
                    <EyebrowBadge className="justify-center mb-3">Everything you need</EyebrowBadge>
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                        Built for the way you train
                    </h2>
                </FadeIn>

                <FadeIn>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        <div className="sm:col-span-2">
                            <FeatureCard
                                Icon={Sparkles}
                                title="AI Coach"
                                description="Daily guidance, weekly reports, and answers to your training questions — powered by AI, grounded in your actual data."
                                visual={<CoachMockup />}
                                colorKey="coach"
                            />
                        </div>

                        <div>
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
                                Icon={Apple}
                                title="Nutrition Tracking"
                                description="Log meals, hit your macros, and see exactly how your plate lines up with your training."
                                visual={<NutritionMockup />}
                                colorKey="nutrition"
                            />
                        </div>

                        <div>
                            <FeatureCard
                                Icon={Trophy}
                                title="Goals & Challenges"
                                description="Set a target, invite a friend, and race each other to it — or chase your own goal at your own pace."
                                visual={<GoalsMockup />}
                                colorKey="goals"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <FeatureCard
                                Icon={Award}
                                title="Badges & Streaks"
                                description="Earn badges for the milestones that matter and keep your streak alive, one workout at a time."
                                visual={<BadgesMockup />}
                                colorKey="badges"
                            />
                        </div>

                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
