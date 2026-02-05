import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import {
  Sync as SyncIcon,
  Image as ImageIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  SignalCellularAlt as LevelIcon,
} from '@mui/icons-material';

interface CoursePreviewProps {
  title: string;
  description: string;
  thumbnail: string | null;
  difficulty: string;
  duration: { hours: number; minutes: number };
  price: number;
  pricingType: string;
  currency: string;
  onRefresh?: () => void;
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  KES: 'KSh',
  NGN: '₦',
};

const CoursePreview: React.FC<CoursePreviewProps> = ({
  title,
  description,
  thumbnail,
  difficulty,
  duration,
  price,
  pricingType,
  currency,
  onRefresh,
}) => {
  const currencySymbol = currencySymbols[currency] || '$';
  const durationText = `${duration.hours}h ${duration.minutes}m`;

  const priceDisplay =
    pricingType === 'free' ? (
      <Typography variant="h5" fontWeight={700} color="success.main">
        Free
      </Typography>
    ) : (
      <Typography variant="h5" fontWeight={700} color="text.primary">
        {currencySymbol}
        {price.toFixed(2)}
      </Typography>
    );

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'grey.200' }}>
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: 'grey.50',
          borderBottom: 1,
          borderColor: 'grey.200',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography fontWeight={700} color="text.primary">
          Course Preview
        </Typography>
        {onRefresh && (
          <IconButton size="small" onClick={onRefresh}>
            <SyncIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        {/* Thumbnail */}
        <Box
          sx={{
            aspectRatio: '16/9',
            background: thumbnail
              ? `url(${thumbnail})`
              : 'linear-gradient(135deg, #ffb74d 0%, #f97316 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 1,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
          }}
        >
          {!thumbnail && <ImageIcon sx={{ fontSize: 48 }} />}
        </Box>

        {/* Title */}
        <Typography
          variant="subtitle1"
          fontWeight={700}
          color="text.primary"
          sx={{ mb: 1, lineHeight: 1.3 }}
        >
          {title || 'Course Title'}
        </Typography>

        {/* Meta */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LevelIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {difficulty}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {durationText}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              New
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description || 'Course description will appear here...'}
        </Typography>

        {/* Price */}
        {priceDisplay}
      </Box>
    </Paper>
  );
};

export default CoursePreview;
