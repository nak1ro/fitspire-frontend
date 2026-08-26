'use client';

import { useState } from 'react';
import { useLikeComment, useUnlikeComment } from './useSocialMutations';

interface LikeableComment {
    id: string;
    isLikedByCurrentUser: boolean;
    likesCount: number;
}

/** Shared optimistic like/unlike toggle for a comment — used by both the full
 *  threaded comment view and the compact feed-card preview. */
export function useCommentLikeOptimistic(comment: LikeableComment, postId: string) {
    const [liked, setLiked] = useState(comment.isLikedByCurrentUser);
    const [count, setCount] = useState(comment.likesCount);
    const { mutate: likeComment } = useLikeComment();
    const { mutate: unlikeComment } = useUnlikeComment();

    const toggle = () => {
        const wasLiked = liked;
        setLiked(!wasLiked);
        setCount(c => c + (wasLiked ? -1 : 1));
        const mutateLike = wasLiked ? unlikeComment : likeComment;
        mutateLike({ postId, commentId: comment.id }, {
            onError: () => {
                setLiked(wasLiked);
                setCount(c => c + (wasLiked ? 1 : -1));
            },
        });
    };

    return { liked, count, toggle };
}
