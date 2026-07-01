import type { PageRequest } from '@/shared/types';
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
export type QuantityUnit = 'Grams' | 'Millilitres' | 'Serving' | 'Piece' | 'CustomServing';
export interface MealItemRequest { name: string; quantity: number; quantityUnit: QuantityUnit; customUnitName?: string | null; caloriesKcal?: number | null; proteinGrams?: number | null; carbsGrams?: number | null; fatGrams?: number | null; }
export interface MealItem extends MealItemRequest { id: string; orderIndex: number; favouriteFoodId?: string | null; createdAt: string; updatedAt?: string | null; }
export interface MealMetadata { mealDate: string; consumedAtLocalTime?: string | null; mealType: MealType; name?: string | null; notes?: string | null; }
export interface CreateMealRequest extends MealMetadata { items: MealItemRequest[]; }
export type UpdateMealRequest = MealMetadata;
export interface Meal extends MealMetadata { id: string; items: MealItem[]; caloriesKcal: number; proteinGrams: number; carbsGrams: number; fatGrams: number; createdAt: string; updatedAt?: string | null; }
export interface AddMealItemRequest { item?: MealItemRequest | null; favouriteFoodId?: string | null; }
export interface ReorderMealItemsRequest { itemIds: string[]; }
export interface NutritionTargetRequest { caloriesKcal?: number | null; proteinGrams?: number | null; carbsGrams?: number | null; fatGrams?: number | null; }
export interface NutritionTarget extends NutritionTargetRequest { id: string; createdAt: string; updatedAt?: string | null; }
export interface FavouriteFood extends MealItemRequest { id: string; createdAt: string; updatedAt?: string | null; }
export type FavouriteFoodRequest = MealItemRequest;
export interface RecentFood extends MealItemRequest { lastUsedDate: string; lastUsedLocalTime?: string | null; }
export interface MealHistoryFilter extends Partial<PageRequest> { from?: string; to?: string; type?: MealType; }
export interface FavouriteFoodFilter extends Partial<PageRequest> { query?: string; }
export interface NutritionTotals { caloriesKcal: number; proteinGrams: number; carbsGrams: number; fatGrams: number; }
export interface NutritionTargetProgress { target?: number | null; percentage?: number | null; }
export interface DailyNutritionSummary { date: string; meals: Meal[]; totals: NutritionTotals; target?: NutritionTarget | null; caloriesKcalProgress: NutritionTargetProgress; proteinGramsProgress: NutritionTargetProgress; carbsGramsProgress: NutritionTargetProgress; fatGramsProgress: NutritionTargetProgress; }
export interface NutritionDailyTotalPoint { date: string; totals: NutritionTotals; }
export interface NutritionRangeSummary { from: string; to: string; calendarDayCount: number; loggedDayCount: number; totals: NutritionTotals; averagePerLoggedDay?: NutritionTotals | null; target?: NutritionTarget | null; caloriesKcalAverageProgress: NutritionTargetProgress; proteinGramsAverageProgress: NutritionTargetProgress; carbsGramsAverageProgress: NutritionTargetProgress; fatGramsAverageProgress: NutritionTargetProgress; dailyTotals: NutritionDailyTotalPoint[]; }
export interface DateRangeFilter { from?: string; to?: string; }
