'use client';

import { useTheme } from 'next-themes';
import { Loader2 } from 'lucide-react';
import { Alert, ChipGroup as SharedChipGroup, Toggle as SharedToggle, type ChipGroupOption } from '@/shared/ui';
import { useUserPreferences, useUpdateUserPreferences } from '../hooks/useUserPreferences';
import { ChangePasswordForm } from './ChangePasswordForm';
import type { PreferredLanguage, UnitSystem } from '../types';

// ─── Primitives ────────────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
    return (
        <p className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1 mb-2 mt-6 first:mt-0">
            {title}
        </p>
    );
}

function SettingRow({
    label,
    description,
    children,
    saving,
}: {
    label: string;
    description?: string;
    children: React.ReactNode;
    saving?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4 px-4 py-3.5 bg-surface rounded-2xl border border-surface-200">
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    {saving && <Loader2 className="h-3.5 w-3.5 text-surface-400 animate-spin shrink-0" aria-hidden="true" />}
                </div>
                {description && (
                    <p className="text-xs text-surface-400 mt-0.5 leading-snug">{description}</p>
                )}
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
}

function ChipGroup<T extends string>({
    options,
    value,
    onChange,
    labelMap,
}: {
    options: readonly T[];
    value: T;
    onChange: (v: T) => void;
    labelMap?: Partial<Record<T, string>>;
}) {
    const chipOptions: ChipGroupOption<T>[] = options.map(opt => ({ value: opt, label: labelMap?.[opt] ?? opt }));
    return (
        <SharedChipGroup
            options={chipOptions}
            value={value}
            onChange={v => v && onChange(v)}
        />
    );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────

function SettingsSkeleton() {
    return (
        <div className="space-y-2 animate-pulse">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 rounded-2xl bg-surface-200" />
            ))}
        </div>
    );
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const UNIT_OPTIONS = ['metric', 'imperial'] as const satisfies readonly UnitSystem[];
const UNIT_LABELS: Record<UnitSystem, string> = { metric: 'Metric', imperial: 'Imperial' };

const LANGUAGE_OPTIONS = ['en', 'es', 'ru'] as const satisfies readonly PreferredLanguage[];
const LANGUAGE_LABELS: Record<PreferredLanguage, string> = { en: 'English', es: 'Español', ru: 'Русский' };

// ─── View ──────────────────────────────────────────────────────────────────────

export function SettingsView() {
    const { setTheme } = useTheme();
    const { data: prefs, isLoading } = useUserPreferences();
    const { mutate, isPending, isError } = useUpdateUserPreferences();

    if (isLoading || !prefs) return <SettingsSkeleton />;

    // Only flip the visible theme once the preference is confirmed saved,
    // so a failed save can't leave the UI theme desynced from what's persisted.
    const handleDarkMode = (enabled: boolean) => {
        mutate({ isDarkModeEnabled: enabled }, {
            onSuccess: () => setTheme(enabled ? 'dark' : 'light'),
        });
    };

    return (
        <div>
            {/* Appearance */}
            <SectionHeader title="Appearance" />
            <SettingRow
                label="Dark mode"
                description="Switch between light and dark theme"
                saving={isPending}
            >
                <SharedToggle
                    checked={prefs.isDarkModeEnabled}
                    onChange={handleDarkMode}
                />
            </SettingRow>

            {/* Units */}
            <SectionHeader title="Units" />
            <SettingRow
                label="Unit system"
                description="Used for distances, weights, and measurements"
                saving={isPending}
            >
                <ChipGroup
                    options={UNIT_OPTIONS}
                    value={prefs.unitSystem}
                    onChange={v => mutate({ unitSystem: v })}
                    labelMap={UNIT_LABELS}
                />
            </SettingRow>

            {/* Notifications */}
            <SectionHeader title="Notifications" />
            <SettingRow
                label="Email notifications"
                description="Receive updates about your activity and challenges"
                saving={isPending}
            >
                <SharedToggle
                    checked={prefs.receiveEmailNotifications}
                    onChange={v => mutate({ receiveEmailNotifications: v })}
                />
            </SettingRow>

            {/* Language */}
            <SectionHeader title="Language" />
            <SettingRow
                label="Preferred language"
                description="Language used across the app"
                saving={isPending}
            >
                <ChipGroup
                    options={LANGUAGE_OPTIONS}
                    value={prefs.preferredLanguage}
                    onChange={v => mutate({ preferredLanguage: v })}
                    labelMap={LANGUAGE_LABELS}
                />
            </SettingRow>

            {isError && (
                <Alert variant="error" className="mt-4">
                    Couldn't save your changes. Please try again.
                </Alert>
            )}

            {/* Security */}
            <SectionHeader title="Security" />
            <ChangePasswordForm />
        </div>
    );
}
