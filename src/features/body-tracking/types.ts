import type { Media } from '@/features/media/types';
import type { PageRequest } from '@/shared/types';

export type BodyCheckInPhotoOperation = 'Keep' | 'Replace' | 'Remove';
export interface BodyCheckInInput { checkInDate: string; weightKg?: number | null; bodyFatPercent?: number | null; waistCm?: number | null; chestCm?: number | null; hipsCm?: number | null; armCm?: number | null; thighCm?: number | null; wellbeingScore?: number | null; note?: string | null; }
export interface CreateBodyCheckInRequest extends BodyCheckInInput { photoMediaId?: string | null; }
export interface UpdateBodyCheckInRequest extends BodyCheckInInput { photoOperation: BodyCheckInPhotoOperation; photoMediaId?: string | null; }
export interface BodyCheckIn extends BodyCheckInInput { id: string; photoMediaId?: string | null; photo?: Media | null; createdAt: string; updatedAt?: string | null; }
export interface BodyCheckInHistoryFilter extends Partial<PageRequest> { from?: string; to?: string; }
export interface BodyMeasurementSnapshot { weightKg?: number | null; bodyFatPercent?: number | null; waistCm?: number | null; chestCm?: number | null; hipsCm?: number | null; armCm?: number | null; thighCm?: number | null; }
export type BodyMeasurementChange = BodyMeasurementSnapshot;
export interface BodyCheckInChartPoint extends BodyMeasurementSnapshot { checkInDate: string; wellbeingScore?: number | null; }
export interface BodyCheckInSummary { from: string; to: string; activeCheckInCount: number; baseline: BodyMeasurementSnapshot; current: BodyMeasurementSnapshot; changes: BodyMeasurementChange; latestWellbeingScore?: number | null; chartPoints: BodyCheckInChartPoint[]; }
export interface DateRangeFilter { from?: string; to?: string; }
