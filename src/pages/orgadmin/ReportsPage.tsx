import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
  IconButton,
} from '@mui/material';
import {
  Assessment as ReportsIcon,
  People as PeopleIcon,
  MenuBook as CourseIcon,
  Assignment as EnrollIcon,
  Analytics as CompletionIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import { useOrgReports, useOrgReportTypes } from '../../hooks/useOrgAdmin';

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
};

interface Report {
  id: number;
  report_type: string;
  name: string;
  generated_by: number;
  generated_at: string;
  status: 'processing' | 'ready' | 'failed';
  file?: string;
  file_size?: string;
}

const reportTypeConfig: Record<string, { icon: React.ReactNode; color: string; title: string; description: string }> = {
  user_activity: { icon: <PeopleIcon />, color: '#3b82f6', title: 'User Activity Report', description: 'Track user logins, course access, and learning patterns' },
  course_performance: { icon: <CourseIcon />, color: '#10b981', title: 'Course Performance Report', description: 'View completion rates, scores, and engagement metrics' },
  enrollment: { icon: <EnrollIcon />, color: '#ffa424', title: 'Enrollment Summary', description: 'Summary of enrollments across all courses' },
  completion: { icon: <CompletionIcon />, color: '#8b5cf6', title: 'Completion Analytics', description: 'Detailed completion analytics and trends' },
};

const ReportsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: reportTypesData } = useOrgReportTypes();
  const { data: reportsData, isLoading, generate } = useOrgReports({ page_size: 20 });

  const reports: Report[] = (reportsData as unknown as { results?: Report[] })?.results ?? [];

  const handleGenerate = (reportType: string) => {
    generate.mutate(reportType);
  };

  const handleDownload = (report: Report) => {
    if (report.file && report.status === 'ready') {
      window.open(report.file, '_blank');
    }
  };

  const getTypeChip = (type: string) => {
    const config = reportTypeConfig[type];
    if (!config) return <Chip label={type} size="small" />;
    return <Chip label={config.title} size="small" sx={{ bgcolor: `${config.color}14`, color: config.color, fontWeight: 600 }} />;
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Reports" />

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #ffa424, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <ReportsIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>Reports</Typography>
              <Typography variant="body2" color="text.secondary">Generate and download organisation reports</Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {Object.entries(reportTypeConfig).map(([type, config]) => (
              <Grid size={{ xs: 12, sm: 6 }} key={type}>
                <Paper elevation={0} sx={{ ...cardSx, p: 3, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1), 0 12px 28px rgba(0,0,0,0.08)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: `${config.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: config.color }}>
                      {config.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>{config.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{config.description}</Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleGenerate(type)}
                    disabled={generate.isPending}
                    sx={{ background: 'linear-gradient(135deg, #ffa424, #f97316)', textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: '0 4px 12px rgba(255,164,36,0.3)', '&:hover': { background: 'linear-gradient(135deg, #f59e0b, #ea580c)' } }}
                  >
                    Generate
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}><Typography fontWeight={700}>Recent Reports</Typography></Box>
            {isLoading ? (
              <Box sx={{ p: 2 }}>{[0,1,2,3].map(i => <Skeleton key={i} height={56} sx={{mb:1}} />)}</Box>
            ) : reports.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">No reports generated yet</Typography></Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Report Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Generated</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Size</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{report.name}</TableCell>
                        <TableCell>{getTypeChip(report.report_type)}</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{new Date(report.generated_at).toLocaleDateString()}</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{report.file_size || '—'}</TableCell>
                        <TableCell>
                          <Chip label={report.status === 'ready' ? 'Ready' : report.status === 'processing' ? 'Processing' : 'Failed'} size="small"
                            sx={{ bgcolor: report.status === 'ready' ? '#dcfce7' : report.status === 'processing' ? '#fff3e0' : '#fef2f2', color: report.status === 'ready' ? '#16a34a' : report.status === 'processing' ? '#f59e0b' : '#ef4444', fontWeight: 600 }} />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleDownload(report)} disabled={report.status !== 'ready'}>
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportsPage;