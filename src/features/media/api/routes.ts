export const MEDIA_ROUTES = {
    uploads: '/api/media/uploads',
    upload: (mediaAssetId: string) => `/api/media/uploads/${mediaAssetId}`,
    complete: (mediaAssetId: string) => `/api/media/uploads/${mediaAssetId}/complete`,
} as const;
