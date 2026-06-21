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
        <div className="rounded-2xl border border-surface-200 bg-background overflow-hidden shadow-chip">

            {/* Search input */}
            <div className="flex items-center gap-2 px-3.5 py-3 border-b border-surface-100 bg-surface-50">
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
                <div className="flex gap-1.5 px-3.5 py-2.5 overflow-x-auto border-b border-surface-100">
                    <button
                        type="button"
                        onClick={() => setCategoryId(null)}
                        className={
                            'shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ' +
                            (!categoryId
                                ? 'bg-primary-50 border-primary-500 text-primary-600'
                                : 'border-surface-200 text-surface-500 hover:bg-surface-100')
                        }
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategoryId(cat.id === categoryId ? null : cat.id)}
                            className={
                                'shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ' +
                                (categoryId === cat.id
                                    ? 'bg-primary-50 border-primary-500 text-primary-600'
                                    : 'border-surface-200 text-surface-500 hover:bg-surface-100')
                            }
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Results */}
            <div className="max-h-48 overflow-y-auto">
                {isLoading && (
                    <p className="text-sm text-surface-400 text-center py-6">Loading…</p>
                )}
                {!isLoading && (!exercises || exercises.length === 0) && (
                    <p className="text-sm text-surface-400 text-center py-6">No exercises found</p>
                )}
                {!isLoading && exercises && exercises.map(ex => (
                    <button
                        key={ex.id}
                        type="button"
                        onClick={() => onAdd(ex)}
                        className="w-full flex items-center gap-3 px-3.5 py-3 hover:bg-surface-50 transition-colors text-left border-b border-surface-100 last:border-0"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{ex.name}</p>
                            {ex.categoryName && (
                                <p className="text-xs text-surface-400 mt-0.5">{ex.categoryName}</p>
                            )}
                        </div>
                        <Plus className="h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                    </button>
                ))}
            </div>
        </div>
    );
}
