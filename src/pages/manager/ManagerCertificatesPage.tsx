import React, { useState, useMemo } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  EmojiEvents as EmojiEventsIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  VerifiedUser as VerifiedIcon,
  Schedule as PendingIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { certificateApi, courseApi } from '../../services/main.api';

// ─── Styles ────────────────────────────────────────────────

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const headerSx = {
  p: 2,
  px: 3,
  bgcolor: 'grey.50',
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap' as const,
  gap: 2,
};

const getKpiStyle = (label: string) => {
  switch (label) {
    case 'Total Issued': return { bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12' };
    case 'This Month': return { bgcolor: '#eff6ff', iconBg: '#3b82f6', color: '#1e3a5f' };
    case 'Verification Rate': return { bgcolor: '#dcfce7', iconBg: '#10b981', color: '#14532d' };
    default: return { bgcolor: '#f5f5f5', iconBg: '#666', color: '#666' };
  }
};

// ─── Component ─────────────────────────────────────────────

const ManagerCertificatesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState<number | 'all'>('all');

  const { data: certificatesData } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => certificateApi.getAll().then(r => r.data),
  });

  const { data: coursesData } = useQuery({
    queryKey: ['courses', 'list'],
    queryFn: () => courseApi.getAll({ limit: 100 }).then(r => r.data),
  });

  const certificates = certificatesData ?? [];
  const courses = coursesData?.results ?? [];

  const courseOptions: Array<{ id: number | 'all'; title: string }> = [
    { id: 'all', title: 'All Courses' },
    ...courses.map((c) => ({ id: c.id, title: c.title })),
  ];

  const getLearnerName = (cert: Record<string, any>) => {
    return cert.user_name || 'Unknown';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getCertStatus = (cert: Record<string, any>): 'Verified' | 'Pending' => {
    return cert.is_valid ? 'Verified' : 'Pending';
  };

  const filtered = useMemo(() => {
    if (!certificates.length) return [];
    return certificates.filter((cert) => {
      const learnerName = getLearnerName(cert).toLowerCase();
      const certId = cert.certificate_number || cert.id?.toString() || '';
      const matchesSearch = search === '' ||
        learnerName.includes(search.toLowerCase()) ||
        certId.includes(search.toLowerCase());
      const matchesCourse = courseFilter === 'all' || cert.course_title === courses.find(c => c.id === courseFilter)?.title;
      return matchesSearch && matchesCourse;
    });
  }, [certificates, search, courseFilter, courses]);

  const kpis = useMemo(() => {
    if (!certificates.length) return [];
    const thisMonth = certificates.filter((c) => {
      const date = new Date(c.issued_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    const verified = certificates.filter((c) => getCertStatus(c) === 'Verified').length;
    const verificationRate = certificates.length > 0 ? Math.round((verified / certificates.length) * 100) : 0;
    return [
      { label: 'Total Issued', value: certificates.length.toString(), ...getKpiStyle('Total Issued') },
      { label: 'This Month', value: thisMonth.toString(), ...getKpiStyle('This Month') },
      { label: 'Verification Rate', value: `${verificationRate}%`, ...getKpiStyle('Verification Rate') },
    ];
  }, [certificates]);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* ── Page Header ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ffa424, #f97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EmojiEventsIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Certificates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage issued certificates
              </Typography>
            </Box>
          </Box>

          {/* ── KPI Cards ── */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {kpis.map((kpi) => (
              <Grid size={{ xs: 12, sm: 4 }} key={kpi.label}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: kpi.bgcolor,
                    borderRadius: '20px',
                    p: 3,
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: kpi.color,
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      lineHeight: 1,
                      mb: 1,
                    }}
                  >
                    {kpi.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: kpi.color, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}
                  >
                    {kpi.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* ── Certificates Table ── */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flex: 1 }}>
                <TextField
                  placeholder="Search learner or certificate ID..."
                  size="small"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{
                    minWidth: 280,
                    '& .MuiOutlinedInput-root': { borderRadius: '10px' },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={courseFilter}
                    label="Course"
                    onChange={(e) => setCourseFilter(e.target.value)}
                    sx={{ borderRadius: '10px' }}
                  >
                    {courseOptions.map((opt) => (
                      <MenuItem key={opt.id} value={opt.id}>{opt.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {filtered.length} {filtered.length === 1 ? 'certificate' : 'certificates'}
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Learner
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Course
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Certificate ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Issue Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((cert) => {
                    const learnerName = getLearnerName(cert);
                    const status = getCertStatus(cert);
                    const certId = cert.certificate_number || cert.id;
                    const issueDate = cert.issued_at
                      ? new Date(cert.issued_at).toLocaleDateString()
                      : '—';
                    return (
                    <TableRow
                      key={cert.id}
                      sx={{
                        '&:hover': { bgcolor: 'rgba(255,164,36,0.03)' },
                        transition: 'background 0.15s',
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                            }}
                          >
                            {getInitials(learnerName)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>
                            {learnerName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {cert.course_title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'monospace', fontWeight: 500, color: 'text.secondary' }}
                        >
                          {certId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {issueDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={status}
                          size="small"
                          icon={
                            status === 'Verified'
                              ? <VerifiedIcon sx={{ fontSize: 14 }} />
                              : <PendingIcon sx={{ fontSize: 14 }} />
                          }
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            borderRadius: '6px',
                            bgcolor: status === 'Verified' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                            color: status === 'Verified' ? '#059669' : '#d97706',
                            '& .MuiChip-icon': {
                              color: status === 'Verified' ? '#059669' : '#d97706',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Verify">
                          <IconButton
                            size="small"
                            onClick={() => window.open(`/verify-certificate?cert=${encodeURIComponent(cert.certificate_number || cert.id)}`, '_blank')}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: '#ffa424', bgcolor: 'rgba(255,164,36,0.08)' },
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={cert.pdf_url ? 'Download PDF' : 'PDF not available'}>
                          <span>
                            <IconButton
                              size="small"
                              disabled={!cert.pdf_url}
                              onClick={() => cert.pdf_url && window.open(cert.pdf_url, '_blank')}
                              sx={{
                                color: 'text.secondary',
                                '&:hover': { color: '#ffa424', bgcolor: 'rgba(255,164,36,0.08)' },
                              }}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerCertificatesPage;
