import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  AdminPanelSettings as SuperAdminIcon,
  School as ManagerIcon,
  Person as InstructorIcon,
  MenuBook as LearnerIcon,
  AccountBalance as FinanceIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

interface RoleCard {
  name: string;
  description: string;
  userCount: number;
  icon: React.ReactNode;
  iconBg: string;
}

const roles: RoleCard[] = [
  {
    name: 'Super Admin',
    description: 'Full platform control with access to all system settings, organizations, and configurations',
    userCount: 2,
    icon: <SuperAdminIcon sx={{ fontSize: 28 }} />,
    iconBg: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
  },
  {
    name: 'LMS Manager',
    description: 'Organization and course management including enrollment, reporting, content curation, and system configuration',
    userCount: 32,
    icon: <ManagerIcon sx={{ fontSize: 28 }} />,
    iconBg: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  {
    name: 'Instructor',
    description: 'Content creation and teaching responsibilities including grading and assessments',
    userCount: 156,
    icon: <InstructorIcon sx={{ fontSize: 28 }} />,
    iconBg: 'linear-gradient(135deg, #ffb74d, #ffa424)',
  },
  {
    name: 'Learner',
    description: 'Course consumption with access to enrolled courses, assessments, and certificates',
    userCount: 24312,
    icon: <LearnerIcon sx={{ fontSize: 28 }} />,
    iconBg: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  },
  {
    name: 'Finance',
    description: 'Financial oversight including payment tracking, invoices, subscriptions, and revenue reports',
    userCount: 5,
    icon: <FinanceIcon sx={{ fontSize: 28 }} />,
    iconBg: 'linear-gradient(135deg, #ec4899, #f472b6)',
  },
];

const permissions = [
  'User Management',
  'Course Management',
  'Enrollment Management',
  'Assessment Management',
  'Financial Access',
  'System Configuration',
  'Audit Logs',
  'Reports & Analytics',
];

const roleNames = ['Super Admin', 'LMS Manager', 'Instructor', 'Learner', 'Finance'];

const permissionMatrix: Record<string, Record<string, boolean>> = {
  'User Management': {
    'Super Admin': true,
    'LMS Manager': true,
    'Instructor': false,
    'Learner': false,
    'Finance': false,
  },
  'Course Management': {
    'Super Admin': true,
    'LMS Manager': true,
    'Instructor': true,
    'Learner': false,
    'Finance': false,
  },
  'Enrollment Management': {
    'Super Admin': true,
    'LMS Manager': true,
    'Instructor': false,
    'Learner': false,
    'Finance': false,
  },
  'Assessment Management': {
    'Super Admin': true,
    'LMS Manager': true,
    'Instructor': true,
    'Learner': false,
    'Finance': false,
  },
  'Financial Access': {
    'Super Admin': true,
    'LMS Manager': true,
    'Instructor': false,
    'Learner': false,
    'Finance': true,
  },
  'System Configuration': {
    'Super Admin': true,
    'LMS Manager': true,
    'Instructor': false,
    'Learner': false,
    'Finance': false,
  },
  'Audit Logs': {
    'Super Admin': true,
    'LMS Manager': true,
    'Instructor': false,
    'Learner': false,
    'Finance': false,
  },
  'Reports & Analytics': {
    'Super Admin': true,
    'LMS Manager': true,
    'Instructor': true,
    'Learner': false,
    'Finance': true,
  },
};

const RolesPermissionsPage: React.FC = () => {
  return (
    <SuperadminLayout title="Roles & Permissions" subtitle="Manage roles and access control">
      {/* Role Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
        {roles.map((role) => (
          <Grid key={role.name} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s',
                height: '100%',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    background: role.iconBg,
                    flexShrink: 0,
                  }}
                >
                  {role.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {role.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                    {role.description}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  pt: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <Box component="span" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.1rem' }}>
                    {role.userCount.toLocaleString()}
                  </Box>{' '}
                  users
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Permission Matrix */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Permission Matrix
        </Typography>
        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary', minWidth: 200 }}>
                  Permission
                </TableCell>
                {roleNames.map((role) => (
                  <TableCell
                    key={role}
                    align="center"
                    sx={{ fontWeight: 600, color: 'text.secondary', minWidth: 120 }}
                  >
                    {role}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow
                  key={permission}
                  sx={{ '&:hover': { bgcolor: 'grey.50' }, '&:last-child td': { borderBottom: 0 } }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {permission}
                    </Typography>
                  </TableCell>
                  {roleNames.map((role) => (
                    <TableCell key={role} align="center">
                      {permissionMatrix[permission][role] ? (
                        <CheckIcon sx={{ color: '#10b981', fontSize: 22 }} />
                      ) : (
                        <CloseIcon sx={{ color: '#ef4444', fontSize: 22 }} />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </SuperadminLayout>
  );
};

export default RolesPermissionsPage;
