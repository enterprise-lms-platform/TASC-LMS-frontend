import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EnrollmentModal from '../catalogue/EnrollmentModal';
import { publicCatalogueApi, getErrorMessage } from '../../lib/api';
import type { PublicCourse } from '../../types/api';
import { getCourseThumbnail, getLocalThumbnailByCategory } from '../../utils/courseHelpers';

interface CoursesProps {
  isMobile: boolean;
}

interface DisplayCourse {
  category: string;
  categorySlug?: string; // For fallback image mapping
  title: string;
  instructor: string;
  hours: string;
  level: string;
  rating: number;
  reviews: string;
  price: string;
  original?: string;
  badge?: string;
  image: string;
}

const Courses: React.FC<CoursesProps> = ({ isMobile }) => {
  const navigate = useNavigate();
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{ title: string; price: string } | null>(null);
  
  // API state
  const [courses, setCourses] = useState<DisplayCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Image error tracking (by course index)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  // Track category slugs for fallback (indexed by course index)
  const [categorySlugs, setCategorySlugs] = useState<Map<number, string | undefined>>(new Map());

  const handleEnroll = (course: { title: string; price: string }) => {
    setSelectedCourse(course);
    setEnrollModalOpen(true);
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  // Fetch featured courses from API
  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await publicCatalogueApi.getCourses({ 
          featured: true,
          page: 1 
        });
        
        // Take first 3 courses for landing page
        const featuredCourses = response.results.slice(0, 3);
        
        // Map API response to display format
        const mappedCourses: DisplayCourse[] = featuredCourses.map((course: PublicCourse) => ({
          category: course.category?.name || 'General',
          categorySlug: course.category?.slug,
          title: course.title,
          instructor: course.instructor_name || 'Instructor',
          hours: `${course.duration_hours} hours`,
          level: course.level.charAt(0).toUpperCase() + course.level.slice(1).replace('_', ' '),
          rating: 4.8, // TODO: Backend doesn't provide ratings yet
          reviews: course.enrollment_count > 0 ? String(course.enrollment_count) : '0',
          price: course.price === '0.00' || course.price === '0' ? 'Free' : `$${course.price}`,
          original: course.discount_percentage > 0 
            ? `$${(parseFloat(course.price) / (1 - course.discount_percentage / 100)).toFixed(2)}` 
            : undefined,
          badge: course.featured ? 'Bestseller' : undefined,
          image: getCourseThumbnail({
            thumbnail: course.thumbnail,
            slug: course.slug,
            category: course.category,
          }),
        }));
        
        // Store category slugs for fallback
        const slugMap = new Map<number, string | undefined>();
        mappedCourses.forEach((course, idx) => {
          slugMap.set(idx, course.categorySlug);
        });
        setCategorySlugs(slugMap);
        setCourses(mappedCourses);
      } catch (err) {
        console.error('Failed to fetch featured courses:', err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section
        style={{
          paddingTop: '96px',
          paddingBottom: '96px',
          backgroundColor: '#fafafa',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', color: '#ffa424' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px' }} />
            <p style={{ margin: 0, fontSize: '1.125rem' }}>Loading featured courses...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
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
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <i className="fas fa-exclamation-circle" style={{ color: '#dc2626', fontSize: '24px', marginBottom: '8px' }} />
            <p style={{ color: '#991b1b', margin: 0 }}>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (courses.length === 0) {
    return (
      <section
        style={{
          paddingTop: '96px',
          paddingBottom: '96px',
          backgroundColor: '#fafafa',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
          <i className="fas fa-book-open" style={{ fontSize: '48px', color: '#d4d4d8', marginBottom: '16px' }} />
          <p style={{ fontSize: '1.125rem', color: '#71717a', margin: 0 }}>
            No featured courses available at the moment.
          </p>
        </div>
      </section>
    );
  }

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
                  src={imageErrors.has(idx) ? getLocalThumbnailByCategory(categorySlugs.get(idx)) : course.image}
                  alt={course.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError(idx)}
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
