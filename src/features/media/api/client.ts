import { http } from '@/shared/lib/http';
import { MEDIA_ROUTES } from './routes';
import { InitiateMediaUploadRequest, MediaAssetState, MediaUploadSession } from '../types';

export const initiateMediaUpload = (accessToken: string, request: InitiateMediaUploadRequest, signal?: AbortSignal) =>
    http<MediaUploadSession>(MEDIA_ROUTES.uploads, {
        method: 'POST',
        accessToken,
        json: request,
        signal,
    });

export const completeMediaUpload = (accessToken: string, mediaAssetId: string, signal?: AbortSignal) =>
    http<MediaAssetState>(MEDIA_ROUTES.complete(mediaAssetId), {
        method: 'POST',
        accessToken,
        signal,
    });

export const getMediaUploadStatus = (accessToken: string, mediaAssetId: string, signal?: AbortSignal) =>
    http<MediaAssetState>(MEDIA_ROUTES.upload(mediaAssetId), { accessToken, signal });

export const abortMediaUpload = (accessToken: string, mediaAssetId: string, signal?: AbortSignal) =>
    http<void>(MEDIA_ROUTES.upload(mediaAssetId), {
        method: 'DELETE',
        accessToken,
        signal,
    });
