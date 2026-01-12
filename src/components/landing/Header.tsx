import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  scrolled: boolean;
  onMobileMenuToggle: () => void;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ scrolled, onMobileMenuToggle, isMobile }) => {
  const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);

  return (
    <header
      className={`landing-page-header ${scrolled ? 'scrolled' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none',
        zIndex: 100,
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 0',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i
              className="fas fa-graduation-cap"
              style={{ fontSize: '32px', color: '#ffa424' }}
            />
            <h1
              style={{
                fontWeight: 700,
                color: '#27272a',
                margin: 0,
                fontSize: '1.5rem',
              }}
            >
              TASC LMS
            </h1>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: '32px', flexGrow: 1, marginLeft: '32px' }}>
              <div style={{ position: 'relative' }}>
                <button
                  className="nav-link"
                  onClick={() => setCoursesMenuOpen(!coursesMenuOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#52525b',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Courses
                  <i className="fas fa-chevron-down" style={{ fontSize: '12px' }} />
                </button>
                {coursesMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      backgroundColor: 'white',
                      border: '1px solid #e4e4e7',
                      borderRadius: '8px',
                      marginTop: '8px',
                      minWidth: '200px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      zIndex: 200,
                    }}
                  >
                    {[
                      { icon: 'code', label: 'Web Development' },
                      { icon: 'chart-line', label: 'Data Science' },
                      { icon: 'shield-alt', label: 'Cybersecurity' },
                      { icon: 'briefcase', label: 'Business' },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href="#"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          color: '#3f3f46',
                          textDecoration: 'none',
                          borderBottom: '1px solid #e4e4e7',
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = '#fafafa';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = 'white';
                        }}
                      >
                        <i
                          className={`fas fa-${item.icon}`}
                          style={{ fontSize: '16px', color: '#ffa424' }}
                        />
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <a href="#features" className="nav-link" style={{ color: '#52525b', textDecoration: 'none' }}>
                Features
              </a>
              <a href="#pricing" className="nav-link" style={{ color: '#52525b', textDecoration: 'none' }}>
                Pricing
              </a>
              <a href="#" className="nav-link" style={{ color: '#52525b', textDecoration: 'none' }}>
                For Business
              </a>
              <a href="#" className="nav-link" style={{ color: '#52525b', textDecoration: 'none' }}>
                About
              </a>
            </nav>
          )}

          {/* Desktop Actions */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                to="/login"
                style={{
                  padding: '8px 20px',
                  border: '1px solid #d4d4d8',
                  backgroundColor: 'white',
                  color: '#3f3f46',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                Log In
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#ffa424',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                Start Free Trial
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button
              onClick={onMobileMenuToggle}
              style={{
                background: 'none',
                border: 'none',
                color: '#27272a',
                fontSize: '24px',
                cursor: 'pointer',
              }}
            >
              <i className="fas fa-bars" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
