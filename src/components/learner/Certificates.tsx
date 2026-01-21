import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { EmojiEvents, ChevronRight } from '@mui/icons-material';

// Certificates data (will come from backend later)
const certificates = [
  { id: '1', title: 'JavaScript Fundamentals', date: 'Nov 15, 2025' },
  { id: '2', title: 'React Basics', date: 'Oct 28, 2025' },
  { id: '3', title: 'Web Development', date: 'Sep 10, 2025' },
];

const Certificates: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: 1,
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          My Certificates
        </Typography>
        <Button
          endIcon={<ChevronRight />}
          sx={{ textTransform: 'none', fontWeight: 500, color: 'primary.dark' }}
        >
          View All
        </Button>
      </Box>

      {/* Certificates Grid */}
      <Grid container spacing={2}>
        {certificates.map((cert) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cert.id}>
            <Paper
              elevation={0}
              className="certificate-card"
              sx={{
                p: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <EmojiEvents sx={{ fontSize: 40, color: 'primary.dark', mb: 1 }} />
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                {cert.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Issued: {cert.date}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default Certificates;
