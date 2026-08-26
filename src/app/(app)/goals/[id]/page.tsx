import { GoalDetailView } from '@/features/goal/components/GoalDetailView';

export default async function GoalDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ ownerId?: string }>;
}) {
    const { id } = await params;
    const { ownerId } = await searchParams;

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <GoalDetailView goalId={id} ownerId={ownerId} />
        </div>
    );
}
