import React from 'react';

interface CategoriesProps {
  isMobile: boolean;
}

const Categories: React.FC<CategoriesProps> = ({ isMobile }) => {
  const categories = [
    { icon: 'code', name: 'Web Development', courses: 42, gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { icon: 'chart-line', name: 'Data Science', courses: 28, gradient: 'linear-gradient(135deg, #11998e, #38ef7d)' },
    { icon: 'shield-alt', name: 'Cybersecurity', courses: 15, gradient: 'linear-gradient(135deg, #eb3349, #f45c43)' },
    { icon: 'briefcase', name: 'Business', courses: 36, gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { icon: 'paint-brush', name: 'Design', courses: 24, gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    { icon: 'bullhorn', name: 'Marketing', courses: 18, gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
    { icon: 'cloud', name: 'Cloud Computing', courses: 21, gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
    { icon: 'mobile-alt', name: 'Mobile Development', courses: 19, gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)' },
  ];

  const getGridColumns = () => {
    if (isMobile) return '1fr';
    return 'repeat(4, 1fr)';
  };

  return (
    <section
      style={{
        padding: '96px 0',
        backgroundColor: 'white',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div
            className="chip-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#fff3e0',
              color: '#ffa424',
              padding: '8px 16px',
              borderRadius: '9999px',
              fontWeight: 600,
              marginBottom: '16px',
              fontSize: '0.875rem',
            }}
          >
            <i className="fas fa-th-large" />
            Browse by Category
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#18181b', marginBottom: '16px' }}>
            Explore Top Categories
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#52525b', maxWidth: '700px', margin: '0 auto' }}>
            Discover courses across a wide range of topics to help you achieve your goals.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: getGridColumns(),
            gap: '24px',
          }}
        >
          {categories.map((category, index) => (
            <a
              key={index}
              href="#"
              className="category-card"
              style={{
                backgroundColor: '#fafafa',
                border: '1px solid #e4e4e7',
                borderRadius: '24px',
                padding: '32px 24px',
                textAlign: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.backgroundColor = 'white';
                target.style.borderColor = '#ffcc80';
                target.style.transform = 'translateY(-8px)';
                target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.backgroundColor = '#fafafa';
                target.style.borderColor = '#e4e4e7';
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  margin: '0 auto 20px',
                  background: category.gradient,
                  color: category.name === 'Mobile Development' ? '#3f3f46' : 'white',
                  transition: 'transform 0.3s ease',
                }}
              >
                <i className={`fas fa-${category.icon}`} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#27272a', marginBottom: '8px' }}>
                {category.name}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#71717a', margin: 0 }}>
                {category.courses} Courses
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
