'use client';

import { createContext, type ReactNode, useContext } from 'react';

interface AppShellActions {
    openLogWorkout: () => void;
}

const AppShellActionsContext = createContext<AppShellActions | null>(null);

interface AppShellActionsProviderProps extends AppShellActions {
    children: ReactNode;
}

export function AppShellActionsProvider({ children, openLogWorkout }: AppShellActionsProviderProps) {
    return (
        <AppShellActionsContext.Provider value={{ openLogWorkout }}>
            {children}
        </AppShellActionsContext.Provider>
    );
}

export function useAppShellActions(): AppShellActions {
    const actions = useContext(AppShellActionsContext);
    if (!actions) throw new Error('useAppShellActions must be used within AppShellActionsProvider.');
    return actions;
}
