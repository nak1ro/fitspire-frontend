import { SettingsView } from '@/features/user/components/SettingsView';

export default function SettingsPage() {
    return (
        <div className="max-w-lg mx-auto px-4 py-6">
            <h1 className="text-xl font-extrabold text-foreground mb-6">Settings</h1>
            <SettingsView />
        </div>
    );
}
