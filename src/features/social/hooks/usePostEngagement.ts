'use client';

import { useState } from 'react';
import { useLikePost, useUnlikePost, useSavePost, useUnsavePost } from './useSocialMutations';

interface EngageablePost {
    id: string;
    isLikedByCurrentUser: boolean;
    likesCount: number;
    isSavedByCurrentUser: boolean;
}

/** Shared optimistic like/save toggle for a post — used by both the feed card and the post detail view. */
export function usePostEngagement(item: EngageablePost) {
    const [liked, setLiked] = useState(item.isLikedByCurrentUser);
    const [likesCount, setLikesCount] = useState(item.likesCount);
    const [saved, setSaved] = useState(item.isSavedByCurrentUser);
    const { mutate: likePost } = useLikePost();
    const { mutate: unlikePost } = useUnlikePost();
    const { mutate: savePost } = useSavePost();
    const { mutate: unsavePost } = useUnsavePost();

    const toggleLike = () => {
        const wasLiked = liked;
        setLiked(!wasLiked);
        setLikesCount(c => c + (wasLiked ? -1 : 1));
        const mutateLike = wasLiked ? unlikePost : likePost;
        mutateLike(item.id, {
            onError: () => {
                setLiked(wasLiked);
                setLikesCount(c => c + (wasLiked ? 1 : -1));
            },
        });
    };

    const toggleSave = () => {
        const wasSaved = saved;
        setSaved(!wasSaved);
        const mutateSave = wasSaved ? unsavePost : savePost;
        mutateSave(item.id, { onError: () => setSaved(wasSaved) });
    };

    return { liked, likesCount, toggleLike, saved, toggleSave };
}
