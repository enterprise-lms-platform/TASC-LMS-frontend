import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Business as OrganizationsIcon,
  CheckCircle as ActiveIcon,
  HourglassEmpty as PendingIcon,
  Block as SuspendedIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { organizationApi } from '../../services/organization.services';
import { exportApi } from '../../services/superadmin.services';
import type { Organization } from '../../types/types';

import KPICard from '../../components/superadmin/KPICard';

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

interface MappedOrg {
  id: number;
  name: string;
  initials: string;
  bgColor: string;
  plan: string;
  subscriptionStatus: string | null;
  subscriptionEndDate: string | null;
  users: string;
  courses: number;
  revenue: string;
  status: string;
  created: string;
}

const AllOrganizationsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [editOrg, setEditOrg] = useState<MappedOrg | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteOrgId, setDeleteOrgId] = useState<number | null>(null);
  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({ open: false, msg: '', severity: 'success' });

  const { data: organizationsData } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationApi.getAll({ limit: 100 }).then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Organization> }) => organizationApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setEditOrg(null);
      setSnack({ open: true, msg: 'Organization updated', severity: 'success' });
    },
    onError: () => setSnack({ open: true, msg: 'Failed to update organization', severity: 'error' }),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => organizationApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setDeleteOrgId(null);
      setSnack({ open: true, msg: 'Organization deactivated', severity: 'success' });
    },
    onError: () => setSnack({ open: true, msg: 'Failed to deactivate organization', severity: 'error' }),
  });

  const raw = organizationsData;
  const organizations = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && 'results' in raw
      ? (raw as unknown as { results: typeof raw }).results
      : [];

  const organizationsMapped: MappedOrg[] = organizations.map((org) => ({
    id: org.id,
    name: org.name,
    initials: org.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
    bgColor: 'linear-gradient(135deg, #ffb74d, #ffa424)',
    plan: '—',
    subscriptionStatus: org.subscription_status || null,
    subscriptionEndDate: org.subscription_end_date || null,
    users: String(org.users_count || 0),
    courses: org.courses_count || 0,
    revenue: '$0',
    status: org.is_active ? 'active' : 'pending',
    created: org.created_at ? new Date(org.created_at).toLocaleDateString() : '',
  }));

  const filteredOrganizations = organizationsMapped.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrgs = organizationsMapped.length;
  const activeOrgs = organizationsMapped.filter((o) => o.status === 'active').length;
  const pendingOrgs = organizationsMapped.filter((o) => o.status === 'pending').length;

  const kpiCards = [
    { title: 'Total Organizations', value: String(totalOrgs), icon: <OrganizationsIcon />, bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20' },
    { title: 'Active', value: String(activeOrgs), icon: <ActiveIcon />, bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#3f3f46', labelColor: '#27272a' },
    { title: 'Pending Approval', value: String(pendingOrgs), icon: <PendingIcon />, bgColor: '#fff3e0', badgeColor: '#ffb74d', valueColor: '#e65100', labelColor: '#bf360c' },
    { title: 'Suspended', value: '0', icon: <SuspendedIcon />, bgColor: '#fafafa', badgeColor: '#71717a', valueColor: '#3f3f46', labelColor: '#27272a' },
  ];

  const handleEditOpen = (org: MappedOrg) => {
    setEditOrg(org);
    setEditName(org.name);
  };

  const handleEditSave = () => {
    if (!editOrg) return;
    updateMutation.mutate({ id: editOrg.id, data: { name: editName } });
  };

  return (
    <SuperadminLayout title="All Organizations" subtitle="Manage organizations on the platform">
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
        {kpiCards.map((kpi, index) => (
          <Grid key={kpi.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              bgColor={kpi.bgColor}
              badgeColor={kpi.badgeColor}
              valueColor={kpi.valueColor}
              labelColor={kpi.labelColor}
              index={index}
            />
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
            <TextField
              size="small"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" color="secondary" startIcon={<DownloadIcon />} onClick={() => exportApi.organizations()} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Export CSV
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/superadmin/organizations/add')} sx={{ textTransform: 'none' }}>
              Add Organization
            </Button>
          </Box>
        </Box>

        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                {['Organization', 'Plan', 'Subscription', 'Users', 'Courses', 'Revenue', 'Status', 'Created', ''].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrganizations.map((org) => (
                <TableRow key={org.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' }, '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 36, height: 36, background: org.bgColor, fontSize: '0.8rem', fontWeight: 600 }}>
                        {org.initials}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{org.name}</Typography>
                    </Box>
                  </TableCell>
                    <TableCell><Typography variant="body2">{org.plan}</Typography></TableCell>
                    <TableCell>
                      {org.subscriptionStatus ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Chip
                            label={org.subscriptionStatus}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              fontSize: '0.7rem',
                              bgcolor: org.subscriptionStatus === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                              color: org.subscriptionStatus === 'active' ? '#10b981' : '#ef4444',
                              width: 'fit-content',
                            }}
                          />
                          {org.subscriptionEndDate && (
                            <Typography variant="caption" color="text.secondary">
                              Exp: {new Date(org.subscriptionEndDate).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">None</Typography>
                      )}
                    </TableCell>
                  <TableCell><Typography variant="body2">{org.users}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{org.courses}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{org.revenue}</Typography></TableCell>
                  <TableCell>
                    <Chip
                      label={org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                      size="small"
                      sx={{ ...getStatusColor(org.status), fontWeight: 500, fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  <TableCell><Typography variant="body2" sx={{ color: 'text.secondary' }}>{org.created}</Typography></TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <IconButton size="small" disabled title="Organization detail view coming soon" sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" title="Edit organization" onClick={() => handleEditOpen(org)} sx={{ border: '1px solid', borderColor: 'divider', '&:hover': { color: 'info.main', borderColor: 'info.main' } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" title="Deactivate organization" onClick={() => setDeleteOrgId(org.id)} sx={{ border: '1px solid', borderColor: 'divider', '&:hover': { color: 'error.main', borderColor: 'error.main' } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrganizations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>No organizations found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Showing {filteredOrganizations.length} of {organizationsMapped.length} organizations
          </Typography>
        </Box>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={!!editOrg} onClose={() => setEditOrg(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Organization</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Organization Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            sx={{ mt: 1 }}
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOrg(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEditSave}
            disabled={updateMutation.isPending || !editName.trim()}
            startIcon={updateMutation.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{ textTransform: 'none' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteOrgId !== null} onClose={() => setDeleteOrgId(null)}>
        <DialogTitle>Deactivate Organization</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will deactivate the organization and restrict access for its users. This action can be reversed by reactivating the organization.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteOrgId(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteOrgId !== null && deactivateMutation.mutate(deleteOrgId)}
            disabled={deactivateMutation.isPending}
            startIcon={deactivateMutation.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{ textTransform: 'none' }}
          >
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })} sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </SuperadminLayout>
  );
};

export default AllOrganizationsPage;
