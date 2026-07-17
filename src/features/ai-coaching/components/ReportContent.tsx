import { CheckCircle2, Repeat, ArrowRight, Info } from 'lucide-react';
import { Card, IconChip } from '@/shared/ui';
import type { WeeklyCoachObservation, WeeklyCoachReport } from '../types';

function ObservationRow({ observation, Icon, color, bg }: { observation: WeeklyCoachObservation; Icon: typeof CheckCircle2; color: string; bg: string }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-surface-100 last:border-0">
            <IconChip icon={Icon} size="sm" color={color} bg={bg} />
            <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight">{observation.title}</p>
                <p className="text-xs text-surface-500 leading-relaxed mt-1">{observation.explanation}</p>
            </div>
        </div>
    );
}

function Section({ title, observations, Icon, color, bg }: { title: string; observations: WeeklyCoachObservation[]; Icon: typeof CheckCircle2; color: string; bg: string }) {
    if (observations.length === 0) return null;
    return (
        <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1">{title}</h3>
            <Card padding="sm">
                {observations.map((o, i) => <ObservationRow key={i} observation={o} Icon={Icon} color={color} bg={bg} />)}
            </Card>
        </div>
    );
}

export function ReportContent({ report }: { report: WeeklyCoachReport }) {
    const content = report.content;
    if (!content) return null;

    return (
        <div className="space-y-6">
            <Card padding="md" className="space-y-2">
                <h2 className="text-base font-extrabold text-foreground leading-snug">{content.headline}</h2>
                <p className="text-sm text-surface-600 leading-relaxed">{content.overview}</p>
            </Card>

            <Section title="Wins" observations={content.wins} Icon={CheckCircle2} color="var(--color-success)" bg="rgba(74,124,95,0.10)" />
            <Section title="Patterns" observations={content.patterns} Icon={Repeat} color="var(--color-warning)" bg="rgba(184,134,11,0.10)" />
            <Section title="Next week" observations={content.nextWeekActions} Icon={ArrowRight} color="var(--color-primary-500)" bg="var(--color-primary-50)" />

            {content.dataLimitations.length > 0 && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-surface-100">
                    <Info className="h-4 w-4 text-surface-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="space-y-1">
                        {content.dataLimitations.map((limitation, i) => (
                            <p key={i} className="text-xs text-surface-500 leading-relaxed">{limitation}</p>
                        ))}
                    </div>
                </div>
            )}

            <p className="text-[11px] text-surface-400 leading-relaxed px-1">{report.wellnessDisclaimer}</p>
        </div>
    );
}
