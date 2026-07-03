import { UserProfileView } from '@/features/social/components/UserProfileView';

export default async function OtherUserProfilePage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <UserProfileView userId={userId} />
        </div>
    );
}
