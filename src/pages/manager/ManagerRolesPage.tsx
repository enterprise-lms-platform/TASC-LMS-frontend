import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Badge as BadgeIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';

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

// ── Role Definitions ──
const roles = [
  {
    name: 'Learner',
    icon: <SchoolIcon />,
    iconBg: '#3b82f6',
    description: 'Standard learner access for browsing, enrolling in courses, taking assessments, and tracking personal progress.',
    userCount: 2184,
    permissions: ['Browse Catalog', 'Enroll in Courses', 'Take Quizzes', 'Submit Assignments', 'View Certificates', 'Track Progress'],
  },
  {
    name: 'Instructor',
    icon: <PersonIcon />,
    iconBg: '#10b981',
    description: 'Course creation and management access including content authoring, grading, and learner engagement monitoring.',
    userCount: 48,
    permissions: ['Create Courses', 'Manage Content', 'Grade Assignments', 'View Learner Progress', 'Host Live Sessions', 'Issue Certificates'],
  },
  {
    name: 'LMS Manager',
    icon: <AdminIcon />,
    iconBg: '#6366f1',
    description: 'Full administrative access to all platform features including user management, analytics, and organizational settings.',
    userCount: 6,
    permissions: ['Manage Users', 'Assign Roles', 'View Analytics', 'Approve Courses', 'Organization Settings', 'Billing Management', 'Bulk Import', 'Full Reports Access'],
  },
];

// ── Recent Role Changes ──
const recentRoleChanges = [
  { user: 'Sarah Mitchell', initials: 'SM', previousRole: 'Learner', newRole: 'Instructor', changedBy: 'Alex Okafor', date: 'Mar 8, 2026' },
  { user: 'David Kim', initials: 'DK', previousRole: 'Learner', newRole: 'Instructor', changedBy: 'Alex Okafor', date: 'Mar 5, 2026' },
  { user: 'Priya Sharma', initials: 'PS', previousRole: 'Instructor', newRole: 'Manager', changedBy: 'Alex Okafor', date: 'Feb 28, 2026' },
  { user: 'Laura Bennett', initials: 'LB', previousRole: 'Instructor', newRole: 'Learner', changedBy: 'Sarah Mitchell', date: 'Feb 20, 2026' },
  { user: 'Michael Thompson', initials: 'MT', previousRole: 'Learner', newRole: 'Instructor', changedBy: 'Alex Okafor', date: 'Feb 14, 2026' },
];

const roleChipColors: Record<string, { bg: string; color: string }> = {
  Learner: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  Instructor: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  Manager: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
};

const ManagerRolesPage: React.FC = () => {
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
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
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
              <BadgeIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Role Assignment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage user roles and permissions
              </Typography>
            </Box>
          </Box>

          {/* Role Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {roles.map((role) => (
              <Grid size={{ xs: 12, md: 4 }} key={role.name}>
                <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '12px',
                          bgcolor: role.iconBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        {role.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          {role.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {role.userCount.toLocaleString()} users
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {role.description}
                    </Typography>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Permissions
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {role.permissions.map((perm) => (
                        <Chip
                          key={perm}
                          label={perm}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            bgcolor: 'rgba(255,164,36,0.08)',
                            color: '#b45309',
                            height: 26,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Recent Role Changes */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>Recent Role Changes</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>Previous Role</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>New Role</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>Changed By</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentRoleChanges.map((change, idx) => (
                    <TableRow
                      key={idx}
                      sx={{ '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' }, '&:last-child td': { borderBottom: 0 } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: 'linear-gradient(135deg, #ffa424, #f97316)',
                            }}
                          >
                            {change.initials}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>
                            {change.user}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={change.previousRole}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: roleChipColors[change.previousRole]?.bg,
                            color: roleChipColors[change.previousRole]?.color,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={change.newRole}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: roleChipColors[change.newRole]?.bg,
                            color: roleChipColors[change.newRole]?.color,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {change.changedBy}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {change.date}
                        </Typography>
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

export default ManagerRolesPage;
