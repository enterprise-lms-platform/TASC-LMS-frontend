import React from 'react';

interface TestimonialsProps {
  isMobile: boolean;
}

const Testimonials: React.FC<TestimonialsProps> = ({ isMobile }) => {
  const testimonials = [
    {
      initials: 'JK',
      name: 'James Kariuki',
      role: 'Senior Developer at TechCorp',
      avatar: '/avatars/male face (14).jpg',
      text: '"TASC LMS completely transformed my career. The React course helped me land a senior developer position at a top tech company. The hands-on projects were invaluable!"',
    },
    {
      initials: 'AN',
      name: 'Amina Nakato',
      role: 'Data Analyst at Global Analytics',
      avatar: '/avatars/female face (5).jpg',
      text: '"The live sessions are amazing! Being able to interact with instructors in real-time made complex data science concepts so much easier to understand."',
    },
    {
      initials: 'PO',
      name: 'Peter Ochieng',
      role: 'HR Director at Innovate Solutions',
      avatar: '/avatars/male face (8).jpg',
      text: '"We enrolled our entire team in TASC LMS. The enterprise features and progress tracking helped us upskill 50+ employees efficiently. Highly recommend for organizations!"',
    },
  ];

  return (
    <section
      className="testimonials-section"
      style={{
        padding: '96px 0',
        background: 'linear-gradient(135deg, rgba(255, 164, 36, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%)',
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
            <i className="fas fa-heart" />
            Testimonials
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#18181b', marginBottom: '16px' }}>
            What Our Learners Say
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#52525b', maxWidth: '700px', margin: '0 auto' }}>
            Join thousands of satisfied learners who have transformed their careers with TASC LMS.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '32px',
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card"
              style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e4e4e7',
                position: 'relative',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Quote mark */}
              <div
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  fontSize: '4rem',
                  color: '#fff3e0',
                  lineHeight: 1,
                  fontFamily: 'Georgia, serif',
                }}
              >
                "
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', gap: '4px', color: '#f59e0b', marginBottom: '16px' }}>
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star" />
                ))}
              </div>

              {/* Text */}
              <p
                style={{
                  fontSize: '1rem',
                  color: '#52525b',
                  lineHeight: 1.8,
                  marginBottom: '24px',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {testimonial.text}
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                    }}
                  >
                    {testimonial.initials}
                  </div>
                )}
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#27272a', margin: 0 }}>
                    {testimonial.name}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#71717a', margin: 0 }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
