import { Hero } from "./components/hero";
import { Features } from "./components/features";
import { Workflow } from "./components/workflow";
import { MatchIntelligence } from "./components/match-intelligence";
import { Pricing } from "./components/pricing";
import { Testimonials } from "./components/testimonials";
import { FAQ } from "./components/faq";
import { CTA } from "./components/cta";
import { Footer } from "./components/footer";
import { LandingNav } from "./components/landing-nav";

export const Home = () => {
  return (
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
  );
};
