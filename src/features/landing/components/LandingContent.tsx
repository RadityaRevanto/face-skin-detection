import { LandingHeader } from "../components/LandingHeader";
import { LandingHero } from "../components/LandingHero";
import { LandingStats } from "../components/LandingStats";
import { LandingFeatures } from "../components/LandingFeatures";
import { LandingHowItWorks } from "../components/LandingHowItWorks";
import { LandingBenefits } from "../components/LandingBenefits";
import { LandingForDoctors } from "../components/LandingDoctors";
import { LandingCta } from "../components/LandingCta";
import { LandingFooter } from "../components/LandingFooter";
import { landingStats, landingFeatures, landingSteps, landingBenefits } from "../utils/landingContent";

export function LandingContent() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <LandingHeader />

      <main className="flex-1">
        <LandingHero />
        <LandingStats stats={landingStats} />
        <LandingFeatures features={landingFeatures} />
        <LandingHowItWorks steps={landingSteps} />
        <LandingBenefits benefits={landingBenefits} />
        <LandingForDoctors />
        <LandingCta />
      </main>

      <LandingFooter />
    </div>
  );
}
