'use client';

import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useCreatePost } from '../hooks/useSocialMutations';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { useUploadMedia } from '@/features/media/hooks/useUploadMedia';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { Avatar, Button, Card } from '@/shared/ui';

export function PostComposer() {
    const [content, setContent] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageMediaId, setImageMediaId] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate, isPending } = useCreatePost();
    const { mutateAsync: uploadImage, isPending: uploadingImage } = useUploadMedia();
    const { data: profile } = useUserProfile();

    const handlePickImage = () => fileInputRef.current?.click();

    const handleImageSelected = async (file: File | undefined) => {
        if (!file) return;
        setImageError(null);
        setImagePreview(URL.createObjectURL(file));
        try {
            const asset = await uploadImage({ file, purpose: 'PostImage' });
            setImageMediaId(asset.id);
        } catch (err) {
            setImagePreview(null);
            setImageError(getErrorMessage(err, 'Failed to upload image.'));
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageMediaId(null);
        setImageError(null);
    };

    const handlePost = () => {
        const trimmed = content.trim();
        if (!trimmed && !imageMediaId) return;
        mutate({ content: trimmed || undefined, mediaAssetIds: imageMediaId ? [imageMediaId] : undefined }, {
            onSuccess: () => {
                setContent('');
                handleRemoveImage();
            },
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handlePost();
        }
    };

    const hasContent = content.trim().length > 0 || Boolean(imagePreview);

    return (
        <Card padding="md">
            <div className="flex gap-3">
                <Avatar
                    displayName={profile?.displayName ?? ''}
                    userName={profile?.userName ?? '...'}
                    avatarUrl={profile?.profilePictureUrl}
                    size="sm"
                    className="mt-0.5"
                />

                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Share a workout, milestone, or thought…"
                    rows={hasContent ? 3 : 1}
                    className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-surface-400 outline-none leading-relaxed transition-all"
                />
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => handleImageSelected(e.target.files?.[0])}
            />

            {imagePreview && (
                <div className="relative w-24 h-24 mt-3 ml-11">
                    <img src={imagePreview} alt="" className="w-24 h-24 rounded-xl object-cover" />
                    {uploadingImage && (
                        <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center">
                            <Loader2 className="h-5 w-5 text-white animate-spin" aria-hidden="true" />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 flex items-center justify-center h-6 w-6 rounded-full bg-error text-white shadow-chip"
                        aria-label="Remove image"
                    >
                        <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                </div>
            )}

            {imageError && <p className="ml-11 mt-2 text-xs text-error">{imageError}</p>}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-100">
                <button
                    type="button"
                    onClick={handlePickImage}
                    disabled={Boolean(imagePreview)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 hover:text-foreground transition-colors disabled:opacity-40"
                >
                    <ImageIcon className="h-4 w-4" aria-hidden="true" />
                    Photo
                </button>
                {hasContent && (
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-surface-400">⌘ + Enter to post</span>
                        <Button onClick={handlePost} loading={isPending} disabled={uploadingImage} size="sm">
                            Post
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}
