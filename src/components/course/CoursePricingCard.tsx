import React from 'react';
import { Box, Typography, Button, Stack, Chip, Divider, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { PublicCourseDetail } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';
import { enrollmentApi } from '../../services/learning.services';
import { useCreateEnrollment } from '../../hooks/useLearning';

interface CoursePricingCardProps {
  course?: PublicCourseDetail;
}

const CoursePricingCard: React.FC<CoursePricingCardProps> = ({ course }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const enrollMutation = useCreateEnrollment();

  const formatPrice = (price: string | undefined) => {
    if (!price) return '0';
    const num = parseFloat(price);
    return isNaN(num) ? '0' : num.toFixed(2);
  };

  const price = parseFloat(course?.discounted_price || course?.price || '0');
  const isFree = price === 0;

  // Check if user is already enrolled (only when authenticated)
  const { data: enrollmentsData } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => enrollmentApi.getAll().then(r => r.data),
    enabled: isAuthenticated,
  });

  const enrollments = Array.isArray(enrollmentsData) ? enrollmentsData : (enrollmentsData as any)?.results || [];
  const isEnrolled = course?.id && enrollments.some((e: any) => e.course === course.id || e.course_id === course.id);

  const handleFreeEnroll = async () => {
    if (!course?.id) return;
    try {
      await enrollMutation.mutateAsync({ course: course.id });
      navigate(`/learner/course/${course.id}`);
    } catch {
      // Already enrolled — navigate anyway
      navigate(`/learner/course/${course.id}`);
    }
  };

  return (
    <Box className="enrollment-card-sticky" sx={{ width: '100%', maxWidth: 360, bgcolor: 'white', borderRadius: 4, overflow: 'hidden', boxShadow: 6, display: { xs: 'none', lg: 'block' } }}>
      {/* Video Preview */}
      <Box sx={{ position: 'relative', cursor: 'pointer', '&:hover .preview-overlay': { opacity: 1 } }}>
        <Box
          component="img"
          src={course?.thumbnail || 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?q=80&w=1074&auto=format&fit=crop'}
          alt={course?.title || 'Course Preview'}
          sx={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
        />
        <Box
          className="preview-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8,
            transition: 'opacity 0.3s',
          }}
        >
          <Box
            className="play-button-pulse"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 64,
              height: 64,
              bgcolor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffa424',
              zIndex: 2,
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 32 }} />
          </Box>
        </Box>
        <Typography
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontWeight: 600,
            bgcolor: 'rgba(0,0,0,0.7)',
            px: 2,
            py: 0.5,
            borderRadius: 10,
            fontSize: '0.875rem',
          }}
        >
          Preview this course
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Already enrolled state */}
        {isEnrolled ? (
          <>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ color: '#10b981', mb: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 20 }} />
              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>You're enrolled!</Typography>
            </Stack>

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<PlayArrowIcon />}
                onClick={() => navigate(`/learner/course/${course?.id}`)}
                sx={{ bgcolor: '#10b981', fontWeight: 700, '&:hover': { bgcolor: '#059669' } }}
              >
                Continue Learning
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 1 }}>
              {isFree ? (
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981' }}>Free</Typography>
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#18181b' }}>${formatPrice(course?.discounted_price || course?.price || '0')}</Typography>
                  {course?.discount_percentage ? (
                    <>
                      <Typography sx={{ color: '#71717a', fontSize: '1rem', fontWeight: 500, textDecoration: 'line-through' }}>${formatPrice(course.price)}</Typography>
                      <Chip label={`${course.discount_percentage}% OFF`} size="small" sx={{ bgcolor: '#fef3c7', color: '#d97706', fontWeight: 700, height: 24 }} />
                    </>
                  ) : (
                    <Typography sx={{ color: '#71717a', fontSize: '1rem', fontWeight: 500 }}>/ course</Typography>
                  )}
                </>
              )}
            </Stack>

            <Box sx={{ mb: 3 }}>
              <Chip
                label="Full Access"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 164, 36, 0.15)',
                  color: '#ffa424',
                  fontWeight: 700,
                  height: 24
                }}
              />
            </Box>

            <Stack direction="row" alignItems="center" spacing={1} sx={{ color: '#10b981', mb: 3 }}>
              <AccessTimeIcon sx={{ fontSize: 18 }} />
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Full access to all course content!</Typography>
            </Stack>

            <Stack spacing={2} sx={{ mb: 3 }}>
              {isFree && isAuthenticated ? (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={enrollMutation.isPending ? <CircularProgress size={18} color="inherit" /> : <PlayArrowIcon />}
                  disabled={enrollMutation.isPending}
                  onClick={handleFreeEnroll}
                  sx={{ bgcolor: '#10b981', fontWeight: 700, '&:hover': { bgcolor: '#059669' } }}
                >
                  {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now — Free'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<ShoppingCartIcon />}
                  href={`/checkout?course=${course?.slug || ''}`}
                  sx={{ bgcolor: '#ffa424', fontWeight: 700, '&:hover': { bgcolor: '#f97316' } }}
                >
                  Get Full Access
                </Button>
              )}
            </Stack>

            <Typography sx={{ textAlign: 'center', fontSize: '0.75rem', color: '#71717a', mb: 3 }}>
              {isFree ? 'No payment required' : '30-Day Money-Back Guarantee'}
            </Typography>
          </>
        )}

        <Divider sx={{ mb: 2 }} />

        <Stack direction="row" justifyContent="space-around">
          <Button startIcon={<ShareIcon />} sx={{ color: '#52525b', textTransform: 'none' }}>Share</Button>
          <Button startIcon={<FavoriteBorderIcon />} sx={{ color: '#52525b', textTransform: 'none' }}>Gift</Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default CoursePricingCard;
