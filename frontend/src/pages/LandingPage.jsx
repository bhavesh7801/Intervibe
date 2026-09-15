import React from 'react';
import HeroSection from '../components/landing/HeroSection.jsx';
import FeaturesGrid from '../components/landing/FeaturesGrid.jsx';
import InteractivePreview from '../components/landing/InteractivePreview.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import CompanyTracks from '../components/landing/CompanyTracks.jsx';
import Testimonials from '../components/landing/Testimonials.jsx';
import FaqAccordion from '../components/landing/FaqAccordion.jsx';
import FinalCta from '../components/landing/FinalCta.jsx';
import Footer from '../components/landing/Footer.jsx';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans relative overflow-x-hidden selection:bg-rose-500 selection:text-white transition-colors duration-200">
      <main className="relative z-10 flex flex-col gap-6 sm:gap-10 pb-16">
        <HeroSection />
        <FeaturesGrid />
        <InteractivePreview />
        <HowItWorks />
        <CompanyTracks />
        <Testimonials />
        <FaqAccordion />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
