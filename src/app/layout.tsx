import '../globals.css';
import { AppProviders } from '@/shared/providers/AppProviders';
import { jakarta } from '@/shared/lib/fonts';

export const metadata = {
    title: 'Fitspire',
    description: 'Your fitness journey starts here.',
    icons: {
        icon: '/icon.svg',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${jakarta.variable} font-sans antialiased bg-background text-foreground`}>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
