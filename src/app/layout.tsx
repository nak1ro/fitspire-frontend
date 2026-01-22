import '../globals.css';
import { AppProviders } from '@/shared/providers/AppProviders';
import { Inter, Outfit } from 'next/font/google';
import { cn } from '@/shared/lib/cn';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  title: 'Fitspire',
  description: 'Your fitness journey starts here.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, outfit.variable, "font-sans antialiased bg-background text-foreground safe-area-view")}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
