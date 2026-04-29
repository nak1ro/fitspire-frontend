import { MarketingNav } from '@/features/marketing/components/MarketingNav';
import { HeroSection } from '@/features/marketing/components/HeroSection';
import { FeaturesSection } from '@/features/marketing/components/FeaturesSection';
import { ManifestoSection } from '@/features/marketing/components/ManifestoSection';
import { HowItWorksSection } from '@/features/marketing/components/HowItWorksSection';
import { CtaSection } from '@/features/marketing/components/CtaSection';
import { MarketingFooter } from '@/features/marketing/components/MarketingFooter';

export default function HomePage() {
    return (
        <div className="bg-background min-h-screen flex flex-col">
            <MarketingNav />
            <main className="flex-1 pt-16">
                <HeroSection />
                <FeaturesSection />
                <ManifestoSection />
                <HowItWorksSection />
                <CtaSection />
            </main>
            <MarketingFooter />
        </div>
    );
}
