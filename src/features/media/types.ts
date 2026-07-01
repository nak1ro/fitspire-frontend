export type MediaPurpose = 'ProfilePicture' | 'PostImage' | 'BodyProgressPhoto';
export type MediaStatus = 'Pending' | 'Processing' | 'Ready' | 'Attached' | 'Rejected' | 'Retired';
export type MediaVariantKind = 'Primary' | 'Thumbnail';

export interface InitiateMediaUploadRequest {
    purpose: MediaPurpose;
    fileName: string;
    contentType: string;
    sizeBytes: number;
    clientRequestId?: string | null;
}

export interface MediaUploadSession {
    mediaAssetId: string;
    status: MediaStatus;
    uploadUrl?: string | null;
    method?: string | null;
    requiredHeaders?: Record<string, string> | null;
    expiresAtUtc?: string | null;
}

export interface MediaVariant {
    kind: MediaVariantKind;
    width: number;
    height: number;
    contentType: string;
}

export interface MediaReadVariant {
    url: string;
    expiresAtUtc: string;
    width: number;
    height: number;
    contentType: string;
}

export interface MediaAssetState {
    id: string;
    purpose: MediaPurpose;
    status: MediaStatus;
    actualSizeBytes?: number | null;
    variants: MediaVariant[];
    createdAt: string;
    readyAtUtc?: string | null;
}

export interface Media {
    id: string;
    purpose: MediaPurpose;
    primary?: MediaReadVariant | null;
    thumbnail?: MediaReadVariant | null;
}

export interface UploadMediaInput {
    file: File;
    purpose: MediaPurpose;
    clientRequestId?: string;
    signal?: AbortSignal;
}
