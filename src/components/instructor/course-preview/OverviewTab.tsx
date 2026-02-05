import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { CheckCircle as CheckIcon, Circle as CircleIcon } from '@mui/icons-material';


interface OverviewTabProps {
  description: string;
  objectives: string[];
  requirements: string[];
  targetAudience: string[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ description, objectives, requirements, targetAudience }) => {
  return (
    <Box>
      {/* Description */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          About This Course
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
          {description}
        </Typography>
      </Box>

      {/* What You'll Learn */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', border: 1, borderColor: 'grey.200', borderRadius: 2, mb: 6 }}>
        <Typography variant="h6" fontWeight={700} mb={3}>
          What You'll Learn
        </Typography>
        <Grid container spacing={2}>
          {objectives.map((objective, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <CheckIcon sx={{ color: 'success.main', fontSize: 20, mt: 0.25 }} />
                <Typography variant="body2" color="text.secondary">
                  {objective}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Requirements */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Requirements
        </Typography>
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {requirements.map((req, index) => (
            <Box component="li" key={index} sx={{ display: 'flex', gap: 2, py: 1 }}>
              <CircleIcon sx={{ fontSize: 8, color: 'text.secondary', mt: 1.25 }} />
              <Typography color="text.secondary">{req}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Target Audience */}
      <Box>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Who This Course Is For
        </Typography>
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {targetAudience.map((audience, index) => (
            <Box component="li" key={index} sx={{ display: 'flex', gap: 2, py: 1 }}>
              <CircleIcon sx={{ fontSize: 8, color: 'text.secondary', mt: 1.25 }} />
              <Typography color="text.secondary">{audience}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default OverviewTab;
