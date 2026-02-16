import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Grid,
} from '@mui/material';
import {
  People as UsersIcon,
  PersonAdd as PersonAddIcon,
  Block as BlockIcon,

  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import KPICard from '../../components/superadmin/KPICard';

const kpiStats = [
  {
    title: 'Total Users',
    value: '24,587',
    icon: <UsersIcon />,
    // Soft Coral Theme
    bgColor: '#fbe9e7', badgeColor: '#ff8a65', valueColor: '#bf360c', labelColor: '#d84315'
  },
  {
    title: 'Active Users',
    value: '21,340',
    icon: <UsersIcon />,
    // Pale Indigo Theme
    bgColor: '#e8eaf6', badgeColor: '#7986cb', valueColor: '#283593', labelColor: '#303f9f'
  },
  {
    title: 'New This Month',
    value: '1,247',
    icon: <PersonAddIcon />,
    // Light Cyan Theme
    bgColor: '#e0f7fa', badgeColor: '#4dd0e1', valueColor: '#00838f', labelColor: '#006064'
  },
  {
    title: 'Suspended',
    value: '89',
    icon: <BlockIcon />,
    // Soft Lime Theme
    bgColor: '#f1f8e9', badgeColor: '#aed581', valueColor: '#558b2f', labelColor: '#33691e'
  },
];

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  status: 'active' | 'suspended' | 'pending';
  lastLogin: string;
  avatarColor: string;
}

const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'John Kamau',
    email: 'john.kamau@acmecorp.com',
    role: 'Admin',
    organization: 'Acme Corporation',
    status: 'active',
    lastLogin: '2026-02-15 09:32',
    avatarColor: '#3b82f6',
  },
  {
    id: '2',
    name: 'Mary Wambui',
    email: 'mary.wambui@globaltech.com',
    role: 'Instructor',
    organization: 'Global Tech Inc',
    status: 'active',
    lastLogin: '2026-02-15 08:15',
    avatarColor: '#10b981',
  },
  {
    id: '3',
    name: 'Peter Ochieng',
    email: 'peter.ochieng@innovate.com',
    role: 'Learner',
    organization: 'Innovate Solutions',
    status: 'active',
    lastLogin: '2026-02-14 17:45',
    avatarColor: '#f59e0b',
  },
  {
    id: '4',
    name: 'Grace Akinyi',
    email: 'grace.akinyi@futuredyn.com',
    role: 'Manager',
    organization: 'Future Dynamics',
    status: 'pending',
    lastLogin: 'Never',
    avatarColor: '#8b5cf6',
  },
  {
    id: '5',
    name: 'David Mwangi',
    email: 'david.mwangi@acmecorp.com',
    role: 'Learner',
    organization: 'Acme Corporation',
    status: 'active',
    lastLogin: '2026-02-14 14:22',
    avatarColor: '#ef4444',
  },
  {
    id: '6',
    name: 'Sarah Nakamura',
    email: 'sarah.nakamura@globaltech.com',
    role: 'Finance',
    organization: 'Global Tech Inc',
    status: 'active',
    lastLogin: '2026-02-15 10:05',
    avatarColor: '#ec4899',
  },
  {
    id: '7',
    name: 'James Otieno',
    email: 'james.otieno@nextgen.com',
    role: 'Instructor',
    organization: 'NextGen Partners',
    status: 'suspended',
    lastLogin: '2026-01-28 11:30',
    avatarColor: '#6366f1',
  },
  {
    id: '8',
    name: 'Faith Muthoni',
    email: 'faith.muthoni@innovate.com',
    role: 'Admin',
    organization: 'Innovate Solutions',
    status: 'active',
    lastLogin: '2026-02-15 07:50',
    avatarColor: '#14b8a6',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    case 'pending':
      return { bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    case 'suspended':
      return { bgcolor: 'rgba(156, 163, 175, 0.1)', color: '#71717a' };
    default:
      return { bgcolor: 'grey.100', color: 'text.secondary' };
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Admin':
      return { bgcolor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' };
    case 'Instructor':
      return { bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
    case 'Learner':
      return { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    case 'Manager':
      return { bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    case 'Finance':
      return { bgcolor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' };
    default:
      return { bgcolor: 'grey.100', color: 'text.secondary' };
  }
};

const AllUsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  return (
    <SuperadminLayout title="All Users" subtitle="Manage users across all organizations">
      {/* KPI Stat Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
        {kpiStats.map((stat, index) => (
          <Grid key={stat.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <KPICard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              bgColor={stat.bgColor}
              badgeColor={stat.badgeColor}
              valueColor={stat.valueColor}
              labelColor={stat.labelColor}
              index={index}
            />
          </Grid>
        ))}
      </Grid>

      {/* Users Table */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          mb: 4,
        }}
      >
        {/* Header Row with Filters */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
            <TextField
              size="small"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
              sx={{ minWidth: 220 }}
            />
            <TextField
              size="small"
              select
              label="Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              {['All', 'Learner', 'Instructor', 'Manager', 'Admin', 'Finance'].map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              {['All', 'Active', 'Suspended', 'Pending'].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Add User
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Bulk Import
            </Button>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Organization</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Last Login</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' }, '&:last-child td': { borderBottom: 0 } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: user.avatarColor,
                          fontSize: '0.85rem',
                          fontWeight: 600,
                        }}
                      >
                        {user.name.split(' ').map((n) => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
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
                        ...getRoleColor(user.role),
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.organization}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      size="small"
                      sx={{
                        ...getStatusColor(user.status),
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {user.lastLogin}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <IconButton
                        size="small"
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': { color: 'info.main', borderColor: 'info.main' },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          border: '1px solid',
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
      </Paper>

      {/* Bulk Import Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
              flexShrink: 0,
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}>
              Bulk Import Users
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Upload a CSV file to import multiple users at once. Download the template to ensure your file is formatted correctly.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Download CSV Template
            </Button>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Upload CSV
            </Button>
          </Box>
        </Box>
      </Paper>
    </SuperadminLayout>
  );
};

export default AllUsersPage;
