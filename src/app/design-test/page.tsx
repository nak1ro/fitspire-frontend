export default function DesignTestPage() {
    return (
        <div className="min-h-screen bg-background p-10 space-y-16">

            <header className="space-y-3">
                <p className="text-xs font-semibold tracking-widest uppercase text-primary-500">Design System</p>
                <h1 className="text-5xl font-bold font-heading text-foreground tracking-tight">
                    Fitspire
                </h1>
                <p className="text-lg text-surface-600">
                    Warm Editorial — visual verification of tokens and primitives.
                </p>
            </header>

            {/* Color System */}
            <section className="space-y-8">
                <h2 className="text-xl font-semibold text-foreground border-b border-surface-200 pb-3">
                    Color System
                </h2>

                <div className="space-y-6">
                    <div>
                        <p className="text-sm font-medium text-surface-600 mb-3">Primary — Ember</p>
                        <div className="grid grid-cols-11 gap-2">
                            {([
                                ['50',  '#FDF6EF'],
                                ['100', '#FAE9D6'],
                                ['200', '#F5CDA8'],
                                ['300', '#EDAC76'],
                                ['400', '#E08B4E'],
                                ['500', '#C26D38'],
                                ['600', '#A85A28'],
                                ['700', '#8C4820'],
                                ['800', '#6A3418'],
                                ['900', '#48220F'],
                                ['950', '#2A1207'],
                            ] as [string, string][]).map(([step, hex]) => (
                                <div key={step} className="space-y-1.5">
                                    <div
                                        className="h-12 w-full rounded-lg"
                                        style={{ backgroundColor: hex }}
                                    />
                                    <p className="text-xs text-center text-surface-400 font-mono">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-surface-600 mb-3">Surface — Warm Stone</p>
                        <div className="grid grid-cols-11 gap-2">
                            {([
                                ['50',  '#FAFAF8'],
                                ['100', '#F5F4F1'],
                                ['200', '#EBE9E4'],
                                ['300', '#D8D5CE'],
                                ['400', '#B8B2A8'],
                                ['500', '#948E84'],
                                ['600', '#7A6E65'],
                                ['700', '#5E5550'],
                                ['800', '#3D3733'],
                                ['900', '#1E1A18'],
                                ['950', '#100E0C'],
                            ] as [string, string][]).map(([step, hex]) => (
                                <div key={step} className="space-y-1.5">
                                    <div
                                        className="h-12 w-full rounded-lg border border-surface-100"
                                        style={{ backgroundColor: hex }}
                                    />
                                    <p className="text-xs text-center text-surface-400 font-mono">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {([
                            ['Success', '#4A7C5F'],
                            ['Warning', '#B8860B'],
                            ['Error',   '#B34040'],
                        ] as [string, string][]).map(([label, hex]) => (
                            <div key={label} className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-md" style={{ backgroundColor: hex }} />
                                <span className="text-sm text-surface-600">{label}</span>
                                <span className="text-xs text-surface-400 font-mono">{hex}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Typography */}
            <section className="space-y-8">
                <h2 className="text-xl font-semibold text-foreground border-b border-surface-200 pb-3">
                    Typography — Plus Jakarta Sans
                </h2>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="text-6xl font-bold tracking-tight text-foreground">Fitspire</div>
                        <div className="text-5xl font-bold tracking-tight text-foreground">Display 200</div>
                        <div className="text-4xl font-bold text-foreground">Heading 1</div>
                        <div className="text-3xl font-semibold text-foreground">Heading 2</div>
                        <div className="text-2xl font-semibold text-foreground">Heading 3</div>
                        <div className="text-xl font-medium text-foreground">Heading 4</div>
                    </div>

                    <div className="space-y-3 max-w-prose">
                        <p className="text-lg text-surface-700 leading-relaxed">
                            Large body. Fitness becomes social when progress is visible. Track workouts, share wins, compete with friends.
                        </p>
                        <p className="text-base text-surface-600 leading-relaxed">
                            Standard body. The quick brown fox jumps over the lazy dog. Every rep counts, every session matters.
                        </p>
                        <p className="text-sm text-surface-500 leading-relaxed">
                            Small body. Secondary information, metadata, timestamps, and helper text.
                        </p>
                        <p className="text-xs text-surface-400">
                            Caption. Labels, legal text, fine print.
                        </p>
                    </div>

                    <div className="flex gap-6">
                        <div>
                            <p className="text-xs text-surface-400 mb-2 uppercase tracking-wider font-medium">Weights</p>
                            <div className="space-y-1">
                                {[
                                    ['200', 'font-extralight'],
                                    ['300', 'font-light'],
                                    ['400', 'font-normal'],
                                    ['500', 'font-medium'],
                                    ['600', 'font-semibold'],
                                    ['700', 'font-bold'],
                                    ['800', 'font-extrabold'],
                                ].map(([w, cls]) => (
                                    <p key={w} className={`text-base text-foreground ${cls}`}>
                                        {w} — The body in motion
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Shadows */}
            <section className="space-y-8">
                <h2 className="text-xl font-semibold text-foreground border-b border-surface-200 pb-3">
                    Elevation — Warm Shadows
                </h2>
                <div className="flex gap-6 flex-wrap">
                    {[
                        ['sm',  '0 1px 4px rgba(28,21,16,0.06)',   'Subtle lift'],
                        ['md',  '0 4px 12px rgba(28,21,16,0.08)',  'Cards'],
                        ['lg',  '0 8px 24px rgba(28,21,16,0.10)',  'Dropdowns, modals'],
                        ['xl',  '0 16px 40px rgba(28,21,16,0.12)', 'Overlays'],
                    ].map(([name, shadow, label]) => (
                        <div
                            key={name}
                            className="w-36 h-24 rounded-xl bg-surface-50 flex flex-col items-center justify-center gap-1"
                            style={{ boxShadow: shadow }}
                        >
                            <span className="text-sm font-semibold text-foreground">{name}</span>
                            <span className="text-xs text-surface-400">{label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Spacing & Radius */}
            <section className="space-y-8">
                <h2 className="text-xl font-semibold text-foreground border-b border-surface-200 pb-3">
                    Radius Scale
                </h2>
                <div className="flex gap-4 flex-wrap items-end">
                    {[
                        ['sm',   '0.5rem',  'w-16 h-16'],
                        ['md',   '0.75rem', 'w-20 h-20'],
                        ['lg',   '1rem',    'w-24 h-24'],
                        ['xl',   '1.5rem',  'w-28 h-28'],
                        ['2xl',  '2rem',    'w-32 h-32'],
                        ['full', '9999px',  'w-20 h-20'],
                    ].map(([name, val, size]) => (
                        <div key={name} className="flex flex-col items-center gap-2">
                            <div
                                className={`${size} bg-primary-100 border border-primary-200`}
                                style={{ borderRadius: val }}
                            />
                            <span className="text-xs text-surface-500 font-mono">{name}</span>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
