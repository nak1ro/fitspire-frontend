import { RoutedPostDetailModal } from '@/features/social/components/RoutedPostDetailModal';

export default async function InterceptedPostDetailPage({ params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    return <RoutedPostDetailModal postId={postId} />;
}
