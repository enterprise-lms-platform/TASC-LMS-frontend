import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
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
import { usersApi, userStatsApi } from '../../services/users.services';
import type { UserUpdateRequest } from '../../services/users.services';
import { exportApi, bulkImportApi } from '../../services/superadmin.services';

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
      return { bgcolor: 'rgba(255, 164, 36, 0.1)', color: '#e65100' };
    case 'Instructor':
      return { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    case 'Learner':
      return { bgcolor: 'rgba(113, 113, 122, 0.1)', color: '#71717a' };
    case 'Manager':
      return { bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    case 'Finance':
      return { bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#166534' };
    default:
      return { bgcolor: 'grey.100', color: 'text.secondary' };
  }
};

const AllUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const csvInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Edit dialog state
  const [editUser, setEditUser] = useState<{ id: number; role: string; is_active: boolean } | null>(null);
  const [editForm, setEditForm] = useState<{ role: string; is_active: boolean }>({ role: '', is_active: true });

  // Delete confirmation state
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const { data: usersData } = useQuery({
    queryKey: ['users', roleFilter, statusFilter, searchQuery],
    queryFn: () => usersApi.getAll({
      role: roleFilter === 'All' ? undefined : roleFilter.toLowerCase(),
      is_active: statusFilter === 'Active' ? true : statusFilter === 'Suspended' ? false : undefined,
      search: searchQuery || undefined,
      page_size: 100,
    }),
  });

  const { data: statsData } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => userStatsApi.getStats(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdateRequest }) => usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditUser(null);
      setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to update user', severity: 'error' });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => usersApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      setDeleteUserId(null);
      setSnackbar({ open: true, message: 'User suspended successfully', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to suspend user', severity: 'error' });
    },
  });

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await bulkImportApi.uploadCSV(file);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSnackbar({
        open: true,
        message: `Import complete: ${result.imported} imported, ${result.failed} failed`,
        severity: result.failed > 0 ? 'error' : 'success',
      });
    } catch {
      setSnackbar({ open: true, message: 'CSV upload failed', severity: 'error' });
    } finally {
      if (csvInputRef.current) csvInputRef.current.value = '';
    }
  };

  const apiStats = statsData?.data;
  const users = usersData?.data?.results || [];

  const usersMapped = users.map((user) => ({
    id: user.id,
    name: user.name || `${user.first_name} ${user.last_name}`.trim(),
    email: user.email,
    role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
    rawRole: user.role,
    organization: '-',
    status: user.is_active ? 'active' : 'suspended' as const,
    lastLogin: user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never',
    avatarColor: '#ffa424',
    is_active: user.is_active,
  }));

  const totalUsers = apiStats?.total ?? usersMapped.length;
  const activeUsers = apiStats?.active ?? usersMapped.filter(u => u.status === 'active').length;

  const kpiStats = [
    {
      title: 'Total Users',
      value: String(totalUsers),
      icon: <UsersIcon />,
      bgColor: '#fff3e0', badgeColor: '#ffa424', valueColor: '#e65100', labelColor: '#9a3412'
    },
    {
      title: 'Active Users',
      value: String(activeUsers),
      icon: <UsersIcon />,
      bgColor: '#dcfce7', badgeColor: '#4ade80', valueColor: '#14532d', labelColor: '#166534'
    },
    {
      title: 'New This Month',
      value: apiStats ? String(apiStats.new_this_month) : '...',
      icon: <PersonAddIcon />,
      bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#27272a', labelColor: '#3f3f46'
    },
    {
      title: 'Suspended',
      value: String(totalUsers - activeUsers),
      icon: <BlockIcon />,
      bgColor: '#f1f8e9', badgeColor: '#aed581', valueColor: '#558b2f', labelColor: '#33691e'
    },
  ];

  return (
    <SuperadminLayout title="All Users" subtitle="Manage users across all organizations">
      {/* Hidden CSV file input */}
      <input
        ref={csvInputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleCsvUpload}
      />

      {/* KPI Stat Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
        {kpiStats.map((stat, index) => (
          <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 3 }}>
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
              onClick={() => navigate('/superadmin/add-user')}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Add User
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => csvInputRef.current?.click()}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Bulk Import
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<DownloadIcon />}
              onClick={() => exportApi.users()}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Export CSV
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
              {usersMapped.map((user) => (
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
                        onClick={() => {
                          setEditUser({ id: user.id, role: user.rawRole, is_active: user.is_active });
                          setEditForm({ role: user.rawRole, is_active: user.is_active });
                        }}
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
                        onClick={() => setDeleteUserId(user.id)}
                        disabled={!user.is_active}
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
              background: 'linear-gradient(135deg, #ffa424, #ffb74d)',
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
              onClick={() => bulkImportApi.downloadTemplate()}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Download CSV Template
            </Button>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => csvInputRef.current?.click()}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Upload CSV
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onClose={() => setEditUser(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit User</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            select
            fullWidth
            label="Role"
            value={editForm.role}
            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          >
            {['learner', 'instructor', 'lms_manager', 'finance', 'tasc_admin'].map((r) => (
              <MenuItem key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1).replace('_', ' ')}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Status"
            value={editForm.is_active ? 'active' : 'suspended'}
            onChange={(e) => setEditForm({ ...editForm, is_active: e.target.value === 'active' })}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditUser(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained"
            disabled={updateMutation.isPending}
            onClick={() => {
              if (!editUser) return;
              updateMutation.mutate({ id: editUser.id, data: { role: editForm.role, is_active: editForm.is_active } });
            }}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {updateMutation.isPending ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Suspend Confirmation Dialog */}
      <Dialog open={deleteUserId !== null} onClose={() => setDeleteUserId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Suspend User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to suspend this user? They will no longer be able to log in.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteUserId(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={deactivateMutation.isPending}
            onClick={() => {
              if (deleteUserId !== null) deactivateMutation.mutate(deleteUserId);
            }}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {deactivateMutation.isPending ? <CircularProgress size={20} /> : 'Suspend'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SuperadminLayout>
  );
};

export default AllUsersPage;
