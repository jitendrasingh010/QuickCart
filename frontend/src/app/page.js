import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Statistics from "@/components/landing/Statistics";
import WhyChoose from "@/components/landing/WhyChoose";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import ScrollToTop from "@/components/landing/ScrollToTop";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <HeroSection />
      <Features />
      <HowItWorks />
      <Statistics />
      <WhyChoose />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
      <ScrollToTop />
    </main>
  );
}