import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Description as SubmissionIcon } from '@mui/icons-material';

interface SubmissionCardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({ title, children, actions }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        mb: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          px: 2.5,
          bgcolor: 'grey.50',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
          color="text.primary"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <SubmissionIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          {title}
        </Typography>
        {actions}
      </Box>

      {/* Body */}
      <Box sx={{ p: 2.5 }}>{children}</Box>
    </Paper>
  );
};

export default SubmissionCard;
