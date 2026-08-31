'use client';

import { useState } from 'react';
import { ChevronRight, UsersRound } from 'lucide-react';
import { Card, IconChip } from '@/shared/ui';
import { PeopleDiscoveryModal } from './PeopleDiscoveryModal';

export function FindPeopleToFollowCard() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Card interactive onClick={() => setOpen(true)} padding="md" className="group">
                <div className="flex items-center gap-3">
                    <IconChip icon={UsersRound} variant="primary" />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground">Find people to follow</p>
                        <p className="mt-0.5 text-xs text-surface-500">Discover active Fitspire members</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-surface-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
            </Card>
            <PeopleDiscoveryModal open={open} onClose={() => setOpen(false)} />
        </>
    );
}
