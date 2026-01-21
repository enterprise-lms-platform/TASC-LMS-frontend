import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/LandingPage.css';
import Header from '../components/landing/Header'
import Hero from '../components/landing/Hero';
import TrustedBy from '../components/landing/TrustedBy';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Courses from '../components/landing/Courses';
import Categories from '../components/landing/Categories';
import Testimonials from '../components/landing/Testimonials';
import StatsBanner from '../components/landing/StatsBanner';
import Pricing from '../components/landing/Pricing';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';
import MobileDrawer from '../components/landing/MobileDrawer';

const LandingPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <Header
        scrolled={scrolled}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMobile={isMobile}
      />

      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <Hero isMobile={isMobile} />

      <TrustedBy isMobile={isMobile} />

      <Features isMobile={isMobile} />

      <HowItWorks isMobile={isMobile} />

      <Courses isMobile={isMobile} />

      <Categories isMobile={isMobile} />

      <Testimonials isMobile={isMobile} />

      <StatsBanner isMobile={isMobile} />

      <Pricing isMobile={isMobile} />

      <CTA isMobile={isMobile} />

      <Footer isMobile={isMobile} />
    </div>
  );
};

export default LandingPage;

