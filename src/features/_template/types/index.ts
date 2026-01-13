/**
 * [Feature] Types
 * 
 * TypeScript types for this feature.
 */

// Entity Types
export interface FeatureItem {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

// Request Types
export interface CreateFeatureRequest {
    name: string;
}

export interface UpdateFeatureRequest {
    name?: string;
}

// Response Types (if different from entity)
// export interface FeatureListResponse { ... }
