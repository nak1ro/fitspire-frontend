interface DatedItem {
    date: string;
}

export function getCurrentStreak(items: DatedItem[]): number {
    if (items.length === 0) return 0;

    const hasItemOn = (d: Date): boolean => {
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        return items.some(item => {
            const itemDate = new Date(item.date);
            return `${itemDate.getFullYear()}-${itemDate.getMonth()}-${itemDate.getDate()}` === key;
        });
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startDate = hasItemOn(today) ? today
        : hasItemOn(yesterday) ? yesterday
        : null;

    if (!startDate) return 0;

    let streak = 0;
    const cursor = new Date(startDate);
    while (hasItemOn(cursor)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}
