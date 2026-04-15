import React, { useState, useMemo, useEffect } from 'react';
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
  TablePagination,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  EmojiEvents as EmojiEventsIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { useCertificateList } from '../../hooks/useLearning';
import { useCertificateStats } from '../../services/learning.services';
import { courseApi } from '../../services/catalogue.services';
import { useQuery } from '@tanstack/react-query';
import type { Certificate } from '../../types/types';

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
    case 'Total Issued':
      return { bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12' };
    case 'This Month':
      return { bgcolor: '#eff6ff', iconBg: '#3b82f6', color: '#1e3a5f' };
    case 'Valid (scoped)':
      return { bgcolor: '#dcfce7', iconBg: '#10b981', color: '#14532d' };
    default:
      return { bgcolor: '#f5f5f5', iconBg: '#666', color: '#666' };
  }
};

const getLearnerName = (cert: Certificate) => cert.user_name || '—';

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

type StatusKind = 'Valid' | 'Expired' | 'Invalid';

const getCertificateStatus = (cert: Certificate): StatusKind => {
  if (!cert.is_valid) return 'Invalid';
  if (cert.is_expired) return 'Expired';
  return 'Valid';
};

const statusChipSx = (kind: StatusKind) => {
  if (kind === 'Valid') {
    return { bgcolor: 'rgba(16,185,129,0.1)', color: '#059669', '& .MuiChip-icon': { color: '#059669' } };
  }
  if (kind === 'Expired') {
    return { bgcolor: 'rgba(245,158,11,0.12)', color: '#d97706', '& .MuiChip-icon': { color: '#d97706' } };
  }
  return { bgcolor: 'rgba(239,68,68,0.1)', color: '#dc2626', '& .MuiChip-icon': { color: '#dc2626' } };
};

const openVerify = (cert: Certificate) => {
  const v = cert.verification_url?.trim();
  if (v) {
    window.open(v, '_blank', 'noopener,noreferrer');
    return;
  }
  const num = cert.certificate_number;
  if (num) {
    window.open(`/verify-certificate?cert=${encodeURIComponent(num)}`, '_blank', 'noopener,noreferrer');
  }
};

const ManagerCertificatesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState<number | 'all'>('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, courseFilter]);

  const listParams = useMemo(
    () => ({
      page: page + 1,
      page_size: pageSize,
      search: debouncedSearch || undefined,
      course: courseFilter === 'all' ? undefined : courseFilter,
    }),
    [page, pageSize, debouncedSearch, courseFilter],
  );

  const {
    data: listData,
    isLoading: listLoading,
    isError: listError,
    error: listErr,
  } = useCertificateList(listParams);

  const {
    data: certStats,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErr,
  } = useCertificateStats();

  const { data: coursesData } = useQuery({
    queryKey: ['courses', 'list', 'manager-certificates'],
    queryFn: () => courseApi.getAll({ limit: 100 }).then((r) => r.data),
  });

  const courses = coursesData?.results ?? [];
  const courseOptions: Array<{ id: number | 'all'; title: string }> = [
    { id: 'all', title: 'All courses' },
    ...courses.map((c) => ({ id: c.id, title: c.title })),
  ];

  const rows = listData?.results ?? [];
  const totalCount = listData?.count ?? 0;

  const kpis = useMemo(() => {
    const loadingOrErr = statsError ? '—' : statsLoading ? '…' : null;
    const total = certStats?.total ?? 0;
    const thisMonth = certStats?.this_month ?? 0;
    const valid = certStats?.valid ?? 0;
    const validLabel =
      loadingOrErr === null && total > 0 ? `${valid} of ${total}` : loadingOrErr ?? `${valid} of ${total || 0}`;

    return [
      {
        label: 'Total Issued',
        value: loadingOrErr ?? String(total),
        ...getKpiStyle('Total Issued'),
      },
      {
        label: 'This Month',
        value: loadingOrErr ?? String(thisMonth),
        ...getKpiStyle('This Month'),
      },
      {
        label: 'Valid (scoped)',
        value: validLabel,
        sub: 'Marked valid in your visible scope',
        ...getKpiStyle('Valid (scoped)'),
      },
    ];
  }, [certStats, statsLoading, statsError]);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
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
                View certificates visible to your role (server-scoped)
              </Typography>
            </Box>
          </Box>

          {statsError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {String((statsErr as Error)?.message ?? 'Could not load certificate statistics.')}
            </Alert>
          )}

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
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: kpi.color,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    {kpi.value}
                  </Typography>
                  {'sub' in kpi && kpi.sub ? (
                    <Typography variant="caption" sx={{ display: 'block', color: kpi.color, opacity: 0.85, mb: 0.5 }}>
                      {kpi.sub}
                    </Typography>
                  ) : null}
                  <Typography
                    variant="body2"
                    sx={{ color: kpi.color, fontWeight: 500, fontSize: '0.875rem', opacity: 0.85 }}
                  >
                    {kpi.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flex: 1 }}>
                <TextField
                  placeholder="Search name, email, course, or certificate #…"
                  size="small"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
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
                    onChange={(e) => {
                      setCourseFilter(e.target.value as number | 'all');
                      setPage(0);
                    }}
                    sx={{ borderRadius: '10px' }}
                  >
                    {courseOptions.map((opt) => (
                      <MenuItem key={String(opt.id)} value={opt.id}>
                        {opt.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {listLoading ? '…' : `${totalCount.toLocaleString()} total`}
              </Typography>
            </Box>

            {listError && (
              <Box sx={{ px: 3, pt: 2 }}>
                <Alert severity="error">
                  {String((listErr as Error)?.message ?? 'Could not load certificates.')}
                </Alert>
              </Box>
            )}

            {listLoading && !listError ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          '& th': {
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            bgcolor: 'grey.50',
                            borderBottom: 2,
                            borderColor: 'divider',
                          },
                        }}
                      >
                        <TableCell>Learner</TableCell>
                        <TableCell>Course</TableCell>
                        <TableCell>Certificate ID</TableCell>
                        <TableCell>Issue date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">
                              No certificates match the current filters.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        rows.map((cert) => {
                          const learnerName = getLearnerName(cert);
                          const st = getCertificateStatus(cert);
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
                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="body2" fontWeight={600} noWrap>
                                      {learnerName}
                                    </Typography>
                                    {cert.user_email ? (
                                      <Typography variant="caption" color="text.secondary" noWrap>
                                        {cert.user_email}
                                      </Typography>
                                    ) : null}
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {cert.course_title || '—'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  sx={{ fontFamily: 'monospace', fontWeight: 500, color: 'text.secondary' }}
                                >
                                  {cert.certificate_number || cert.id}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {issueDate}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip label={st} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', ...statusChipSx(st) }} />
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title="View / verify">
                                  <IconButton
                                    size="small"
                                    onClick={() => openVerify(cert)}
                                    disabled={!cert.certificate_number && !cert.verification_url}
                                    sx={{
                                      color: 'text.secondary',
                                      '&:hover': { color: '#ffa424', bgcolor: 'rgba(255,164,36,0.08)' },
                                    }}
                                  >
                                    <ViewIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={cert.pdf_url ? 'Download PDF' : 'No PDF on file'}>
                                  <span>
                                    <IconButton
                                      size="small"
                                      disabled={!cert.pdf_url}
                                      onClick={() => cert.pdf_url && window.open(cert.pdf_url, '_blank', 'noopener,noreferrer')}
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
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={totalCount}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  rowsPerPage={pageSize}
                  onRowsPerPageChange={(e) => {
                    setPageSize(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  labelRowsPerPage="Rows per page"
                />
              </>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerCertificatesPage;
