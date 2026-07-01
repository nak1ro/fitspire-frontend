import { http } from '@/shared/lib/http';
import type { PageResponse } from '@/shared/types';
import { BADGE_ROUTES } from './routes';
import type { BadgeCatalogueFilter, BadgeCatalogueItem, BadgeCollectionFilter, EarnedBadge, SetFeaturedBadgesRequest } from '../types';

export const getBadgeCatalogue = (accessToken: string, filter?: BadgeCatalogueFilter) =>
    http<PageResponse<BadgeCatalogueItem>>(BADGE_ROUTES.base, {
        accessToken,
        query: filter
            ? { category: filter.category, earned: filter.earned, page: filter.page, pageSize: filter.pageSize }
            : undefined,
    });

export const getMyBadges = (accessToken: string, filter?: BadgeCollectionFilter) =>
    http<PageResponse<EarnedBadge>>(BADGE_ROUTES.mine, {
        accessToken,
        query: filter
            ? { category: filter.category, featured: filter.featured, page: filter.page, pageSize: filter.pageSize }
            : undefined,
    });

export const setFeaturedBadges = (accessToken: string, data: SetFeaturedBadgesRequest) =>
    http<void>(BADGE_ROUTES.featured, { method: 'PUT', accessToken, json: data });
