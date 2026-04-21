import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicCategoryApi, publicCourseApi } from '../../services/public.services';
import type { Category, CourseList } from '../../types/types';

interface CategoriesProps {
  isMobile: boolean;
}

const gradients = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #11998e, #38ef7d)',
  'linear-gradient(135deg, #eb3349, #f45c43)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a8edea, #fed6e3)',
];

const icons = ['code', 'chart-line', 'shield-alt', 'briefcase', 'paint-brush', 'bullhorn', 'cloud', 'mobile-alt'];

interface CategoryWithCount extends Category {
  icon: string;
  courses: number;
  gradient: string;
}

const Categories: React.FC<CategoriesProps> = ({ isMobile }) => {
  const navigate = useNavigate();
  
  const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery({
    queryKey: ['publicCategories'],
    queryFn: () => publicCategoryApi.getAll(),
  });

  const { data: coursesResponse, isLoading: coursesLoading } = useQuery({
    queryKey: ['publicCourses', 'all'],
    queryFn: () => publicCourseApi.getAll({ page_size: 1000 }),
  });

  const categories: CategoryWithCount[] = React.useMemo(() => {
    const categoriesData = categoriesResponse?.data?.results || [];
    const coursesData = coursesResponse?.data?.results || [];
    
    const courseCountByCategory = new Map<number, number>();
    coursesData.forEach((course: CourseList) => {
      if (course.category?.id) {
        const count = courseCountByCategory.get(course.category.id) || 0;
        courseCountByCategory.set(course.category.id, count + 1);
      }
    });

    return categoriesData.slice(0, 8).map((cat, idx) => ({
      ...cat,
      icon: icons[idx % icons.length],
      courses: courseCountByCategory.get(cat.id) || 0,
      gradient: gradients[idx % gradients.length],
    }));
  }, [categoriesResponse, coursesResponse]);

  const isLoading = categoriesLoading || coursesLoading;

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
          {categories.length > 0 ? categories.map((category, index) => (
      <a
        key={category.id || index}
        href={`/courses?category=${category.id || ''}`}
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
              onClick={(e) => {
                e.preventDefault();
                navigate(`/courses?category=${category.slug}`);
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
                {isLoading ? '...' : `${category.courses} Courses`}
              </p>
            </a>
          )) : isLoading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#fafafa',
                  border: '1px solid #e4e4e7',
                  borderRadius: '24px',
                  padding: '32px 24px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '16px',
                    margin: '0 auto 20px',
                    background: gradients[idx % gradients.length],
                  }}
                />
                <div style={{ height: '20px', backgroundColor: '#e4e4e7', borderRadius: '4px', marginBottom: '8px' }} />
                <div style={{ height: '16px', width: '60%', backgroundColor: '#e4e4e7', borderRadius: '4px', margin: '0 auto' }} />
              </div>
            ))
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Categories;
