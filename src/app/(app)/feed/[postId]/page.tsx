import { PostDetailView } from '@/features/social/components/PostDetailView';

export default async function PostDetailPage({ params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <PostDetailView postId={postId} />
        </div>
    );
}
