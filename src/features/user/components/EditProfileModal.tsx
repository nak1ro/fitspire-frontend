'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Alert } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useUpdateUserProfile } from '../hooks/useUserProfile';
import type { UserProfile } from '../types';

interface Props {
    profile: UserProfile;
    open: boolean;
    onClose: () => void;
}

export function EditProfileModal({ profile, open, onClose }: Props) {
    const [displayName, setDisplayName] = useState(profile.displayName);
    const [bio, setBio] = useState(profile.bio ?? '');
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useUpdateUserProfile();

    // Sync fields when profile changes
    useEffect(() => {
        setDisplayName(profile.displayName);
        setBio(profile.bio ?? '');
    }, [profile.displayName, profile.bio]);

    const handleSubmit = async () => {
        if (!displayName.trim()) return;
        setSubmitError(null);
        try {
            await mutateAsync({ displayName: displayName.trim(), bio: bio.trim() || null });
            onClose();
        } catch (err) {
            setSubmitError(getErrorMessage(err, 'Failed to update profile. Please try again.'));
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

            <div
                className="relative w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden z-10"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                <div className="h-[3px]" style={{ background: 'linear-gradient(to right, #059669, #34D399, transparent)' }} />

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200">
                    <h2 className="text-base font-bold text-foreground">Edit profile</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-5 space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500">
                            Display name
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            placeholder="Your name"
                            maxLength={60}
                            className="w-full text-sm font-medium bg-background border border-surface-200 rounded-xl px-3 py-2.5 outline-none transition-colors text-foreground placeholder:text-surface-400"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500">
                            Bio <span className="normal-case font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            placeholder="A short bio…"
                            rows={3}
                            maxLength={200}
                            className="w-full text-sm bg-background border border-surface-200 rounded-xl px-3 py-2.5 outline-none transition-colors resize-none text-foreground placeholder:text-surface-400"
                        />
                        <p className="text-[11px] text-surface-400 text-right">{bio.length}/200</p>
                    </div>

                    {submitError && <Alert variant="error">{submitError}</Alert>}

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isPending || !displayName.trim()}
                        className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #059669, #34D399)' }}
                    >
                        {isPending ? 'Saving…' : 'Save changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
