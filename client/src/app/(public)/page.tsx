import { StatsSection } from "./_components/stats-section";
import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";
import { HowItWorksSection } from "./_components/how-it-works-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
    </>
  );
}
