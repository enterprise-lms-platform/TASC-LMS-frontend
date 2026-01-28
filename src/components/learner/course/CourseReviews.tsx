import React from 'react';
import { Box, Typography, Stack, Avatar, Rating, LinearProgress, Button } from '@mui/material';
import { Add as AddIcon, Star as StarIcon } from '@mui/icons-material';

export interface Review {
  id: string;
  reviewerName: string;
  reviewerInitials: string;
  reviewerAvatar?: string;
  rating: number;
  date: string;
  content: string;
}

interface RatingDistribution {
  stars: number;
  percentage: number;
}

interface CourseReviewsProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution[];
  reviews: Review[];
  onWriteReview?: () => void;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({
  averageRating,
  totalReviews,
  ratingDistribution,
  reviews,
  onWriteReview,
}) => {
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
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onWriteReview}
          sx={{
            borderColor: '#d4d4d8',
            color: '#3f3f46',
            textTransform: 'none',
            '&:hover': { borderColor: '#ffa424', color: '#ffa424' },
          }}
        >
          Write Review
        </Button>
      </Stack>

      {/* Rating Summary */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={4}
        alignItems={{ xs: 'center', sm: 'flex-start' }}
        sx={{ pb: 3, mb: 3, borderBottom: '1px solid #e4e4e7' }}
      >
        {/* Average Rating */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h2" fontWeight={700} color="text.primary">
            {averageRating.toFixed(1)}
          </Typography>
          <Rating
            value={averageRating}
            precision={0.1}
            readOnly
            size="medium"
            sx={{ mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            {totalReviews.toLocaleString()} reviews
          </Typography>
        </Box>

        {/* Rating Bars */}
        <Box sx={{ flex: 1, width: '100%' }}>
          {ratingDistribution.map((item) => (
            <Stack
              key={item.stars}
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 1 }}
            >
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
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#f59e0b',
                    borderRadius: 4,
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ width: 40 }}>
                {item.percentage}%
              </Typography>
            </Stack>
          ))}
        </Box>
      </Stack>

      {/* Reviews List */}
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
    </Box>
  );
};

// Sample data
export const sampleRatingDistribution: RatingDistribution[] = [
  { stars: 5, percentage: 75 },
  { stars: 4, percentage: 18 },
  { stars: 3, percentage: 5 },
  { stars: 2, percentage: 1 },
  { stars: 1, percentage: 1 },
];

export const sampleReviews: Review[] = [
  {
    id: '1',
    reviewerName: 'Sarah Chen',
    reviewerInitials: 'SC',
    reviewerAvatar: '/avatars/female face (10).jpg',
    rating: 5,
    date: '2 weeks ago',
    content: 'This course transformed how I approach React development. The advanced patterns taught here are exactly what senior developers use in production. The projects were challenging but incredibly rewarding.',
  },
  {
    id: '2',
    reviewerName: 'David Wilson',
    reviewerInitials: 'DW',
    reviewerAvatar: '/avatars/male face (17).jpg',
    rating: 5,
    date: '1 month ago',
    content: 'Michael does an excellent job explaining complex concepts. The custom hooks section alone was worth the price of the course. Highly recommend for anyone wanting to level up their React skills.',
  },
  {
    id: '3',
    reviewerName: 'Amanda Peters',
    reviewerInitials: 'AP',
    reviewerAvatar: '/avatars/female face (11).jpg',
    rating: 4,
    date: '1 month ago',
    content: 'Great content overall. The only reason for 4 stars is that I wish there were more practice exercises. But the video content and explanations are top-notch.',
  },
];

export default CourseReviews;
