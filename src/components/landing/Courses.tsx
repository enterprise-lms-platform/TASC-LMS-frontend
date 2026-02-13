import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EnrollmentModal from '../catalogue/EnrollmentModal';

interface CoursesProps {
  isMobile: boolean;
}

const Courses: React.FC<CoursesProps> = ({ isMobile }) => {
  const navigate = useNavigate();
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{ title: string; price: string } | null>(null);

  const handleEnroll = (course: { title: string; price: string }) => {
    setSelectedCourse(course);
    setEnrollModalOpen(true);
  };

  const courses = [
    {
      category: 'Web Development',
      title: 'Advanced React Patterns & Best Practices',
      instructor: 'Michael Rodriguez',
      hours: '24 hours',
      level: 'Advanced',
      rating: 4.8,
      reviews: '1.2k',
      price: '$129.99',
      original: '$199.99',
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?q=80&w=1074',
    },
    {
      category: 'Data Science',
      title: 'Data Science & Machine Learning Fundamentals',
      instructor: 'Emma Chen',
      hours: '36 hours',
      level: 'Beginner',
      rating: 4.9,
      reviews: '856',
      price: 'Free',
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1170',
    },
    {
      category: 'Cybersecurity',
      title: 'Cybersecurity Essentials: From Zero to Hero',
      instructor: 'David Wilson',
      hours: '28 hours',
      level: 'Intermediate',
      rating: 4.7,
      reviews: '642',
      price: '$89.99',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1171',
    },
  ];

  return (
    <section
      style={{
        paddingTop: '96px',
        paddingBottom: '96px',
        backgroundColor: '#fafafa',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '48px',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '24px',
          }}
        >
          <div>
            <div
              className="chip-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#fff3e0',
                color: '#ffa424',
                padding: '6px 12px',
                borderRadius: '20px',
                fontWeight: 600,
                marginBottom: '16px',
                fontSize: '0.875rem',
              }}
            >
              <i className="fas fa-fire" />
              Popular Courses
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px', margin: '0 0 8px 0' }}>
              Featured Courses
            </h2>
            <p
              style={{
                fontSize: '1.125rem',
                color: '#52525b',
                margin: 0,
              }}
            >
              Discover our most popular courses loved by thousands of learners.
            </p>
          </div>
          <button
            onClick={() => navigate('/courses')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              backgroundColor: 'white',
              border: '2px solid #ffa424',
              color: '#ffa424',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            View All Courses
            <i className="fas fa-arrow-right" />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '32px',
          }}
        >
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="course-card"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: 'white',
              }}
            >
              {/* Card Header Image */}
              <div
                className="course-image"
                style={{
                  position: 'relative',
                  height: '200px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={course.image}
                  alt={course.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                
                {/* Overlay gradient for text readability if needed, or just hover effect */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.1)',
                    transition: 'background 0.3s ease'
                  }}
                  className="image-overlay"
                />
                {course.badge && (
                  <div
                    className="course-badge"
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      backgroundColor: course.badge === 'Bestseller' ? '#ffa424' : '#10b981',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  >
                    {course.badge}
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div style={{ padding: '24px' }}>
                <p
                  style={{
                    color: '#ffa424',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontSize: '0.75rem',
                    margin: '0 0 8px 0',
                  }}
                >
                  {course.category}
                </p>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '12px', margin: '0 0 12px 0' }}>
                  {course.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#ffa424',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {course.instructor
                      ? course.instructor
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                      : 'IN'}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#71717a', margin: 0 }}>{course.instructor}</p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '16px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #e4e4e7',
                    fontSize: '0.75rem',
                    color: '#71717a',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className="fas fa-clock" />
                    {course.hours}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className="fas fa-signal" />
                    {course.level}
                  </div>
                  <div
                    className="course-rating"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <i className="fas fa-star" style={{ color: '#f59e0b' }} />
                    <strong style={{ color: '#27272a' }}>{course.rating}</strong>
                    <span>({course.reviews})</span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: course.price === 'Free' ? '#10b981' : '#27272a',
                        margin: 0,
                      }}
                    >
                      {course.price}
                    </p>
                    {course.original && (
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: '#a1a1aa',
                          textDecoration: 'line-through',
                          margin: 0,
                        }}
                      >
                        {course.original}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleEnroll(course)}
                    style={{
                      padding: '6px 16px',
                      backgroundColor: '#ffa424',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <EnrollmentModal 
        open={enrollModalOpen} 
        onClose={() => setEnrollModalOpen(false)} 
        courseTitle={selectedCourse?.title || ''} 
        coursePrice={selectedCourse?.price || ''} 
      />
    </section>
  );
};

export default Courses;
