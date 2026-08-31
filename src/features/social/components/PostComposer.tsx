'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Image as ImageIcon, Loader2, Dumbbell, Target, Trophy } from 'lucide-react';
import { useCreatePost, useShareGoal, useSharePersonalRecord, useShareWorkout } from '../hooks/useSocialMutations';
import { useComposerDraftStore } from '../store/composerDraftStore';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { useUploadMedia } from '@/features/media/hooks/useUploadMedia';
import { useAbortMediaUpload } from '@/features/media/hooks/useAbortMediaUpload';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { getTypeConfig } from '@/features/workout/typeConfig';
import { formatMetric, formatValue } from '@/features/workout/personalRecordFormat';
import { Alert, Avatar, Button, Card, IconChip } from '@/shared/ui';
import { AttachWorkoutPicker } from './AttachWorkoutPicker';
import { AttachGoalPicker } from './AttachGoalPicker';
import { AttachPersonalRecordPicker } from './AttachPersonalRecordPicker';
import type { WorkoutHistoryItem, PersonalRecord } from '@/features/workout/types';
import type { Goal } from '@/features/goal/types';

export function PostComposer() {
    const [content, setContent] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageMediaId, setImageMediaId] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [attachedWorkout, setAttachedWorkout] = useState<WorkoutHistoryItem | null>(null);
    const [attachedGoal, setAttachedGoal] = useState<Goal | null>(null);
    const [attachedRecord, setAttachedRecord] = useState<PersonalRecord | null>(null);
    const [workoutPickerOpen, setWorkoutPickerOpen] = useState(false);
    const [goalPickerOpen, setGoalPickerOpen] = useState(false);
    const [recordPickerOpen, setRecordPickerOpen] = useState(false);
    const [postError, setPostError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: createPost, isPending: creatingPost } = useCreatePost();
    const { mutate: shareWorkout, isPending: sharingWorkout } = useShareWorkout();
    const { mutate: shareGoal, isPending: sharingGoal } = useShareGoal();
    const { mutate: sharePersonalRecord, isPending: sharingRecord } = useSharePersonalRecord();
    const { mutateAsync: uploadImage, isPending: uploadingImage } = useUploadMedia();
    const { mutate: abortUpload } = useAbortMediaUpload();
    const { data: profile } = useUserProfile();
    const isPending = creatingPost || sharingWorkout || sharingGoal || sharingRecord;

    // A "quick share" button elsewhere (Records tab, workout/goal detail screens)
    // may have stashed a pre-selected attachment + draft caption before navigating
    // here — consume it once on mount so it doesn't leak into a later fresh post.
    useEffect(() => {
        const draft = useComposerDraftStore.getState().consumePending();
        if (!draft) return;
        setContent(draft.caption);
        if (draft.attachment.type === 'workout') setAttachedWorkout(draft.attachment.item);
        else if (draft.attachment.type === 'goal') setAttachedGoal(draft.attachment.item);
        else setAttachedRecord(draft.attachment.item);
    }, []);

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
        // Best-effort cleanup: the upload already completed server-side (Ready but
        // unattached) by the time a preview exists to remove. Abandoned uploads
        // self-expire anyway, so a failure here isn't surfaced to the user.
        if (imageMediaId) abortUpload(imageMediaId);
        setImagePreview(null);
        setImageMediaId(null);
        setImageError(null);
    };

    const handlePost = () => {
        const trimmed = content.trim();
        if (!trimmed && !imageMediaId && !attachedWorkout && !attachedGoal && !attachedRecord) return;
        setPostError(null);

        const onSuccess = () => {
            setContent('');
            setAttachedWorkout(null);
            setAttachedGoal(null);
            setAttachedRecord(null);
            handleRemoveImage();
        };
        const onError = (err: unknown) => setPostError(getErrorMessage(err, 'Failed to post.'));
        const mediaAssetIds = imageMediaId ? [imageMediaId] : undefined;

        if (attachedWorkout) {
            shareWorkout({ workoutId: attachedWorkout.id, caption: trimmed || undefined, mediaAssetIds }, { onSuccess, onError });
        } else if (attachedGoal) {
            shareGoal({ goalId: attachedGoal.id, caption: trimmed || undefined, mediaAssetIds }, { onSuccess, onError });
        } else if (attachedRecord) {
            sharePersonalRecord({ personalRecordId: attachedRecord.id, caption: trimmed || undefined, mediaAssetIds }, { onSuccess, onError });
        } else {
            createPost({ content: trimmed || undefined, mediaAssetIds }, { onSuccess, onError });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handlePost();
        }
    };

    const hasContent = content.trim().length > 0 || Boolean(imagePreview) || Boolean(attachedWorkout) || Boolean(attachedGoal) || Boolean(attachedRecord);
    const workoutTypeConfig = attachedWorkout ? getTypeConfig(attachedWorkout.workoutType) : null;
    const hasOtherAttachment = (excluding: 'workout' | 'goal' | 'record') =>
        (excluding !== 'workout' && Boolean(attachedWorkout)) ||
        (excluding !== 'goal' && Boolean(attachedGoal)) ||
        (excluding !== 'record' && Boolean(attachedRecord));

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

            {(imagePreview || attachedWorkout || attachedGoal || attachedRecord) && (
                <div className="flex gap-2.5 mt-3 ml-11">
                    {imagePreview && (
                        <div className="relative w-20 h-20 shrink-0">
                            <img src={imagePreview} alt="" className="w-20 h-20 rounded-xl object-cover" />
                            {uploadingImage && (
                                <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center">
                                    <Loader2 className="h-4 w-4 text-white animate-spin" aria-hidden="true" />
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-1.5 -right-1.5 flex items-center justify-center h-5 w-5 rounded-full bg-error text-white shadow-chip"
                                aria-label="Remove image"
                            >
                                <X className="h-3 w-3" aria-hidden="true" />
                            </button>
                        </div>
                    )}

                    {attachedWorkout && workoutTypeConfig && (
                        <div className="relative w-20 h-20 shrink-0 rounded-xl bg-surface-100 flex flex-col items-center justify-center gap-1 px-1 text-center">
                            <IconChip icon={workoutTypeConfig.Icon} size="sm" color={workoutTypeConfig.color} bg={workoutTypeConfig.bg} />
                            <p className="text-[10px] font-semibold text-foreground leading-tight truncate max-w-full">{workoutTypeConfig.label}</p>
                            <p className="text-[9px] text-surface-500 leading-tight">
                                {new Date(attachedWorkout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                            <button
                                type="button"
                                onClick={() => setAttachedWorkout(null)}
                                className="absolute -top-1.5 -right-1.5 flex items-center justify-center h-5 w-5 rounded-full bg-error text-white shadow-chip"
                                aria-label="Remove attached workout"
                            >
                                <X className="h-3 w-3" aria-hidden="true" />
                            </button>
                        </div>
                    )}

                    {attachedGoal && (
                        <div className="relative w-20 h-20 shrink-0 rounded-xl bg-surface-100 flex flex-col items-center justify-center gap-1 px-1 text-center">
                            <IconChip icon={Trophy} size="sm" variant="warning" />
                            <p className="text-[10px] font-semibold text-foreground leading-tight truncate max-w-full">{attachedGoal.goalTypeName}</p>
                            <p className="text-[9px] text-surface-500 leading-tight">
                                {attachedGoal.targetValue} {attachedGoal.unit}
                            </p>
                            <button
                                type="button"
                                onClick={() => setAttachedGoal(null)}
                                className="absolute -top-1.5 -right-1.5 flex items-center justify-center h-5 w-5 rounded-full bg-error text-white shadow-chip"
                                aria-label="Remove attached goal"
                            >
                                <X className="h-3 w-3" aria-hidden="true" />
                            </button>
                        </div>
                    )}

                    {attachedRecord && (
                        <div className="relative w-20 h-20 shrink-0 rounded-xl bg-surface-100 flex flex-col items-center justify-center gap-1 px-1 text-center">
                            <IconChip icon={Trophy} size="sm" color={getTypeConfig(attachedRecord.workoutType).color} bg={getTypeConfig(attachedRecord.workoutType).bg} />
                            <p className="text-[10px] font-semibold text-foreground leading-tight truncate max-w-full">
                                {attachedRecord.exerciseName ?? formatMetric(attachedRecord.metric)}
                            </p>
                            <p className="text-[9px] text-surface-500 leading-tight">
                                {formatValue(attachedRecord.value, attachedRecord.unit)}
                            </p>
                            <button
                                type="button"
                                onClick={() => setAttachedRecord(null)}
                                className="absolute -top-1.5 -right-1.5 flex items-center justify-center h-5 w-5 rounded-full bg-error text-white shadow-chip"
                                aria-label="Remove attached personal record"
                            >
                                <X className="h-3 w-3" aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {imageError && <p className="ml-11 mt-2 text-xs text-error">{imageError}</p>}

            {postError && <div className="mt-3 ml-11"><Alert variant="error">{postError}</Alert></div>}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-100">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={handlePickImage}
                        disabled={Boolean(imagePreview)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 hover:text-foreground transition-colors disabled:opacity-40"
                    >
                        <ImageIcon className="h-4 w-4" aria-hidden="true" />
                        Photo
                    </button>
                    <button
                        type="button"
                        onClick={() => setWorkoutPickerOpen(true)}
                        disabled={hasOtherAttachment('workout')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 hover:text-foreground transition-colors disabled:opacity-40"
                    >
                        <Dumbbell className="h-4 w-4" aria-hidden="true" />
                        Workout
                    </button>
                    <button
                        type="button"
                        onClick={() => setGoalPickerOpen(true)}
                        disabled={hasOtherAttachment('goal')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 hover:text-foreground transition-colors disabled:opacity-40"
                    >
                        <Target className="h-4 w-4" aria-hidden="true" />
                        Goal
                    </button>
                    <button
                        type="button"
                        onClick={() => setRecordPickerOpen(true)}
                        disabled={hasOtherAttachment('record')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 hover:text-foreground transition-colors disabled:opacity-40"
                    >
                        <Trophy className="h-4 w-4" aria-hidden="true" />
                        PR
                    </button>
                </div>
                {hasContent && (
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-surface-400">⌘ + Enter to post</span>
                        <Button onClick={handlePost} loading={isPending} disabled={uploadingImage} size="sm">
                            Post
                        </Button>
                    </div>
                )}
            </div>

            <AttachWorkoutPicker
                open={workoutPickerOpen}
                onClose={() => setWorkoutPickerOpen(false)}
                onSelect={workout => {
                    setAttachedWorkout(workout);
                    setWorkoutPickerOpen(false);
                }}
            />

            <AttachGoalPicker
                open={goalPickerOpen}
                onClose={() => setGoalPickerOpen(false)}
                onSelect={goal => {
                    setAttachedGoal(goal);
                    setGoalPickerOpen(false);
                }}
            />

            <AttachPersonalRecordPicker
                open={recordPickerOpen}
                onClose={() => setRecordPickerOpen(false)}
                onSelect={record => {
                    setAttachedRecord(record);
                    setRecordPickerOpen(false);
                }}
            />
        </Card>
    );
}
