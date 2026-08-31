'use client';

import { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Flame, X } from 'lucide-react';
import { Button, IconChip, Modal } from '@/shared/ui';
import { getStreakCalendar } from '@/shared/lib/streak';
import { StreakCalendar } from './StreakCalendar';

interface DatedWorkout {
    date: string;
}

interface StreakDetailModalProps {
    open: boolean;
    onClose: () => void;
    streak: number;
    workouts: DatedWorkout[];
    onLogWorkout: () => void;
    onViewWorkouts: () => void;
}

function changeMonth(month: Date, offset: number): Date {
    return new Date(month.getFullYear(), month.getMonth() + offset, 1);
}

export function StreakDetailModal({ open, onClose, streak, workouts, onLogWorkout, onViewWorkouts }: StreakDetailModalProps) {
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
    const monthLabel = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const calendarDays = getStreakCalendar(workouts, selectedMonth);
    const monthWorkouts = calendarDays.filter(day => day.isCurrentMonth && day.hasActivity).length;
    const isCurrentMonth = selectedMonth.getFullYear() === now.getFullYear() && selectedMonth.getMonth() === now.getMonth();

    return (
        <Modal open={open} onClose={onClose} labelledBy="streak-detail-title">
            <div className="flex items-center justify-between px-5 pt-4 pb-1">
                <h2 id="streak-detail-title" className="text-base font-bold text-foreground">Your streak</h2>
                <button type="button" onClick={onClose} className="p-1.5 rounded-xl text-surface-500 hover:bg-surface-100 hover:text-foreground transition-colors" aria-label="Close">
                    <X className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>

            <div className="px-5 pt-4 pb-5 space-y-5">
                <div className="flex items-center gap-3">
                    <IconChip icon={Flame} variant="warning" size="lg" />
                    <div>
                        <p className="text-2xl font-extrabold text-foreground">{streak} day{streak === 1 ? '' : 's'}</p>
                        <p className="text-sm text-surface-500">{streak > 0 ? 'Keep your momentum going.' : 'Log a workout to start your streak.'}</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-surface-200 bg-background p-4 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1">
                            <button type="button" onClick={() => setSelectedMonth(month => changeMonth(month, -1))} className="p-1 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-foreground transition-colors" aria-label="Previous month">
                                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <p className="min-w-32 text-center text-sm font-bold text-foreground">{monthLabel}</p>
                            <button type="button" onClick={() => setSelectedMonth(month => changeMonth(month, 1))} disabled={isCurrentMonth} className="p-1 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none" aria-label="Next month">
                                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                        <span className="flex items-center gap-1.5 text-xs font-medium text-surface-500">
                            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                            {monthWorkouts} workouts
                        </span>
                    </div>
                    <StreakCalendar days={calendarDays} />
                </div>

                <Button fullWidth onClick={onLogWorkout}>Log workout</Button>
                <Button fullWidth variant="secondary" onClick={onViewWorkouts}>View workouts</Button>
            </div>
        </Modal>
    );
}
