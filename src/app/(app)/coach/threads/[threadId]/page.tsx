import { CoachChatView } from '@/features/ai-coaching/components/CoachChatView';

export default async function CoachThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
    const { threadId } = await params;

    return (
        <div className="h-full max-w-2xl mx-auto flex flex-col">
            <CoachChatView threadId={threadId} />
        </div>
    );
}
