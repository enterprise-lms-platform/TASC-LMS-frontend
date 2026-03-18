import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCreateEnrollment } from '../../hooks/useLearning';

interface EnrollmentModalProps {
  open: boolean;
  onClose: () => void;
  courseTitle: string;
  courseSlug?: string;
  courseId?: number;
  isFree?: boolean;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ open, onClose, courseTitle, courseSlug, courseId, isFree }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const enrollMutation = useCreateEnrollment();

  const handleFreeEnroll = async () => {
    if (!courseId) return;
    try {
      await enrollMutation.mutateAsync({ course: courseId });
      onClose();
      navigate(`/learner/course/${courseId}`);
    } catch {
      // Enrollment may already exist — navigate anyway
      onClose();
      navigate(`/learner/course/${courseId}`);
    }
  };

  const handleGoToCheckout = () => {
    onClose();
    navigate(`/checkout?course=${encodeURIComponent(courseSlug || '')}`);
  };

  // Logged-in user flow
  if (isAuthenticated) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 0 } }}
      >
        <DialogContent sx={{ p: 5, textAlign: 'center', position: 'relative' }}>
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', top: 16, right: 16, color: '#a1a1aa', '&:hover': { color: '#52525b' } }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #ffb74d, #f97316)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <SchoolIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 700, color: '#27272a', mb: 2 }}>
            {isFree ? 'Enroll Now — Free!' : 'Get Full Access'}
          </Typography>

          <Typography sx={{ fontWeight: 600, color: '#3f3f46', mb: 1 }}>{courseTitle}</Typography>

          <Typography sx={{ fontSize: '0.875rem', color: '#71717a', mb: 4 }}>
            {isFree
              ? 'This course is free. Click below to start learning immediately.'
              : 'Proceed to checkout to complete your enrollment.'}
          </Typography>

          <Stack spacing={2}>
            {isFree ? (
              <Button
                variant="contained"
                fullWidth
                startIcon={enrollMutation.isPending ? <CircularProgress size={18} color="inherit" /> : <PlayArrowIcon />}
                disabled={enrollMutation.isPending}
                onClick={handleFreeEnroll}
                sx={{ bgcolor: '#10b981', py: 1.5, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#059669' } }}
              >
                {enrollMutation.isPending ? 'Enrolling...' : 'Start Learning — Free'}
              </Button>
            ) : (
              <Button
                variant="contained"
                fullWidth
                startIcon={<PersonAddIcon />}
                onClick={handleGoToCheckout}
                sx={{ bgcolor: '#ffa424', py: 1.5, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#f97316' } }}
              >
                Get Full Access
              </Button>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    );
  }

  // Not logged in — show register/login options
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 0 } }}
    >
      <DialogContent sx={{ p: 5, textAlign: 'center', position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 16, right: 16, color: '#a1a1aa', '&:hover': { color: '#52525b' } }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            width: 80,
            height: 80,
            background: 'linear-gradient(135deg, #ffb74d, #f97316)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <SchoolIcon sx={{ fontSize: 40, color: 'white' }} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, color: '#27272a', mb: 2 }}>
          Start Learning Today!
        </Typography>

        <Typography sx={{ fontWeight: 600, color: '#3f3f46', mb: 1 }}>{courseTitle}</Typography>

        <Typography
          sx={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#ffa424',
            mb: 2,
          }}
        >
          {isFree ? 'Free Course' : 'Included in Biannual Plan'}
        </Typography>

        <Typography sx={{ fontSize: '0.875rem', color: '#71717a', mb: 4 }}>
          Create a free account to enroll in this course and track your progress.
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<PersonAddIcon />}
            href={`/register?redirect=${encodeURIComponent(`/course-details/${courseSlug || ''}`)}`}
            sx={{ bgcolor: '#ffa424', py: 1.5, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#f97316' } }}
          >
            Get Full Access
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LoginIcon />}
            href={`/login?redirect=${encodeURIComponent(`/course-details/${courseSlug || ''}`)}`}
            sx={{ color: '#52525b', borderColor: '#d4d4d8', py: 1.5, fontWeight: 600, textTransform: 'none', '&:hover': { borderColor: '#a1a1aa', bgcolor: '#fafafa' } }}
          >
            Log In
          </Button>
        </Stack>

        <Typography sx={{ fontSize: '0.75rem', color: '#a1a1aa', mt: 3 }}>
          Already have an account? Log in to continue.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentModal;
