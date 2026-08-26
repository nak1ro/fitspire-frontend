import { PostDetailModal } from '@/features/social/components/PostDetailModal';

export default async function InterceptedPostDetailPage({ params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    return <PostDetailModal postId={postId} />;
}
