import React from 'react';
import { Box, Typography, Button, Grid, Paper, Skeleton } from '@mui/material';
import { EmojiEvents, ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { certificateApi } from '../../services/learning.services';
import type { PaginatedResponse } from '../../types/types';

interface CertificateResult {
  id: number;
  course_title?: string;
  course?: { title?: string };
  issued_at?: string;
  created_at?: string;
}

const Certificates: React.FC = () => {
  const navigate = useNavigate();

  const { data: certsData, isLoading } = useQuery({
    queryKey: ['learner', 'certificates', 'dashboard'],
    queryFn: () => certificateApi.getAll({ page: 1, page_size: 100 }).then((r) => r.data),
  });

  const certs: CertificateResult[] = Array.isArray(certsData)
    ? certsData
    : (certsData as PaginatedResponse<CertificateResult> | undefined)?.results ?? [];
  const recentCerts = certs.slice(0, 3);

  if (!isLoading && recentCerts.length === 0) return null;

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
          onClick={() => navigate('/learner/certificates')}
          sx={{ textTransform: 'none', fontWeight: 500, color: 'primary.dark', fontSize: '0.8rem' }}
        >
          View All
        </Button>
      </Box>

      <Grid container spacing={2}>
        {isLoading ? (
          [0, 1, 2].map(i => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: '12px' }} />
            </Grid>
          ))
        ) : (
          recentCerts.map((cert) => (
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
                  {cert.course_title || cert.course?.title || 'Certificate'}
                </Typography>
                <Typography variant="caption" color="text.disabled" display="block" sx={{ fontSize: '0.72rem' }}>
                  Issued: {new Date(cert.issued_at || cert.created_at || '').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </Typography>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>
    </Paper>
  );
};

export default Certificates;
