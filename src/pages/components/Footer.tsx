import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      title: 'Product',
      links: ['Courses', 'Pricing', 'Live Sessions', 'Certificates', 'Mobile App'],
    },
    {
      title: 'Resources',
      links: ['Blog', 'Documentation', 'Video Tutorials', 'Community Forum', 'Status'],
    },
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Press', 'Contact', 'Partners'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility', 'Support'],
    },
  ];

  const socialLinks = [
    { icon: 'facebook-f', label: 'Facebook' },
    { icon: 'twitter', label: 'Twitter' },
    { icon: 'linkedin-in', label: 'LinkedIn' },
    { icon: 'youtube', label: 'YouTube' },
    { icon: 'instagram', label: 'Instagram' },
  ];

  return (
    <footer className="footer-section" style={{ backgroundColor: '#18181b', color: '#a1a1aa', paddingTop: '80px', paddingBottom: '40px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        {/* Main Footer Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr',
            gap: '48px',
            marginBottom: '48px',
            gridAutoFlow: 'column',
          }}
          className="footer-grid"
        >
          {/* Brand Column */}
          <div>
            <div
              className="footer-logo"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '24px',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#ffa424',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.25rem',
                }}
              >
                <i className="fas fa-graduation-cap" />
              </div>
              <span style={{ color: 'white' }}>TASC</span>
            </div>
            <p style={{ marginBottom: '24px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              Empowering learners worldwide with high-quality courses and expert instruction.
            </p>

            <div className="footer-social" style={{ display: 'flex', gap: '16px' }}>
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href="#"
                  className="social-icon"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#27272a',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffa424',
                    transition: 'all 0.3s',
                    textDecoration: 'none',
                  }}
                  title={social.label}
                >
                  <i className={`fab fa-${social.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <h4
                className="footer-column-title"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'white',
                  marginBottom: '16px',
                  margin: '0 0 16px 0',
                }}
              >
                {column.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {column.links.map((link) => (
                  <li key={link} style={{ marginBottom: '12px', margin: '0 0 12px 0' }}>
                    <a
                      href="#"
                      className="footer-link"
                      style={{
                        color: '#a1a1aa',
                        textDecoration: 'none',
                        transition: 'color 0.3s',
                        fontSize: '0.875rem',
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
            borderTop: '1px solid #27272a',
            paddingTop: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <p
              className="footer-copyright"
              style={{
                fontSize: '0.875rem',
                color: '#52525b',
                margin: 0,
              }}
            >
              &copy; {currentYear} TASC Learning Management System. All rights reserved.
            </p>
            <div
              className="footer-policy-links"
              style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'center',
              }}
            >
              <a
                href="#"
                className="footer-link"
                style={{
                  fontSize: '0.875rem',
                  color: '#52525b',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
              >
                Privacy
              </a>
              <span style={{ color: '#27272a' }}>•</span>
              <a
                href="#"
                className="footer-link"
                style={{
                  fontSize: '0.875rem',
                  color: '#52525b',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
              >
                Terms
              </a>
              <span style={{ color: '#27272a' }}>•</span>
              <a
                href="#"
                className="footer-link"
                style={{
                  fontSize: '0.875rem',
                  color: '#52525b',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
