'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Camera, Loader2 } from 'lucide-react';
import { Alert, Avatar } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useUploadMedia } from '@/features/media/hooks/useUploadMedia';
import { useUpdateUserProfile, useAttachUserProfilePicture, useRemoveUserProfilePicture } from '../hooks/useUserProfile';
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
    const [photoError, setPhotoError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutateAsync, isPending } = useUpdateUserProfile();
    const { mutateAsync: uploadPhoto, isPending: uploadingPhoto } = useUploadMedia();
    const { mutateAsync: attachPhoto, isPending: attachingPhoto } = useAttachUserProfilePicture();
    const { mutateAsync: removePhoto, isPending: removingPhoto } = useRemoveUserProfilePicture();
    const photoBusy = uploadingPhoto || attachingPhoto || removingPhoto;

    const handlePickPhoto = () => fileInputRef.current?.click();

    const handleFileSelected = async (file: File | undefined) => {
        if (!file) return;
        setPhotoError(null);
        try {
            const asset = await uploadPhoto({ file, purpose: 'ProfilePicture' });
            await attachPhoto(asset.id);
        } catch (err) {
            setPhotoError(getErrorMessage(err, 'Failed to update profile photo.'));
        }
    };

    const handleRemovePhoto = async () => {
        setPhotoError(null);
        try {
            await removePhoto();
        } catch (err) {
            setPhotoError(getErrorMessage(err, 'Failed to remove profile photo.'));
        }
    };

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
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-4 pb-1">
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
                <div className="px-5 pb-5 pt-1 space-y-4">
                    <div className="flex flex-col items-center gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={e => handleFileSelected(e.target.files?.[0])}
                        />
                        <div className="relative">
                            <Avatar
                                displayName={profile.displayName}
                                userName={profile.userName}
                                avatarUrl={profile.profilePictureUrl}
                                size="xl"
                            />
                            {photoBusy && (
                                <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                                    <Loader2 className="h-5 w-5 text-white animate-spin" aria-hidden="true" />
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={handlePickPhoto}
                                disabled={photoBusy}
                                className="absolute -bottom-1 -right-1 flex items-center justify-center h-7 w-7 rounded-full bg-primary-500 text-white shadow-chip disabled:opacity-50"
                                aria-label="Change profile photo"
                            >
                                <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                        </div>
                        {profile.profilePictureUrl && (
                            <button
                                type="button"
                                onClick={handleRemovePhoto}
                                disabled={photoBusy}
                                className="text-xs font-semibold text-error hover:opacity-70 transition-opacity disabled:opacity-50"
                            >
                                Remove photo
                            </button>
                        )}
                        {photoError && <p className="text-xs text-error text-center">{photoError}</p>}
                    </div>

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
