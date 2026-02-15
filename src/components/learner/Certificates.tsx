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
        p: { xs: 2, md: 3 },
        borderRadius: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, md: 3 } }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
          My Certificates
        </Typography>
        <Button
          endIcon={<ChevronRight />}
          sx={{ textTransform: 'none', fontWeight: 500, color: 'primary.dark', fontSize: '0.8rem' }}
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
                p: 2.5,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ffa424, #f97316)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1.5,
                }}
              >
                <EmojiEvents sx={{ fontSize: 24, color: 'white' }} />
              </Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ fontSize: '0.85rem' }}>
                {cert.title}
              </Typography>
              <Typography variant="caption" color="text.disabled" display="block" sx={{ fontSize: '0.72rem' }}>
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
