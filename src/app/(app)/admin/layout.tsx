import { type ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { isCurrentUserAdmin } from '@/features/auth/server/session';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    if (!await isCurrentUserAdmin()) redirect('/feed');
    return children;
}
