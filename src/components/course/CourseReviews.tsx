import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Stack, LinearProgress, Button, Rating, TextField, InputAdornment, Avatar, Paper } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { courseReviewApi } from '../../services/catalogue.services';

interface CourseReviewsProps {
  courseId?: number;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
  const { data: reviewData } = useQuery({
    queryKey: ['courseReviews', courseId],
    queryFn: () => courseReviewApi.getSummary(courseId!),
    enabled: !!courseId,
  });

  const summary = reviewData?.data || { average: 0, total: 0, distribution: [0, 0, 0, 0, 0], reviews: [] };

  const reviews = summary.reviews.map((review) => ({
    initials: review.user_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    name: review.user_name,
    role: 'Student',
    rating: review.rating,
    date: new Date(review.created_at).toLocaleDateString(),
    avatarColor: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    content: review.content,
  }));

  // Fallback to sample reviews if no data
  const displayReviews = reviews.length > 0 ? reviews : [
    {
      initials: 'JK',
      name: 'James Kariuki',
      role: 'Senior Developer at TechCorp',
      rating: 5,
      date: '2 weeks ago',
      avatarColor: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      content: "This is exactly what I was looking for! After years of working with React, I thought I knew most patterns, but this course opened my eyes to so many optimizations and best practices I wasn't aware of."
    },
    {
      initials: 'AN',
      name: 'Amina Nakato',
      role: 'Frontend Engineer at StartupXYZ',
      rating: 5,
      date: '1 month ago',
      avatarColor: 'linear-gradient(135deg, #10b981, #34d399)',
      content: "The performance optimization module is incredible. I applied the techniques to our production app and we saw a 40% improvement in rendering performance."
    },
    {
      initials: 'PO',
      name: 'Peter Ochieng',
      role: 'Lead Developer at Innovate Solutions',
      rating: 4,
      date: '1 month ago',
      avatarColor: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      content: "Great course overall. The content is top-notch and the instructor is excellent. I'd recommend this to anyone serious about learning."
    }
  ];
  return (
    <Box id="reviews" className="course-section" sx={{ mb: 8, scrollMarginTop: '140px' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#18181b' }}>Student Reviews</Typography>

      {/* Summary */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ mb: 4 }}>
        <Box textAlign="center">
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{summary.average > 0 ? summary.average.toFixed(1) : '0.0'}</Typography>
          <Rating value={summary.average} readOnly precision={0.1} size="large" sx={{ color: '#f59e0b', my: 1 }} />
          <Typography variant="body2" color="text.secondary">{summary.total} Reviews</Typography>
        </Box>

        <Box flex={1} maxWidth={400}>
          {[5, 4, 3, 2, 1].map((star, i) => (
            <Stack key={star} direction="row" alignItems="center" spacing={2} sx={{ mb: 1, cursor: 'pointer', '&:hover .MuiLinearProgress-bar': { bgcolor: '#ffa424' } }}>
              <Box display="flex" alignItems="center" width={50}>
                <StarIcon fontSize="small" sx={{ color: '#71717a', mr: 0.5 }} />
                <Typography variant="body2">{star}</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={summary.distribution.length > 0 ? summary.distribution[5 - star] : 0} 
                sx={{ flex: 1, height: 8, borderRadius: 1, bgcolor: '#e4e4e7', '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b', transition: 'background-color 0.3s' } }} 
              />
              <Typography variant="body2" color="text.secondary" width={40} textAlign="right">{summary.distribution.length > 0 ? summary.distribution[5 - star] : 0}%</Typography>
            </Stack>
          ))}
        </Box>
      </Stack>

      {/* Filters & Search */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }} justifyContent="space-between">
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {['All Reviews', '5 Star', '4 Star', '3 Star', 'Recent'].map((filter, i) => (
            <Button 
              key={filter} 
              variant={i === 0 ? "contained" : "outlined"} 
              size="small"
              sx={{ 
                borderRadius: 10, 
                textTransform: 'none', 
                bgcolor: i === 0 ? 'rgba(255, 164, 36, 0.1)' : 'transparent',
                color: i === 0 ? '#ffa424' : '#52525b',
                borderColor: i === 0 ? 'transparent' : '#d4d4d8',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#ffa424', color: 'white', borderColor: '#ffa424' }
              }}
            >
              {filter}
            </Button>
          ))}
        </Stack>
        <TextField
          placeholder="Search reviews..."
          size="small"
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
          }}
          sx={{ width: { xs: '100%', sm: 240 } }}
        />
      </Stack>

      {/* Reviews List */}
      <Stack spacing={3}>
        {displayReviews.map((review, i) => (
          <Paper key={i} elevation={0} sx={{ p: 4, border: '1px solid #e4e4e7', borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={2}>
                <Avatar sx={{ background: review.avatarColor, fontWeight: 700 }}>{review.initials}</Avatar>
                <Box>
                  <Typography fontWeight={600} color="#27272a">{review.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{review.role}</Typography>
                </Box>
              </Stack>
              <Box textAlign="right">
                <Rating value={review.rating} readOnly size="small" sx={{ color: '#f59e0b' }} />
                <Typography variant="caption" display="block" color="text.secondary">{review.date}</Typography>
              </Box>
            </Stack>
            <Typography sx={{ color: '#3f3f46', lineHeight: 1.7, mb: 2, fontSize: '0.9rem' }}>{review.content}</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="caption" color="text.secondary">Was this review helpful?</Typography>
              <Button size="small" startIcon={<ThumbUpIcon fontSize="small" />} sx={{ color: '#52525b', textTransform: 'none' }}>Yes (42)</Button>
              <Button size="small" startIcon={<ThumbDownIcon fontSize="small" />} sx={{ color: '#52525b', textTransform: 'none' }}>No (2)</Button>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Box textAlign="center" mt={4}>
        <Button variant="outlined" sx={{ color: '#ffa424', borderColor: '#ffa424', '&:hover': { bgcolor: '#fff3e0', borderColor: '#ffa424' } }}>
          Load More Reviews
        </Button>
      </Box>
    </Box>
  );
};

export default CourseReviews;
