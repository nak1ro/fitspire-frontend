import { completeMediaUpload, getMediaUploadStatus, initiateMediaUpload } from '../api/client';
import { MediaAssetState, MediaPurpose, UploadMediaInput } from '../types';

const SUPPORTED_CONTENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const PROFILE_PICTURE_MAX_BYTES = 15 * 1024 * 1024;
const LARGE_IMAGE_MAX_BYTES = 30 * 1024 * 1024;

export async function uploadMedia(
    accessToken: string,
    { file, purpose, clientRequestId, signal }: UploadMediaInput
): Promise<MediaAssetState> {
    validateFile(file, purpose);

    const session = await initiateMediaUpload(accessToken, {
        purpose,
        fileName: file.name,
        contentType: file.type,
        sizeBytes: file.size,
        clientRequestId: clientRequestId ?? crypto.randomUUID(),
    }, signal);

    if (session.status === 'Ready' || session.status === 'Attached') {
        return getMediaUploadStatus(accessToken, session.mediaAssetId, signal);
    }

    if (!session.uploadUrl || !session.method) {
        throw new Error('The media upload session did not provide an upload URL.');
    }

    const response = await fetch(session.uploadUrl, {
        method: session.method,
        headers: session.requiredHeaders ?? undefined,
        body: file,
        signal,
    });

    if (!response.ok) {
        throw new Error(`Image upload failed with status ${response.status}.`);
    }

    return completeMediaUpload(accessToken, session.mediaAssetId, signal);
}

function validateFile(file: File, purpose: MediaPurpose) {
    if (!SUPPORTED_CONTENT_TYPES.has(file.type.toLowerCase())) {
        throw new Error('Use a JPEG, PNG, or WebP image. Animated images are not supported.');
    }

    const maximumSize = purpose === 'ProfilePicture' ? PROFILE_PICTURE_MAX_BYTES : LARGE_IMAGE_MAX_BYTES;
    if (file.size <= 0 || file.size > maximumSize) {
        throw new Error(`This image must be no larger than ${maximumSize / 1024 / 1024} MB.`);
    }
}
