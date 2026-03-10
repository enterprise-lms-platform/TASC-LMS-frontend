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
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  People as PeopleIcon,
  MenuBook as CourseIcon,
  School as EnrollIcon,
  Analytics as AnalyticsIcon,
  Quiz as AssessmentIcon,
  AttachMoney as RevenueIcon,
  Download as DownloadIcon,
  PlayArrow as GenerateIcon,
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

interface ReportType {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

const reportTypes: ReportType[] = [
  { icon: <PeopleIcon />, iconBg: '#3b82f6', title: 'User Activity Report', description: 'Detailed breakdown of user login patterns, session durations, and platform engagement metrics across the organization.' },
  { icon: <CourseIcon />, iconBg: '#10b981', title: 'Course Performance Report', description: 'Comprehensive analysis of course completion rates, learner satisfaction scores, and content effectiveness.' },
  { icon: <EnrollIcon />, iconBg: '#ffa424', title: 'Enrollment Summary', description: 'Overview of enrollment trends, new registrations, drop-off rates, and capacity utilization by course.' },
  { icon: <AnalyticsIcon />, iconBg: '#8b5cf6', title: 'Completion Analytics', description: 'In-depth analytics on course and module completion, time-to-complete, and learner progress trajectories.' },
  { icon: <AssessmentIcon />, iconBg: '#ef4444', title: 'Assessment Results', description: 'Aggregated quiz and assignment scores, pass/fail distributions, and question-level performance analytics.' },
  { icon: <RevenueIcon />, iconBg: '#14b8a6', title: 'Revenue Report', description: 'Financial summary including course revenue, subscription income, refund rates, and revenue per learner.' },
];

interface RecentReport {
  id: number;
  name: string;
  type: string;
  typeColor: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
  generatedBy: string;
  date: string;
  size: string;
  status: 'Ready' | 'Processing';
}

const recentReports: RecentReport[] = [
  { id: 1, name: 'Q4 2025 User Activity', type: 'User Activity', typeColor: 'primary', generatedBy: 'Admin User', date: 'Mar 8, 2026', size: '2.4 MB', status: 'Ready' },
  { id: 2, name: 'February Course Performance', type: 'Course Performance', typeColor: 'success', generatedBy: 'Sarah Chen', date: 'Mar 5, 2026', size: '1.8 MB', status: 'Ready' },
  { id: 3, name: 'Spring Enrollment Summary', type: 'Enrollment', typeColor: 'warning', generatedBy: 'Admin User', date: 'Mar 3, 2026', size: '956 KB', status: 'Ready' },
  { id: 4, name: 'Annual Completion Analytics', type: 'Completion', typeColor: 'secondary', generatedBy: 'James Wilson', date: 'Mar 1, 2026', size: '—', status: 'Processing' },
  { id: 5, name: 'Q1 Assessment Results', type: 'Assessment', typeColor: 'error', generatedBy: 'Admin User', date: 'Feb 28, 2026', size: '3.1 MB', status: 'Ready' },
];

// ─── Component ─────────────────────────────────────────────

const ManagerReportsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          {/* Page Header */}
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
                color: 'white',
              }}
            >
              <DescriptionIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>Reports</Typography>
              <Typography variant="body2" color="text.secondary">Generate and download organization reports</Typography>
            </Box>
          </Box>

          {/* Report Type Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {reportTypes.map((report) => (
              <Grid size={{ xs: 12, sm: 6 }} key={report.title}>
                <Paper
                  elevation={0}
                  sx={{
                    ...cardSx,
                    p: 3,
                    display: 'flex',
                    gap: 2.5,
                    alignItems: 'flex-start',
                    transition: 'transform 0.2s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1), 0 12px 28px rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      bgcolor: report.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    {report.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>{report.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {report.description}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<GenerateIcon />}
                      sx={{
                        background: 'linear-gradient(135deg, #ffa424, #f97316)',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(255,164,36,0.3)',
                        '&:hover': { background: 'linear-gradient(135deg, #f59e0b, #ea580c)' },
                      }}
                    >
                      Generate
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Recent Reports Table */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Typography variant="h6" fontWeight={700}>Recent Reports</Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Report Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Generated By</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Size</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Download</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentReports.map((report) => (
                    <TableRow key={report.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{report.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={report.type} size="small" color={report.typeColor} sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{report.generatedBy}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{report.date}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{report.size}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={report.status}
                          size="small"
                          color={report.status === 'Ready' ? 'success' : 'warning'}
                          variant={report.status === 'Processing' ? 'outlined' : 'filled'}
                          sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={report.status === 'Ready' ? 'Download report' : 'Report is still processing'}>
                          <span>
                            <IconButton
                              size="small"
                              disabled={report.status !== 'Ready'}
                              sx={{ color: report.status === 'Ready' ? '#3b82f6' : 'text.disabled' }}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </span>
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

export default ManagerReportsPage;
