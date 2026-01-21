import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface Organization {
  id: string;
  name: string;
  email: string;
  initials: string;
  bgColor: string;
  users: string;
  courses: number;
  revenue: string;
  status: 'active' | 'pending' | 'suspended';
}

const organizations: Organization[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'acme@example.com',
    initials: 'AC',
    bgColor: 'linear-gradient(135deg, #ffb74d, #f97316)',
    users: '2,450',
    courses: 67,
    revenue: '$42,580',
    status: 'active',
  },
  {
    id: '2',
    name: 'Global Tech Inc',
    email: 'global@example.com',
    initials: 'GT',
    bgColor: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    users: '1,890',
    courses: 42,
    revenue: '$38,920',
    status: 'active',
  },
  {
    id: '3',
    name: 'Innovate Solutions',
    email: 'innovate@example.com',
    initials: 'IS',
    bgColor: 'linear-gradient(135deg, #10b981, #34d399)',
    users: '956',
    courses: 28,
    revenue: '$24,150',
    status: 'active',
  },
  {
    id: '4',
    name: 'Future Dynamics',
    email: 'future@example.com',
    initials: 'FD',
    bgColor: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    users: '543',
    courses: 15,
    revenue: '$12,870',
    status: 'pending',
  },
  {
    id: '5',
    name: 'NextGen Partners',
    email: 'nextgen@example.com',
    initials: 'NP',
    bgColor: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    users: '1,234',
    courses: 34,
    revenue: '$28,430',
    status: 'suspended',
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

const OrganizationsTable: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Top Organizations
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ViewIcon />}
            sx={{ textTransform: 'none' }}
          >
            View All
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none' }}
          >
            Add New
          </Button>
        </Box>
      </Box>

      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Organization</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Users</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Courses</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Revenue</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizations.map((org) => (
              <TableRow
                key={org.id}
                sx={{ '&:hover': { bgcolor: 'grey.50' }, '&:last-child td': { borderBottom: 0 } }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: org.bgColor,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {org.initials}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {org.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {org.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{org.users}</TableCell>
                <TableCell>{org.courses}</TableCell>
                <TableCell>{org.revenue}</TableCell>
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
  );
};

export default OrganizationsTable;
