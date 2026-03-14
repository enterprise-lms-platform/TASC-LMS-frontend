import React, { useState, useMemo } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
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
  LinearProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Block as SuspendIcon,
  Check as ActivateIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { usersApi } from '../../services/users.services';
import type { UserListParams } from '../../services/users.services';

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

const roleColors: Record<string, { bg: string; color: string }> = {
  lms_manager: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
  org_admin: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
  instructor: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  learner: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  tasc_admin: { bg: 'rgba(255,164,36,0.1)', color: '#ffa424' },
};

const formatRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    lms_manager: 'Manager',
    org_admin: 'Org Admin',
    instructor: 'Instructor',
    learner: 'Learner',
    tasc_admin: 'TASC Admin',
  };
  return roleMap[role] || role;
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getRelativeTime = (dateStr: string): string => {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateStr);
};

const ManagerUsersPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  const queryClient = useQueryClient();

  const params = useMemo((): UserListParams => {
    const p: UserListParams = { page_size: 100 };
    if (search) p.search = search;
    if (statusFilter === 'Active') p.is_active = true;
    if (statusFilter === 'Suspended') p.is_active = false;
    if (roleFilter !== 'All') p.role = roleFilter.toLowerCase();
    return p;
  }, [search, statusFilter, roleFilter]);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getAll(params).then(r => r.data),
  });

  const users = usersData?.results ?? [];

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => usersApi.deactivate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) => usersApi.activate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const handleToggleStatus = (user: { id: number; is_active: boolean }) => {
    if (user.is_active) {
      deactivateMutation.mutate(user.id);
    } else {
      activateMutation.mutate(user.id);
    }
  };

  const getInitials = (name: string): string => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filtered = users.filter((u: any) => {
    const matchSearch =
      (u.name || u.email).toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || (statusFilter === 'Active' ? u.is_active : !u.is_active);
    const matchRole = roleFilter === 'All' || formatRole(u.role) === roleFilter;
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
          {isLoading && <LinearProgress sx={{ mb: 2 }} />}
          
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
                  {filtered.map((user: any) => {
                    const isActive = user.is_active;
                    return (
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
                            {user.avatar || user.google_picture ? (
                              <img src={user.avatar || user.google_picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            ) : (
                              getInitials(user.name || user.email)
                            )}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {user.name || user.email.split('@')[0]}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatRole(user.role)}
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
                          label={isActive ? 'Active' : 'Suspended'}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                            color: isActive ? '#10b981' : '#ef4444',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(user.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {getRelativeTime(user.last_login)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit user">
                          <IconButton size="small" sx={{ color: 'text.secondary' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={isActive ? 'Suspend user' : 'Reactivate user'}>
                          <IconButton 
                            size="small" 
                            sx={{ color: isActive ? 'text.secondary' : '#ef4444' }}
                            onClick={() => handleToggleStatus({ id: user.id, is_active: isActive })}
                            disabled={deactivateMutation.isPending || activateMutation.isPending}
                          >
                            {isActive ? <SuspendIcon fontSize="small" /> : <ActivateIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )})}
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
