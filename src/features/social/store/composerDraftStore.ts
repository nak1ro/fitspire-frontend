import { create } from 'zustand';
import type { WorkoutHistoryItem, PersonalRecord } from '@/features/workout/types';
import type { Goal } from '@/features/goal/types';

export type ComposerDraftAttachment =
    | { type: 'workout'; item: WorkoutHistoryItem }
    | { type: 'goal'; item: Goal }
    | { type: 'record'; item: PersonalRecord };

interface ComposerDraft {
    attachment: ComposerDraftAttachment;
    caption: string;
}

interface ComposerDraftState {
    pending: ComposerDraft | null;
    setPending: (draft: ComposerDraft) => void;
    consumePending: () => ComposerDraft | null;
}

// Ephemeral hand-off from a "quick share" button (Records tab, workout/goal detail
// screens) to the feed composer: the button stashes an attachment + draft caption
// here and navigates to /feed, where PostComposer consumes (and clears) it on mount.
export const useComposerDraftStore = create<ComposerDraftState>((set, get) => ({
    pending: null,
    setPending: (draft) => set({ pending: draft }),
    consumePending: () => {
        const pending = get().pending;
        if (pending) set({ pending: null });
        return pending;
    },
}));
