import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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

} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { organizationApi } from '../../services/organization.services';



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

import KPICard from '../../components/superadmin/KPICard';

const AllOrganizationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: organizationsData } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationApi.getAll({ limit: 100 }),
  });

  const organizations = organizationsData?.data || [];

  const organizationsMapped = organizations.map((org) => ({
    id: String(org.id),
    name: org.name,
    initials: org.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    bgColor: 'linear-gradient(135deg, #ffb74d, #ffa424)',
    plan: 'Standard',
    users: '0',
    courses: org.courses_count || 0,
    revenue: '$0',
    status: org.is_active ? 'active' : 'pending' as const,
    created: org.created_at ? new Date(org.created_at).toLocaleDateString() : '',
  }));

  const filteredOrganizations = organizationsMapped.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrgs = organizationsMapped.length;
  const activeOrgs = organizationsMapped.filter(o => o.status === 'active').length;
  const pendingOrgs = organizationsMapped.filter(o => o.status === 'pending').length;

  const kpiCards = [
    {
      title: 'Total Organizations',
      value: String(totalOrgs),
      icon: <OrganizationsIcon />,
      bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20'
    },
    {
      title: 'Active',
      value: String(activeOrgs),
      icon: <ActiveIcon />,
      bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#3f3f46', labelColor: '#27272a'
    },
    {
      title: 'Pending Approval',
      value: String(pendingOrgs),
      icon: <PendingIcon />,
      bgColor: '#fff3e0', badgeColor: '#ffb74d', valueColor: '#e65100', labelColor: '#bf360c'
    },
    {
      title: 'Suspended',
      value: '0',
      icon: <SuspendedIcon />,
      bgColor: '#fafafa', badgeColor: '#71717a', valueColor: '#3f3f46', labelColor: '#27272a'
    },
  ];

  return (
    <SuperadminLayout title="All Organizations" subtitle="Manage organizations on the platform">
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
        {kpiCards.map((kpi, index) => (
          <Grid key={kpi.title} size={{ xs: 12, sm: 6, lg: 3 }}>
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

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
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
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/superadmin/organizations/add')}
            sx={{ textTransform: 'none' }}
          >
            Add Organization
          </Button>
        </Box>

        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Organization</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Users</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Courses</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Revenue</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrganizations.map((org) => (
                <TableRow
                  key={org.id}
                  sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' }, '&:last-child td': { borderBottom: 0 } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          background: org.bgColor,
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        {org.initials}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {org.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{org.plan}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{org.users}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{org.courses}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{org.revenue}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                      size="small"
                      sx={{
                        ...getStatusColor(org.status),
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{org.created}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <IconButton
                        size="small"
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': { color: 'primary.main', borderColor: 'primary.main' },
                        }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
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

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Showing 1-8 of 142
          </Typography>
        </Box>
      </Paper>
    </SuperadminLayout>
  );
};

export default AllOrganizationsPage;
