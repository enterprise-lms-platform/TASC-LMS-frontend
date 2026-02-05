import React from 'react';
import { Box, Typography, TextField, Chip, Button } from '@mui/material';
import { Comment as FeedbackIcon, Mic as MicIcon } from '@mui/icons-material';

interface FeedbackSectionProps {
  feedback: string;
  onFeedbackChange: (value: string) => void;
  onTemplateClick?: (template: string) => void;
}

const templates = [
  'Great work!',
  'Needs improvement',
  'Well structured',
  'Check references',
  'Good analysis',
  'Missing details',
];

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  feedback,
  onFeedbackChange,
  onTemplateClick,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'white',
      }}
    >
      <Typography
        variant="body2"
        fontWeight={600}
        color="text.secondary"
        sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
      >
        <FeedbackIcon sx={{ color: 'primary.main', fontSize: 18 }} />
        Feedback to Student
      </Typography>

      <TextField
        fullWidth
        multiline
        minRows={4}
        placeholder="Provide detailed feedback for the student..."
        value={feedback}
        onChange={(e) => onFeedbackChange(e.target.value)}
        sx={{
          '& .MuiInputBase-root': { fontSize: '0.875rem' },
          '& .MuiOutlinedInput-root': {
            '&:focus-within': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
                boxShadow: '0 0 0 3px rgba(255, 164, 36, 0.15)',
              },
            },
          },
        }}
      />

      {/* Quick Templates */}
      <Box sx={{ mt: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Quick feedback:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {templates.map((t) => (
            <Chip
              key={t}
              label={t}
              size="small"
              onClick={() => onTemplateClick?.(t)}
              sx={{
                fontSize: '0.75rem',
                bgcolor: 'grey.100',
                '&:hover': { bgcolor: '#ffcc80', borderColor: 'primary.light' },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Voice Feedback */}
      <Button
        variant="outlined"
        startIcon={<MicIcon />}
        sx={{
          mt: 1.5,
          textTransform: 'none',
          fontWeight: 500,
          borderColor: '#3b82f6',
          color: '#3b82f6',
          bgcolor: '#dbeafe',
          '&:hover': { bgcolor: '#3b82f6', color: 'white' },
        }}
      >
        Record Voice Feedback
      </Button>
    </Box>
  );
};

export default FeedbackSection;
