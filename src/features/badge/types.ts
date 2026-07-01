import type { PageRequest } from '@/shared/types';

export interface BadgeListFilter extends Partial<PageRequest> {
    category?: string;
}

export interface BadgeCatalogueFilter extends BadgeListFilter {
    earned?: boolean;
}

export interface BadgeCollectionFilter extends BadgeListFilter {
    featured?: boolean;
}

export interface BadgeDefinition {
    badgeId: string;
    code: string;
    name: string;
    description?: string | null;
    iconUrl?: string | null;
    category: string;
    seriesCode?: string | null;
    tier: string;
    criterionCode: string;
    threshold: number;
    canonicalUnit: string;
}

export interface BadgeEvidence {
    criterionCode?: string | null;
    threshold?: number | null;
    achievedValue?: number | null;
    canonicalUnit?: string | null;
    triggeringEntityType?: string | null;
    triggeringEntityId?: string | null;
    summary?: string | null;
}

export interface BadgeCatalogueItem {
    badge: BadgeDefinition;
    isEarned: boolean;
    awardedAt?: string | null;
    featuredOrder?: number | null;
    currentProgress?: number | null;
    progressPercentage?: number | null;
    evidence?: BadgeEvidence | null;
}

export interface EarnedBadge {
    badge: BadgeDefinition;
    awardedAt: string;
    featuredOrder?: number | null;
    evidence: BadgeEvidence;
}

export interface SetFeaturedBadgesRequest {
    badgeIds: string[];
}
