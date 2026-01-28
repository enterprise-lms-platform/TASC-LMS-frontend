import React from 'react';
import { Box, Typography, Stack, Grid } from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';

interface WhatYouLearnProps {
  learnings: string[];
}

const WhatYouLearn: React.FC<WhatYouLearnProps> = ({ learnings }) => {
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
          What You'll Learn
        </Typography>
        <Typography color="text.secondary">
          Master these skills to become a senior React developer
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {learnings.map((item, index) => (
          <Grid key={index} size={{ xs: 12, md: 6 }}>
            <Stack
              direction="row"
              alignItems="flex-start"
              spacing={1.5}
              sx={{
                p: 1.5,
                bgcolor: '#fafafa',
                borderRadius: 2,
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: '#f4f4f5' },
              }}
            >
              <CheckIcon sx={{ color: '#ffa424', mt: 0.25, flexShrink: 0 }} />
              <Typography variant="body2" color="text.primary">
                {item}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Sample data
export const sampleLearnings = [
  'Advanced React patterns like Render Props and HOCs',
  'Custom hooks for reusable logic and state management',
  'Performance optimization techniques',
  'Testing strategies for complex React applications',
  'State management with Context API and Redux',
  'Server-side rendering with Next.js',
  'Building accessible and responsive components',
  'React architecture and best practices',
];

export default WhatYouLearn;
