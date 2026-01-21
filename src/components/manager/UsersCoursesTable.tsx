import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import {
  People as UsersIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  PersonAdd as PersonAddIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';

// User data (will come from backend later)
const usersData = [
  {
    name: 'Michael Rodriguez',
    email: 'michael.r@acme.com',
    initials: 'MR',
    avatarColor: 'linear-gradient(135deg, #667eea, #764ba2)',
    role: 'Instructor',
    roleColor: 'info',
    department: 'Engineering',
    courses: '4 courses',
    status: 'Active',
    statusColor: 'success',
  },
  {
    name: 'Emma Chen',
    email: 'emma.c@acme.com',
    initials: 'EC',
    avatarColor: 'linear-gradient(135deg, #11998e, #38ef7d)',
    role: 'Learner',
    roleColor: 'success',
    department: 'Marketing',
    courses: '6 courses',
    status: 'Active',
    statusColor: 'success',
  },
  {
    name: 'David Wilson',
    email: 'david.w@acme.com',
    initials: 'DW',
    avatarColor: 'linear-gradient(135deg, #f093fb, #f5576c)',
    role: 'Instructor',
    roleColor: 'info',
    department: 'Sales',
    courses: '3 courses',
    status: 'Pending',
    statusColor: 'warning',
  },
  {
    name: 'Lisa Thompson',
    email: 'lisa.t@acme.com',
    initials: 'LT',
    avatarColor: 'linear-gradient(135deg, #fa709a, #fee140)',
    role: 'Finance',
    roleColor: 'warning',
    department: 'Finance',
    courses: '2 courses',
    status: 'Active',
    statusColor: 'success',
  },
  {
    name: 'James Kariuki',
    email: 'james.k@acme.com',
    initials: 'JK',
    avatarColor: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    role: 'Learner',
    roleColor: 'success',
    department: 'Engineering',
    courses: '8 courses',
    status: 'Active',
    statusColor: 'success',
  },
];

const UsersCoursesTable: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          px: 3,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            minHeight: 56,
          },
          '& .Mui-selected': {
            color: 'primary.dark',
          },
          '& .MuiTabs-indicator': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        <Tab label="Recent Users" />
        <Tab label="Courses Overview" />
        <Tab label="Recent Enrollments" />
      </Tabs>

      {/* Users Tab Content */}
      {tabValue === 0 && (
        <>
          {/* Card Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: { xs: 2, md: 2.5 },
              px: { xs: 2, md: 3 },
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <UsersIcon sx={{ color: 'primary.dark', fontSize: { xs: 20, md: 24 } }} />
              <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                Recent Users
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<FilterIcon />}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 500,
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  px: { xs: 1, md: 2 },
                }}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<PersonAddIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  bgcolor: 'primary.dark',
                  '&:hover': { bgcolor: 'primary.main' },
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  px: { xs: 1, md: 2 },
                }}
              >
                Add User
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer sx={{ overflowX: 'auto', width: '100%' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>
                    User
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>
                    Role
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', display: { xs: 'none', md: 'table-cell' } }}>
                    Department
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', display: { xs: 'none', sm: 'table-cell' } }}>
                    Enrolled Courses
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersData.map((user, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            background: user.avatarColor,
                            fontSize: '0.875rem',
                            fontWeight: 600,
                          }}
                        >
                          {user.initials}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        sx={{
                          bgcolor: `${user.roleColor}.lighter`,
                          color: `${user.roleColor}.main`,
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      <Typography variant="body2">{user.department}</Typography>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Typography variant="body2">{user.courses}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        sx={{
                          bgcolor: `${user.statusColor}.lighter`,
                          color: `${user.statusColor}.main`,
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          '& .MuiChip-label': {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            '&:hover': { color: 'info.main', borderColor: 'info.main' },
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            '&:hover': { color: 'warning.main', borderColor: 'warning.main' },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            '&:hover': { color: 'error.main', borderColor: 'error.main' },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              px: 3,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing 5 of 2,450 users
            </Typography>
            <Button
              variant="outlined"
              size="small"
              endIcon={<ArrowIcon />}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              View All Users
            </Button>
          </Box>
        </>
      )}

      {/* Placeholder for other tabs */}
      {tabValue === 1 && (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>Courses Overview content coming soon...</Typography>
        </Box>
      )}
      {tabValue === 2 && (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>Recent Enrollments content coming soon...</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default UsersCoursesTable;
