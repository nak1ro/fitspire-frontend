import { Trophy } from 'lucide-react';
import { ComingSoonView } from '@/features/shared-views/ComingSoonView';

export default function ChallengesPage() {
    return (
        <ComingSoonView
            icon={Trophy}
            title="Challenges are coming soon"
            subtitle="Create a challenge, set a goal together, and see who rises to it."
        />
    );
}
