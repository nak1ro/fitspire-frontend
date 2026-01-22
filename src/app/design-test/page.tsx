export default function DesignTestPage() {
    return (
        <div className="min-h-screen bg-background p-10 space-y-12">
            <header className="space-y-4">
                <h1 className="text-4xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
                    Flow Design System
                </h1>
                <p className="text-xl text-surface-500">
                    Visual verification of design tokens and core primitives.
                </p>
            </header>

            {/* Colors */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b border-surface-200 pb-2">Color System</h2>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Primary (Violet)</h3>
                    <div className="grid grid-cols-11 gap-2">
                        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => (
                            <div key={step} className="space-y-1.5">
                                <div
                                    className={`h-12 w-full rounded-lg shadow-sm bg-primary-${step}`}
                                />
                                <div className="text-xs text-center text-surface-400 font-mono">{step}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Accent (Fuchsia)</h3>
                    <div className="grid grid-cols-11 gap-2">
                        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => (
                            <div key={step} className="space-y-1.5">
                                <div
                                    className={`h-12 w-full rounded-lg shadow-sm bg-accent-${step}`}
                                />
                                <div className="text-xs text-center text-surface-400 font-mono">{step}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Surface (Slate)</h3>
                    <div className="grid grid-cols-11 gap-2">
                        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => (
                            <div key={step} className="space-y-1.5">
                                <div
                                    className={`h-12 w-full rounded-lg shadow-sm bg-surface-${step}`}
                                />
                                <div className="text-xs text-center text-surface-400 font-mono">{step}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Typography */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b border-surface-200 pb-2">Typography</h2>
                <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-surface-400 uppercase tracking-wider">Headings (Outfit)</h3>
                        <div className="space-y-4">
                            <div className="text-5xl font-bold font-heading">Display Text</div>
                            <div className="text-4xl font-bold font-heading">Heading 1</div>
                            <div className="text-3xl font-semibold font-heading">Heading 2</div>
                            <div className="text-2xl font-semibold font-heading">Heading 3</div>
                            <div className="text-xl font-medium font-heading">Heading 4</div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-surface-400 uppercase tracking-wider">Body (Inter)</h3>
                        <div className="space-y-4 text-surface-700">
                            <p className="text-lg">Large body text used for introductions or emphasized content paragraphs.</p>
                            <p className="text-base">Standard body text. The quick brown fox jumps over the lazy dog. A fluent user interface design feels like water.</p>
                            <p className="text-sm">Small text for secondary information, metadata, or helper text.</p>
                            <p className="text-xs">Caption text or legal disclaimers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Glassmorphism */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b border-surface-200 pb-2">Glassmorphism & Shadows</h2>

                <div className="relative h-64 w-full rounded-2xl overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-accent-500 to-indigo-600" />

                    <div className="absolute inset-0 p-8 flex items-center justify-center gap-8">
                        {/* Glass Card Light */}
                        <div className="w-64 h-40 rounded-xl p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white">
                            <h3 className="font-semibold text-lg mb-2">Glass Light</h3>
                            <p className="text-white/80 text-sm">Light glass effect for subtle depth layers.</p>
                        </div>

                        {/* Glass Card Heavy */}
                        <div className="w-64 h-40 rounded-xl p-6 bg-white/25 backdrop-blur-xl border border-white/30 shadow-xl text-white">
                            <h3 className="font-semibold text-lg mb-2">Glass Heavy</h3>
                            <p className="text-white/90 text-sm">Heavier glass for modals or focused content.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Components - Buttons */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b border-surface-200 pb-2">Buttons (Preview)</h2>
                <div className="flex flex-wrap gap-4">
                    <button className="h-10 px-4 py-2 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/30">
                        Primary Button
                    </button>
                    <button className="h-10 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:opacity-90 transition-opacity shadow-sm shadow-accent-500/30">
                        Gradient Button
                    </button>
                    <button className="h-10 px-4 py-2 rounded-lg font-medium text-surface-900 bg-white border border-surface-200 hover:bg-surface-50 transition-colors shadow-sm">
                        Secondary Button
                    </button>
                    <button className="h-10 px-4 py-2 rounded-lg font-medium text-surface-600 hover:bg-surface-100 transition-colors">
                        Ghost Button
                    </button>
                </div>
            </section>
        </div>
    );
}
