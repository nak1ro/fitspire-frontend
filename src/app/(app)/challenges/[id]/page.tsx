import { ChallengeDetailView } from '@/features/challenge/components/ChallengeDetailView';

export default async function ChallengeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <ChallengeDetailView challengeId={id} />
        </div>
    );
}
