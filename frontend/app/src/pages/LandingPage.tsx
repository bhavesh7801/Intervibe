import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { MockInterviewPreview } from '../components/landing/MockInterviewPreview';
import { CompanyTracks } from '../components/landing/CompanyTracks';
import { HowItWorks } from '../components/landing/HowItWorks';
import { SystemDesignPreview } from '../components/landing/SystemDesignPreview';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { Testimonials } from '../components/landing/Testimonials';
import { FaqAccordion } from '../components/landing/FaqAccordion';
import { FinalCta } from '../components/landing/FinalCta';
import { Footer } from '../components/landing/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 font-sans relative overflow-x-hidden selection:bg-blue-500 selection:text-white" data-testid="landing-page">
      <main className="relative z-10 flex flex-col gap-28 lg:gap-40 pb-32">
        <HeroSection />
        <MockInterviewPreview />
        <CompanyTracks />
        <HowItWorks />
        <SystemDesignPreview />
        <FeaturesGrid />
        <Testimonials />
        <FaqAccordion />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
