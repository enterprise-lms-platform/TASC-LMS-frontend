import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, Typography, Box, Button, Slide } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useBadges } from '../../hooks/useBadges';

const Transition = React.forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BadgeEarnedModal: React.FC = () => {
  const { newlyEarnedBadges, markAsSeen } = useBadges();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeBadge = newlyEarnedBadges[currentIndex];
  const isOpen = Boolean(activeBadge);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ffa424', '#10b981', '#3b82f6', '#f43f5e']
        });
      }, 300);
    }
  }, [activeBadge, isOpen]);

  const handleNext = () => {
    if (activeBadge) {
      markAsSeen([activeBadge.id]);
    }
    if (currentIndex < newlyEarnedBadges.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleViewAll = () => {
    if (activeBadge) {
      markAsSeen([activeBadge.id]);
    }
    navigate('/learner/badges');
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          textAlign: 'center',
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent sx={{ p: 5 }}>
        <Box sx={{ mb: 4, mt: 2, display: 'flex', justifyContent: 'center' }}>
          <img src={activeBadge.image_url} alt={activeBadge.title} style={{ width: 140, height: 140, objectFit: 'contain' }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#18181b', mb: 1 }}>
          Badge Unlocked!
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffa424', mb: 1 }}>
          {activeBadge.title}
        </Typography>
        <Typography sx={{ color: '#71717a', fontSize: '1.1rem', mb: 5 }}>
          {activeBadge.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="outlined" size="large" onClick={handleNext} sx={{ fontWeight: 600, color: '#52525b', borderColor: '#e4e4e7', '&:hover': { bgcolor: '#f4f4f5', borderColor: '#d4d4d8' } }}>
            {newlyEarnedBadges.length > 1 ? 'Next Badge' : 'Close'}
          </Button>
          <Button variant="contained" size="large" onClick={handleViewAll} sx={{ bgcolor: '#10b981', color: '#fff', fontWeight: 600, '&:hover': { bgcolor: '#059669' } }}>
            View All Badges
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeEarnedModal;
