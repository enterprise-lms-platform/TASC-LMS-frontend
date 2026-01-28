import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

interface CourseRequirementsProps {
  requirements: string[];
}

const CourseRequirements: React.FC<CourseRequirementsProps> = ({ requirements }) => {
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
      <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mb: 3 }}>
        Requirements
      </Typography>

      <Stack spacing={1.5}>
        {requirements.map((item, index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              p: 1.5,
              bgcolor: '#fafafa',
              borderRadius: 2,
            }}
          >
            <CheckIcon sx={{ color: '#10b981' }} />
            <Typography variant="body2" color="text.primary">
              {item}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

// Sample data
export const sampleRequirements = [
  'Basic understanding of JavaScript and React',
  'Node.js and npm/yarn installed',
  'Code editor (VS Code recommended)',
  'Modern web browser',
];

export default CourseRequirements;
