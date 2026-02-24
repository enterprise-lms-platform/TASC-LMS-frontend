import React from 'react';
import {
  Box, Paper, Typography, Button, Avatar, Chip, IconButton,
} from '@mui/material';
import {
  Visibility as ViewIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
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
  { id: '1', name: 'Acme Corporation', email: 'acme@example.com', initials: 'AC', bgColor: 'linear-gradient(135deg, #ffb74d, #f97316)', users: '2,450', courses: 67, revenue: '$42,580', status: 'active' },
  { id: '2', name: 'Global Tech Inc', email: 'global@example.com', initials: 'GT', bgColor: 'linear-gradient(135deg, #a1a1aa, #71717a)', users: '1,890', courses: 42, revenue: '$38,920', status: 'active' },
  { id: '3', name: 'Innovate Solutions', email: 'innovate@example.com', initials: 'IS', bgColor: 'linear-gradient(135deg, #10b981, #34d399)', users: '956', courses: 28, revenue: '$24,150', status: 'active' },
  { id: '4', name: 'Future Dynamics', email: 'future@example.com', initials: 'FD', bgColor: 'linear-gradient(135deg, #f59e0b, #fbbf24)', users: '543', courses: 15, revenue: '$12,870', status: 'pending' },
  { id: '5', name: 'NextGen Partners', email: 'nextgen@example.com', initials: 'NP', bgColor: 'linear-gradient(135deg, #3f3f46, #71717a)', users: '1,234', courses: 34, revenue: '$28,430', status: 'suspended' },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  active: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  suspended: { bg: 'rgba(156, 163, 175, 0.1)', color: '#71717a' },
};

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const OrganizationsTable: React.FC = () => {
  return (
    <Paper elevation={0} sx={cardSx}>
      {/* Header */}
      <Box sx={{
        p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1,
      }}>
        <Typography fontWeight={700}>Top Organizations</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined" startIcon={<ViewIcon sx={{ fontSize: 14 }} />}
            sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 500, borderColor: 'rgba(0,0,0,0.08)', color: 'text.secondary', borderRadius: 2, '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
            View All
          </Button>
          <Button size="small" variant="contained" startIcon={<AddIcon sx={{ fontSize: 14 }} />}
            sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 500, borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
            Add New
          </Button>
        </Box>
      </Box>

      {/* Row-based list */}
      {organizations.map((org, i) => {
        const status = statusColors[org.status] || statusColors.active;
        return (
          <Box
            key={org.id}
            sx={{
              display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
              borderBottom: i < organizations.length - 1 ? 1 : 0, borderColor: 'divider',
              '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
            }}
          >
            <Avatar sx={{ width: 36, height: 36, background: org.bgColor, fontSize: '0.7rem', fontWeight: 600 }}>
              {org.initials}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>{org.name}</Typography>
              <Typography variant="caption" color="text.secondary">{org.email}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' }, minWidth: 60 }}>
              <Typography variant="body2" fontWeight={700}>{org.users}</Typography>
              <Typography variant="caption" color="text.secondary">Users</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' }, minWidth: 50 }}>
              <Typography variant="body2" fontWeight={700}>{org.courses}</Typography>
              <Typography variant="caption" color="text.secondary">Courses</Typography>
            </Box>
            <Box sx={{ textAlign: 'right', minWidth: 70 }}>
              <Typography variant="body2" fontWeight={700} color="primary.main">{org.revenue}</Typography>
            </Box>
            <Chip label={org.status.charAt(0).toUpperCase() + org.status.slice(1)} size="small" sx={{
              height: 22, fontSize: '0.7rem', fontWeight: 600,
              bgcolor: status.bg, color: status.color,
            }} />
            <Box sx={{ display: 'flex', gap: 0.25 }}>
              <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'info.main' } }}>
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        );
      })}
    </Paper>
  );
};

export default OrganizationsTable;
