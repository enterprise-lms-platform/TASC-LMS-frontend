import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, Stack, LinearProgress, Button, Rating, TextField, InputAdornment, Avatar, Paper, IconButton, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ReportIcon from '@mui/icons-material/Report';
import { courseReviewApi } from '../../services/catalogue.services';

interface CourseReviewsProps {
  courseId?: number;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
  const queryClient = useQueryClient();
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: reviewData } = useQuery({
    queryKey: ['courseReviews', courseId],
    queryFn: () => courseReviewApi.getSummary(courseId!),
    enabled: !!courseId,
  });

  const { data: filteredReviewsData } = useQuery({
    queryKey: ['courseReviewsList', courseId, ratingFilter],
    queryFn: () => courseReviewApi.getAll({ course: courseId, rating: ratingFilter }),
    enabled: !!courseId,
  });

  const helpfulMutation = useMutation({
    mutationFn: courseReviewApi.helpful,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseReviews', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courseReviewsList', courseId] });
    },
  });

  const reportMutation = useMutation({
    mutationFn: courseReviewApi.report,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseReviews', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courseReviewsList', courseId] });
    },
  });

  const summary = reviewData?.data || { average: 0, total: 0, distribution: [0, 0, 0, 0, 0], reviews: [] };
  const allReviews = filteredReviewsData?.data?.results || summary.reviews;

  const displayReviews = allReviews
    .filter(r => r.user_name.toLowerCase().includes(searchQuery.toLowerCase()))
    .map((review) => ({
      id: review.id,
      initials: review.user_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      name: review.user_name,
      role: 'Student',
      rating: review.rating,
      date: new Date(review.created_at).toLocaleDateString(),
      avatarColor: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      content: review.content,
      helpful_count: review.helpful_count,
    }));

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
          {[5, 4, 3, 2, 1].map((star) => (
            <Stack 
              key={star} 
              direction="row" 
              alignItems="center" 
              spacing={2} 
              sx={{ mb: 1, cursor: 'pointer', '&:hover .MuiLinearProgress-bar': { bgcolor: '#ffa424' } }}
              onClick={() => setRatingFilter(star)}
            >
              <Box display="flex" alignItems="center" width={50}>
                <StarIcon fontSize="small" sx={{ color: ratingFilter === star ? '#f59e0b' : '#71717a', mr: 0.5 }} />
                <Typography variant="body2" sx={{ fontWeight: ratingFilter === star ? 700 : 400 }}>{star}</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={summary.distribution.length > 0 ? summary.distribution[5 - star] : 0} 
                sx={{ flex: 1, height: 8, borderRadius: 1, bgcolor: '#e4e4e7', '& .MuiLinearProgress-bar': { bgcolor: ratingFilter === star ? '#ffa424' : '#f59e0b', transition: 'background-color 0.3s' } }} 
              />
              <Typography variant="body2" color="text.secondary" width={40} textAlign="right">{summary.distribution.length > 0 ? summary.distribution[5 - star] : 0}%</Typography>
            </Stack>
          ))}
          {ratingFilter && (
            <Button size="small" onClick={() => setRatingFilter(undefined)} sx={{ mt: 1, textTransform: 'none', color: '#ffa424' }}>
              Clear Filter
            </Button>
          )}
        </Box>
      </Stack>

      {/* Filters & Search */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }} justifyContent="space-between">
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {[
            { label: 'All Reviews', value: undefined },
            { label: '5 Star', value: 5 },
            { label: '4 Star', value: 4 },
            { label: '3 Star', value: 3 },
          ].map((filter) => (
            <Button 
              key={filter.label} 
              variant={ratingFilter === filter.value ? "contained" : "outlined"} 
              size="small"
              onClick={() => setRatingFilter(filter.value)}
              sx={{ 
                borderRadius: 10, 
                textTransform: 'none', 
                bgcolor: ratingFilter === filter.value ? 'rgba(255, 164, 36, 0.1)' : 'transparent',
                color: ratingFilter === filter.value ? '#ffa424' : '#52525b',
                borderColor: ratingFilter === filter.value ? 'transparent' : '#d4d4d8',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#ffa424', color: 'white', borderColor: '#ffa424' }
              }}
            >
              {filter.label}
            </Button>
          ))}
        </Stack>
        <TextField
          placeholder="Search reviews..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
          }}
          sx={{ width: { xs: '100%', sm: 240 } }}
        />
      </Stack>

      {/* Reviews List */}
      {displayReviews.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No reviews matched your criteria.
        </Typography>
      )}
      <Stack spacing={3}>
        {displayReviews.map((review) => (
          <Paper key={review.id} elevation={0} sx={{ p: 4, border: '1px solid #e4e4e7', borderRadius: 3 }}>
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
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="caption" color="text.secondary">Was this review helpful?</Typography>
                <Button 
                  size="small" 
                  startIcon={<ThumbUpIcon fontSize="small" />} 
                  onClick={() => helpfulMutation.mutate(review.id)}
                  disabled={helpfulMutation.isPending}
                  sx={{ color: '#52525b', textTransform: 'none' }}
                >
                  Yes ({review.helpful_count})
                </Button>
              </Stack>
              <Tooltip title="Report review">
                <IconButton 
                  size="small" 
                  onClick={() => reportMutation.mutate(review.id)}
                  disabled={reportMutation.isPending}
                >
                  <ReportIcon fontSize="small" color="error" />
                </IconButton>
              </Tooltip>
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
