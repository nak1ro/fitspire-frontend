import type { NutritionDailyTotalPoint } from '../types';

function formatDayLabel(dateStr: string): string {
    const [, m, d] = dateStr.split('-').map(Number);
    return `${m}/${d}`;
}

export function DailyCaloriesChart({ points, targetCalories }: {
    points: NutritionDailyTotalPoint[];
    targetCalories?: number | null;
}) {
    if (points.length === 0) return null;

    const values = points.map(p => p.totals.caloriesKcal);
    const maxValue = Math.max(...values, targetCalories ?? 0, 1);
    const barWidth = points.length > 40 ? 6 : points.length > 14 ? 12 : 24;
    const gap = points.length > 40 ? 2 : 4;
    const chartHeight = 140;
    const showLabels = points.length <= 14;
    const svgHeight = showLabels ? chartHeight + 18 : chartHeight;
    const width = points.length * (barWidth + gap);
    const targetY = targetCalories ? chartHeight - Math.min(1, targetCalories / maxValue) * chartHeight : null;

    return (
        <div className="overflow-x-auto">
            <svg width={width} height={svgHeight} className="block" role="img" aria-label="Daily calories over the selected range">
                {targetY != null && (
                    <line x1={0} y1={targetY} x2={width} y2={targetY} stroke="var(--color-surface-300)" strokeDasharray="3 3" strokeWidth={1} />
                )}
                {points.map((p, i) => {
                    const h = p.totals.caloriesKcal > 0 ? Math.max(2, (p.totals.caloriesKcal / maxValue) * chartHeight) : 0;
                    const x = i * (barWidth + gap);
                    const y = chartHeight - h;
                    const isLast = i === points.length - 1;
                    return (
                        <g key={p.date}>
                            <rect x={x} y={y} width={barWidth} height={h} rx={2} fill={isLast ? 'var(--color-primary-500)' : 'var(--color-primary-200)'} />
                            {showLabels && (
                                <text x={x + barWidth / 2} y={chartHeight + 13} textAnchor="middle" fontSize={9} fill="var(--color-surface-400)">
                                    {formatDayLabel(p.date)}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
