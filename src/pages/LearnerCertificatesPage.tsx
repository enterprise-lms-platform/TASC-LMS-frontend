import React, { useState } from 'react';
import {
  Box, Toolbar, CssBaseline, Typography, Grid, Paper, Chip, Button,
  Dialog, DialogContent, IconButton, CircularProgress, useMediaQuery, useTheme,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  Verified as VerifiedIcon,
  Warning as ExpiredIcon,
  School as CourseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../components/learner/Sidebar';
import TopBar from '../components/learner/TopBar';
import CertificatePreview from '../components/learner/CertificatePreview';
import { useCertificates } from '../hooks/useLearning';
import type { Certificate } from '../types/types';
import '../styles/LearnerDashboard.css';
import '../styles/CertificatePrint.css';

// TODO: Remove mock data once backend is connected
const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 1,
    enrollment: 1,
    user_name: 'Bernard Otim',
    user_email: 'bernard@tasc.com',
    course_title: 'Advanced React Patterns',
    certificate_number: 'TASC-2026-00142',
    issued_at: '2026-02-15T10:00:00Z',
    expiry_date: '2027-02-15T10:00:00Z',
    is_valid: true,
    is_expired: false,
    pdf_url: null,
    verification_url: null,
  },
  {
    id: 2,
    enrollment: 2,
    user_name: 'Bernard Otim',
    user_email: 'bernard@tasc.com',
    course_title: 'Project Management Fundamentals',
    certificate_number: 'TASC-2025-00098',
    issued_at: '2025-11-20T14:30:00Z',
    expiry_date: '2026-11-20T14:30:00Z',
    is_valid: true,
    is_expired: false,
    pdf_url: null,
    verification_url: null,
  },
  {
    id: 3,
    enrollment: 3,
    user_name: 'Bernard Otim',
    user_email: 'bernard@tasc.com',
    course_title: 'Introduction to Cloud Computing & AWS Services',
    certificate_number: 'TASC-2025-00056',
    issued_at: '2025-06-10T09:00:00Z',
    expiry_date: '2026-01-10T09:00:00Z',
    is_valid: false,
    is_expired: true,
    pdf_url: null,
    verification_url: null,
  },
];

const LearnerCertificatesPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: apiCertificates, isLoading } = useCertificates();

  // TODO: Remove MOCK_CERTIFICATES fallback once backend is connected
  const certificates = apiCertificates && apiCertificates.length > 0 ? apiCertificates : MOCK_CERTIFICATES;

  const validCount = certificates.filter((c) => c.is_valid && !c.is_expired).length;
  const expiredCount = certificates.filter((c) => c.is_expired).length;
  const totalCount = certificates.length;

  const handleOpenPreview = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setPreviewOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (selectedCertificate?.pdf_url) {
      window.open(selectedCertificate.pdf_url, '_blank');
    } else {
      window.print();
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const stats = [
    { label: 'Total', value: totalCount, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Valid', value: validCount, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Expired', value: expiredCount, color: '#ef4444', bg: '#fef2f2' },
  ];

  return (
    <Box className="learner-page" sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          overflowX: 'hidden',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.1rem', md: '1.3rem' } }}
          >
            My Certificates
          </Typography>
          <Typography color="text.disabled" sx={{ fontSize: '0.85rem' }}>
            View and download your earned certificates
          </Typography>
        </Box>

        {/* Stats Row */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  textAlign: 'center',
                  bgcolor: stat.bg,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: stat.color, fontSize: { xs: '1.5rem', md: '2rem' } }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Loading */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#ffa424' }} />
          </Box>
        )}

        {/* Empty State */}
        {!isLoading && totalCount === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'grey.200',
              textAlign: 'center',
            }}
          >
            <TrophyIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              No certificates yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Complete a course to earn your first certificate
            </Typography>
            <Button
              variant="contained"
              startIcon={<CourseIcon />}
              onClick={() => navigate('/learner/courses')}
              sx={{
                bgcolor: '#ffa424',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: '#f97316' },
              }}
            >
              Browse Courses
            </Button>
          </Paper>
        )}

        {/* Certificates Grid */}
        {!isLoading && totalCount > 0 && (
          <Grid container spacing={2}>
            {certificates?.map((cert) => {
              const isValid = cert.is_valid && !cert.is_expired;
              return (
                <Grid key={cert.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper
                    elevation={0}
                    onClick={() => handleOpenPreview(cert)}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'grey.200',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#ffa424',
                        boxShadow: '0 4px 16px rgba(255,164,36,0.12)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {/* Icon + Status */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #ffa424 0%, #ffb74d 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <TrophyIcon sx={{ color: '#fff', fontSize: 28 }} />
                      </Box>
                      <Chip
                        icon={isValid ? <VerifiedIcon sx={{ fontSize: 14 }} /> : <ExpiredIcon sx={{ fontSize: 14 }} />}
                        label={isValid ? 'Valid' : 'Expired'}
                        size="small"
                        sx={{
                          bgcolor: isValid ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          color: isValid ? '#10b981' : '#ef4444',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          '& .MuiChip-icon': { color: isValid ? '#10b981' : '#ef4444' },
                        }}
                      />
                    </Box>

                    {/* Course Title */}
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.3,
                        minHeight: '2.6em',
                      }}
                    >
                      {cert.course_title}
                    </Typography>

                    {/* Certificate Number */}
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.disabled', fontFamily: 'monospace', display: 'block', mb: 1 }}
                    >
                      {cert.certificate_number}
                    </Typography>

                    {/* Issued Date */}
                    <Typography variant="body2" color="text.secondary">
                      Issued: {formatDate(cert.issued_at)}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Certificate Preview Dialog */}
        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="lg"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{ sx: { borderRadius: isMobile ? 0 : '16px', overflow: 'hidden' } }}
        >
          {/* Action Bar */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              '@media print': { display: 'none' },
            }}
          >
            <Typography fontWeight={600}>Certificate Preview</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                startIcon={<PrintIcon />}
                onClick={handlePrint}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Print
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                sx={{
                  bgcolor: '#ffa424',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#f97316' },
                }}
              >
                Download
              </Button>
              <IconButton onClick={() => setPreviewOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <DialogContent sx={{ display: 'flex', justifyContent: 'center', p: { xs: 2, md: 4 }, bgcolor: '#f4f4f5' }}>
            {selectedCertificate && <CertificatePreview certificate={selectedCertificate} />}
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default LearnerCertificatesPage;
