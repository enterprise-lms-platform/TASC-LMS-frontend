import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, Typography, Paper, Grid, Button, Snackbar, Alert } from '@mui/material';
import { Download as DownloadIcon, School as EnrollmentIcon, CheckCircle as CompletionIcon, Assignment as SubmissionIcon } from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import RecentMembersTable from '../../components/orgadmin/RecentMembersTable';
import { useOrgAdminMembers, useOrgActivity } from '../../hooks/useOrgAdmin';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const ReportsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { data: membersData } = useOrgAdminMembers({ page_size: 1 });
  const { data: activityData } = useOrgActivity('30days');
  const totalMembers = membersData?.count ?? 0;
  const summary = activityData?.summary;

  const handleExport = () => {
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Reports" />

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
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                  Members Report
                </Typography>
                <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
                  {totalMembers.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Total members in your organisation
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExport}
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
                >
                  Export CSV
                </Button>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                  Activity Report (30 Days)
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EnrollmentIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                      <Box>
                        <Typography variant="h5" fontWeight={700}>
                          {summary?.enrollments ?? 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Enrollments
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CompletionIcon sx={{ color: '#10b981', fontSize: 20 }} />
                      <Box>
                        <Typography variant="h5" fontWeight={700}>
                          {summary?.completions ?? 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Completions
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SubmissionIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                      <Box>
                        <Typography variant="h5" fontWeight={700}>
                          {summary?.submissions ?? 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Submissions
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <RecentMembersTable />
        </Box>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="info" onClose={() => setSnackbarOpen(false)}>
          Export coming soon
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportsPage;