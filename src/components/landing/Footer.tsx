import React from 'react';

interface FooterProps {
  isMobile?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isMobile = false }) => {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      title: 'Platform',
      links: ['Browse Courses', 'Categories', 'Pricing', 'For Business', 'Become an Instructor'],
    },
    {
      title: 'Resources',
      links: ['Help Center', 'Documentation', 'Blog', 'Community', 'Webinars'],
    },
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Press', 'Partners', 'Contact'],
    },
    {
      title: 'Support',
      links: ['Contact Support', 'FAQs', 'System Status', 'Accessibility', 'Sitemap'],
    },
  ];

  const socialLinks = [
    { icon: 'facebook-f', label: 'Facebook' },
    { icon: 'twitter', label: 'Twitter' },
    { icon: 'linkedin-in', label: 'LinkedIn' },
    { icon: 'instagram', label: 'Instagram' },
    { icon: 'youtube', label: 'YouTube' },
  ];

  const getGridColumns = () => {
    if (isMobile) return '1fr';
    return '2fr repeat(4, 1fr)';
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
          <div style={{ maxWidth: isMobile ? '100%' : '300px', gridColumn: isMobile ? '1' : 'auto', textAlign: isMobile ? 'center' : 'left' }}>
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
              <i className="fas fa-graduation-cap" style={{ fontSize: '1.5rem', color: '#ffb74d' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>TASC LMS</span>
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
              Empowering learners worldwide with world-class education. Transform your career with expert-led courses
              and recognized certifications.
            </p>

            <div className="footer-social" style={{ display: 'flex', gap: '12px', marginBottom: isMobile ? '24px' : 0, justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href="#"
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

          {/* Footer Columns */}
          {columns.map((column) => (
            <div key={column.title} className="footer-column" style={{ textAlign: isMobile ? 'center' : 'left' }}>
              <h4
                className="footer-column-title"
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'white',
                  marginBottom: '24px',
                }}
              >
                {column.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {column.links.map((link) => (
                  <li key={link} style={{ marginBottom: '12px' }}>
                    <a
                      href="#"
                      className="footer-link"
                      style={{
                        color: '#a1a1aa',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = '#ffb74d';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = '#a1a1aa';
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
            alignItems: isMobile ? 'center' : 'center',
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
            © {currentYear} TASC Learning Management System. All rights reserved.
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
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((item) => (
              <a
                key={item}
                href="#"
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
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
