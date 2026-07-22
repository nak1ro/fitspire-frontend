import { GoalDetailView } from '@/features/goal/components/GoalDetailView';

export default async function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <GoalDetailView goalId={id} />
        </div>
    );
}
