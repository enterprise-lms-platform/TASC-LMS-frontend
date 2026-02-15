import React, { useState } from 'react';
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
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

interface Organization {
  id: string;
  name: string;
  initials: string;
  bgColor: string;
  plan: string;
  users: string;
  courses: number;
  revenue: string;
  status: 'active' | 'pending' | 'suspended';
  created: string;
}

const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    initials: 'AC',
    bgColor: 'linear-gradient(135deg, #ffb74d, #ffa424)',
    plan: 'Enterprise',
    users: '2,450',
    courses: 67,
    revenue: '$42,580',
    status: 'active',
    created: 'Jan 15, 2025',
  },
  {
    id: '2',
    name: 'Global Tech Inc',
    initials: 'GT',
    bgColor: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    plan: 'Enterprise',
    users: '1,890',
    courses: 42,
    revenue: '$38,920',
    status: 'active',
    created: 'Feb 03, 2025',
  },
  {
    id: '3',
    name: 'Innovate Solutions',
    initials: 'IS',
    bgColor: 'linear-gradient(135deg, #10b981, #34d399)',
    plan: 'Professional',
    users: '956',
    courses: 28,
    revenue: '$24,150',
    status: 'active',
    created: 'Mar 12, 2025',
  },
  {
    id: '4',
    name: 'Future Dynamics',
    initials: 'FD',
    bgColor: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    plan: 'Professional',
    users: '543',
    courses: 15,
    revenue: '$12,870',
    status: 'pending',
    created: 'Apr 20, 2025',
  },
  {
    id: '5',
    name: 'NextGen Partners',
    initials: 'NP',
    bgColor: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    plan: 'Enterprise',
    users: '1,234',
    courses: 34,
    revenue: '$28,430',
    status: 'active',
    created: 'May 08, 2025',
  },
  {
    id: '6',
    name: 'Apex Learning Co',
    initials: 'AL',
    bgColor: 'linear-gradient(135deg, #ef4444, #f87171)',
    plan: 'Starter',
    users: '312',
    courses: 9,
    revenue: '$6,540',
    status: 'suspended',
    created: 'Jun 14, 2025',
  },
  {
    id: '7',
    name: 'Stellar Education',
    initials: 'SE',
    bgColor: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
    plan: 'Professional',
    users: '728',
    courses: 21,
    revenue: '$18,320',
    status: 'active',
    created: 'Jul 22, 2025',
  },
  {
    id: '8',
    name: 'Bright Horizons Ltd',
    initials: 'BH',
    bgColor: 'linear-gradient(135deg, #ec4899, #f472b6)',
    plan: 'Starter',
    users: '195',
    courses: 7,
    revenue: '$4,210',
    status: 'pending',
    created: 'Aug 30, 2025',
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

const kpiCards = [
  {
    title: 'Total Organizations',
    value: '142',
    trend: { direction: 'up' as const, value: '+8.2%', period: 'from last month' },
    icon: <OrganizationsIcon />,
    iconBgColor: 'linear-gradient(135deg, #ffb74d, #ffa424)',
  },
  {
    title: 'Active',
    value: '128',
    trend: { direction: 'up' as const, value: '+5.1%', period: 'from last month' },
    icon: <ActiveIcon />,
    iconBgColor: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  {
    title: 'Pending Approval',
    value: '8',
    trend: { direction: 'down' as const, value: '-2.3%', period: 'from last month' },
    icon: <PendingIcon />,
    iconBgColor: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
  },
  {
    title: 'Suspended',
    value: '6',
    trend: { direction: 'down' as const, value: '-1.5%', period: 'from last month' },
    icon: <SuspendedIcon />,
    iconBgColor: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
  },
];

const AllOrganizationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrganizations = mockOrganizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <SuperadminLayout title="All Organizations" subtitle="Manage organizations on the platform">
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
        {kpiCards.map((kpi) => (
          <Grid key={kpi.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {kpi.title}
                </Typography>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    background: kpi.iconBgColor,
                  }}
                >
                  {kpi.icon}
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                {kpi.value}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: kpi.trend.direction === 'up' ? 'success.main' : 'error.main',
                }}
              >
                {kpi.trend.direction === 'up' ? (
                  <TrendingUpIcon sx={{ fontSize: 18 }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 18 }} />
                )}
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {kpi.trend.value} {kpi.trend.period}
                </Typography>
              </Box>
            </Paper>
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
