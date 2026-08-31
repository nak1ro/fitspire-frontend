import { FeedView } from '@/features/social/components/FeedView';
import { FeedRail } from '@/features/social/components/FeedRail';

export default function FeedPage() {
    return (
        <div className="max-w-xl lg:max-w-5xl mx-auto px-4 py-6">
            <div className="lg:flex lg:gap-8 lg:justify-center lg:items-start">
                <div className="lg:w-full lg:max-w-xl">
                    <FeedView />
                </div>
                <aside className="hidden lg:block w-72 shrink-0 sticky top-6">
                    <FeedRail />
                </aside>
            </div>
        </div>
    );
}
