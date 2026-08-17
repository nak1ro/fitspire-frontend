import { AdminModerationDetailView } from '@/features/moderation/components/admin/AdminModerationDetailView';

export default async function AdminReportPage({ params }: { params: Promise<{ reportId: string }> }) {
    const { reportId } = await params;
    return <div className="mx-auto max-w-2xl px-4 py-6"><AdminModerationDetailView reportId={reportId} /></div>;
}
