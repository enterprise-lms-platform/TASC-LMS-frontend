import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  isMobile?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isMobile = false }) => {
  const currentYear = new Date().getFullYear();

  const platformLinks = [
    { label: 'Browse Courses', href: '/courses' },
    { label: 'For Business', href: '/business' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
  ];

  const socialLinks = [
    { icon: 'facebook-f', label: 'Facebook', href: 'https://www.facebook.com/TascUg/' },
    { icon: 'x-twitter', label: 'X (Twitter)', href: 'https://x.com/Tasc_Ug/' },
    { icon: 'linkedin-in', label: 'LinkedIn', href: 'https://www.linkedin.com/company/the-assessment-and-skilling-centre/' },
    { icon: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/tascuganda/' },
    { icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/channel/UCzQmK67VmivoyB72SDOcpKg' },
  ];

  const getGridColumns = () => {
    if (isMobile) return '1fr';
    return '2fr 1fr 1.5fr 1.5fr';
  };

  const linkHoverStyle = {
    color: '#a1a1aa',
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'color 0.2s',
  };

  return (
    <footer
      className="footer-section"
      style={{
        backgroundColor: '#18181b',
        color: 'white',
        padding: isMobile ? '48px 0 32px' : '80px 0 32px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Main Footer Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: getGridColumns(),
            gap: isMobile ? '32px' : '48px',
            marginBottom: '64px',
          }}
          className="footer-grid"
        >
          {/* Brand Column */}
          <div style={{ maxWidth: isMobile ? '100%' : '320px', gridColumn: isMobile ? '1' : 'auto', textAlign: isMobile ? 'center' : 'left' }}>
            <div
              className="footer-logo"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
                justifyContent: isMobile ? 'center' : 'flex-start',
              }}
            >
              <img src="/TASC logo.png" alt="TASC Logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffa424' }}>TASC LMS</span>
            </div>
            <p
              className="footer-description"
              style={{
                fontSize: '0.875rem',
                color: '#a1a1aa',
                lineHeight: 1.7,
                marginBottom: '24px',
                maxWidth: isMobile ? '100%' : 'auto',
                margin: isMobile ? '0 auto 24px' : '0 0 24px',
              }}
            >
              TASC is a private pre-employment training, assessment and certification hub for ambitious professionals in East Africa. Together with global partners, we provide programs that help people achieve their potential through work-based learning.
            </p>

            <div className="footer-social" style={{ display: 'flex', gap: '12px', marginBottom: isMobile ? '24px' : 0, justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    transition: 'all 0.3s',
                    textDecoration: 'none',
                  }}
                  title={social.label}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#ffa424';
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                  }}
                >
                  <i className={`fab fa-${social.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div className="footer-column" style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <h4
              className="footer-column-title"
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'white',
                marginBottom: '24px',
              }}
            >
              Platform
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {platformLinks.map((link) => (
                <li key={link.label} style={{ marginBottom: '12px' }}>
                  <Link
                    to={link.href}
                    className="footer-link"
                    style={linkHoverStyle}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#ffb74d';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#a1a1aa';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kampala Office */}
          <div className="footer-column" style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <h4
              className="footer-column-title"
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'white',
                marginBottom: '24px',
              }}
            >
              Kampala Office
            </h4>
            <div style={{ fontSize: '0.875rem', color: '#a1a1aa', lineHeight: 1.8 }}>
              <p style={{ margin: '0 0 8px' }}>Plot 15, Martyrs Way, Ntinda</p>
              <p style={{ margin: '0 0 8px' }}>P. O. Box 124128, Kampala</p>
              <p style={{ margin: '0 0 8px' }}>
                Tel:{' '}
                <a
                  href="tel:+256741543906"
                  style={{ color: '#ffa424', textDecoration: 'none' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffb74d'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffa424'; }}
                >
                  +256 741 543 906
                </a>
              </p>
              <p style={{ margin: '0' }}>
                <a
                  href="mailto:admin@tasc.co.ug"
                  style={{ color: '#ffa424', textDecoration: 'none' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffb74d'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffa424'; }}
                >
                  admin@tasc.co.ug
                </a>
              </p>
            </div>
          </div>

          {/* Hoima Office */}
          <div className="footer-column" style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <h4
              className="footer-column-title"
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'white',
                marginBottom: '24px',
              }}
            >
              Hoima Office
            </h4>
            <div style={{ fontSize: '0.875rem', color: '#a1a1aa', lineHeight: 1.8 }}>
              <p style={{ margin: '0 0 8px' }}>Plot 1 Kikwite Rd – Kijungu</p>
              <p style={{ margin: '0 0 16px' }}>Opp. Murubya P/Sch</p>
              <a
                href="https://tasc.co.ug/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#ffa424',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffb74d'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffa424'; }}
              >
                🌐 tasc.co.ug
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className="footer-bottom"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '32px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          <p
            className="footer-copyright"
            style={{
              fontSize: '0.875rem',
              color: '#71717a',
              margin: 0,
            }}
          >
            © {currentYear} The Assessment & Skilling Centre (TASC). All rights reserved.
          </p>
          <div
            className="footer-legal"
            style={{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              justifyContent: isMobile ? 'center' : 'flex-end',
            }}
          >
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Service', href: '/terms' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.href}
                style={{
                  fontSize: '0.875rem',
                  color: '#71717a',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#ffb74d';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#71717a';
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
