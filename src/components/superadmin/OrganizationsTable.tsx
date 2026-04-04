import React from 'react';
import {
  Box, Paper, Typography, Button, Avatar, Chip, IconButton, Skeleton,
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { organizationApi } from '../../services/organization.services';
import type { PaginatedResponse } from '../../types/types';

interface OrgResult {
  id: number;
  name: string;
  email?: string;
  is_active?: boolean;
  user_count?: number;
  course_count?: number;
  revenue?: number | string;
}

const statusColors: Record<string, { bg: string; color: string }> = {
  active: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  suspended: { bg: 'rgba(156, 163, 175, 0.1)', color: '#71717a' },
};

const bgColors = [
  'linear-gradient(135deg, #ffb74d, #f97316)',
  'linear-gradient(135deg, #a1a1aa, #71717a)',
  'linear-gradient(135deg, #10b981, #34d399)',
  'linear-gradient(135deg, #f59e0b, #fbbf24)',
  'linear-gradient(135deg, #3f3f46, #71717a)',
];

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const OrganizationsTable: React.FC = () => {
  const navigate = useNavigate();

  const { data: orgsRaw, isLoading } = useQuery({
    queryKey: ['superadmin', 'organizations', 'top'],
    queryFn: () => organizationApi.getAll({ limit: 5 }).then(r => r.data),
  });

  const organizations: OrgResult[] = Array.isArray(orgsRaw)
    ? orgsRaw
    : (orgsRaw as PaginatedResponse<OrgResult> | undefined)?.results ?? [];

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
            onClick={() => navigate('/superadmin/organizations')}
            sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 500, borderColor: 'rgba(0,0,0,0.08)', color: 'text.secondary', borderRadius: 2, '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
            View All
          </Button>
          <Button size="small" variant="contained" startIcon={<AddIcon sx={{ fontSize: 14 }} />}
            onClick={() => navigate('/superadmin/organizations')}
            sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 500, borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
            Add New
          </Button>
        </Box>
      </Box>

      {/* Row-based list */}
      {isLoading ? (
        [0, 1, 2, 3, 4].map(i => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3, borderBottom: i < 4 ? 1 : 0, borderColor: 'divider' }}>
            <Skeleton variant="circular" width={36} height={36} />
            <Box sx={{ flex: 1 }}><Skeleton width="50%" /><Skeleton width="30%" /></Box>
            <Skeleton width={50} />
          </Box>
        ))
      ) : organizations.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">No organizations found</Typography>
        </Box>
      ) : (
        organizations.map((org, i) => {
          const initials = org.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
          const status = org.is_active === false ? 'suspended' : 'active';
          const sc = statusColors[status];

          return (
            <Box
              key={org.id}
              sx={{
                display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
                borderBottom: i < organizations.length - 1 ? 1 : 0, borderColor: 'divider',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
              }}
            >
              <Avatar sx={{ width: 36, height: 36, background: bgColors[i % bgColors.length], fontSize: '0.7rem', fontWeight: 600 }}>
                {initials}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>{org.name}</Typography>
                <Typography variant="caption" color="text.secondary">{org.email || ''}</Typography>
              </Box>
              {org.user_count != null && (
                <Box sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' }, minWidth: 60 }}>
                  <Typography variant="body2" fontWeight={700}>{org.user_count.toLocaleString()}</Typography>
                  <Typography variant="caption" color="text.secondary">Users</Typography>
                </Box>
              )}
              {org.course_count != null && (
                <Box sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' }, minWidth: 50 }}>
                  <Typography variant="body2" fontWeight={700}>{org.course_count}</Typography>
                  <Typography variant="caption" color="text.secondary">Courses</Typography>
                </Box>
              )}
              <Chip label={status.charAt(0).toUpperCase() + status.slice(1)} size="small" sx={{
                height: 22, fontSize: '0.7rem', fontWeight: 600,
                bgcolor: sc.bg, color: sc.color,
              }} />
              <Box sx={{ display: 'flex', gap: 0.25 }}>
                <IconButton size="small" onClick={() => navigate('/superadmin/organizations')}
                  sx={{ color: 'text.disabled', '&:hover': { color: 'info.main' } }} title="Manage organization">
                  <EditIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>
          );
        })
      )}
    </Paper>
  );
};

export default OrganizationsTable;
