import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Why from "@/components/landing/Why";
import TryExamples from "@/components/landing/TryExamples";
import Faq from "@/components/landing/Faq";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";

// min-h (not fixed h) so a section taller than the viewport grows instead of
// clipping. Smooth scrolling lives on <html> in globals.css.
export default function LandingPage() {
  return (
    <div className="bg-paper">
      <SiteHeader variant="landing" />
      <main>
        <Hero />
        <HowItWorks />
        <Why />
        <TryExamples />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
