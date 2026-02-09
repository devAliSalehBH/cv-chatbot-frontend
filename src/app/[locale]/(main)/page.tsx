import Hero from "@/components/landingPage/Hero";
import HowItWorks from "@/components/landingPage/HowItWorks";
import Pricing from "@/components/landingPage/Pricing";
import WhyPlatform from "@/components/landingPage/WhyPlatform";
import CallToAction from "@/components/landingPage/CallToAction";
import Footer from "@/components/landingPage/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Pricing />
      <WhyPlatform />
      <CallToAction />
      <Footer />
    </main>
  );
}
