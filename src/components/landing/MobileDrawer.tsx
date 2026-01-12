import React from 'react';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose }) => {
  const menuItems = [
    { label: 'Courses', href: '#courses', icon: 'book-open' },
    { label: 'Pricing', href: '#pricing', icon: 'tag' },
    { label: 'Features', href: '#features', icon: 'star' },
    { label: 'About', href: '#', icon: 'info-circle' },
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
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#ffa424',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <i className="fas fa-graduation-cap" />
            </div>
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
            {menuItems.map((item) => (
              <li key={item.label} style={{ marginBottom: '8px', margin: '0 0 8px 0' }}>
                <a
                  href={item.href}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    color: '#52525b',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLAnchorElement;
                    target.style.backgroundColor = '#f4f4f5';
                    target.style.color = '#ffa424';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLAnchorElement;
                    target.style.backgroundColor = 'transparent';
                    target.style.color = '#52525b';
                  }}
                >
                  <i className={`fas fa-${item.icon}`} style={{ fontSize: '1rem', width: '20px' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <hr style={{ border: 'none', borderTop: '1px solid #e4e4e7', margin: '16px' }} />

        {/* Action Buttons */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            style={{
              padding: '12px 16px',
              backgroundColor: 'white',
              color: '#ffa424',
              border: '2px solid #ffa424',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.backgroundColor = '#fff9f5';
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.backgroundColor = 'white';
            }}
          >
            Sign In
          </button>
          <button
            style={{
              padding: '12px 16px',
              backgroundColor: '#ffa424',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.backgroundColor = '#f97316';
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.backgroundColor = '#ffa424';
            }}
          >
            Start Learning Free
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
