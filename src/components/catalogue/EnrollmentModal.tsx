import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';

interface EnrollmentModalProps {
  open: boolean;
  onClose: () => void;
  courseTitle: string;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ open, onClose, courseTitle }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 0 } }}
    >
      <DialogContent sx={{ p: 5, textAlign: 'center', position: 'relative' }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 16, right: 16, color: '#a1a1aa', '&:hover': { color: '#52525b' } }}
        >
          <CloseIcon />
        </IconButton>

        {/* Icon */}
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

        {/* Title */}
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#27272a', mb: 2 }}>
          Start Learning Today!
        </Typography>

        {/* Course Name */}
        <Typography sx={{ fontWeight: 600, color: '#3f3f46', mb: 1 }}>{courseTitle}</Typography>

        {/* Price */}
        <Typography
          sx={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#ffa424',
            mb: 2,
          }}
        >
          Included in Biannual Plan
        </Typography>

        {/* Description */}
        <Typography sx={{ fontSize: '0.875rem', color: '#71717a', mb: 4 }}>
          Create a free account to enroll in this course and track your progress.
        </Typography>

        {/* Actions */}
        <Stack spacing={2}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<PersonAddIcon />}
            href={`/register?course=${encodeURIComponent(courseTitle)}`}
            sx={{ bgcolor: '#ffa424', py: 1.5, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#f97316' } }}
          >
            Get Full Access
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LoginIcon />}
            href={`/login?course=${encodeURIComponent(courseTitle)}`}
            sx={{ color: '#52525b', borderColor: '#d4d4d8', py: 1.5, fontWeight: 600, textTransform: 'none', '&:hover': { borderColor: '#a1a1aa', bgcolor: '#fafafa' } }}
          >
            Log In
          </Button>
        </Stack>

        {/* Note */}
        <Typography sx={{ fontSize: '0.75rem', color: '#a1a1aa', mt: 3 }}>
          Already have an account? Log in to continue.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentModal;
