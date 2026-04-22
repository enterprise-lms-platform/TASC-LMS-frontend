import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Stack, Avatar, Rating, LinearProgress,
  Button, TextField, Collapse, Alert, CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Star as StarIcon } from '@mui/icons-material';
import { courseReviewApi } from '../../../services/catalogue.services';
import { useEnrollments } from '../../../hooks/useLearning';
import { getErrorMessage } from '../../../utils/config';

export interface Review {
  id: string;
  reviewerName: string;
  reviewerInitials: string;
  reviewerAvatar?: string;
  rating: number;
  date: string;
  content: string;
}

export interface RatingDistribution {
  stars: number;
  percentage: number;
}

export type CourseReviewsSummaryStatus = 'loading' | 'error' | 'empty' | 'ready';

interface CourseReviewsProps {
  courseId: number;
  summaryStatus: CourseReviewsSummaryStatus;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution[];
  reviews: Review[];
}

const REVIEWS_UNAVAILABLE = 'Reviews are temporarily unavailable.';

const CourseReviews: React.FC<CourseReviewsProps> = ({
  courseId,
  summaryStatus,
  averageRating,
  totalReviews,
  ratingDistribution,
  reviews,
}) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState<number | null>(null);
  const [formContent, setFormContent] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { data: enrollments } = useEnrollments();
  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];
  const isEnrolled = safeEnrollments.some((e) => e.course === courseId);

  const submitMutation = useMutation({
    mutationFn: (data: { course: number; rating: number; content: string }) =>
      courseReviewApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-reviews', 'summary', courseId] });
      setFormRating(null);
      setFormContent('');
      setShowForm(false);
      setSubmitError('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    },
    onError: (err: unknown) => {
      setSubmitError(getErrorMessage(err, 'Failed to submit review. Please try again.'));
    },
  });

  const handleSubmit = () => {
    if (!formRating || !formContent.trim()) return;
    submitMutation.mutate({ course: courseId, rating: formRating, content: formContent.trim() });
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormRating(null);
    setFormContent('');
    setSubmitError('');
    submitMutation.reset();
  };

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 3,
        p: 4,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e4e4e7',
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          Student Reviews
        </Typography>
        {isEnrolled && !showForm && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
            sx={{
              borderColor: '#d4d4d8',
              color: '#3f3f46',
              textTransform: 'none',
              '&:hover': { borderColor: '#ffa424', color: '#ffa424' },
            }}
          >
            Write Review
          </Button>
        )}
      </Stack>

      {/* Success message */}
      <Collapse in={submitSuccess}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Your review has been submitted and is pending approval.
        </Alert>
      </Collapse>

      {/* Write Review Form */}
      <Collapse in={showForm}>
        <Box
          sx={{
            mb: 4,
            p: 3,
            border: '1px solid #e4e4e7',
            borderRadius: 2,
            bgcolor: '#fafafa',
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Share your experience
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Your rating *
            </Typography>
            <Rating
              value={formRating}
              onChange={(_, val) => setFormRating(val)}
              size="large"
              sx={{ color: '#f59e0b' }}
            />
          </Box>

          <TextField
            label="Your review *"
            multiline
            rows={4}
            fullWidth
            value={formContent}
            onChange={(e) => setFormContent(e.target.value)}
            placeholder="What did you think of this course? What worked well? What could be improved?"
            sx={{ mb: 2 }}
          />

          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!formRating || !formContent.trim() || submitMutation.isPending}
              sx={{
                bgcolor: '#ffa424',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: '#f97316' },
                '&:disabled': { bgcolor: '#e4e4e7' },
              }}
            >
              {submitMutation.isPending ? 'Submitting…' : 'Submit Review'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={submitMutation.isPending}
              sx={{ textTransform: 'none', borderColor: '#d4d4d8', color: '#3f3f46' }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Collapse>

      {/* Rating Summary */}
      <Stack sx={{ pb: 3, mb: 3, borderBottom: '1px solid #e4e4e7' }}>
        {summaryStatus === 'loading' ? (
          <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 2 }}>
            <CircularProgress size={28} sx={{ color: '#ffa424' }} />
            <Typography variant="body2" color="text.secondary">
              Loading reviews…
            </Typography>
          </Stack>
        ) : summaryStatus === 'error' ? (
          <Alert severity="warning" variant="outlined" sx={{ borderColor: '#e4e4e7', color: 'text.primary' }}>
            {REVIEWS_UNAVAILABLE}
          </Alert>
        ) : summaryStatus === 'empty' ? (
          <Typography variant="body1" color="text.secondary" sx={{ py: 1 }}>
            No reviews yet.
          </Typography>
        ) : (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={4}
            alignItems={{ xs: 'center', sm: 'flex-start' }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" fontWeight={700} color="text.primary">
                {averageRating.toFixed(1)}
              </Typography>
              <Rating value={averageRating} precision={0.1} readOnly size="medium" sx={{ mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {totalReviews.toLocaleString()} {totalReviews === 1 ? 'review' : 'reviews'}
              </Typography>
            </Box>

            <Box sx={{ flex: 1, width: '100%' }}>
              {ratingDistribution.map((item) => (
                <Stack key={item.stars} direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: 60 }}>
                    {item.stars} stars
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={item.percentage}
                    sx={{
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#e4e4e7',
                      '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b', borderRadius: 4 },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ width: 40 }}>
                    {item.percentage}%
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Stack>
        )}
      </Stack>

      {/* Reviews List */}
      {summaryStatus === 'loading' || summaryStatus === 'error' ? null : summaryStatus === 'empty' ? null : reviews.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No reviews yet. Be the first to share your experience!
        </Typography>
      ) : (
        <Stack spacing={3}>
          {reviews.map((review) => (
            <Box
              key={review.id}
              sx={{
                pb: 3,
                borderBottom: '1px solid #e4e4e7',
                '&:last-child': { borderBottom: 'none', pb: 0 },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    src={review.reviewerAvatar}
                    sx={{
                      width: 40,
                      height: 40,
                      background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {review.reviewerInitials}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600} color="text.primary">
                      {review.reviewerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.date}
                    </Typography>
                  </Box>
                </Stack>
                <Rating
                  value={review.rating}
                  readOnly
                  size="small"
                  icon={<StarIcon sx={{ fontSize: 16 }} />}
                  emptyIcon={<StarIcon sx={{ fontSize: 16 }} />}
                />
              </Stack>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {review.content}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CourseReviews;
