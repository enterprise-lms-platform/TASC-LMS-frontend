import React from 'react';
import { Box, Typography } from '@mui/material';
import { Lightbulb as TipIcon, CheckCircle as CheckIcon } from '@mui/icons-material';

const tips = [
  'Use descriptive filenames for better organization',
  'Keep video files under 2GB for faster uploads',
  'Add subtitles to make videos more accessible',
  'Use high-quality PDF files for documents',
];

const UploadTipsCard: React.FC = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #ffa424, #f97316)',
        borderRadius: 2,
        p: 3,
        color: 'white',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <TipIcon />
        <Typography fontWeight={700}>Quick Tips</Typography>
      </Box>
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
        {tips.map((tip, index) => (
          <Box
            component="li"
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              fontSize: '0.875rem',
              mb: 1.5,
              opacity: 0.95,
              '&:last-child': { mb: 0 },
            }}
          >
            <CheckIcon sx={{ fontSize: 16, mt: 0.25 }} />
            <Typography variant="body2">{tip}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UploadTipsCard;
