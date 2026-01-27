import React from 'react';
import { Box, Typography, Button, Stack, Chip, Divider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const CoursePricingCard: React.FC = () => {
  return (
    <Box className="enrollment-card-sticky" sx={{ width: '100%', maxWidth: 360, bgcolor: 'white', borderRadius: 4, overflow: 'hidden', boxShadow: 6, display: { xs: 'none', lg: 'block' } }}>
      {/* Video Preview */}
      <Box sx={{ position: 'relative', cursor: 'pointer', '&:hover .preview-overlay': { opacity: 1 } }}>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1616400619175-5beda3a17896?q=80&w=1074&auto=format&fit=crop"
          alt="Course Preview"
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
        <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#18181b' }}>$129.99</Typography>
          <Typography sx={{ textDecoration: 'line-through', color: '#71717a' }}>$199.99</Typography>
          <Chip label="35% OFF" size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: 700, height: 24 }} />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ color: '#ef4444', mb: 3 }}>
          <AccessTimeIcon sx={{ fontSize: 18 }} />
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>2 days left at this price!</Typography>
        </Stack>

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Button variant="contained" size="large" fullWidth startIcon={<ShoppingCartIcon />} sx={{ bgcolor: '#ffa424', fontWeight: 700, '&:hover': { bgcolor: '#f97316' } }}>
            Enroll Now
          </Button>
          <Button variant="outlined" size="large" fullWidth sx={{ borderColor: '#ffa424', color: '#ffa424', fontWeight: 700, '&:hover': { bgcolor: '#fff3e0', borderColor: '#ffa424' } }}>
            Add to Cart
          </Button>
        </Stack>

        <Typography sx={{ textAlign: 'center', fontSize: '0.75rem', color: '#71717a', mb: 3 }}>
          30-Day Money-Back Guarantee
        </Typography>

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
