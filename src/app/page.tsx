import { MarketingNav } from '@/features/marketing/components/MarketingNav';
import { HeroSection } from '@/features/marketing/components/HeroSection';
import { MarketingFooter } from '@/features/marketing/components/MarketingFooter';

export default function HomePage() {
    return (
        <div className="bg-background min-h-screen flex flex-col">
            <MarketingNav />
            <main className="flex-1 pt-16">
                <HeroSection />
            </main>
            <MarketingFooter />
        </div>
    );
}
