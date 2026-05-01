import { env } from "@env/web";
import { createFileRoute } from "@tanstack/react-router";
import { getOwnerSetupStatus } from "@/features/admin/owner/api";
import { Hero } from "@/features/landing/components/hero";
import { Features } from "@/features/landing/components/features";
import { Workflow } from "@/features/landing/components/workflow";
import { MatchIntelligence } from "@/features/landing/components/match-intelligence";
import { Pricing } from "@/features/landing/components/pricing";
import { Testimonials } from "@/features/landing/components/testimonials";
import { FAQ } from "@/features/landing/components/faq";
import { CTA } from "@/features/landing/components/cta";
import { Footer } from "@/features/landing/components/footer";
import { LandingNav } from "@/features/landing/components/landing-nav";

export const Route = createFileRoute("/_public/")({
  beforeLoad: async () => {
    if (!env.VITE_OWNER_SETUP_CHECK) {
      return;
    }
    // Check setup-status so the UI can conditionally render/setup links
    // but do NOT perform any automatic redirection. The user can still
    // navigate to /setup manually if OWNER_SETUP_CHECK is enabled and
    // no owner exists.
    try {
      await getOwnerSetupStatus();
    } catch {
      return;
    }

    // Intentionally do not redirect here. Let the page render and the
    // UI decide whether to show setup entry points.
    return;
  },
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <LandingNav />
        <main className="flex-grow">
          <Hero />
          <Features />
          <Workflow />
          <MatchIntelligence />
          <Pricing />
          <Testimonials />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
