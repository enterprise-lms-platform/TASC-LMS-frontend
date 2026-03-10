import React, { useState } from 'react';
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
import Sidebar, { DRAWER_WIDTH } from '../components/manager/Sidebar';
import TopBar from '../components/manager/TopBar';

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

// ─── Mock Data ─────────────────────────────────────────────

const kpis = [
  { label: 'Total Issued', value: '1,248', bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12' },
  { label: 'This Month', value: '86', bgcolor: '#eff6ff', iconBg: '#3b82f6', color: '#1e3a5f' },
  { label: 'Verification Rate', value: '94%', bgcolor: '#dcfce7', iconBg: '#10b981', color: '#14532d' },
];

const courses = [
  'All Courses',
  'Advanced React Patterns',
  'Python for Data Science',
  'AWS Solutions Architect',
  'TypeScript Mastery',
  'Docker & Kubernetes',
];

interface Certificate {
  id: number;
  learner: string;
  initials: string;
  course: string;
  certificateId: string;
  issueDate: string;
  status: 'Verified' | 'Pending';
}

const certificates: Certificate[] = [
  { id: 1, learner: 'Alice Mwangi', initials: 'AM', course: 'Advanced React Patterns', certificateId: 'CERT-2026-001247', issueDate: 'Mar 8, 2026', status: 'Verified' },
  { id: 2, learner: 'Brian Ochieng', initials: 'BO', course: 'Python for Data Science', certificateId: 'CERT-2026-001246', issueDate: 'Mar 7, 2026', status: 'Verified' },
  { id: 3, learner: 'Clara Njeri', initials: 'CN', course: 'AWS Solutions Architect', certificateId: 'CERT-2026-001245', issueDate: 'Mar 6, 2026', status: 'Pending' },
  { id: 4, learner: 'David Kamau', initials: 'DK', course: 'TypeScript Mastery', certificateId: 'CERT-2026-001244', issueDate: 'Mar 5, 2026', status: 'Verified' },
  { id: 5, learner: 'Esther Wanjiku', initials: 'EW', course: 'Docker & Kubernetes', certificateId: 'CERT-2026-001243', issueDate: 'Mar 4, 2026', status: 'Verified' },
  { id: 6, learner: 'Francis Otieno', initials: 'FO', course: 'Advanced React Patterns', certificateId: 'CERT-2026-001242', issueDate: 'Mar 3, 2026', status: 'Verified' },
  { id: 7, learner: 'Grace Akinyi', initials: 'GA', course: 'Python for Data Science', certificateId: 'CERT-2026-001241', issueDate: 'Mar 2, 2026', status: 'Pending' },
  { id: 8, learner: 'Henry Mutua', initials: 'HM', course: 'AWS Solutions Architect', certificateId: 'CERT-2026-001240', issueDate: 'Mar 1, 2026', status: 'Verified' },
];

// ─── Component ─────────────────────────────────────────────

const ManagerCertificatesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All Courses');

  const filtered = certificates.filter((cert) => {
    const matchesSearch =
      cert.learner.toLowerCase().includes(search.toLowerCase()) ||
      cert.certificateId.toLowerCase().includes(search.toLowerCase());
    const matchesCourse =
      courseFilter === 'All Courses' || cert.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

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
                    {courses.map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
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
                  {filtered.map((cert) => (
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
                            {cert.initials}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>
                            {cert.learner}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {cert.course}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'monospace', fontWeight: 500, color: 'text.secondary' }}
                        >
                          {cert.certificateId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {cert.issueDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={cert.status}
                          size="small"
                          icon={
                            cert.status === 'Verified'
                              ? <VerifiedIcon sx={{ fontSize: 14 }} />
                              : <PendingIcon sx={{ fontSize: 14 }} />
                          }
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            borderRadius: '6px',
                            bgcolor: cert.status === 'Verified' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                            color: cert.status === 'Verified' ? '#059669' : '#d97706',
                            '& .MuiChip-icon': {
                              color: cert.status === 'Verified' ? '#059669' : '#d97706',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: '#ffa424', bgcolor: 'rgba(255,164,36,0.08)' },
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: '#ffa424', bgcolor: 'rgba(255,164,36,0.08)' },
                            }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
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
