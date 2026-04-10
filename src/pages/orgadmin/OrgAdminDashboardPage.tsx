import React, { useState, useMemo } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  IconButton,
  AppBar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  VerifiedUser as VerifiedUserIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import { useLogout } from '../../hooks/useLogout';
import { managerMembersApi } from '../../services/organization.services';
import { getRoleDisplayName } from '../../utils/userHelpers';
import type { ManagerMemberItem } from '../../services/organization.services';
import type { UserRole } from '../../types/types';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  p: 3,
  height: '100%',
};

const RECENT_DAYS = 30;

const OrgAdminDashboardPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleLogout = useLogout();
  const navigate = useNavigate();

  const { data: membersData, isLoading } = useQuery({
    queryKey: ['manager-members-dashboard'],
    queryFn: () => managerMembersApi.getAll({ page_size: 200 }).then((r) => r.data),
  });

  const members = membersData?.results ?? [];
  const totalCount = membersData?.count ?? 0;

  const stats = useMemo(() => {
    const now = Date.now();
    const cutoff = now - RECENT_DAYS * 24 * 60 * 60 * 1000;
    return {
      total: totalCount,
      active: members.filter((m) => m.is_active).length,
      verified: members.filter((m) => m.email_verified).length,
      recentlyJoined: members.filter((m) => new Date(m.date_joined).getTime() >= cutoff).length,
    };
  }, [members, totalCount]);

  const recentMembers = useMemo(
    () => members.slice(0, 5),
    [members],
  );

  const statCards = [
    { label: 'Total Members', value: stats.total, icon: <PeopleIcon />, color: '#3b82f6' },
    { label: 'Active Members', value: stats.active, icon: <CheckCircleIcon />, color: '#10b981' },
    { label: 'Email Verified', value: stats.verified, icon: <VerifiedUserIcon />, color: '#8b5cf6' },
    { label: `Joined (Last ${RECENT_DAYS}d)`, value: stats.recentlyJoined, icon: <ScheduleIcon />, color: '#f59e0b' },
  ];

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
          <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { md: 'none' }, color: 'text.secondary' }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
              '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.08)' },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

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

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>

          {/* Quick Actions */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => navigate('/org-admin/invite')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '10px',
                px: 2.5,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              Add Member
            </Button>
            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => navigate('/org-admin/members')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '10px',
                px: 2.5,
                borderColor: 'divider',
                color: 'text.primary',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(255,164,36,0.04)' },
              }}
            >
              View All Members
            </Button>
          </Box>

          {/* Stat Cards */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {statCards.map((card) => (
              <Grid size={{ xs: 6, md: 3 }} key={card.label}>
                <Paper elevation={0} sx={cardSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${card.color}14`,
                        color: card.color,
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                  {isLoading ? (
                    <Skeleton variant="text" width={48} height={40} />
                  ) : (
                    <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.1 }}>
                      {card.value}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {card.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Recent Members */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: '1rem',
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Recent Members
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                onClick={() => navigate('/org-admin/members')}
                sx={{ textTransform: 'none', fontWeight: 600, color: 'primary.dark' }}
              >
                View all
              </Button>
            </Box>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : recentMembers.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No members yet. Invite your first learner to get started.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={() => navigate('/org-admin/invite')}
                  sx={{ mt: 2, textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
                >
                  Add Member
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' } }}>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Joined</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentMembers.map((m: ManagerMemberItem) => (
                      <TableRow key={m.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                        <TableCell sx={{ fontWeight: 500 }}>{m.name}</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{m.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={getRoleDisplayName(m.role as UserRole)}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              bgcolor: 'rgba(255,164,36,0.08)',
                              color: 'primary.dark',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={m.is_active ? 'Active' : 'Inactive'}
                            size="small"
                            color={m.is_active ? 'success' : 'default'}
                            variant="outlined"
                            sx={{ fontWeight: 500, fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                          {formatDate(m.date_joined)}
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

export default OrgAdminDashboardPage;
