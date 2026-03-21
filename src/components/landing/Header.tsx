import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import MobileDrawer from './MobileDrawer';

const roleDashboardMap: Record<string, string> = {
  learner: '/learner',
  instructor: '/instructor',
  lms_manager: '/manager',
  finance: '/finance',
  tasc_admin: '/superadmin',
};

interface HeaderProps {
  scrolled: boolean;
  onMobileMenuToggle?: () => void;
  isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ scrolled }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const dashboardPath = user?.role ? (roleDashboardMap[user.role] || '/learner') : '/learner';
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = useCallback(() => setDrawerOpen((prev) => !prev), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Close drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setDrawerOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <style>{`
        .header-desktop-nav,
        .header-desktop-actions {
          display: flex;
        }
        .header-mobile-toggle {
          display: none;
        }
        @media (max-width: 959px) {
          .header-desktop-nav,
          .header-desktop-actions {
            display: none !important;
          }
          .header-mobile-toggle {
            display: block;
          }
        }
      `}</style>
      <header
        className={`landing-page-header ${scrolled ? 'scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none',
          zIndex: 1100,
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 0',
            }}
          >
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <img
                src="/TASC logo.png"
                alt="TASC Logo"
                style={{ width: '72px', height: '72px', objectFit: 'contain' }}
              />
              <h1
                style={{
                  fontWeight: 700,
                  color: '#ffa424',
                  margin: 0,
                  fontSize: '1.5rem',
                }}
              >
                TASC LMS
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="header-desktop-nav" style={{ gap: '24px', flexGrow: 1, marginLeft: '32px', alignItems: 'center' }}>
              <Link to="/courses" className="nav-link" style={{ color: '#52525b', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Courses
              </Link>
              <a href="#features" className="nav-link" style={{ color: '#52525b', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Features
              </a>
              <a href="#pricing" className="nav-link" style={{ color: '#52525b', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Pricing
              </a>
              <Link to="/for-business" className="nav-link" style={{ color: '#52525b', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                For Business
              </Link>
              <Link to="/verify-certificate" className="nav-link" style={{ color: '#52525b', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Verify Certificate
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="header-desktop-actions" style={{ gap: '12px', alignItems: 'center' }}>
              {isAuthenticated && user ? (
                <>
                  <Link
                    to={dashboardPath}
                    style={{
                      padding: '8px 20px',
                      backgroundColor: '#ffa424',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      textDecoration: 'none',
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => logout()}
                    style={{
                      padding: '8px 20px',
                      border: '1px solid #d4d4d8',
                      backgroundColor: 'white',
                      color: '#3f3f46',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
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
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
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
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Start Free Trial
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="header-mobile-toggle"
              onClick={toggleDrawer}
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
          </div>
        </div>
      </header>

      {/* Built-in Mobile Drawer */}
      <MobileDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
};

export default Header;
