import type { BadgeCatalogueFilter, BadgeCollectionFilter } from '../types';

export const badgeQueryKeys = {
    all: ['badge'] as const,
    catalogue: (filter?: BadgeCatalogueFilter) => [...badgeQueryKeys.all, 'catalogue', filter ?? {}] as const,
    mine: (filter?: BadgeCollectionFilter) => [...badgeQueryKeys.all, 'mine', filter ?? {}] as const,
};
