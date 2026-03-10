import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Block as SuspendIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/manager/Sidebar';
import TopBar from '../components/manager/TopBar';

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

// ── Mock Users ──
const mockUsers = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah.mitchell@acmecorp.com', initials: 'SM', role: 'Manager', status: 'Active', joined: 'Jan 12, 2025', lastActive: '2 hours ago' },
  { id: 2, name: 'James Rodriguez', email: 'james.rodriguez@acmecorp.com', initials: 'JR', role: 'Instructor', status: 'Active', joined: 'Feb 8, 2025', lastActive: '1 hour ago' },
  { id: 3, name: 'Emily Chen', email: 'emily.chen@acmecorp.com', initials: 'EC', role: 'Learner', status: 'Active', joined: 'Mar 15, 2025', lastActive: '30 minutes ago' },
  { id: 4, name: 'Michael Thompson', email: 'michael.t@acmecorp.com', initials: 'MT', role: 'Learner', status: 'Suspended', joined: 'Apr 2, 2025', lastActive: '3 days ago' },
  { id: 5, name: 'Priya Sharma', email: 'priya.sharma@acmecorp.com', initials: 'PS', role: 'Instructor', status: 'Active', joined: 'Jan 28, 2025', lastActive: '5 hours ago' },
  { id: 6, name: 'David Kim', email: 'david.kim@acmecorp.com', initials: 'DK', role: 'Learner', status: 'Active', joined: 'May 10, 2025', lastActive: '1 day ago' },
  { id: 7, name: 'Laura Bennett', email: 'laura.bennett@acmecorp.com', initials: 'LB', role: 'Learner', status: 'Suspended', joined: 'Jun 3, 2025', lastActive: '1 week ago' },
  { id: 8, name: 'Alex Okafor', email: 'alex.okafor@acmecorp.com', initials: 'AO', role: 'Manager', status: 'Active', joined: 'Dec 19, 2024', lastActive: '15 minutes ago' },
];

const roleColors: Record<string, { bg: string; color: string }> = {
  Manager: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
  Instructor: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  Learner: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
};

const ManagerUsersPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchStatus && matchRole;
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
              <PeopleIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                All Users
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage organization users and access
              </Typography>
            </Box>
          </Box>

          {/* Filters */}
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box sx={{ p: 2, px: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: 240, flex: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  label="Role"
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Learner">Learner</MenuItem>
                  <MenuItem value="Instructor">Instructor</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* Users Table */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>Users</Typography>
              <Typography variant="body2" color="text.secondary">
                {filtered.length} users total
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>Joined</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>Last Active</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{ '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' }, '&:last-child td': { borderBottom: 0 } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              background: 'linear-gradient(135deg, #ffa424, #f97316)',
                            }}
                          >
                            {user.initials}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
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
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: roleColors[user.role]?.bg,
                            color: roleColors[user.role]?.color,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: user.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                            color: user.status === 'Active' ? '#10b981' : '#ef4444',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.joined}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.lastActive}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit user">
                          <IconButton size="small" sx={{ color: 'text.secondary' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={user.status === 'Active' ? 'Suspend user' : 'Reactivate user'}>
                          <IconButton size="small" sx={{ color: user.status === 'Active' ? 'text.secondary' : '#ef4444' }}>
                            <SuspendIcon fontSize="small" />
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

export default ManagerUsersPage;
