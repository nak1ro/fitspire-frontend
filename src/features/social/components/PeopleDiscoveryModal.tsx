'use client';

import { useEffect, useState } from 'react';
import { Search, Users, X } from 'lucide-react';
import { Avatar, EmptyState, Modal } from '@/shared/ui';
import { useDiscoverSocialUsers } from '../hooks/useSocialReads';
import { useRetainedFollows, type RetainedFollow } from '../hooks/useRetainedFollows';
import type { DiscoverableSocialUser } from '../types';
import { DiscoveryFollowButton } from './DiscoveryFollowButton';

interface PeopleDiscoveryModalProps {
    open: boolean;
    onClose: () => void;
}

function useDebouncedValue(value: string, delayMs: number) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = window.setTimeout(() => setDebounced(value), delayMs);
        return () => window.clearTimeout(timer);
    }, [delayMs, value]);

    return debounced;
}

interface PeopleRowProps {
    person: DiscoverableSocialUser;
    isFollowing: boolean;
    isLeaving: boolean;
    onFollowStarted: () => void;
    onUnfollowed: () => void;
}

function PeopleRow({ person, isFollowing, isLeaving, onFollowStarted, onUnfollowed }: PeopleRowProps) {
    return (
        <div className={`flex items-center gap-3 rounded-xl px-2 py-2 transition-all duration-300 ${isLeaving ? '-translate-x-2 opacity-0' : 'animate-fade-in'}`}>
            <Avatar displayName={person.displayName} userName={person.userName} avatarUrl={person.profilePictureUrl} size="md" />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{person.displayName}</p>
                <p className="truncate text-xs text-surface-400">@{person.userName}</p>
                {person.reason && <p className="mt-1 text-xs text-primary-600">{person.reason}</p>}
            </div>
            <DiscoveryFollowButton
                userId={person.id}
                isFollowing={isFollowing}
                onFollowStarted={onFollowStarted}
                onUnfollowed={onUnfollowed}
            />
        </div>
    );
}

function getDisplayedPeople(people: DiscoverableSocialUser[], retained: RetainedFollow[], resultKey: string) {
    const relevantRetained = retained.filter((entry) => entry.resultKey === resultKey);
    const retainedIds = new Set(relevantRetained.map((entry) => entry.person.id));
    const displayed = people.filter((person) => !retainedIds.has(person.id));

    for (const entry of relevantRetained.sort((left, right) => left.index - right.index)) {
        displayed.splice(Math.min(entry.index, displayed.length), 0, entry.person);
    }

    return displayed.slice(0, 5);
}

function PeopleSkeleton() {
    return (
        <div className="space-y-2 py-2" aria-label="Loading people" aria-busy="true">
            {[1, 2, 3].map((item) => <div key={item} className="h-14 animate-pulse rounded-xl bg-surface-100" />)}
        </div>
    );
}

export function PeopleDiscoveryModal({ open, onClose }: PeopleDiscoveryModalProps) {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebouncedValue(query, 300).trim();
    const canSearch = debouncedQuery.length >= 2;
    const { data: people, isLoading, isFetching } = useDiscoverSocialUsers(canSearch ? debouncedQuery : '', open);
    const { retained, retain, revert } = useRetainedFollows();

    const rawQuery = query.trim();
    const isSearchMode = rawQuery.length >= 2;
    const isTyping = rawQuery.length > 0 && !isSearchMode;
    const title = isSearchMode ? 'People matching your search' : 'Recommended for you';
    const resultKey = isSearchMode ? `search:${debouncedQuery}` : 'recommendations';
    const displayPeople = getDisplayedPeople(people ?? [], retained, resultKey);
    const handleClose = () => {
        setQuery('');
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose} maxWidthClassName="sm:max-w-lg" labelledBy="people-discovery-title">
            <div className="flex max-h-[80dvh] flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="people-discovery-title" className="text-lg font-bold text-foreground">Find people to follow</h2>
                        <p className="mt-1 text-sm text-surface-500">Search public profiles or discover active members.</p>
                    </div>
                    <button type="button" onClick={handleClose} className="rounded-lg p-1 text-surface-400 hover:bg-surface-100 hover:text-foreground" aria-label="Close">
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <label className="mt-5 flex h-11 items-center gap-2 rounded-xl border border-surface-200 bg-surface-50 px-3 focus-within:border-primary-500">
                    <Search className="h-4 w-4 shrink-0 text-surface-400" aria-hidden="true" />
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Username or display name" className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-surface-400" />
                </label>

                <div className="mt-5 min-h-0 flex-1 overflow-y-auto">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-surface-400">{title}</h3>
                    {isTyping ? (
                        <p className="py-7 text-center text-sm text-surface-400">Type at least two characters to search.</p>
                    ) : isSearchMode && !canSearch || isLoading || isFetching ? <PeopleSkeleton /> : !displayPeople.length ? (
                        <EmptyState icon={Users} title={isSearchMode ? 'No new people found' : 'No recommendations yet'} className="py-8" />
                    ) : (
                        <div key={isSearchMode ? 'search-results' : 'recommendations'} className="space-y-1 animate-fade-in">
                            {displayPeople.map((person, index) => {
                                const retainedEntry = retained.find((entry) =>
                                    entry.person.id === person.id && entry.resultKey === resultKey);
                                return (
                                    <PeopleRow
                                        key={person.id}
                                        person={person}
                                        isFollowing={retainedEntry?.isFollowing ?? false}
                                        isLeaving={retainedEntry?.isLeaving ?? false}
                                        onFollowStarted={() => retain(person, index, resultKey)}
                                        onUnfollowed={() => revert(person.id)}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
