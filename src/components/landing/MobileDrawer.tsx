import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const roleDashboardMap: Record<string, string> = {
  learner: '/learner',
  instructor: '/instructor',
  lms_manager: '/manager',
  finance: '/finance',
  tasc_admin: '/superadmin',
};

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const dashboardPath = user?.role ? (roleDashboardMap[user.role] || '/learner') : '/learner';

  const menuItems = [
    { label: 'Courses', href: '#courses', icon: 'book-open' },
    { label: 'Pricing', href: '#pricing', icon: 'tag' },
    { label: 'Features', href: '#features', icon: 'star' },
    { label: 'Verify Certificate', href: '/verify-certificate', icon: 'certificate' },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: open ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
          zIndex: 40,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'background-color 0.3s',
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          maxWidth: '300px',
          height: '100vh',
          backgroundColor: 'white',
          zIndex: 50,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s',
          overflowY: 'auto',
          boxShadow: open ? '0 8px 32px rgba(0, 0, 0, 0.1)' : 'none',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            borderBottom: '1px solid #e4e4e7',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '1.25rem',
              fontWeight: 700,
            }}
          >
            <img
              src="/TASC logo.png"
              alt="TASC Logo"
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
            />
            <span>TASC</span>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#52525b',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#18181b')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#52525b')}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Menu Items */}
        <nav style={{ padding: '16px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menuItems.map((item) => {
              const linkStyle = {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                color: '#52525b',
                textDecoration: 'none',
                transition: 'all 0.3s',
              };
              const hoverIn = (e: React.MouseEvent<HTMLElement>) => {
                e.currentTarget.style.backgroundColor = '#f4f4f5';
                e.currentTarget.style.color = '#ffa424';
              };
              const hoverOut = (e: React.MouseEvent<HTMLElement>) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#52525b';
              };
              const content = (
                <>
                  <i className={`fas fa-${item.icon}`} style={{ fontSize: '1rem', width: '20px' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</span>
                </>
              );
              const isRoute = item.href.startsWith('/');
              return (
                <li key={item.label} style={{ marginBottom: '8px', margin: '0 0 8px 0' }}>
                  {isRoute ? (
                    <Link to={item.href} onClick={onClose} style={linkStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                      {content}
                    </Link>
                  ) : (
                    <a href={item.href} onClick={onClose} style={linkStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                      {content}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <hr style={{ border: 'none', borderTop: '1px solid #e4e4e7', margin: '16px' }} />

        {/* Action Buttons */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isAuthenticated && user ? (
            <>
              <Link
                to={dashboardPath}
                onClick={onClose}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#ffa424',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                My Dashboard
              </Link>
              <button
                onClick={() => { logout(); onClose(); }}
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'white',
                  color: '#ffa424',
                  border: '2px solid #ffa424',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textAlign: 'center',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                }}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={onClose}
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'white',
                  color: '#ffa424',
                  border: '2px solid #ffa424',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#ffa424',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                Start Learning Free
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
