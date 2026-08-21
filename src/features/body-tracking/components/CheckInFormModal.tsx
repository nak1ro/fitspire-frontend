'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Camera, Trash2, Loader2 } from 'lucide-react';
import { Alert, Button } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useUploadMedia } from '@/features/media/hooks/useUploadMedia';
import { useAbortMediaUpload } from '@/features/media/hooks/useAbortMediaUpload';
import { useCreateBodyCheckIn, useUpdateBodyCheckIn, useDeleteBodyCheckIn } from '../hooks/useBodyCheckIns';
import type { BodyCheckIn, BodyCheckInPhotoOperation } from '../types';

interface Props {
    open: boolean;
    onClose: () => void;
    checkIn?: BodyCheckIn | null;
    defaultDate: string;
}

function today(): string {
    return new Date().toISOString().split('T')[0];
}

function toNumberOrNull(v: string): number | null {
    return v.trim() === '' ? null : Number(v);
}

function MetricField({ label, unit, value, onChange }: { label: string; unit: string; value: string; onChange: (v: string) => void }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500">{label}</label>
            <div className="relative">
                <input
                    type="number"
                    min={0}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="—"
                    className="w-full h-10 pl-3 pr-10 text-sm font-medium bg-surface-50 border border-surface-200 rounded-xl outline-none transition-colors text-foreground placeholder:text-surface-400 focus:border-primary-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-surface-400 pointer-events-none">{unit}</span>
            </div>
        </div>
    );
}

export function CheckInFormModal({ open, onClose, checkIn, defaultDate }: Props) {
    const isEdit = Boolean(checkIn);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [checkInDate, setCheckInDate] = useState(defaultDate);
    const [weightKg, setWeightKg] = useState('');
    const [bodyFatPercent, setBodyFatPercent] = useState('');
    const [waistCm, setWaistCm] = useState('');
    const [chestCm, setChestCm] = useState('');
    const [hipsCm, setHipsCm] = useState('');
    const [armCm, setArmCm] = useState('');
    const [thighCm, setThighCm] = useState('');
    const [wellbeingScore, setWellbeingScore] = useState<number | null>(null);
    const [note, setNote] = useState('');

    const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);
    const [photoOperation, setPhotoOperation] = useState<BodyCheckInPhotoOperation>('Keep');
    const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
    const [newPhotoMediaId, setNewPhotoMediaId] = useState<string | null>(null);

    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { mutateAsync: uploadPhoto, isPending: uploading } = useUploadMedia();
    const { mutate: abortUpload } = useAbortMediaUpload();
    const { mutateAsync: createCheckIn, isPending: creating } = useCreateBodyCheckIn();
    const { mutateAsync: updateCheckIn, isPending: updating } = useUpdateBodyCheckIn();
    const { mutateAsync: deleteCheckIn, isPending: deleting } = useDeleteBodyCheckIn();

    const isPending = creating || updating || deleting || uploading;

    useEffect(() => {
        if (!open) return;
        if (checkIn) {
            setCheckInDate(checkIn.checkInDate);
            setWeightKg(checkIn.weightKg?.toString() ?? '');
            setBodyFatPercent(checkIn.bodyFatPercent?.toString() ?? '');
            setWaistCm(checkIn.waistCm?.toString() ?? '');
            setChestCm(checkIn.chestCm?.toString() ?? '');
            setHipsCm(checkIn.hipsCm?.toString() ?? '');
            setArmCm(checkIn.armCm?.toString() ?? '');
            setThighCm(checkIn.thighCm?.toString() ?? '');
            setWellbeingScore(checkIn.wellbeingScore ?? null);
            setNote(checkIn.note ?? '');
            setExistingPhotoUrl(checkIn.photo?.thumbnail?.url ?? checkIn.photo?.primary?.url ?? null);
        } else {
            setCheckInDate(defaultDate);
            setWeightKg(''); setBodyFatPercent(''); setWaistCm(''); setChestCm('');
            setHipsCm(''); setArmCm(''); setThighCm('');
            setWellbeingScore(null);
            setNote('');
            setExistingPhotoUrl(null);
        }
        setPhotoOperation('Keep');
        setNewPhotoPreview(null);
        setNewPhotoMediaId(null);
        setConfirmingDelete(false);
        setSubmitError(null);
    }, [open, checkIn, defaultDate]);

    const handlePickPhoto = () => fileInputRef.current?.click();

    const handleFileSelected = async (file: File | undefined) => {
        if (!file) return;
        setSubmitError(null);
        setNewPhotoPreview(URL.createObjectURL(file));
        try {
            const asset = await uploadPhoto({ file, purpose: 'BodyProgressPhoto' });
            setNewPhotoMediaId(asset.id);
            setPhotoOperation('Replace');
        } catch (err) {
            setNewPhotoPreview(null);
            setSubmitError(getErrorMessage(err, 'Failed to upload photo.'));
        }
    };

    const handleRemovePhoto = () => {
        // Best-effort cleanup of an already-completed (Ready but unattached) upload;
        // abandoned uploads self-expire anyway, so a failure here isn't surfaced.
        if (newPhotoMediaId) abortUpload(newPhotoMediaId);
        setPhotoOperation('Remove');
        setNewPhotoPreview(null);
        setNewPhotoMediaId(null);
        setExistingPhotoUrl(null);
    };

    const handleDelete = async () => {
        if (!checkIn) return;
        if (!confirmingDelete) { setConfirmingDelete(true); return; }
        try {
            await deleteCheckIn(checkIn.id);
            onClose();
        } catch (err) {
            setSubmitError(getErrorMessage(err, 'Failed to delete check-in.'));
        }
    };

    const handleSubmit = async () => {
        setSubmitError(null);

        const fields = {
            checkInDate,
            weightKg: toNumberOrNull(weightKg),
            bodyFatPercent: toNumberOrNull(bodyFatPercent),
            waistCm: toNumberOrNull(waistCm),
            chestCm: toNumberOrNull(chestCm),
            hipsCm: toNumberOrNull(hipsCm),
            armCm: toNumberOrNull(armCm),
            thighCm: toNumberOrNull(thighCm),
            wellbeingScore,
            note: note.trim() || null,
        };

        const hasAnyValue = Object.entries(fields).some(([key, v]) => key !== 'checkInDate' && v != null) || photoOperation === 'Replace';
        if (!isEdit && !hasAnyValue) {
            setSubmitError('Add at least one measurement, your wellbeing, a note, or a photo.');
            return;
        }

        try {
            if (!checkIn) {
                await createCheckIn({ ...fields, photoMediaId: newPhotoMediaId });
            } else {
                await updateCheckIn({
                    id: checkIn.id,
                    data: {
                        ...fields,
                        photoOperation,
                        photoMediaId: photoOperation === 'Replace' ? newPhotoMediaId : null,
                    },
                });
            }
            onClose();
        } catch (err) {
            setSubmitError(getErrorMessage(err, 'Failed to save check-in. Please try again.'));
        }
    };

    if (!open) return null;

    const photoUrl = newPhotoPreview ?? existingPhotoUrl;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

            <div
                className="relative w-full sm:max-w-xl max-h-[92dvh] sm:max-h-[88dvh] bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col z-10"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                <div className="flex items-center gap-2 px-5 pt-4 pb-1 shrink-0">
                    <h2 className="flex-1 text-base font-bold text-foreground">{isEdit ? 'Edit check-in' : 'New check-in'}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all" aria-label="Close">
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-5 pt-1 space-y-5">

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-surface-700">Date</label>
                        <input
                            type="date"
                            value={checkInDate}
                            max={today()}
                            onChange={e => setCheckInDate(e.target.value)}
                            disabled={isEdit}
                            className="flex h-11 w-full rounded-xl border border-surface-200 px-4 text-sm text-foreground bg-surface-50 outline-none focus:border-primary-500 disabled:opacity-60"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                        <MetricField label="Weight" unit="kg" value={weightKg} onChange={setWeightKg} />
                        <MetricField label="Body fat" unit="%" value={bodyFatPercent} onChange={setBodyFatPercent} />
                        <MetricField label="Waist" unit="cm" value={waistCm} onChange={setWaistCm} />
                        <MetricField label="Chest" unit="cm" value={chestCm} onChange={setChestCm} />
                        <MetricField label="Hips" unit="cm" value={hipsCm} onChange={setHipsCm} />
                        <MetricField label="Arm" unit="cm" value={armCm} onChange={setArmCm} />
                        <MetricField label="Thigh" unit="cm" value={thighCm} onChange={setThighCm} />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-surface-700">Wellbeing <span className="text-surface-400 font-normal">(optional)</span></label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(score => (
                                <button
                                    key={score}
                                    type="button"
                                    onClick={() => setWellbeingScore(wellbeingScore === score ? null : score)}
                                    className={
                                        'flex-1 h-10 rounded-xl text-sm font-bold border transition-all ' +
                                        (wellbeingScore === score ? 'bg-primary-50 border-primary-500 text-primary-600' : 'border-surface-200 text-surface-500 hover:bg-surface-100')
                                    }
                                >
                                    {score}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-surface-700">Photo <span className="text-surface-400 font-normal">(optional)</span></label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={e => handleFileSelected(e.target.files?.[0])}
                        />
                        {photoUrl ? (
                            <div className="relative w-24 h-24">
                                <img src={photoUrl} alt="" className="w-24 h-24 rounded-xl object-cover" />
                                {uploading && (
                                    <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center">
                                        <Loader2 className="h-5 w-5 text-white animate-spin" aria-hidden="true" />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={handleRemovePhoto}
                                    className="absolute -top-2 -right-2 flex items-center justify-center h-6 w-6 rounded-full bg-error text-white shadow-chip"
                                    aria-label="Remove photo"
                                >
                                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handlePickPhoto}
                                className="w-24 h-24 rounded-xl border-2 border-dashed border-surface-200 flex flex-col items-center justify-center gap-1 text-surface-400 hover:text-surface-600 hover:border-surface-300 transition-all"
                            >
                                <Camera className="h-5 w-5" aria-hidden="true" />
                                <span className="text-[10px] font-semibold">Add</span>
                            </button>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-surface-700">Note <span className="text-surface-400 font-normal">(optional)</span></label>
                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            rows={2}
                            maxLength={1000}
                            className="w-full text-sm bg-surface-50 border border-surface-200 rounded-xl px-4 py-2.5 outline-none resize-none text-foreground placeholder:text-surface-400 focus:border-primary-500"
                        />
                    </div>

                    {submitError && <Alert variant="error">{submitError}</Alert>}

                    <Button onClick={handleSubmit} loading={isPending && !confirmingDelete} fullWidth>
                        {isEdit ? 'Save changes' : 'Save check-in'}
                    </Button>

                    {isEdit && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="w-full flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-error hover:opacity-70 transition-opacity disabled:opacity-50"
                        >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            {confirmingDelete ? 'Tap again to confirm delete' : 'Delete check-in'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
