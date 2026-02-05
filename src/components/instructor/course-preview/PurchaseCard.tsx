import React from 'react';
import { Box, Paper, Typography, Button, Chip } from '@mui/material';
import {
  PlayCircle as PlayIcon,
  ShoppingCart as CartIcon,
  AccessTime as TimeIcon,
  Language as LanguageIcon,
  WorkspacePremium as CertificateIcon,
  PhoneAndroid as MobileIcon,
  AllInclusive as LifetimeIcon,
} from '@mui/icons-material';

interface PurchaseCardProps {
  currentPrice: number;
  originalPrice?: number;
  discount?: number;
  saleEndTime?: string;
  onEnroll?: () => void;
  onAddToCart?: () => void;
}

const features = [
  { icon: <LifetimeIcon fontSize="small" />, text: 'Lifetime access' },
  { icon: <MobileIcon fontSize="small" />, text: 'Access on mobile and TV' },
  { icon: <CertificateIcon fontSize="small" />, text: 'Certificate of completion' },
  { icon: <LanguageIcon fontSize="small" />, text: 'English subtitles' },
];

const PurchaseCard: React.FC<PurchaseCardProps> = ({
  currentPrice,
  originalPrice,
  discount,
  saleEndTime,
  onEnroll,
  onAddToCart,
}) => {
  return (
    <Paper elevation={8} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {/* Video Preview */}
      <Box
        sx={{
          aspectRatio: '16/9',
          background: 'linear-gradient(135deg, #ffb74d, #f97316)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'pointer',
          '&:hover .play-button': {
            transform: 'scale(1.1)',
          },
        }}
      >
        <Box
          className="play-button"
          sx={{
            width: 72,
            height: 72,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s',
            boxShadow: 3,
          }}
        >
          <PlayIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        </Box>
        <Chip
          label="Preview this course"
          size="small"
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            fontWeight: 500,
          }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h3" fontWeight={700}>
            ${currentPrice}
          </Typography>
          {originalPrice && (
            <>
              <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                ${originalPrice}
              </Typography>
              {discount && (
                <Chip
                  label={`${discount}% OFF`}
                  size="small"
                  sx={{
                    bgcolor: '#fee2e2',
                    color: '#ef4444',
                    fontWeight: 600,
                  }}
                />
              )}
            </>
          )}
        </Box>

        {/* Sale Timer */}
        {saleEndTime && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              bgcolor: '#fee2e2',
              borderRadius: 1,
              mb: 3,
            }}
          >
            <TimeIcon sx={{ fontSize: 16, color: '#ef4444' }} />
            <Typography variant="body2" color="#ef4444" fontWeight={500}>
              Sale ends {saleEndTime}
            </Typography>
          </Box>
        )}

        {/* Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={onEnroll}
            sx={{
              py: 1.5,
              fontSize: '1.125rem',
              fontWeight: 600,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 3,
              },
            }}
          >
            Enroll Now
          </Button>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<CartIcon />}
            onClick={onAddToCart}
            sx={{
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Add to Cart
          </Button>
        </Box>

        {/* Guarantee */}
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
          30-Day Money-Back Guarantee
        </Typography>

        {/* Features */}
        <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
          <Typography fontWeight={600} mb={2}>
            This course includes:
          </Typography>
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 0.75,
                color: 'text.secondary',
              }}
            >
              <Box sx={{ color: 'text.secondary', width: 20 }}>{feature.icon}</Box>
              <Typography variant="body2">{feature.text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default PurchaseCard;
