'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useExerciseCategories, useExercises } from '../hooks/useExerciseCatalog';
import type { Exercise } from '../types';

interface Props {
    onAdd: (exercise: Exercise) => void;
}

export function ExerciseSearchPanel({ onAdd }: Props) {
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState<string | null>(null);

    const { data: categories } = useExerciseCategories();
    const { data: exercises, isLoading } = useExercises({
        search: search || null,
        categoryId: categoryId || null,
    });

    return (
        <div className="rounded-xl border border-surface-200 bg-background overflow-hidden">

            {/* Search input */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-surface-200">
                <Search className="h-4 w-4 text-surface-400 shrink-0" aria-hidden="true" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search exercises…"
                    autoFocus
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-surface-400 outline-none"
                />
            </div>

            {/* Category chips */}
            {categories && categories.length > 0 && (
                <div className="flex gap-1.5 px-3 py-2 overflow-x-auto border-b border-surface-200">
                    <button
                        type="button"
                        onClick={() => setCategoryId(null)}
                        className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all"
                        style={!categoryId ? {
                            backgroundColor: 'rgba(5,150,105,0.08)',
                            borderColor: '#059669',
                            color: '#059669',
                        } : { borderColor: 'var(--color-surface-200)', color: 'var(--color-surface-500)' }}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategoryId(cat.id === categoryId ? null : cat.id)}
                            className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all"
                            style={categoryId === cat.id ? {
                                backgroundColor: 'rgba(5,150,105,0.08)',
                                borderColor: '#059669',
                                color: '#059669',
                            } : { borderColor: 'var(--color-surface-200)', color: 'var(--color-surface-500)' }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Results */}
            <div className="max-h-44 overflow-y-auto">
                {isLoading && (
                    <p className="text-xs text-surface-400 text-center py-6">Loading…</p>
                )}
                {!isLoading && (!exercises || exercises.length === 0) && (
                    <p className="text-xs text-surface-400 text-center py-6">No exercises found</p>
                )}
                {!isLoading && exercises && exercises.map(ex => (
                    <button
                        key={ex.id}
                        type="button"
                        onClick={() => onAdd(ex)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface transition-colors text-left border-b border-surface-100 last:border-0"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{ex.name}</p>
                            {ex.categoryName && (
                                <p className="text-[11px] text-surface-400">{ex.categoryName}</p>
                            )}
                        </div>
                        <Plus className="h-4 w-4 shrink-0" style={{ color: '#059669' }} aria-hidden="true" />
                    </button>
                ))}
            </div>
        </div>
    );
}
