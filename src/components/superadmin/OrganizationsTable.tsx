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
    bgColor: 'linear-gradient(135deg, #a1a1aa, #71717a)',
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
    bgColor: 'linear-gradient(135deg, #3f3f46, #71717a)',
    users: '1,234',
    courses: 34,
    revenue: '$28,430',
    status: 'suspended',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return { bgcolor: 'rgba(16, 185, 129, 0.08)', color: '#10b981', accent: '#10b981' };
    case 'pending':
      return { bgcolor: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b', accent: '#f59e0b' };
    case 'suspended':
      return { bgcolor: 'rgba(156, 163, 175, 0.08)', color: '#71717a', accent: '#71717a' };
    default:
      return { bgcolor: 'grey.100', color: 'text.secondary', accent: '#71717a' };
  }
};

const OrganizationsTable: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        transition: 'box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        },
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
        <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.95rem' }}>
          Top Organizations
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ViewIcon sx={{ fontSize: 14 }} />}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderColor: 'rgba(0,0,0,0.08)',
              color: 'text.secondary',
              borderRadius: 2,
              '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
            }}
          >
            View All
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 14 }} />}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' },
            }}
          >
            Add New
          </Button>
        </Box>
      </Box>

      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Organization', 'Users', 'Courses', 'Revenue', 'Status', ''].map((h, i) => (
                <TableCell
                  key={h || 'actions'}
                  align={i === 5 ? 'right' : 'left'}
                  sx={{
                    fontWeight: 600,
                    color: 'text.disabled',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                    py: 1.5,
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {organizations.map((org) => {
              const statusStyle = getStatusColor(org.status);
              return (
                <TableRow
                  key={org.id}
                  className="sa-table-row"
                  sx={{
                    transition: 'background 0.2s cubic-bezier(0.4,0,0.2,1)',
                    '& td': { borderBottom: 'none' },
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' },
                    '&:hover td': { borderBottom: 'none' },
                  }}
                >
                  <TableCell sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          background: org.bgColor,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }}
                      >
                        {org.initials}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 500, fontSize: '0.82rem' }}>
                          {org.name}
                        </Typography>
                        <Typography sx={{ color: 'text.disabled', fontSize: '0.72rem' }}>
                          {org.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.82rem', color: 'text.secondary', fontWeight: 400 }}>{org.users}</TableCell>
                  <TableCell sx={{ fontSize: '0.82rem', color: 'text.secondary', fontWeight: 400 }}>{org.courses}</TableCell>
                  <TableCell sx={{ fontSize: '0.82rem', fontWeight: 500 }}>{org.revenue}</TableCell>
                  <TableCell>
                    <Chip
                      label={org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: statusStyle.bgcolor,
                        color: statusStyle.color,
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        height: 24,
                        borderLeft: `3px solid ${statusStyle.accent}`,
                        borderRadius: 1.5,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box className="sa-row-actions" sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <IconButton
                        size="small"
                        sx={{
                          color: 'text.disabled',
                          transition: 'color 0.2s',
                          '&:hover': { color: 'info.main' },
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          color: 'text.disabled',
                          transition: 'color 0.2s',
                          '&:hover': { color: 'error.main' },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrganizationsTable;
