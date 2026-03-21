import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from '../../components/landing/Header';
import Footer from '../../components/landing/Footer';
import BusinessHero from '../../components/business/BusinessHero';
import TrustedBySection from '../../components/business/TrustedBySection';
import BenefitsSection from '../../components/business/BenefitsSection';
import FeaturesShowcase from '../../components/business/FeaturesShowcase';
import UseCasesSection from '../../components/business/UseCasesSection';
import BusinessStatsSection from '../../components/business/BusinessStatsSection';
import PricingSection from '../../components/business/PricingSection';
import TestimonialsSection from '../../components/business/TestimonialsSection';
import FaqSection from '../../components/business/FaqSection';
import BusinessCtaSection from '../../components/business/BusinessCtaSection';
import '../../styles/ForBusiness.css';

const ForBusinessPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header scrolled={scrolled} />
      
      <Box component="main" sx={{ flex: 1 }}>
        <BusinessHero />
        <TrustedBySection />
        <BenefitsSection />
        <FeaturesShowcase />
        <UseCasesSection />
        <BusinessStatsSection />
        <PricingSection />
        <TestimonialsSection />
        <FaqSection />
        <BusinessCtaSection />
      </Box>

      <Footer />
    </Box>
  );
};

export default ForBusinessPage;
