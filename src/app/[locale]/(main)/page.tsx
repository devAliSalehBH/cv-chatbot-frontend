
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import WhyPlatform from "@/components/WhyPlatform";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">

      <Hero />
      <HowItWorks />
      <Pricing />
      <WhyPlatform />
      <CallToAction />
      <Footer />
    </main>
  );
}
