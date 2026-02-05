import React from 'react';
import { Box, Typography, Paper, LinearProgress, Avatar } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

interface Review {
  id: string;
  userName: string;
  userInitials: string;
  rating: number;
  date: string;
  content: string;
}

interface ReviewsTabProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { stars: number; percentage: number }[];
  reviews: Review[];
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ averageRating, totalReviews, ratingDistribution, reviews }) => {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Student Reviews
      </Typography>

      {/* Rating Summary */}
      <Paper elevation={0} sx={{ display: 'flex', gap: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2, mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
        {/* Average Rating */}
        <Box
          sx={{
            textAlign: 'center',
            pr: { sm: 4 },
            borderRight: { sm: 1 },
            borderBottom: { xs: 1, sm: 0 },
            borderColor: 'divider',
            pb: { xs: 3, sm: 0 },
          }}
        >
          <Typography variant="h2" fontWeight={700} sx={{ color: '#f59e0b' }}>
            {averageRating.toFixed(1)}
          </Typography>
          <Box sx={{ color: '#f59e0b', display: 'flex', justifyContent: 'center', mb: 1 }}>
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} />
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {totalReviews.toLocaleString()} reviews
          </Typography>
        </Box>

        {/* Rating Bars */}
        <Box sx={{ flex: 1 }}>
          {ratingDistribution.map((dist) => (
            <Box key={dist.stars} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
              <Typography variant="body2" sx={{ minWidth: 60 }}>
                {dist.stars} stars
              </Typography>
              <LinearProgress
                variant="determinate"
                value={dist.percentage}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 1,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#f59e0b',
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40, textAlign: 'right' }}>
                {dist.percentage}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Individual Reviews */}
      {reviews.map((review) => (
        <Paper key={review.id} elevation={0} sx={{ p: 3, border: 1, borderColor: 'grey.200', borderRadius: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'grey.300', color: 'text.secondary', width: 40, height: 40, fontWeight: 600 }}>
              {review.userInitials}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600}>{review.userName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {review.date}
              </Typography>
            </Box>
            <Box sx={{ color: '#f59e0b', display: 'flex' }}>
              {[...Array(review.rating)].map((_, i) => (
                <StarIcon key={i} fontSize="small" />
              ))}
            </Box>
          </Box>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {review.content}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default ReviewsTab;
export type { Review };
