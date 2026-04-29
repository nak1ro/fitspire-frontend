import Link from 'next/link';
import { Button } from '@/shared/ui';

function NotificationPill({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div
            className="absolute flex items-center gap-2 whitespace-nowrap rounded-full border border-surface-200 bg-background px-3.5 py-2 text-sm font-medium text-foreground"
            style={{ boxShadow: '0 4px 20px rgba(28,21,16,0.10)', ...style }}
        >
            {children}
        </div>
    );
}

function WorkoutCard() {
    const exercises = [
        ['Bench Press',     '3×8 · 85 kg'],
        ['Shoulder Press',  '3×10 · 60 kg'],
        ['Tricep Dips',     '3×12 · BW'],
    ] as const;

    return (
        <div className="relative" style={{ width: 300 }}>
            {/* Shadow card behind */}
            <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl border border-surface-200 bg-surface-100"
                style={{ transform: 'rotate(-2.5deg) translateY(10px) translateX(-6px)' }}
            />

            {/* Main card */}
            <div
                className="relative rounded-2xl border border-surface-200 bg-background p-5 space-y-4"
                style={{
                    boxShadow: '0 24px 48px -8px rgba(28,21,16,0.14), 0 8px 20px -4px rgba(28,21,16,0.08)',
                    transform: 'rotate(1.5deg)',
                }}
            >
                {/* User row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-600"
                            style={{ backgroundColor: 'rgba(194,109,56,0.12)' }}
                        >
                            LS
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground leading-none">Lisa Summers</p>
                            <p className="text-xs text-surface-400 mt-0.5">@lisa · 2h ago</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary-200 bg-primary-50 text-primary-600 uppercase tracking-wide">
                        New PR 🔥
                    </span>
                </div>

                {/* Workout info */}
                <div className="pb-3 border-b border-surface-100">
                    <p className="font-bold text-foreground">Morning Push Day</p>
                    <p className="text-xs text-surface-400 mt-0.5">Mon, Jun 16 · 1h 12m</p>
                </div>

                {/* Exercise list */}
                <div className="space-y-2.5">
                    {exercises.map(([name, detail]) => (
                        <div key={name} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">{name}</span>
                            <span className="text-xs text-surface-500">{detail}</span>
                        </div>
                    ))}
                    <p className="text-[11px] text-surface-400">+3 more exercises</p>
                </div>

                {/* Footer stats */}
                <div className="flex items-center justify-between border-t border-surface-100 pt-3">
                    <div className="flex items-center gap-3 text-xs text-surface-500">
                        <span>❤️ 14</span>
                        <span>💬 3</span>
                    </div>
                    <span className="text-xs text-surface-500 font-medium">Vol: 8,400 kg</span>
                </div>
            </div>
        </div>
    );
}

const statChips = ['Free to join', 'Workout tracking', 'Live challenges', 'Community feed'];

export function HeroSection() {
    return (
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center px-6 py-16 overflow-hidden">

            {/* Layer 1: CSS line grid */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(28,21,16,0.04) 1px, transparent 1px), ' +
                        'linear-gradient(to right, rgba(28,21,16,0.04) 1px, transparent 1px)',
                    backgroundSize: '72px 72px',
                }}
            />

            {/* Layer 2: Ambient blur orbs */}
            <div
                aria-hidden="true"
                className="absolute pointer-events-none rounded-full"
                style={{
                    width: 640, height: 640,
                    top: -220, left: -180,
                    background: 'rgba(194,109,56,0.09)',
                    filter: 'blur(90px)',
                }}
            />
            <div
                aria-hidden="true"
                className="absolute pointer-events-none rounded-full"
                style={{
                    width: 440, height: 440,
                    bottom: -120, right: -100,
                    background: 'rgba(194,109,56,0.06)',
                    filter: 'blur(80px)',
                }}
            />

            <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: Text */}
                <div className="space-y-7">

                    {/* Pill label */}
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-primary-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden="true" />
                            Social fitness platform
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-foreground">
                        Your fitness,
                        <br />
                        <span className="text-primary-500">together.</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-surface-600 leading-relaxed max-w-md">
                        Log every workout, challenge your friends, and track progress
                        on the platform built for fitness communities.
                    </p>

                    {/* Stat chips */}
                    <div className="flex flex-wrap gap-2">
                        {statChips.map(chip => (
                            <span
                                key={chip}
                                className="inline-flex items-center rounded-full border border-surface-200 bg-surface px-3 py-1.5 text-xs font-medium text-surface-600"
                            >
                                {chip}
                            </span>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <Link href="/sign-up">
                            <Button size="lg">Get started free</Button>
                        </Link>
                        <Link href="/sign-in">
                            <Button variant="ghost" size="lg">Sign in</Button>
                        </Link>
                    </div>
                </div>

                {/* Right: Card + floating notifications */}
                <div className="hidden lg:flex justify-center items-center">
                    {/* Padded wrapper creates space for the absolutely-positioned pills */}
                    <div
                        className="relative"
                        style={{ paddingTop: 52, paddingBottom: 60, paddingLeft: 20, paddingRight: 76 }}
                    >
                        {/* Notification pill: top-left */}
                        <NotificationPill style={{ top: 10, left: 14, transform: 'rotate(2deg)' }}>
                            ❤️ <span>Maria liked your PR</span>
                        </NotificationPill>

                        {/* Notification pill: top-right */}
                        <NotificationPill style={{ top: 22, right: 8, transform: 'rotate(-2.5deg)' }}>
                            🏆 <span>7-day streak!</span>
                        </NotificationPill>

                        {/* Notification pill: bottom-right */}
                        <NotificationPill style={{ bottom: 8, right: 10, transform: 'rotate(1.5deg)' }}>
                            🔥 <span>Alex accepted your challenge</span>
                        </NotificationPill>

                        <WorkoutCard />
                    </div>
                </div>
            </div>
        </section>
    );
}
